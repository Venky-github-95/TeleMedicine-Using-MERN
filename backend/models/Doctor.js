const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }, // 👈 Must exist
  specialty: { type: String, required: true },
  available: { type: Boolean, default: true },
  availableTime: { type: String },
  nextAvailableDate: { type: String },
  photoUrl: { type: String },
  contactNumber: { type: String },
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Doctor', doctorSchema);
