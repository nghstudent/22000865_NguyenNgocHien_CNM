const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const productRoutes = require('./src/routes/product.route');

const app = express();

/* ===== GLOBAL VARIABLES ===== */
app.use((req, res, next) => {
  res.locals.title = 'Product Management';
  next();
});

/* ===== MIDDLEWARE ===== */
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ===== VIEW ENGINE ===== */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/* ===== ROUTES ===== */
app.use('/products', productRoutes);
app.get('/', (req, res) => res.redirect('/products'));

module.exports = app;
