const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', (req, res) => res.redirect('/products'));
router.get('/products', productController.index);
router.get('/api/products/:id', productController.getById);

module.exports = router;
