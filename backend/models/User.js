// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: String,
  bloodType: String,
  age: Number,
  patients: [
    {
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
      appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
