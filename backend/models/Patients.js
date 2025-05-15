// models/Patients.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  gender: String,
  contactNumber: String,
  issue: String,
  reasonForVisit: String,
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
