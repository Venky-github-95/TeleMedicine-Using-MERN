// import React from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import './styles.css';

// function UserDashboard() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//     navigate('/login');
//   };

//   return (
//     <div className="dashboard-container">
//       <nav className="dashboard-navbar">
//         <div className="dashboard-logo">🏥 MyHospital</div>
//         <button onClick={handleLogout} className="logout-button">Logout</button>
//       </nav>

//       <div className="dashboard-main">

//         <aside className="dashboard-sidebar">
//           <ul>
//             <li><Link to="/dashboard/home" className="sidebar-link">🏠 Home</Link></li>
//             <li><Link to="/dashboard/appointments" className="sidebar-link">📅 Appointments</Link></li>
//             <li><Link to="/dashboard/medical-records" className="sidebar-link">🗂️ Medical Records</Link></li>
//           </ul>
//         </aside>

//         <section className="dashboard-content">
//           <Outlet />
//         </section>
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;


import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import trustedBy from '../images/trusted-by-logos.png';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function UserDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [user, setUser] = useState({ name: '', age: '', phoneNumber: '', bloodType: '' });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // const previousPrescriptions = [
  //   { id: 1, date: '2023-10-10', doctor: 'Dr. Sarah Johnson', medications: ['Lisinopril 10mg', 'Metoprolol 50mg'] },
  //   { id: 2, date: '2023-09-05', doctor: 'Dr. Priya Mehta', medications: ['Amoxicillin 500mg', 'Ibuprofen 400mg'] }
  // ];


  // const messages = [
  //   { id: 1, from: 'Dr. Sarah Johnson', time: '2 hours ago', preview: 'Your test results are ready...', unread: true },
  //   { id: 2, from: 'Dr. Michael Wong', time: '1 day ago', preview: 'Follow-up appointment reminder...', unread: false }
  // ];



useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data); // This will be used in Welcome message
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };
  fetchProfile();
}, []);

useEffect(() => {
  const fetchPatients = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/auth/my-patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };
  fetchPatients();
}, []);


useEffect(() => {
  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/auth/my-appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const upcoming = res.data
        .filter(appt => new Date(appt.appointmentDate) > new Date())
        .map(appt => ({
          id: appt._id,
          doctor: appt.doctorId?.name || 'Doctor',
          specialty: appt.doctorId?.specialty || 'Specialty',
          patientName: appt.patientName,
          status: appt.status,
          date: new Date(appt.appointmentDate).toLocaleDateString(),
          time: new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

      setUpcomingAppointments(upcoming);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  fetchAppointments();
}, []);


const handleDownloadClick = (appt) => {
  setSelectedAppointment(appt);
  setShowModal(true);
};

const handleGeneratePDF = () => {
  const doc = new jsPDF();
  
  // Add header with hospital info
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("TeleMedicine Hospital", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("123 Healthcare Avenue, Medical City", 105, 28, { align: "center" });
  doc.text("Phone: (555) 123-4567 | Email: info@citygeneral.com", 105, 36, { align: "center" });
  
  // Add title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("APPOINTMENT CONFIRMATION", 105, 50, { align: "center" });
  
  // Add divider line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);
  
  // Create table-like structure for patient info
  const createInfoSection = (title, data, startY) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, 20, startY);
    
    // Draw table border
    doc.rect(20, startY + 5, 170, 10 + (data.length * 10));
    
    let y = startY + 10;
    data.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 25, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 25 + doc.getTextWidth(label) + 5, y);
      y += 10;
    });
    
    return y + 10;
  };
  
  // Patient information
  let currentY = 65;
  currentY = createInfoSection("PATIENT INFORMATION", [
    ["Patient Name:", selectedAppointment.patientName],
    // ["Patient ID:", selectedAppointment.patientId || "N/A"],
    // ["Date of Birth:", selectedAppointment.dob || "N/A"],
    // ["Contact Number:", selectedAppointment.phone || "N/A"]
  ], currentY);
  
  // Appointment information
  createInfoSection("APPOINTMENT DETAILS", [
    ["Appointment ID:", selectedAppointment.id],
    ["Doctor:", selectedAppointment.doctor],
    ["Specialty:", selectedAppointment.specialty],
    ["Date:", selectedAppointment.date],
    ["Time:", selectedAppointment.time],
    ["Status:", selectedAppointment.status],
    ["Location:", "Main Hospital - Floor 3, Room 302"],
    ["Notes:", selectedAppointment.notes || "None"]
  ], currentY);
  
  // Add footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Please arrive 15 minutes prior to your appointment time.", 105, 280, { align: "center" });
  doc.text("Bring your insurance card and photo ID.", 105, 285, { align: "center" });
  doc.text("Cancellations require 24 hours notice.", 105, 290, { align: "center" });
  
  doc.save(`Appointment_Confirmation_${selectedAppointment.id}.pdf`);
  setShowModal(false);
};


  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
            <span className="navbar-logo"><img src={trustedBy} alt="Trusted by logos" width={70} height={70} style={{borderRadius: '50%'}}/></span>
            <span className="navbar-title" style={{color:'white', marginLeft:'20px'}}>TeleMedicine</span>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>

      <div className="dashboard-main">
        <aside className="dashboard-sidebar">
          <h2>Main Menu</h2>
          <ul>
            <li><Link to="/dashboard" className="sidebar-link">🏠 Home</Link></li>
            <li><Link to="/dashboard/doctor" className="sidebar-link">🥼 Doctor</Link></li>
            <li><Link to="/dashboard/appointments" className="sidebar-link">📅 Appointments</Link></li>
            <li><Link to="/dashboard/medical-records" className="sidebar-link">🗂️ Medical Records</Link></li>
            <li><Link to="/dashboard/messages" className="sidebar-link">✉️ Messages</Link></li>
            {/* <li><Link to="/dashboard/profile" className="sidebar-link">👤 Profile</Link></li> */}
          </ul>
        </aside>

        <section className="dashboard-content">
          <Outlet />
          
          {/* Default content when no sub-route is selected */}
         {window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/' ? (
        <div className="dashboard-overview">
          <h2>Welcome back, {user.name}</h2>

          <div className="dashboard-grid">
            {/* Appointments Section */}
            <div className="dashboard-card">
                  <div className="card-header">
                    <h3>📅 Appointments Status</h3>
                    <Link to="/dashboard/appointments" className="view-all">View All</Link>
                  </div>
                  {upcomingAppointments.length > 0 ? (
                    <ul className="appointment-list">
                      {upcomingAppointments.map(appt => (
                        <li key={appt.id} className="appointment-item">
                          <div className="appointment-details">
                             <span className="appointment-patient">🧍 Patient: {appt.patientName}</span>
                            <span className={`appointment-status ${appt.status.toLowerCase()}`}>
                              📌 Status: {appt.status}
                            </span>
                            <span className="doctor-name">👨‍⚕️ {appt.doctor}</span>
                            <span className="appointment-time">🕒 {appt.date} at {appt.time}</span>
                            <span className="appointment-specialty">🏥 {appt.specialty}</span>
                          </div>
                           <button className="action-button" onClick={() => handleDownloadClick(appt)}>
                              Download PDF
                        </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data">No upcoming appointments</p>
                  )}
                  {/* Modal */}
                    {showModal && selectedAppointment && (
                      <div className="modal-overlay">
                        <div className="modal-content">
                          <h2>📄 Approved Appointment Form</h2>
                          <div className="pdf-preview">
                            <p><strong>Patient Name:</strong> {selectedAppointment.patientName}</p>
                            <p><strong>Doctor:</strong> {selectedAppointment.doctor}</p>
                            <p><strong>Specialty:</strong> {selectedAppointment.specialty}</p>
                            <p><strong>Date & Time:</strong> {selectedAppointment.date} at {selectedAppointment.time}</p>
                            <p><strong>Status:</strong> {selectedAppointment.status}</p>
                          </div>
                          <div className="modal-actions">
                            <button className="download-button" onClick={handleGeneratePDF}>Download PDF</button>
                            <button className="close-button" onClick={() => setShowModal(false)}>Close</button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>


                {/* Prescriptions Section */}
                {/* <div className="dashboard-card">
                  <div className="card-header">
                    <h3>💊 Recent Prescriptions</h3>
                    <Link to="/dashboard/medical-records" className="view-all">View All</Link>
                  </div>
                  {previousPrescriptions.length > 0 ? (
                    <ul className="prescription-list">
                      {previousPrescriptions.map(prescription => (
                        <li key={prescription.id} className="prescription-item">
                          <div className="prescription-details">
                            <span className="prescription-date">{prescription.date}</span>
                            <span className="prescription-doctor">Dr. {prescription.doctor}</span>
                            <ul className="medication-list">
                              {prescription.medications.map((med, idx) => (
                                <li key={idx}>{med}</li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data">No prescription history</p>
                  )}
                </div> */}

                {/* Patients Section */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>📋Patients </h3>
                  </div>
                  <div className="profile-details">
                    {patients.length > 0 ? patients.map((p) => (
                      <div className="detail-row" key={p._id}>
                        <strong>{p.name}</strong> — {p.age} yrs — {p.gender} — {p.contactNumber}
                      </div>
                    )) : <p>No patients found.</p>}
                  </div>
                </div>
              

                {/* Messages Section */}
                {/* <div className="dashboard-card">
                  <div className="card-header">
                    <h3>✉️ Messages</h3>
                    <Link to="/dashboard/messages" className="view-all">View All</Link>
                  </div>
                  {messages.length > 0 ? (
                    <ul className="message-list">
                      {messages.map(message => (
                        <li key={message.id} className={`message-item ${message.unread ? 'unread' : ''}`}>
                          <div className="message-preview">
                            <span className="message-from">{message.from}</span>
                            <span className="message-time">{message.time}</span>
                            <p className="message-text">{message.preview}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data">No new messages</p>
                  )}
                </div> */}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;