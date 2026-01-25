const db = require('../models/db');

exports.index = (req, res) => {
  db.query('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error(err);
      return res.send('DB error');
    }
    res.render('products/index', { products: rows });
  });
};

exports.createForm = (req, res) => {
  res.render('products/create');
};

exports.create = (req, res) => {
  const { name, price } = req.body;
  db.query(
    'INSERT INTO products(name, price) VALUES (?, ?)',
    [name, price],
    () => res.redirect('/products')
  );
};

exports.editForm = (req, res) => {
  db.query(
    'SELECT * FROM products WHERE id=?',
    [req.params.id],
    (err, rows) => {
      res.render('products/edit', { product: rows[0] });
    }
  );
};

exports.update = (req, res) => {
  const { name, price } = req.body;
  db.query(
    'UPDATE products SET name=?, price=? WHERE id=?',
    [name, price, req.params.id],
    () => res.redirect('/products')
  );
};

exports.delete = (req, res) => {
  db.query(
    'DELETE FROM products WHERE id=?',
    [req.params.id],
    () => res.redirect('/products')
  );
};
