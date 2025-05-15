const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // assuming doctors are also users
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  medicines: [
    {
      name: { type: String, required: true },
      days: { type: Number, required: true },
      time: { type: String, required: true }, // e.g., "Morning,Noon,Night"
      count: { type: Number, required: true }, // Tablets per dose
      foodTime: { type: String }, // "Before Food" or "After Food"
      syrupML: { type: String }, // If applicable
      totalCount: { type: Number }, // Computed: days * count * doses per day
      price: { type: Number },
      totalPrice: { type: Number }
    }
  ],
  notes: { type: String },
  totalMedicines: { type: Number }, // Number of medicine entries
  totalItems: { type: Number }, // Sum of totalCount for all medicines
  billAmount: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
