require('dotenv').config();
const express = require('express');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();

// 1. Cấu hình để dùng file .ejs làm giao diện
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Cấu hình để nhận dữ liệu từ Form (như tên sản phẩm, giá...)
app.use(express.urlencoded({ extended: true }));

// 3. Cấu hình thư mục chứa ảnh/css tĩnh nếu cần
app.use(express.static(path.join(__dirname, 'public')));

// 4. Kết nối các đường dẫn (Routes)
app.use('/', productRoutes);

// 5. Mở cổng 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});