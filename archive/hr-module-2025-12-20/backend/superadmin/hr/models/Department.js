const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Department = sequelize.define('Department', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    hotelId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'departments',
    paranoid: true,
    indexes: [{ fields: ['name'] }, { fields: ['hotelId'] }]
  });

  return Department;
};