module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Role', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        permissions: { type: DataTypes.JSON, allowNull: true }
    }, { tableName: 'roles', timestamps: true });
};
