const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HRPolicy = sequelize.define('HRPolicy', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
    scope: { type: DataTypes.ENUM('global','hotel'), defaultValue: 'global' },
    effectiveDate: { type: DataTypes.DATEONLY }
  }, {
    tableName: 'hr_policies',
    paranoid: true,
    indexes: [{ fields: ['scope'] }]
  });

  return HRPolicy;
};