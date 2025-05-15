const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  date: String
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
