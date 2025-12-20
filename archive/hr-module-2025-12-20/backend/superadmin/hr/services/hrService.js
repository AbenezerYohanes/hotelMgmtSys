const { initDb } = require('../../../config/database');

const createEmployee = async (payload) => {
  const sequelize = await initDb();
  const { Employee, User } = require('../../../models')(sequelize);
  // create User account and Employee record in a transaction
  return await sequelize.transaction(async (t) => {
    const user = await User.create({ email: payload.email, password: payload.password || 'changeme', name: payload.name, role: payload.role || 'staff' }, { transaction: t });
    const emp = await Employee.create({ userId: user.id, hotelId: payload.hotelId || null, roleId: payload.roleId || null, departmentId: payload.departmentId || null, hireDate: payload.hireDate || null, meta: payload.meta || {} }, { transaction: t });
    return { user, employee: emp };
  });
};

const listEmployees = async (opts = {}) => {
  const sequelize = await initDb();
  const { Employee, User, Department, Role } = require('../../../models')(sequelize);
  const where = {};
  if (opts.hotelId) where.hotelId = opts.hotelId;
  const employees = await Employee.findAll({ where, include: [{ model: User, attributes: ['email','name','role'] }] });
  return employees;
};

const getEmployee = async (id) => {
  const sequelize = await initDb();
  const { Employee, User } = require('../../../models')(sequelize);
  const emp = await Employee.findByPk(id, { include: [{ model: User, attributes: ['id','email','name','role'] }] });
  return emp;
};

const updateEmployee = async (id, payload) => {
  const sequelize = await initDb();
  const { Employee, User } = require('../../../models')(sequelize);
  const emp = await Employee.findByPk(id);
  if (!emp) throw new Error('Not found');
  await emp.update(payload);
  if (payload.email || payload.name) {
    const user = await User.findByPk(emp.userId);
    if (payload.email) user.email = payload.email;
    if (payload.name) user.name = payload.name;
    await user.save();
  }
  return emp;
};

const removeEmployee = async (id) => {
  const sequelize = await initDb();
  const { Employee, User } = require('../../../models')(sequelize);
  const emp = await Employee.findByPk(id);
  if (!emp) throw new Error('Not found');
  const user = await User.findByPk(emp.userId);
  await emp.destroy();
  if (user) await user.destroy();
  return true;
};

const createDepartment = async (payload) => {
  const sequelize = await initDb();
  const { Department } = require('../../../models')(sequelize);
  return Department.create(payload);
};

const listDepartments = async (hotelId) => {
  const sequelize = await initDb();
  const { Department } = require('../../../models')(sequelize);
  const where = {};
  if (hotelId) where.hotelId = hotelId;
  return Department.findAll({ where });
};

module.exports = { createEmployee, listEmployees, getEmployee, updateEmployee, removeEmployee, createDepartment, listDepartments };