const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

const verifyDoctor = async (req, res) => {
  const { name, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ name });

    if (!doctor) {
      return res.status(401).json({ message: 'Doctor not found' });
    }

    const isMatch = password === doctor.password;
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ doctor, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const protectDoctor = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.doctor = await Doctor.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { verifyDoctor, protectDoctor };
