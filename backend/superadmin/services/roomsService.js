const { Room } = require('../models');

async function list(){ return await Room.findAll(); }
async function create(payload){ return await Room.create(payload); }
async function update(id,payload){ const r = await Room.findByPk(id); if(!r) throw { status:404 }; return await r.update(payload); }
async function remove(id){ const r = await Room.findByPk(id); if(!r) throw { status:404 }; await r.destroy(); }

module.exports = { list, create, update, remove };
