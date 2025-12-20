module.exports = (sequelize) => {
  const User = require('./User')(sequelize);
  const Room = require('./Room')(sequelize);
  const Booking = require('./Booking')(sequelize);
  const Payment = require('./Payment')(sequelize);
  const Pricing = require('./Pricing')(sequelize);
  const Notification = require('./Notification')(sequelize);
  const Inventory = require('./Inventory')(sequelize);
  const StaffSchedule = require('./StaffSchedule')(sequelize);

  // HR models (optional, integrated if present under superadmin/hr models)
  let Role, Department, Employee, Shift, Attendance, LeaveRequest, Payroll, PayrollItem, PerformanceReview, HRPolicy;
  try {
    Role = require('../superadmin/hr/models/Role')(sequelize);
    Department = require('../superadmin/hr/models/Department')(sequelize);
    Employee = require('../superadmin/hr/models/Employee')(sequelize);
    Shift = require('../superadmin/hr/models/Shift')(sequelize);
    Attendance = require('../superadmin/hr/models/Attendance')(sequelize);
    LeaveRequest = require('../superadmin/hr/models/LeaveRequest')(sequelize);
    Payroll = require('../superadmin/hr/models/Payroll')(sequelize);
    PayrollItem = require('../superadmin/hr/models/PayrollItem')(sequelize);
    PerformanceReview = require('../superadmin/hr/models/PerformanceReview')(sequelize);
    HRPolicy = require('../superadmin/hr/models/HRPolicy')(sequelize);
  } catch (err) {
    // models may not exist yet during initial setup
  }

  // Associations
  User.hasMany(Booking, { foreignKey: 'guestId' });
  Booking.belongsTo(User, { as: 'guest', foreignKey: 'guestId' });

  Room.hasMany(Booking, { foreignKey: 'roomId' });
  Booking.belongsTo(Room, { foreignKey: 'roomId' });

  Booking.hasOne(Payment, { foreignKey: 'bookingId' });
  Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

  User.hasMany(Notification, { foreignKey: 'userId' });
  Notification.belongsTo(User, { foreignKey: 'userId' });

  const core = { User, Room, Booking, Payment, Pricing, Notification, Inventory, StaffSchedule };
  const hr = {};
  if (Role) hr.Role = Role;
  if (Department) hr.Department = Department;
  if (Employee) hr.Employee = Employee;
  if (Shift) hr.Shift = Shift;
  if (Attendance) hr.Attendance = Attendance;
  if (LeaveRequest) hr.LeaveRequest = LeaveRequest;
  if (Payroll) hr.Payroll = Payroll;
  if (PayrollItem) hr.PayrollItem = PayrollItem;
  if (PerformanceReview) hr.PerformanceReview = PerformanceReview;
  if (HRPolicy) hr.HRPolicy = HRPolicy;

  // HR associations
  if (Employee && User) {
    Employee.belongsTo(User, { foreignKey: 'userId' });
    User.hasOne(Employee, { foreignKey: 'userId' });
  }
  if (Employee && Role) {
    Employee.belongsTo(Role, { foreignKey: 'roleId' });
    Role.hasMany(Employee, { foreignKey: 'roleId' });
  }
  if (Employee && Department) {
    Employee.belongsTo(Department, { foreignKey: 'departmentId' });
    Department.hasMany(Employee, { foreignKey: 'departmentId' });
  }
  if (Attendance && Employee) {
    Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });
    Employee.hasMany(Attendance, { foreignKey: 'employeeId' });
  }
  if (LeaveRequest && Employee) {
    LeaveRequest.belongsTo(Employee, { foreignKey: 'employeeId' });
    Employee.hasMany(LeaveRequest, { foreignKey: 'employeeId' });
  }
  if (Payroll && Employee) {
    Payroll.belongsTo(Employee, { foreignKey: 'employeeId' });
    Employee.hasMany(Payroll, { foreignKey: 'employeeId' });
  }
  if (PayrollItem && Payroll) {
    PayrollItem.belongsTo(Payroll, { foreignKey: 'payrollId' });
    Payroll.hasMany(PayrollItem, { foreignKey: 'payrollId' });
  }
  if (PerformanceReview && Employee) {
    PerformanceReview.belongsTo(Employee, { foreignKey: 'employeeId' });
    Employee.hasMany(PerformanceReview, { foreignKey: 'employeeId' });
  }

  return { ...core, ...hr };
};
