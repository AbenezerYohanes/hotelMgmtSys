const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Shift = sequelize.define('Shift', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    breakMinutes: { type: DataTypes.INTEGER, defaultValue: 0 },
    hotelId: { type: DataTypes.INTEGER, allowNull: true },
    meta: { type: DataTypes.JSON }
  }, {
    tableName: 'shifts',
    paranoid: true,
    indexes: [{ fields: ['hotelId'] }, { fields: ['name'] }]
  });

  return Shift;
};