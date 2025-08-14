const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getInvoice
} = require('../controllers/ordersController');

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);
router.get('/:id/invoice', getInvoice);

module.exports = router;