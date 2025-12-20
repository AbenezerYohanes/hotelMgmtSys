const hrService = require('../services/hrService');

const createEmployee = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await hrService.createEmployee(payload);
    res.json({ ok: true, data: result });
  } catch (err) { next(err); }
};

const listEmployees = async (req, res, next) => {
  try {
    const hotelId = req.query.hotelId;
    const list = await hrService.listEmployees({ hotelId });
    res.json(list);
  } catch (err) { next(err); }
};

const getEmployee = async (req, res, next) => {
  try {
    const emp = await hrService.getEmployee(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Not found' });
    res.json(emp);
  } catch (err) { next(err); }
};

const updateEmployee = async (req, res, next) => {
  try {
    await hrService.updateEmployee(req.params.id, req.body);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

const deleteEmployee = async (req, res, next) => {
  try {
    await hrService.removeEmployee(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

const createDepartment = async (req, res, next) => {
  try {
    const d = await hrService.createDepartment(req.body);
    res.json(d);
  } catch (err) { next(err); }
};

const listDepartments = async (req, res, next) => {
  try {
    const hotelId = req.query.hotelId;
    const list = await hrService.listDepartments(hotelId);
    res.json(list);
  } catch (err) { next(err); }
};

module.exports = { createEmployee, listEmployees, getEmployee, updateEmployee, deleteEmployee, createDepartment, listDepartments };
