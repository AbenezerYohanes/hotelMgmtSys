module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Billing', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        reservation_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
        guest_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        payment_method: { 
            type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'cash', 'chapa'), 
            defaultValue: 'cash' 
        },
        status: { 
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'), 
            defaultValue: 'pending' 
        },
        transaction_id: { type: DataTypes.STRING(255), allowNull: true }
    }, { tableName: 'billing', timestamps: true });
};
