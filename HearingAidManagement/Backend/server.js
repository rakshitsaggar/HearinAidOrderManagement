const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const seed = require('./seed/seedData');

const customersRoute = require('./routes/customers');
const hearingAidsRoute = require('./routes/hearingAids');
const ordersRoute = require('./routes/orders');
const appointmentsRoute = require('./routes/appointments');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/customers', customersRoute);
app.use('/api/hearing-aids', hearingAidsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/appointments', appointmentsRoute);

(async () => {
  await sequelize.sync({ force: true });
  await seed();
  app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
})();