const mongoose = require('mongoose');

const RoomTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  base_price: { type: Number, default: 0 },
  capacity: { type: Number, default: 1 },
  amenities: { type: [String], default: [] }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.RoomType || mongoose.model('RoomType', RoomTypeSchema);
const { Schema, model } = require('mongoose');

const RoomTypeSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  base_price: { type: Number, required: true },
  capacity: { type: Number, default: 1 },
  amenities: { type: [String], default: [] }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = model('RoomType', RoomTypeSchema);
