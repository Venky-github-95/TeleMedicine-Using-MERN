const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyUserToken = require('../middleware/authMiddleware');
const Patient = require('../models/Patients');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
//     // Inside your login handler
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token and user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'user'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/profile', verifyUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name age phoneNumber bloodType');
    res.json(user); // This will be used in the Welcome message
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-patients', verifyUserToken, async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.user.id }).populate('appointmentId', 'appointmentDate status');
    res.json(patients);
  } catch (err) {
    console.error('Fetching patients error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-appointments', verifyUserToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate('doctorId', 'name specialty')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (err) {
    console.error('Appointment fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
