module.exports = (sequelize, DataTypes) => {
  const Guest = sequelize.define('Guest', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    id_type: { type: DataTypes.STRING, allowNull: true },
    id_number: { type: DataTypes.STRING, allowNull: true },
    nationality: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'guests',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Guest;
};
