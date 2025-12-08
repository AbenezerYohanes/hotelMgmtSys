const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  employee_id: { type: String, index: true, unique: true, sparse: true },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  position: { type: String },
  hire_date: { type: Date },
  salary: { type: Number, default: 0 },
  emergency_contact: { type: String },
  emergency_phone: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
const { Schema, model } = require('mongoose');

const EmployeeSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  employee_id: { type: String, required: true, unique: true },
  department_id: { type: Schema.Types.ObjectId, ref: 'Department' },
  position: { type: String, required: true },
  hire_date: { type: Date },
  salary: { type: Number, default: 0 },
  emergency_contact: String,
  emergency_phone: String,
  status: { type: String, enum: ['active','inactive','terminated'], default: 'active' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = model('Employee', EmployeeSchema);
