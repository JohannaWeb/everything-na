module.exports = (db) => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      sobriety_start_date TEXT
    )`);

        db.run(`CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

        db.all("PRAGMA table_info(journal_entries)", (err, rows) => {
            if (rows && !rows.find(row => row.name === 'mood')) {
                db.run('ALTER TABLE journal_entries ADD COLUMN mood TEXT');
            }
            if (rows && !rows.find(row => row.name === 'user_id')) {
                db.run('ALTER TABLE journal_entries ADD COLUMN user_id INTEGER REFERENCES users(id)');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

        db.run(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      post_id INTEGER NOT NULL,
      user_id INTEGER,
      FOREIGN KEY (post_id) REFERENCES posts (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

        db.run(`CREATE TABLE IF NOT EXISTS meeting_rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    )`);

        db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES meeting_rooms (id)
    )`);

        db.run(`CREATE TABLE IF NOT EXISTS sharing_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES meeting_rooms (id)
    )`);

        db.run(`CREATE TABLE IF NOT EXISTS fourth_step_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT NOT NULL,
      description TEXT,
      affects_what TEXT,
      my_part TEXT,
      fear_type TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

        db.get('SELECT COUNT(*) AS count FROM meeting_rooms', (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }
            if (row.count === 0) {
                db.run('INSERT INTO meeting_rooms (name, description) VALUES (?, ?)', ['General Chat', 'A general chat room for everyone.']);
                db.run('INSERT INTO meeting_rooms (name, description) VALUES (?, ?)', ['Daily Check-in', 'Share your daily progress and thoughts.']);
                db.run('INSERT INTO meeting_rooms (name, description) VALUES (?, ?)', ['Steps & Traditions', 'Discussion about the 12 Steps and 12 Traditions.']);
            }
        });
    });
};
