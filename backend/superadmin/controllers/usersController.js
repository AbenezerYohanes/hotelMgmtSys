const usersService = require('../services/usersService');

async function list(req, res, next) {
  try { res.json(await usersService.list()); } catch (err) { next(err); }
}

async function create(req, res, next) {
  try { res.status(201).json(await usersService.create(req.body)); } catch (err) { next(err); }
}

async function get(req, res, next) {
  try { res.json(await usersService.get(req.params.id)); } catch (err) { next(err); }
}

async function update(req, res, next) {
  try { res.json(await usersService.update(req.params.id, req.body)); } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try { await usersService.remove(req.params.id); res.status(204).end(); } catch (err) { next(err); }
}

async function activate(req, res, next) {
  try { res.json(await usersService.activate(req.params.id, req.body.active)); } catch (err) { next(err); }
}

async function resetPassword(req, res, next) {
  try { res.json(await usersService.resetPassword(req.params.id)); } catch (err) { next(err); }
}

module.exports = { list, create, get, update, remove, activate, resetPassword };
