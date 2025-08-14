const Customer = require('../models/Customer');

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCustomer = async (req, res) => {
  try {
    const cust = await Customer.create(req.body);
    res.json(cust);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const cust = await Customer.findByPk(req.params.id);
    if (!cust) return res.status(404).json({ error: 'Customer not found' });
    await cust.update(req.body);
    res.json(cust);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};