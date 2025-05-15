import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/medicalRecords/${userId}`)
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div>
      <h2>Your Medical Records</h2>
      <ul>
        {records.map(record => (
          <li key={record._id}>{record.date}: {record.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalRecordsPage;
