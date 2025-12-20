const { initDb } = require('../../../../config/database');

const seed = async () => {
  const sequelize = await initDb();
  const { Role, Department, Employee, Payroll, PayrollItem, Shift, HRPolicy, User } = require('../../../models')(sequelize);

  await sequelize.sync();

  // Roles
  const roles = ['superadmin','admin','staff','receptionist'];
  for (const r of roles) await Role.findOrCreate({ where: { name: r }, defaults: { description: r } });

  // Departments
  const deps = ['Front Desk','Housekeeping','Kitchen','Maintenance','HR'];
  for (const d of deps) await Department.findOrCreate({ where: { name: d } });

  // Shifts
  await Shift.findOrCreate({ where: { name: 'Morning' }, defaults: { startTime: '08:00', endTime: '16:00' } });
  await Shift.findOrCreate({ where: { name: 'Evening' }, defaults: { startTime: '16:00', endTime: '00:00' } });

  // Seed users: superadmin and admin
  const [sa] = await User.findOrCreate({ where: { email: 'superadmin@hotel.test' }, defaults: { password: 'superadmin123', name: 'Super Admin', role: 'superadmin' } });
  const [ad] = await User.findOrCreate({ where: { email: 'admin@hotel.test' }, defaults: { password: 'admin12345', name: 'Hotel Admin', role: 'admin' } });

  // Create Employee records for admin
  await Employee.findOrCreate({ where: { userId: ad.id }, defaults: { userId: ad.id, roleId: null, departmentId: null, hireDate: new Date() } });

  console.log('HR seed complete');
};

if (require.main === module) seed().catch(console.error);

module.exports = { seed };