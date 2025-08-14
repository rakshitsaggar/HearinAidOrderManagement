const Customer = require('../models/Customer');
const HearingAid = require('../models/HearingAid');

async function seed() {
  await Customer.create({
    first_name: 'John',
    last_name: 'Smith',
    email: 'john@email.com',
    phone: '5550123',
    hearing_loss_level: 'moderate',
    budget_range: 70000,
    has_insurance: true
  });
  await HearingAid.bulkCreate([
    { brand: 'Signia', model: 'IX', type: 'ITE', price: 30000, features: ['basic_amplification'], suitable_for_loss_levels: ['mild', 'moderate'], in_stock: 10 },
    { brand: 'Signia', model: 'Styletto', type: 'BTE', price: 64000, features: ['bluetooth'], suitable_for_loss_levels: ['moderate', 'severe'], in_stock: 5 }
  ]);
}
module.exports = seed;