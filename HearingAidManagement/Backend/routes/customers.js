const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer
} = require('../controllers/customersController');

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', addCustomer);
router.put('/:id', updateCustomer);

module.exports = router;