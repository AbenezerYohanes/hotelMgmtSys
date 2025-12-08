const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
const { Schema, model } = require('mongoose');

const DepartmentSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  manager_id: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = model('Department', DepartmentSchema);
