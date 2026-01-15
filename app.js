const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// CẤU HÌNH SESSION
app.use(session({
    secret: 'mysecretkey', // Chuỗi bí mật bất kỳ
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // Session tồn tại trong 1 tiếng
}));

const productRoutes = require('./routes/product.routes');
app.use('/', productRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));