module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Hotel', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        location: { type: DataTypes.STRING(255), allowNull: true },
        contact: { type: DataTypes.STRING(100), allowNull: true },
        email: { type: DataTypes.STRING(255), allowNull: true }
    }, { tableName: 'hotels', timestamps: true });
};
