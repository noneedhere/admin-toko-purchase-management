const db = require('../config/database');

const Purchase = {

  getAll() {
    const stmt = db.prepare(`
      SELECT 
        pur.id,
        pur.invoice_number,
        pur.product_id,
        pur.quantity,
        pur.unit_price,
        pur.total_price,
        pur.purchase_date,
        pur.status,
        pur.created_at,
        p.product_name
      FROM purchases pur
      JOIN products p ON pur.product_id = p.id
      ORDER BY pur.created_at DESC
    `);
    return stmt.all();
  },

  getById(id) {
    const stmt = db.prepare(`
      SELECT 
        pur.id,
        pur.invoice_number,
        pur.product_id,
        pur.quantity,
        pur.unit_price,
        pur.total_price,
        pur.purchase_date,
        pur.status,
        pur.created_at,
        p.product_name
      FROM purchases pur
      JOIN products p ON pur.product_id = p.id
      WHERE pur.id = ?
    `);
    return stmt.get(id);
  },

  generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const dateStart = `${year}-${month}-${day} 00:00:00`;

    const stmt = db.prepare(`
      SELECT COUNT(*) AS count FROM purchases 
      WHERE purchase_date >= ?
    `);
    const row = stmt.get(dateStart);
    const seq = (row.count + 1).toString().padStart(4, '0');

    return `INV-${dateStr}-${seq}`;
  },

  create(data) {
    const { invoiceNumber, productId, quantity, unitPrice, totalPrice } = data;

    const createTransaction = db.transaction(() => {
      const insertStmt = db.prepare(`
        INSERT INTO purchases (invoice_number, product_id, quantity, unit_price, total_price, purchase_date, status)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'active')
      `);
      const result = insertStmt.run(invoiceNumber, productId, quantity, unitPrice, totalPrice);

      const updateStockStmt = db.prepare(`
        UPDATE product_stocks 
        SET stock_quantity = stock_quantity - ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = ?
      `);
      updateStockStmt.run(quantity, productId);

      return result;
    });

    return createTransaction();
  },

  cancel(id) {
    const purchase = this.getById(id);
    if (!purchase) {
      return { success: false, message: 'Transaksi tidak ditemukan' };
    }
    if (purchase.status !== 'active') {
      return { success: false, message: 'Transaksi sudah dibatalkan atau tidak dapat dibatalkan' };
    }

    const cancelTransaction = db.transaction(() => {
      const updateStatusStmt = db.prepare(`
        UPDATE purchases SET status = 'cancelled' WHERE id = ?
      `);
      updateStatusStmt.run(id);

      const updateStockStmt = db.prepare(`
        UPDATE product_stocks 
        SET stock_quantity = stock_quantity + ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = ?
      `);
      updateStockStmt.run(purchase.quantity, purchase.product_id);
    });

    cancelTransaction();
    return { success: true, invoiceNumber: purchase.invoice_number };
  },

  getStats() {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
      FROM purchases
    `);
    return stmt.get();
  }
};

module.exports = Purchase;
