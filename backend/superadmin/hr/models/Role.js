const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    permissions: { type: DataTypes.JSON, allowNull: true }
  }, {
    tableName: 'roles',
    paranoid: true,
    indexes: [{ fields: ['name'] }]
  });

  return Role;
};
