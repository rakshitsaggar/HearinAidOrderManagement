const Appointment = require('../models/Appointment');

exports.getAppointments = async (req, res) => {
  try {
    const appts = await Appointment.findAll();
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    res.json(appt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    await appt.update(req.body);
    res.json(appt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};