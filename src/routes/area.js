var express = require('express');
const router = express.Router();

const areaController = require('../app/controllers/AreaController');

// newController.index
router.get('/create', areaController.create);
router.post('/store', areaController.store);
router.put('/control/:id', areaController.control)
router.get('/:id/edit', areaController.edit)
router.put('/:id', areaController.update)
router.delete('/:id', areaController.delete)
router.get('/data/:slug', areaController.data)
router.get('/:slug', areaController.show);

module.exports = router;