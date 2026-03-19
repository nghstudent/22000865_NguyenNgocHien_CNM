const Product = require("../models/productModel");
const { s3Client } = require("../config/aws");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Hàm hỗ trợ xóa ảnh trên S3
const deleteS3Image = async(imageUrl) => {
    if (!imageUrl) return;
    try {
        // Tách lấy key từ URL (ví dụ: https://bucket.s3.region.amazonaws.com/products/123-image.jpg -> products/123-image.jpg)
        const urlParts = imageUrl.split('/');
        const key = urlParts.slice(3).join('/'); // Bỏ qua phần domain

        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        }));
    } catch (error) {
        console.error("Lỗi khi xóa ảnh trên S3:", error);
    }
};

exports.getAllProducts = async(req, res) => {
    try {
        const products = await Product.getAll();
        res.render("index", { products });
    } catch (err) {
        res.status(500).send("Lỗi tải danh sách sản phẩm");
    }
};

exports.getAddForm = (req, res) => {
    res.render("add");
};

exports.addProduct = async(req, res) => {
    try {
        const { name, price, unit_in_stock } = req.body;
        // req.file.location chứa URL của ảnh đã upload lên S3
        const url_image = req.file ? req.file.location : "";

        const newProduct = {
            id: uuidv4(),
            name,
            price: Number(price),
            unit_in_stock: Number(unit_in_stock),
            url_image
        };
        await Product.save(newProduct);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi thêm sản phẩm");
    }
};

exports.getEditForm = async(req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        res.render("edit", { product });
    } catch (err) {
        res.status(500).send("Lỗi lấy thông tin sản phẩm");
    }
};

exports.editProduct = async(req, res) => {
    try {
        const { name, price, unit_in_stock, old_image } = req.body;
        let url_image = old_image;

        if (req.file) {
            url_image = req.file.location; // Lấy URL ảnh mới từ S3
            await deleteS3Image(old_image); // Điểm cộng: Xóa ảnh cũ trên S3
        }

        const updatedProduct = {
            id: req.params.id,
            name,
            price: Number(price),
            unit_in_stock: Number(unit_in_stock),
            url_image
        };
        await Product.save(updatedProduct);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi cập nhật sản phẩm");
    }
};

exports.deleteProduct = async(req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (product && product.url_image) {
            await deleteS3Image(product.url_image); // Điểm cộng: Xóa ảnh trên S3 khi xóa sản phẩm
        }
        await Product.delete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi xóa sản phẩm");
    }
};

exports.getDetail = async(req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        res.render("detail", { product });
    } catch (err) {
        res.status(500).send("Lỗi xem chi tiết");
    }
};