const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PerformanceReview = sequelize.define('PerformanceReview', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    reviewerId: { type: DataTypes.INTEGER, allowNull: true },
    rating: { type: DataTypes.INTEGER, allowNull: true },
    comments: { type: DataTypes.TEXT },
    reviewDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'performance_reviews',
    paranoid: true,
    indexes: [{ fields: ['employeeId'] }, { fields: ['reviewDate'] }]
  });

  return PerformanceReview;
};