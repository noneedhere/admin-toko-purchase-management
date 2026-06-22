const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.get('/purchases', purchaseController.index);
router.get('/purchases/create', purchaseController.create);
router.post('/purchases', purchaseController.store);
router.post('/purchases/:id/cancel', purchaseController.cancel);

module.exports = router;
