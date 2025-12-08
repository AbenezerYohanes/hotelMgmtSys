const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  id_type: { type: String },
  id_number: { type: String },
  nationality: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.Guest || mongoose.model('Guest', GuestSchema);
