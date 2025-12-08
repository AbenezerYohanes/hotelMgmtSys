const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  booking_number: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guest_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', default: null },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  check_in_date: { type: Date, required: true },
  check_out_date: { type: Date, required: true },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  total_amount: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  special_requests: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
const { Schema, model } = require('mongoose');

const BookingSchema = new Schema({
  hotel_id: { type: Schema.Types.ObjectId, ref: 'Hotel' },
  room_id: { type: Schema.Types.ObjectId, ref: 'Room' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  check_in_date: { type: Date, required: true },
  check_out_date: { type: Date, required: true },
  total_amount: { type: Number, required: true },
  nights: { type: Number, required: true },
  status: { type: String, enum: ['pending','confirmed','cancelled','checked_in','checked_out'], default: 'pending' },
  stripe_payment_intent: String,
  payment_status: { type: String, enum: ['pending','succeeded','refunded'], default: 'pending' },
  receipt_url: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = model('Booking', BookingSchema);
