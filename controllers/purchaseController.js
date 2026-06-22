const Product = require('../models/Product');
const Purchase = require('../models/Purchase');

const purchaseController = {
  /**
   * GET /purchases — Halaman daftar semua transaksi pembelian
   */
  index(req, res) {
    try {
      const purchases = Purchase.getAll();
      const stats = Purchase.getStats();

      res.render('purchases/index', {
        title: 'Daftar Transaksi Pembelian',
        purchases,
        stats,
        success: req.query.success || null,
        error: req.query.error || null
      });
    } catch (err) {
      console.error('Error loading purchases:', err);
      res.status(500).render('errors/500', {
        title: '500 — Kesalahan Server'
      });
    }
  },

  /**
   * GET /purchases/create — Halaman form buat transaksi baru
   */
  create(req, res) {
    try {
      const products = Product.getAll();

      res.render('purchases/create', {
        title: 'Buat Transaksi Pembelian Baru',
        products,
        success: req.query.success || null,
        error: req.query.error || null
      });
    } catch (err) {
      console.error('Error loading create form:', err);
      res.status(500).render('errors/500', {
        title: '500 — Kesalahan Server'
      });
    }
  },

  /**
   * POST /purchases — Proses simpan transaksi baru
   * Server-side validation sesuai PRD §15
   */
  store(req, res) {
    try {
      const { product_id, quantity } = req.body;

      // --- Validasi: product_id ---
      if (!product_id || product_id === '') {
        return res.redirect('/purchases/create?error=' + encodeURIComponent('Produk harus dipilih'));
      }

      const productId = parseInt(product_id, 10);
      if (isNaN(productId)) {
        return res.redirect('/purchases/create?error=' + encodeURIComponent('Produk tidak valid'));
      }

      const product = Product.getById(productId);
      if (!product) {
        return res.redirect('/purchases/create?error=' + encodeURIComponent('Produk tidak valid'));
      }

      // --- Validasi: quantity ---
      if (!quantity || quantity === '') {
        return res.redirect('/purchases/create?error=' + encodeURIComponent('Quantity harus diisi'));
      }

      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || !Number.isInteger(qty)) {
        return res.redirect('/purchases/create?error=' + encodeURIComponent('Quantity harus berupa angka bulat'));
      }

      if (qty <= 0) {
        return res.redirect('/purchases/create?error=' + encodeURIComponent('Quantity minimal adalah 1'));
      }

      // --- Validasi: stok ---
      const currentStock = Product.getStock(productId);
      if (qty > currentStock) {
        return res.redirect('/purchases/create?error=' + encodeURIComponent(`Stok tidak mencukupi. Stok tersedia: ${currentStock}`));
      }

      // --- Proses transaksi ---
      const invoiceNumber = Purchase.generateInvoiceNumber();
      const unitPrice = product.price;
      const totalPrice = unitPrice * qty;

      Purchase.create({
        invoiceNumber,
        productId,
        quantity: qty,
        unitPrice,
        totalPrice
      });

      return res.redirect('/purchases?success=' + encodeURIComponent('Transaksi berhasil dibuat'));
    } catch (err) {
      console.error('Error creating purchase:', err);
      return res.redirect('/purchases/create?error=' + encodeURIComponent('Terjadi kesalahan, coba lagi'));
    }
  },

  /**
   * POST /purchases/:id/cancel — Proses pembatalan transaksi
   */
  cancel(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.redirect('/purchases?error=' + encodeURIComponent('Transaksi tidak ditemukan'));
      }

      const result = Purchase.cancel(id);

      if (!result.success) {
        return res.redirect('/purchases?error=' + encodeURIComponent(result.message));
      }

      return res.redirect('/purchases?success=' + encodeURIComponent(`Transaksi ${result.invoiceNumber} berhasil dibatalkan`));
    } catch (err) {
      console.error('Error cancelling purchase:', err);
      return res.redirect('/purchases?error=' + encodeURIComponent('Terjadi kesalahan, coba lagi'));
    }
  }
};

module.exports = purchaseController;
