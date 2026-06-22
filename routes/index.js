const express = require('express');
const router = express.Router();

const productRoutes = require('./productRoutes');
const purchaseRoutes = require('./purchaseRoutes');

router.use('/', productRoutes);
router.use('/', purchaseRoutes);

module.exports = router;
