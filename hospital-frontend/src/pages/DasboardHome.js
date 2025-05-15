// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './dashboardStyles.css';
// import { useNavigate } from 'react-router-dom';

// const DashboardHome = () => {
//   const [search, setSearch] = useState('');
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
  

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/doctors');
//         setDoctors(res.data);
//         setFilteredDoctors(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearch(value);

//     const lowerValue = value.toLowerCase();
//     const filtered = doctors.filter(
//       (doc) =>
//         doc.name.toLowerCase().includes(lowerValue) ||
//         doc.specialty.toLowerCase().includes(lowerValue)
//     );
//     setFilteredDoctors(filtered);
//   };

//   return (
//     <div className="dashboardhome-container">
//       <h1>Dashboard Home</h1>
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search doctors by name, specialty, or patients by name, age..."
//           value={search}
//           onChange={handleSearch}
//         />
//       </div>

//       <div className="doctor-grid">
//   {filteredDoctors.map((doc) => (
//     <div key={doc._id} className="doctor-card">
//       <div className="doctor-photo-container">
//         <img
//           src={doc.photoUrl || '/default-doctor.png'}
//           alt={doc.name}
//           className="doctor-photo"
//         />
//         {doc.available && <span className="available-badge">✔</span>}
//       </div>

//       <div className="doctor-info">
//         <h3>{doc.name}</h3>
//         <p><strong>Specialty:</strong> {doc.specialty}</p>
//         <p><strong>Next Available:</strong> {doc.nextAvailableDate || 'N/A'}</p>
//         <p><strong>Contact:</strong> {doc.contactNumber || 'N/A'}</p>
//         <button className="like-button">👍 Like</button>
//       </div>
//     </div>
//   ))}
// </div>

//     </div>
//   );
// };

// export default DashboardHome;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboardStyles.css';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const lowerValue = value.toLowerCase();
    const filtered = doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(lowerValue) ||
        doc.specialty.toLowerCase().includes(lowerValue)
    );
    setFilteredDoctors(filtered);
  };

  const handleMessageClick = (doc) => {
    // Save selected doctor info for messaging
    localStorage.setItem('selectedDoctor', JSON.stringify({
      id: doc._id,
      name: doc.name,
    }));
    navigate('/dashboard/messages');
  };

  return (
    <div className="dashboardhome-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search doctors by name, specialty, or patients by name, age..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="doctor-grid">
        {filteredDoctors.map((doc) => (
          <div key={doc._id} className="doctor-card">
            <div className="doctor-photo-container">
              <img
                src={doc.photoUrl || '/default-doctor.png'}
                alt={doc.name}
                className="doctor-photo"
              />
              {doc.available && <span className="available-badge">✔</span>}
            </div>

            <div className="doctor-info">
              <h3>{doc.name}</h3>
              <p><strong>Specialty:</strong> {doc.specialty}</p>
              <p><strong>Next Available:</strong> {doc.nextAvailableDate || 'N/A'}</p>
              <p><strong>Contact:</strong> {doc.contactNumber || 'N/A'}</p>
              <button className="like-button">👍 Like</button>
              <button onClick={() => handleMessageClick(doc)}>💬 Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
