const path = require('path');
require('dotenv').config();
const { initDb } = require('../config/database');

module.exports = async function seed() {
  const sequelize = await initDb();
  const models = require('../models')(sequelize);

  // Create demo users
  const demoUsers = [
    { email: 'superadmin@hotel.com', password: 'superadmin123', name: 'Super Admin', role: 'superadmin' },
    { email: 'admin@hotel.com', password: 'admin123', name: 'Admin User', role: 'admin' },
    { email: 'staff@hotel.com', password: 'staff123', name: 'Staff User', role: 'staff' },
    { email: 'receptionist@hotel.com', password: 'reception123', name: 'Receptionist', role: 'receptionist' },
    { email: 'guest@hotel.com', password: 'guest123', name: 'Guest User', role: 'guest' }
  ];

  for (const u of demoUsers) {
    const exists = await models.User.findOne({ where: { email: u.email } });
    if (!exists) await models.User.create(u);
  }

  // sample rooms
  const rooms = [
    { code: 'R-101', type: 'Deluxe', capacity: 2, price: 120.00, amenities: { wifi: true, tv: true } },
    { code: 'R-102', type: 'Suite', capacity: 4, price: 240.00, amenities: { wifi: true, tv: true, kitchen: true } }
  ];
  for (const r of rooms) {
    const exists = await models.Room.findOne({ where: { code: r.code } });
    if (!exists) await models.Room.create(r);
  }

  // sample inventory
  await models.Inventory.findOrCreate({ where: { sku: 'TOWEL-STD' }, defaults: { name: 'Towels', sku: 'TOWEL-STD', quantity: 100 } });

  // pricing sample
  await models.Pricing.findOrCreate({ where: { name: 'Weekend Premium' }, defaults: { name: 'Weekend Premium', adjustmentType: 'percent', adjustmentValue: 15.0 } });

  return true;
};
