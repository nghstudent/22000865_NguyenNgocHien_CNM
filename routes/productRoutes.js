const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");

router.get("/", productController.getAllProducts);
router.get("/add", productController.getAddForm);
router.post("/add", upload.single("image"), productController.addProduct); // Tích hợp middleware upload S3
router.get("/edit/:id", productController.getEditForm);
router.post("/edit/:id", upload.single("image"), productController.editProduct);
router.get("/delete/:id", productController.deleteProduct);
router.get("/detail/:id", productController.getDetail);

module.exports = router;