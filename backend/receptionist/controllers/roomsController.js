const { Room } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const rooms = await Room.findAll();
    res.json({ success: true, data: rooms });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const r = await Room.findByPk(id);
    if (!r) return res.status(404).json({ success: false, message: 'Not found' });
    r.status = status;
    await r.save();
    res.json({ success: true, data: r });
  } catch (err) { next(err); }
};
