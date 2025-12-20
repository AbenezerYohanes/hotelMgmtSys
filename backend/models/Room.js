module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hotel_id: { type: DataTypes.INTEGER },
    room_type: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    capacity: { type: DataTypes.INTEGER },
    amenities: { type: DataTypes.JSON },
    price: { type: DataTypes.DECIMAL(10, 2) },
    status: { type: DataTypes.STRING, defaultValue: 'available' }
  }, { tableName: 'rooms', timestamps: true });
};
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.STRING },
    capacity: { type: DataTypes.INTEGER, defaultValue: 2 },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    amenities: { type: DataTypes.JSON, allowNull: true },
    status: { type: DataTypes.ENUM('available', 'occupied', 'maintenance'), defaultValue: 'available' }
  }, { tableName: 'Rooms' });
  return Room;
};
