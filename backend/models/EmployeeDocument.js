module.exports = (sequelize, DataTypes) => {
    return sequelize.define('EmployeeDocument', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        type: { type: DataTypes.STRING(100), allowNull: false },
        document_path: { type: DataTypes.STRING(500), allowNull: false },
        status: { 
            type: DataTypes.ENUM('pending', 'verified', 'rejected'), 
            defaultValue: 'pending' 
        }
    }, { tableName: 'employee_documents', timestamps: true });
};

