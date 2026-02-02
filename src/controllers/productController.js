const Product = require('../models/productModel');

exports.renderPage = async (req, res) => {
    try {
        const products = await Product.getAll();
        // Kiểm tra xem người dùng có bấm nút "Sửa" không (dựa vào query editId)
        let productToEdit = null;
        if (req.query.editId) {
            productToEdit = products.find(p => p.id === req.query.editId);
        }
        res.render('index', { products, productToEdit });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.saveProduct = async (req, res) => {
    const { id, name, price, url_image } = req.body;
    try {
        await Product.save({ id, name, price: Number(price), url_image });
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};