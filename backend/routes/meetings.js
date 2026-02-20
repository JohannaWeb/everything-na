const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const authMiddleware = require('../middleware/auth');

// Posts routes
router.get('/posts', authMiddleware, meetingController.getPosts);
router.get('/posts/:id', authMiddleware, meetingController.getPostById);
router.post('/posts', authMiddleware, meetingController.createPost);
router.post('/posts/:id/comments', authMiddleware, meetingController.createComment);

// Meeting room routes
router.get('/meeting-rooms', meetingController.getMeetingRooms);
router.get('/meeting-rooms/:roomId/messages', meetingController.getMessages);
router.post('/meeting-rooms/:roomId/messages', authMiddleware, meetingController.createMessage);
router.get('/meeting-rooms/:roomId/queue', authMiddleware, meetingController.getQueue);
router.post('/meeting-rooms/:roomId/queue', authMiddleware, meetingController.joinQueue);
router.delete('/meeting-rooms/:roomId/queue/:author', authMiddleware, meetingController.leaveQueue);

module.exports = router;
