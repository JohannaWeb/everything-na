const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-should-be-in-env-vars';

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ noServer: true });
    const rooms = new Map();

    server.on('upgrade', (request, socket, head) => {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const token = url.searchParams.get('token');

        if (!token) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }

            wss.handleUpgrade(request, socket, head, (ws) => {
                ws.user = decoded;
                wss.emit('connection', ws, request);
            });
        });
    });

    wss.on('connection', (ws, req) => {
        console.log('WebSocket client connected:', ws.user.username);

        ws.on('message', message => {
            const data = JSON.parse(message);
            const { type, roomId, payload } = data;
            const author = ws.user.username;

            if (type === 'joinRoom') {
                if (!rooms.has(roomId)) {
                    rooms.set(roomId, new Set());
                }
                rooms.get(roomId).add(ws);
                ws.roomId = roomId;
                console.log(`User ${author} joined room ${roomId} via WebSocket`);

                rooms.get(roomId).forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'userJoined', author: author }));
                    }
                });

            } else if (type === 'signal' && ws.roomId) {
                rooms.get(ws.roomId).forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'signal',
                            sender: author,
                            payload: payload
                        }));
                    }
                });
            }
        });

        ws.on('close', () => {
            console.log('WebSocket client disconnected:', ws.user.username);
            if (ws.roomId && rooms.has(ws.roomId)) {
                rooms.get(ws.roomId).delete(ws);
                rooms.get(ws.roomId).forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'userLeft', author: ws.user.username }));
                    }
                });
                if (rooms.get(ws.roomId).size === 0) {
                    rooms.delete(ws.roomId);
                }
            }
        });

        ws.on('error', error => {
            console.error('WebSocket error:', error);
        });
    });

    return wss;
};

module.exports = setupWebSocket;
