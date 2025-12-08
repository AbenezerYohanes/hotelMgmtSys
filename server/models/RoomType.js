module.exports = (sequelize, DataTypes) => {
  const RoomType = sequelize.define('RoomType', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    base_price: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 },
    capacity: { type: DataTypes.INTEGER, defaultValue: 1 },
    amenities: { type: DataTypes.JSON, defaultValue: [] }
  }, {
    tableName: 'room_types',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return RoomType;
};
