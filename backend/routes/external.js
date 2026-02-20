const express = require('express');
const router = express.Router();
const externalController = require('../controllers/externalController');
const authMiddleware = require('../middleware/auth');

router.get('/na-meetings', externalController.getNaMeetings);
router.get('/na-daily-reflection', externalController.getDailyReflection);

// Fourth step routes
router.get('/fourth-step', authMiddleware, externalController.getFourthStep);
router.post('/fourth-step', authMiddleware, externalController.createFourthStep);
router.delete('/fourth-step/:id', authMiddleware, externalController.deleteFourthStep);

module.exports = router;
