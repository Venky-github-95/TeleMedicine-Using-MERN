// routes/doctors.js
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { verifyDoctor } = require('../controllers/doctorController');
const { protectDoctor } = require('../controllers/doctorController');
const auth = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();  
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/doctor.js or similar
router.post('/verify', verifyDoctor);


router.get('/me', protectDoctor, (req, res) => {
  res.json({ doctor: req.doctor });
});

router.get('/all', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, 'name specialty available photoUrl contactNumber');
    res.json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
