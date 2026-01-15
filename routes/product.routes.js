const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

/**
 * MIDDLEWARE: Kiểm tra trạng thái đăng nhập
 * Nếu đã login (có session) thì cho phép thực hiện hành động
 * Nếu chưa login thì đá về trang đăng nhập
 */
const isAdmin = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
};

// --- CÁC ROUTE AUTHENTICATION (Đăng nhập/Đăng xuất) ---

// 1. Hiển thị trang Login
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// 2. Xử lý Đăng nhập
router.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;
        // Kiểm tra tài khoản trong DB (admin/123456)
        const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (rows.length > 0) {
            req.session.isLoggedIn = true;
            req.session.user = rows[0].username;
            res.redirect('/');
        } else {
            res.render('login', { error: 'Sai tài khoản hoặc mật khẩu!' });
        }
    } catch (err) {
        res.status(500).send("Lỗi đăng nhập: " + err.message);
    }
});

// 3. Đăng xuất
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});


// --- CÁC ROUTE QUẢN LÝ SẢN PHẨM (Được bảo vệ bởi isAdmin) ---

// 4. Trang danh sách sản phẩm + Tìm kiếm
router.get('/', isAdmin, async(req, res) => {
    try {
        const { search } = req.query;
        let sql = 'SELECT * FROM products';
        let params = [];

        if (search) {
            sql = 'SELECT * FROM products WHERE name LIKE ?';
            params = [`%${search}%`];
        }

        const [rows] = await db.query(sql, params);
        res.render('products', {
            products: rows,
            search: search || '',
            user: req.session.user
        });
    } catch (err) {
        res.status(500).send("Lỗi truy vấn: " + err.message);
    }
});

// 5. Xử lý thêm sản phẩm mới
router.post('/add', isAdmin, async(req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const sql = 'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)';
        await db.query(sql, [name, price, quantity]);
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Lỗi khi thêm sản phẩm: " + err.message);
    }
});

// 6. XÓA sản phẩm
router.get('/delete/:id', isAdmin, async(req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Lỗi khi xóa: " + err.message);
    }
});

// 7. HIỂN THỊ trang sửa
router.get('/edit/:id', isAdmin, async(req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.render('edit', { product: rows[0] });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        res.status(500).send("Lỗi: " + err.message);
    }
});

// 8. CẬP NHẬT dữ liệu sau khi sửa
router.post('/update/:id', isAdmin, async(req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity } = req.body;
        await db.query(
            'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]
        );
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Lỗi cập nhật: " + err.message);
    }
});

module.exports = router;