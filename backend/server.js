require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
const cors = require('cors');
const setupWebSocket = require('./ws');
const db = require('./config/db');
const initDb = require('./models/initDb');

// Initialize Database Schema
initDb(db);

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Initialize HTTP and WebSocket Server
const server = http.createServer(app);
setupWebSocket(server);

// Routes
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const meetingRoutes = require('./routes/meetings');
const externalRoutes = require('./routes/external');
const openviduRoutes = require('./routes/openvidu');

// Map API endpoints to modular routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api', meetingRoutes);
app.use('/api', externalRoutes);
app.use('/api/openvidu', openviduRoutes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`HTTP and WebSocket server running on port ${PORT}`);
});
