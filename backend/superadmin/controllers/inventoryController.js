const inventoryService = require('../services/inventoryService');

async function list(req,res,next){ try{ res.json(await inventoryService.list()); }catch(err){next(err);} }
async function create(req,res,next){ try{ res.status(201).json(await inventoryService.create(req.body)); }catch(err){next(err);} }
async function update(req,res,next){ try{ res.json(await inventoryService.update(req.params.id, req.body)); }catch(err){next(err);} }
async function remove(req,res,next){ try{ await inventoryService.remove(req.params.id); res.status(204).end(); }catch(err){next(err);} }

module.exports = { list, create, update, remove };
