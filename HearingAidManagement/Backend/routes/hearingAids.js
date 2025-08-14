const express = require('express');
const router = express.Router();
const {
  getHearingAids,
  recommendHearingAids
} = require('../controllers/hearingAidsController');

router.get('/', getHearingAids);
router.get('/recommend/:customerId', recommendHearingAids);

module.exports = router;