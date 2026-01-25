const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');

router.get('/', controller.index);
router.get('/create', controller.createForm);
router.post('/create', controller.create);
router.get('/edit/:id', controller.editForm);
router.post('/edit/:id', controller.update);
router.get('/delete/:id', controller.delete);

module.exports = router;
