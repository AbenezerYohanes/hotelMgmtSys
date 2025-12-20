const { Inventory } = require('../models');

async function list(){ return await Inventory.findAll(); }
async function create(payload){ return await Inventory.create(payload); }
async function update(id,payload){ const i = await Inventory.findByPk(id); if(!i) throw { status:404 }; return await i.update(payload); }
async function remove(id){ const i = await Inventory.findByPk(id); if(!i) throw { status:404 }; await i.destroy(); }

module.exports = { list, create, update, remove };
