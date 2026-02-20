const openvidu = require('../config/openvidu');

exports.createSession = async (req, res) => {
    try {
        const session = await openvidu.createSession(req.body);
        console.log(`[createSession] Successfully created session: ${session.sessionId}`);
        res.send(session.sessionId);
    } catch (error) {
        if (error?.message?.includes('409') || error?.status === 409) {
            console.log(`[createSession] Session ${req.body.customSessionId} already exists (409)`);
            res.send(req.body.customSessionId);
        } else {
            console.error('[createSession] Error creating OpenVidu session:', error);
            res.status(500).send('Error creating OpenVidu session: ' + error.message);
        }
    }
};

exports.createConnection = async (req, res) => {
    try {
        await openvidu.fetch();
        const session = openvidu.activeSessions.find(
            (s) => s.sessionId === req.params.sessionId
        );
        if (!session) {
            console.warn(`[createConnection] Session not found: ${req.params.sessionId}`);
            res.status(404).send();
        } else {
            const connection = await session.createConnection(req.body);
            console.log(`[createConnection] Successfully created connection for session ${req.params.sessionId}`);
            res.send(connection.token);
        }
    } catch (error) {
        console.error(`[createConnection] Error creating OpenVidu connection for session ${req.params.sessionId}:`, error);
        res.status(500).send('Error creating OpenVidu connection: ' + error.message);
    }
};
