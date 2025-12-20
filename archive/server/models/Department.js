module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    manager_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }
  }, {
    tableName: 'departments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Department;
};
