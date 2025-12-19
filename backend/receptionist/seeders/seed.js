require('dotenv').config();
const { sequelize, User, Guest, Room, Booking, Payment } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('DB synced');
  const receptionist = await User.create({ name: 'Receptionist One', email: 'reception@hotel.test', password: 'password123', role: 'receptionist' });
  console.log('Created receptionist', receptionist.email);
  const room1 = await Room.create({ number: '101', type: 'single', price: 50 });
  const room2 = await Room.create({ number: '102', type: 'double', price: 80 });
  console.log('Rooms created');
  const guest = await Guest.create({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+123456789' });
  const booking = await Booking.create({ reference: 'BKG-TEST-1', guestId: guest.id, roomId: room1.id, checkInDate: new Date(), checkOutDate: new Date(Date.now()+86400000), totalAmount: 50 });
  await Payment.create({ bookingId: booking.id, amount: 50, method: 'cash', verified: true });
  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
