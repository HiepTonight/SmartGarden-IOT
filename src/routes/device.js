var express = require('express');
const router = express.Router();

const deviceController = require('../app/controllers/DeviceController');

// newController.index
router.get('/create', deviceController.create);
router.post('/store', deviceController.store);
router.get('/:id/edit', deviceController.edit)
router.put('/:id', deviceController.update)
router.delete('/:id', deviceController.delete)
router.get('/:slug', deviceController.show);
router.get('/', deviceController.index);

module.exports = router;