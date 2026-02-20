const db = require('../config/db');

exports.getPosts = (req, res) => {
    db.all('SELECT p.*, u.username as author FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.id DESC', [], (err, posts) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const promises = posts.map(post => {
            return new Promise((resolve, reject) => {
                db.all('SELECT c.*, u.username as author FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ?', [post.id], (err, comments) => {
                    if (err) {
                        reject(err);
                    } else {
                        post.comments = comments;
                        resolve(post);
                    }
                });
            });
        });
        Promise.all(promises).then(results => {
            res.json(results);
        }).catch(err => {
            res.status(500).json({ error: err.message });
        });
    });
};

exports.getPostById = (req, res) => {
    const postId = req.params.id;
    db.get('SELECT p.*, u.username as author FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?', [postId], (err, post) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        db.all('SELECT c.*, u.username as author FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ?', [postId], (err, comments) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            post.comments = comments;
            res.json(post);
        });
    });
};

exports.createPost = (req, res) => {
    const { title, content } = req.body;
    db.run('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
};

exports.createComment = (req, res) => {
    const { content } = req.body;
    db.run('INSERT INTO comments (content, post_id, user_id) VALUES (?, ?, ?)', [content, req.params.id, req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
};

exports.getMeetingRooms = (req, res) => {
    db.all('SELECT * FROM meeting_rooms', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ rooms: rows });
    });
};

exports.createMessage = (req, res) => {
    const { roomId } = req.params;
    const { content } = req.body;
    const author = req.user.username;
    const timestamp = new Date().toISOString();
    db.run('INSERT INTO messages (room_id, author, content, timestamp) VALUES (?, ?, ?, ?)', [roomId, author, content, timestamp], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, roomId, author, content, timestamp });
    });
};

exports.getMessages = (req, res) => {
    const { roomId } = req.params;
    db.all('SELECT * FROM messages WHERE room_id = ? ORDER BY timestamp ASC', [roomId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ messages: rows });
    });
};

exports.joinQueue = (req, res) => {
    const { roomId } = req.params;
    const author = req.user.username;
    const timestamp = new Date().toISOString();

    db.get('SELECT id FROM sharing_queue WHERE room_id = ? AND author = ?', [roomId, author], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(409).json({ error: 'Author already in queue for this room.' });
        }

        db.run('INSERT INTO sharing_queue (room_id, author, timestamp) VALUES (?, ?, ?)', [roomId, author, timestamp], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, roomId, author, timestamp });
        });
    });
};

exports.getQueue = (req, res) => {
    const { roomId } = req.params;
    db.all('SELECT id, room_id, author, timestamp FROM sharing_queue WHERE room_id = ? ORDER BY timestamp ASC', [roomId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ queue: rows });
    });
};

exports.leaveQueue = (req, res) => {
    const { roomId, author } = req.params;
    db.run('DELETE FROM sharing_queue WHERE room_id = ? AND author = ?', [roomId, author], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
};
