// doctorAuthMiddleware.js
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

const verifyDoctorToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.doctor = await Doctor.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyDoctorToken;


// const jwt = require('jsonwebtoken');
// const Doctor = require('../models/Doctor');

// const verifyDoctorToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const doctor = await Doctor.findById(decoded.id);
//     if (!doctor) return res.status(401).json({ message: 'Doctor not found' });

//     req.doctor = doctor;
//     next();
//   } catch (err) {
//     console.error('Invalid token:', err);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// module.exports = verifyDoctorToken;
