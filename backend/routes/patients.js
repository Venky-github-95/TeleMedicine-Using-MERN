const express = require('express');
const router = express.Router();
const Patient = require('../models/Patients');

router.get('/byDoctor/:doctorId', async (req, res) => {
  try {
    // Populate appointment and filter by doctorId
    const patients = await Patient.find()
      .populate({
        path: 'appointmentId',
        match: { doctorId: req.params.doctorId },
      });

    // Filter out patients where appointmentId is null (not matched)
    const filtered = patients.filter(p => p.appointmentId);

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching patients by doctor:', error);
    res.status(500).json({ message: 'Error fetching patients', error });
  }
});

module.exports = router;
