module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    employee_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    department_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    position: { type: DataTypes.STRING, allowNull: true },
    hire_date: { type: DataTypes.DATE, allowNull: true },
    salary: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    emergency_contact: { type: DataTypes.STRING, allowNull: true },
    emergency_phone: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('active','inactive','terminated'), defaultValue: 'active' }
  }, {
    tableName: 'employees',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Employee;
};
