module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PerformanceReview', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        reviewer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
        rating: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0, max: 10 } },
        comments: { type: DataTypes.TEXT, allowNull: true },
        date: { type: DataTypes.DATEONLY, allowNull: false }
    }, { tableName: 'performance_reviews', timestamps: true });
};

