require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const User = require('../models/User')(sequelize, require('sequelize').DataTypes);
const Room = require('../models/Room')(sequelize, require('sequelize').DataTypes);
const Cabin = require('../models/Cabin')(sequelize, require('sequelize').DataTypes);
const Booking = require('../models/Booking')(sequelize, require('sequelize').DataTypes);
const StaffSchedule = require('../models/StaffSchedule')(sequelize, require('sequelize').DataTypes);
const Notification = require('../models/Notification')(sequelize, require('sequelize').DataTypes);
const GuestRequest = require('../models/GuestRequest')(sequelize, require('sequelize').DataTypes);
const MaintenanceLog = require('../models/MaintenanceLog')(sequelize, require('sequelize').DataTypes);

async function seed(){
  await sequelize.sync({ force: true });
  const pass = await bcrypt.hash(process.env.SEED_PASSWORD || 'password123', 10);
  const staff = await User.create({ name: 'Sample Staff', email: 'staff@example.com', password: pass, role: 'staff', phone: '1234567890' });
  const room1 = await Room.create({ number: '101', type: 'standard', capacity: 2, amenities: ['tv','ac'] });
  const cabin1 = await Cabin.create({ name: 'Cabin A', capacity: 4, amenities: ['fireplace'] });
  const booking1 = await Booking.create({ reference: 'BKG-001', guestName: 'John Doe', roomId: room1.id, status: 'assigned', staffId: staff.id });
  await StaffSchedule.create({ staffId: staff.id, start: new Date(), end: new Date(Date.now()+3600*1000*4), role: 'housekeeping' });
  await Notification.create({ staffId: staff.id, message: 'Morning briefing at 09:00', priority: 'high' });
  await GuestRequest.create({ bookingId: booking1.id, guestName: 'John Doe', requestType: 'extra-towels', details: 'Needs 2 extra towels', handledBy: staff.id });
  await MaintenanceLog.create({ locationType: 'room', locationId: room1.id, description: 'AC not cooling', priority: 'high', reportedBy: staff.id });
  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
