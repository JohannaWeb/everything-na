const db = require('../config/db');

exports.getEntries = (req, res) => {
    db.all('SELECT * FROM journal_entries WHERE user_id = ? ORDER BY date DESC', [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ entries: rows });
    });
};

exports.createEntry = (req, res) => {
    const { date, content, mood } = req.body;
    db.run('INSERT INTO journal_entries (date, content, mood, user_id) VALUES (?, ?, ?, ?)', [date, content, mood, req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
};

exports.updateEntry = (req, res) => {
    const { content, mood } = req.body;
    db.run('UPDATE journal_entries SET content = ?, mood = ? WHERE id = ? AND user_id = ?', [content, mood, req.params.id, req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
};

exports.deleteEntry = (req, res) => {
    db.run('DELETE FROM journal_entries WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
};

exports.getSobrietyDate = (req, res) => {
    db.get('SELECT sobriety_start_date FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ sobriety_start_date: row.sobriety_start_date });
    });
};

exports.updateSobrietyDate = (req, res) => {
    const { sobriety_start_date } = req.body;
    db.run('UPDATE users SET sobriety_start_date = ? WHERE id = ?', [sobriety_start_date, req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
};
