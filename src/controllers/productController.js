const Product = require('../models/productModel');

exports.listProducts = async(req, res) => {
    const keyword = req.query.search;
    const result = keyword ? await Product.search(keyword) : await Product.getAll();
    res.render('index', { products: result.Items, keyword });
};

exports.addProduct = async(req, res) => {
    const { name, price, quantity } = req.body;
    const image = req.file ? req.file.location : "";
    await Product.save({ name, price, quantity, image });
    res.redirect('/');
};

exports.showEditForm = async(req, res) => {
    const result = await Product.getById(req.params.id);
    res.render('edit', { product: result.Item });
};

exports.updateProduct = async(req, res) => {
    const { id, name, price, quantity, oldImage } = req.body;
    const image = req.file ? req.file.location : oldImage; // Giữ ảnh cũ nếu không chọn mới
    await Product.save({ id, name, price, quantity, image });
    res.redirect('/');
};

exports.deleteProduct = async(req, res) => {
    await Product.delete(req.params.id);
    res.redirect('/');
};

exports.listProducts = async(req, res) => {
    try {
        const keyword = req.query.search; // Lấy từ khóa từ URL ví dụ: /?search=Sua
        let result;

        if (keyword) {
            result = await Product.search(keyword);
        } else {
            result = await Product.getAll();
        }

        res.render('index', {
            products: result.Items,
            keyword: keyword || "" // Gửi lại từ khóa để hiển thị trên ô input
        });
    } catch (err) {
        res.status(500).send("Lỗi tìm kiếm: " + err.message);
    }
};