const express = require('express');
const router = express.Router();
const openviduController = require('../controllers/openviduController');

router.post('/sessions', openviduController.createSession);
router.post('/sessions/:sessionId/connections', openviduController.createConnection);

module.exports = router;
