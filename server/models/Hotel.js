
module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }
  }, {
    tableName: 'hotels',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Hotel;
};
