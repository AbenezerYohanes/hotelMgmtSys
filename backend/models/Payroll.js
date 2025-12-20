module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Payroll', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        salary: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
        allowances: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
        deductions: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
        date: { type: DataTypes.DATEONLY, allowNull: false }
    }, { tableName: 'payroll', timestamps: true });
};

