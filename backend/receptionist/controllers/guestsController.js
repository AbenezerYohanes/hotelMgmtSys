const { Guest } = require('../models');

exports.create = async (req, res, next) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json({ success: true, data: guest });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const g = await Guest.findByPk(id);
    if (!g) return res.status(404).json({ success: false, message: 'Not found' });
    await g.update(req.body);
    res.json({ success: true, data: g });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const guests = await Guest.findAll();
    res.json({ success: true, data: guests });
  } catch (err) { next(err); }
};
