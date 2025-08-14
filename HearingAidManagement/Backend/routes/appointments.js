const express = require('express');
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointment
} = require('../controllers/appointmentsController');

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);

module.exports = router;