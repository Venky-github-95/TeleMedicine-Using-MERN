const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

router.post('/add', async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json({ message: 'Prescription added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add prescription.', error });
  }
});

// GET prescriptions by userId
router.get('/byUser/:userId', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.params.userId })
      .populate('doctorId', 'name')    // only get the doctor's name
      .populate('patientId', 'name')   // only get the patient's name
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Failed to retrieve prescriptions' });
  }
});


module.exports = router;
