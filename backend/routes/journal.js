const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', journalController.getEntries);
router.post('/', journalController.createEntry);
router.put('/:id', journalController.updateEntry);
router.delete('/:id', journalController.deleteEntry);
router.get('/sobriety-date', journalController.getSobrietyDate);
router.put('/sobriety-date', journalController.updateSobrietyDate);

module.exports = router;
