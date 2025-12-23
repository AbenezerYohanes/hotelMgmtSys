module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Guest', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        first_name: { type: DataTypes.STRING(150), allowNull: false },
        last_name: { type: DataTypes.STRING(150), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        password: { type: DataTypes.STRING(255), allowNull: false },
        contact: { type: DataTypes.STRING(50), allowNull: true },
        address: { type: DataTypes.TEXT, allowNull: true }
    }, { tableName: 'guests', timestamps: true });
};
