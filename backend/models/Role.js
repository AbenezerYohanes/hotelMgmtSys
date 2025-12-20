module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Role', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        permissions: { type: DataTypes.JSON, allowNull: true }
    }, { tableName: 'roles', timestamps: true });
};
