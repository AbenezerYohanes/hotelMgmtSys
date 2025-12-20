module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Billing', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        reservation_id: { type: DataTypes.INTEGER },
        guest_id: { type: DataTypes.INTEGER },
        amount: { type: DataTypes.DECIMAL(10, 2) },
        payment_method: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING, defaultValue: 'unpaid' },
        transaction_id: { type: DataTypes.STRING }
    }, { tableName: 'billing', timestamps: true });
};
