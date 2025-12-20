const { User } = require('../models');
const bcrypt = require('bcrypt');

async function list() { return await User.findAll({ attributes: { exclude: ['password'] } }); }

async function create(payload) {
  if (!payload.password) payload.password = 'ChangeMe123';
  const hash = await bcrypt.hash(payload.password, 10);
  const user = await User.create({ ...payload, password: hash });
  return { id: user.id, email: user.email, role: user.role };
}

async function get(id) { const u = await User.findByPk(id); if(!u) throw { status:404, message:'Not found' }; return u; }

async function update(id, payload) { const u = await User.findByPk(id); if(!u) throw { status:404 }; await u.update(payload); return u; }

async function remove(id) { const u = await User.findByPk(id); if(!u) throw { status:404 }; await u.destroy(); }

async function activate(id, active) { const u = await User.findByPk(id); if(!u) throw { status:404 }; await u.update({ active: !!active }); return { id: u.id, active: u.active }; }

async function resetPassword(id) { const u = await User.findByPk(id); if(!u) throw { status:404 }; const newPass = 'Temp' + Math.random().toString(36).slice(2,8); const hash = await bcrypt.hash(newPass, 10); await u.update({ password: hash }); return { tempPassword: newPass }; }

module.exports = { list, create, get, update, remove, activate, resetPassword };
