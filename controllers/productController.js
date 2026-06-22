const Product = require('../models/Product');

const productController = {
  /**
   * GET /products — Halaman daftar semua produk
   */
  index(req, res) {
    try {
      const products = Product.getAll();
      const outOfStock = products.filter(p => p.stock_quantity === 0).length;

      res.render('products/index', {
        title: 'Daftar Produk',
        products,
        totalProducts: products.length,
        outOfStock,
        success: req.query.success || null,
        error: req.query.error || null
      });
    } catch (err) {
      console.error('Error loading products:', err);
      res.status(500).render('errors/500', {
        title: '500 — Kesalahan Server'
      });
    }
  },

  /**
   * GET /api/products/:id — JSON data produk (untuk AJAX auto-fill)
   */
  getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID produk tidak valid' });
      }

      const product = Product.getById(id);
      if (!product) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }

      res.json({
        id: product.id,
        product_name: product.product_name,
        price: product.price,
        stock_quantity: product.stock_quantity
      });
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  }
};

module.exports = productController;
