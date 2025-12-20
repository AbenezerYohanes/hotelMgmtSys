const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    hotelId: { type: DataTypes.INTEGER, allowNull: true },
    roleId: { type: DataTypes.INTEGER, allowNull: true },
    departmentId: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.ENUM('active','suspended','terminated'), defaultValue: 'active' },
    hireDate: { type: DataTypes.DATEONLY, allowNull: true },
    terminationDate: { type: DataTypes.DATEONLY, allowNull: true },
    meta: { type: DataTypes.JSON, allowNull: true }
  }, {
    tableName: 'employees',
    paranoid: true,
    indexes: [{ fields: ['userId'] }, { fields: ['hotelId'] }, { fields: ['roleId'] }]
  });

  return Employee;
};