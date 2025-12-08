const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  payment_method: { type: String },
  payment_status: { type: String, default: 'pending' },
  payment_date: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
const { Schema, model } = require('mongoose');

const PaymentSchema = new Schema({
  booking_id: { type: Schema.Types.ObjectId, ref: 'Booking' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, default: 'unknown' },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = model('Payment', PaymentSchema);
