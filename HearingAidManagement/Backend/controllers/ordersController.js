const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Customer = require('../models/Customer');
const HearingAid = require('../models/HearingAid');
const generateInvoice = require('../utils/pdfGenerator');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [Customer, OrderItem] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [Customer, OrderItem] });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customer_id, items } = req.body;
    const customer = await Customer.findByPk(customer_id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    let totalAmount = 0;
    for (let item of items) {
      const aid = await HearingAid.findByPk(item.hearing_aid_id);
      if (!aid) return res.status(404).json({ error: 'Product not found' });
      totalAmount += aid.price * item.quantity;
    }

    const discount = customer.has_insurance ? totalAmount * 0.3 : 0;
    const finalAmount = totalAmount - discount;

    const order = await Order.create({
      CustomerId: customer_id,
      total_amount: totalAmount,
      insurance_discount: discount,
      final_amount: finalAmount,
    });

    for (let item of items) {
      const aid = await HearingAid.findByPk(item.hearing_aid_id);
      await OrderItem.create({
        OrderId: order.id,
        HearingAidId: aid.id,
        quantity: item.quantity,
        unit_price: aid.price,
        ear_side: item.ear_side
      });
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [Customer, { model: OrderItem, include: [HearingAid] }]
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    generateInvoice(order, order.Customer, order.OrderItems, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};