module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Department', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        hotel_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }
    }, { tableName: 'departments', timestamps: true });
};
