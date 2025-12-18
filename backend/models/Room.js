const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.STRING },
    capacity: { type: DataTypes.INTEGER, defaultValue: 2 },
    price: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 },
    amenities: { type: DataTypes.JSON, allowNull: true },
    status: { type: DataTypes.ENUM('available','occupied','maintenance'), defaultValue: 'available' }
  }, { tableName: 'Rooms' });
  return Room;
};
