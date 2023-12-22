var express = require('express');
const router = express.Router();

const MeController = require('../app/controllers/MeController');

// storedController.index
router.get('/stored/areas', MeController.storedAreas);

module.exports = router;