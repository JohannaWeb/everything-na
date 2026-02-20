const path = require('path');
const fs = require('fs').promises;
const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.getNaMeetings = async (req, res) => {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    try {
        const filePath = path.join(__dirname, '..', 'mock_meetings.json');
        const data = await fs.readFile(filePath, 'utf8');
        const meetings = JSON.parse(data);
        res.json(meetings);
    } catch (error) {
        console.error('Error serving mock AA meetings:', error);
        res.status(500).json({ error: 'Failed to fetch AA meetings.' });
    }
};

exports.getDailyReflection = async (req, res) => {
    try {
        const response = await fetch('https://www.aa.org/daily-reflections');
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('span.field--name-title').first().text().trim();
        const bodyContent = $('div.field--name-body').first().text().trim();
        const dateText = $('div').first().text().match(/[A-Za-z]+ \d+/)?.[0] || 'Today';

        if (title && bodyContent) {
            res.json({
                title: title.replace(/^"|"$/g, ''),
                date: dateText,
                content: bodyContent
            });
            return;
        }

        throw new Error('Could not extract reflection from website');
    } catch (scrapingError) {
        console.log('Web scraping failed, falling back to local JSON file:', scrapingError.message);

        try {
            const filePath = path.join(__dirname, '..', 'daily_reflections.json');
            const data = await fs.readFile(filePath, 'utf8');
            const reflections = JSON.parse(data);

            if (!Array.isArray(reflections) || reflections.length === 0) {
                return res.status(500).json({ error: 'No reflections available' });
            }

            const today = new Date();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            const formattedDate = `${month}-${day}`;

            let reflection = reflections.find(r => r.date === formattedDate);

            if (!reflection) {
                reflection = reflections[Math.floor(Math.random() * reflections.length)];
            }

            res.json(reflection);
        } catch (error) {
            console.error('Error serving AA Daily Reflection:', error);
            res.status(500).json({ error: `Failed to serve AA Daily Reflection: ${error.message}` });
        }
    }
};

exports.getFourthStep = (req, res) => {
    const db = require('../config/db');
    db.all('SELECT * FROM fourth_step_inventory WHERE user_id = ?', [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

exports.createFourthStep = (req, res) => {
    const db = require('../config/db');
    const { type, description, affects_what, my_part, fear_type } = req.body;
    db.run('INSERT INTO fourth_step_inventory (user_id, type, description, affects_what, my_part, fear_type) VALUES (?, ?, ?, ?, ?, ?)', [req.user.id, type, description, affects_what, my_part, fear_type], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
};

exports.deleteFourthStep = (req, res) => {
    const db = require('../config/db');
    db.run('DELETE FROM fourth_step_inventory WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
};
