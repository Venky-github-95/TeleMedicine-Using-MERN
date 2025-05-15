const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const doctorRoutes = require('./routes/doctors');
const messageRoutes = require('./routes/message');
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);

app.use('/api/doctors', doctorRoutes);

app.use('/api/appointments', require('./routes/appointments'));

app.use('/api/messages', messageRoutes);

app.use('/api/prescriptions', require('./routes/prescriptions'));

app.use('/api/patients', require('./routes/patients'));

app.use('/api/medicalRecords', require('./routes/medicalRecords'));

app.get('/', (req, res) => res.send('Hospital Management API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
