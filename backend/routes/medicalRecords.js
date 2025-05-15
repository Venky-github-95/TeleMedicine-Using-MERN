const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');

router.post('/', async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.params.userId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
