const db = require('../config/database');

const Product = {

  getAll() {
    const stmt = db.prepare(`
      SELECT 
        p.id,
        p.product_name,
        p.price,
        p.description,
        p.created_at,
        COALESCE(ps.stock_quantity, 0) AS stock_quantity
      FROM products p
      LEFT JOIN product_stocks ps ON p.id = ps.product_id
      ORDER BY p.id ASC
    `);
    return stmt.all();
  },

  getById(id) {
    const stmt = db.prepare(`
      SELECT 
        p.id,
        p.product_name,
        p.price,
        p.description,
        p.created_at,
        COALESCE(ps.stock_quantity, 0) AS stock_quantity
      FROM products p
      LEFT JOIN product_stocks ps ON p.id = ps.product_id
      WHERE p.id = ?
    `);
    return stmt.get(id);
  },

  getStock(productId) {
    const stmt = db.prepare(`
      SELECT stock_quantity FROM product_stocks WHERE product_id = ?
    `);
    const row = stmt.get(productId);
    return row ? row.stock_quantity : 0;
  }
};

module.exports = Product;
