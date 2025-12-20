const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = require('./Role')(sequelize, DataTypes);
const Hotel = require('./Hotel')(sequelize, DataTypes);
const Department = require('./Department')(sequelize, DataTypes);
const Employee = require('./Employee')(sequelize, DataTypes);
const Room = require('./Room')(sequelize, DataTypes);
const Guest = require('./Guest')(sequelize, DataTypes);
const Reservation = require('./Reservation')(sequelize, DataTypes);
const Billing = require('./Billing')(sequelize, DataTypes);

// Associations
Role.hasMany(Employee, { foreignKey: 'role_id' });
Employee.belongsTo(Role, { foreignKey: 'role_id' });

Hotel.hasMany(Employee, { foreignKey: 'hotel_id' });
Employee.belongsTo(Hotel, { foreignKey: 'hotel_id' });

Hotel.hasMany(Room, { foreignKey: 'hotel_id' });
Room.belongsTo(Hotel, { foreignKey: 'hotel_id' });

Guest.hasMany(Reservation, { foreignKey: 'guest_id' });
Reservation.belongsTo(Guest, { foreignKey: 'guest_id' });

Room.hasMany(Reservation, { foreignKey: 'room_id' });
Reservation.belongsTo(Room, { foreignKey: 'room_id' });

Reservation.hasOne(Billing, { foreignKey: 'reservation_id' });
Billing.belongsTo(Reservation, { foreignKey: 'reservation_id' });

module.exports = {
  sequelize,
  Role,
  Hotel,
  Department,
  Employee,
  Room,
  Guest,
  Reservation,
  Billing
};
module.exports = (sequelize) => {
  const User = require('./User')(sequelize);
  const Room = require('./Room')(sequelize);
