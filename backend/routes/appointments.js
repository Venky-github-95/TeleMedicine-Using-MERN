const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const verifyUserToken = require('../middleware/authMiddleware'); // ✅ Import the middleware
const User = require('../models/User');
const Patient = require('../models/Patients');

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/book', verifyUserToken, async (req, res) => {
  try {
    const { patientName, patientEmail, patientAge, patientGender, contactNumber, reasonForVisit, issue, doctorId, appointmentDate } = req.body;
    const userId = req.user.id; // Get user from JWT

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const appointment = new Appointment({
      patientName,
      patientEmail,
      patientAge,
      patientGender,
      contactNumber,
      reasonForVisit,
      issue,
      doctorId,
      userId,
      appointmentDate
    });

    await appointment.save();

    const patient = new Patient({
      name: patientName,
      email: patientEmail,
      age: patientAge,
      gender: patientGender,
      contactNumber,
      issue,
      reasonForVisit,
      appointmentId: appointment._id,
      userId
    });

    await patient.save();

    await User.findByIdAndUpdate(userId, {
      $push: {
        patients: {
          patientId: patient._id,
          appointmentId: appointment._id
        }
      }
    });

    res.status(201).json({ message: 'Appointment booked and patient record created successfully', appointment });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ message: err.message });
  }
});

// router.post('/book', async (req, res) => {
//   try {
//     console.log('Received request body:', req.body); // ✅ Log data

//     const { patientName,patientEmail, patientAge, patientGender, contactNumber, reasonForVisit, issue ,doctorId, appointmentDate } = req.body;

//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) {
//       console.log('Doctor not found with ID:', doctorId); // ✅ Log doctor issue
//       return res.status(404).json({ message: 'Doctor not found' });
//     }

//     const appointment = new Appointment({
//       patientName,
//       patientEmail,
//       patientAge,
//       patientGender,
//       contactNumber,
//       reasonForVisit,
//       issue,
//       doctorId,
//       appointmentDate
//     });

//     await appointment.save();
//     res.status(201).json({ message: 'Appointment booked successfully', appointment });
//   } catch (err) {
//     console.error('Error while booking appointment:', err); // ✅ Log full error
//     res.status(500).json({ message: err.message });
//   }
// });


// GET: Get all appointments for a specific doctor
router.get('/fetch', async (req, res) => {
  const { doctorId } = req.query; // Extract doctorId from query parameter

  try {
    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    // Fetch appointments for the given doctorId
    const appointments = await Appointment.find({ doctorId })
      .populate('doctorId', 'name specialty') // Optional, if you want to include doctor details in the response
      .exec();

    res.status(200).json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});


// Approve
router.put('/:id/approve', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Appointment not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error approving appointment' });
  }
});

// Reject
router.put('/:id/reject', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Appointment not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error rejecting appointment' });
  }
});


module.exports = router;
