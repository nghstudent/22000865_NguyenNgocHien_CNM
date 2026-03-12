const express = require('express');
const router = express.Router();
const upload = require('../config/upload-config');
const productController = require('../controllers/productController');

router.get('/', productController.listProducts);
router.post('/add', upload.single('image'), productController.addProduct);
router.get('/edit/:id', productController.showEditForm);
router.post('/edit', upload.single('image'), productController.updateProduct);
router.get('/delete/:id', productController.deleteProduct);

module.exports = router;