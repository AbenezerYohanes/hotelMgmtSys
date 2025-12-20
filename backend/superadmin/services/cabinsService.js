const { Cabin } = require('../models');

async function list(){ return await Cabin.findAll(); }
async function create(payload){ return await Cabin.create(payload); }
async function update(id,payload){ const c = await Cabin.findByPk(id); if(!c) throw { status:404 }; return await c.update(payload); }
async function remove(id){ const c = await Cabin.findByPk(id); if(!c) throw { status:404 }; await c.destroy(); }

module.exports = { list, create, update, remove };
