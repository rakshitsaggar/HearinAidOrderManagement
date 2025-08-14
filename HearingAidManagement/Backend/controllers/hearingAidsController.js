const HearingAid = require('../models/HearingAid');
const Customer = require('../models/Customer');

exports.getHearingAids = async (req, res) => {
  try {
    const aids = await HearingAid.findAll();
    res.json(aids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.recommendHearingAids = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const aids = await HearingAid.findAll();
    const matches = aids.filter(
      a =>
        a.suitable_for_loss_levels.includes(customer.hearing_loss_level) &&
        a.price <= customer.budget_range
    );

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};