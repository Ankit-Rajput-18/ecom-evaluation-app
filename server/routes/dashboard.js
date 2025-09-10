const express = require('express');
const router = express.Router();
const { productsHandler, visitorsHandler } = require('../controllers/dashboard');

// GET /api/dashboard/products
router.get('/products', productsHandler);

// GET /api/dashboard/visitors
router.get('/visitors', visitorsHandler);

module.exports = router;
