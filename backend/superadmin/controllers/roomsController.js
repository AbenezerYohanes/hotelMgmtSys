const roomsService = require('../services/roomsService');

async function list(req,res,next){ try{ res.json(await roomsService.list()); }catch(err){next(err);} }
async function create(req,res,next){ try{ res.status(201).json(await roomsService.create(req.body)); }catch(err){next(err);} }
async function update(req,res,next){ try{ res.json(await roomsService.update(req.params.id, req.body)); }catch(err){next(err);} }
async function remove(req,res,next){ try{ await roomsService.remove(req.params.id); res.status(204).end(); }catch(err){next(err);} }

module.exports = { list, create, update, remove };
