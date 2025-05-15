// src/components/ViewAppointment.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
  const fetchAppointments = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const doctorRes = await axios.get('http://localhost:5000/api/doctors/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const doctorId = doctorRes.data.doctor._id;

    console.log(doctorId);
    const res = await axios.get(`http://localhost:5000/api/appointments/fetch?doctorId=${doctorId}`);
    setAppointments(res.data);
  } catch (error) {
    console.error('Error fetching doctor or appointments:', error);
  }
};


  fetchAppointments();
}, []);

  const handleApprove = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/approve`);
      setAppointments(appointments.map(appt => 
        appt._id === appointmentId ? { ...appt, status: 'approved' } : appt
      ));
      setStatusMessage('Appointment approved successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('Error approving appointment:', err);
      setStatusMessage('Failed to approve appointment');
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/reject`);
      setAppointments(appointments.map(appt => 
        appt._id === appointmentId ? { ...appt, status: 'rejected' } : appt
      ));
      setStatusMessage('Appointment rejected successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      setStatusMessage('Failed to reject appointment');
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };


  return (
  <div className="appointments-container">
    <h2 className="appointments-title">Patient Appointments</h2>

    {statusMessage && (
      <div className={`status-message ${statusMessage.includes('success') ? 'status-success' : 'status-error'}`}>
        {statusMessage}
      </div>
    )}

    {appointments.length === 0 ? (
      <div className="no-appointments-box">
        <p className="no-appointments-text">No appointments found.</p>
      </div>
    ) : (
      <div className="appointments-grid">
        {appointments.map((appt) => (
          <div key={appt._id} className={`appointment-card ${appt.status}`}>
            <div className="appointment-content">
              <div className="appointment-header">
                <h3 className="patient-name">{appt.patientName}</h3>
                <span className={`appointment-status ${appt.status}`}>
                  {appt.status || 'pending'}
                </span>
              </div>
              <div className="appointment-info">
                <p><span className="label">Issue:</span> {appt.issue}</p>
                <p><span className="label">Reason:</span> {appt.reasonForVisit}</p>
                <p><span className="label">When:</span> {new Date(appt.appointmentDate).toLocaleString()}</p>
              </div>
              <div className="appointment-actions">
                <button onClick={() => handleApprove(appt._id)} className="btn-approve" disabled={appt.status === 'approved'}>Approve</button>
                <button onClick={() => handleReject(appt._id)} className="btn-reject" disabled={appt.status === 'rejected'}>Reject</button>
                <button onClick={() => handleViewDetails(appt)} className="btn-view">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {selectedAppointment && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-body">
            <div className="modal-header">
              <h3 className="modal-title">Appointment Details</h3>
              <button onClick={handleCloseDetails} className="modal-close">
                <svg xmlns="http://www.w3.org/2000/svg" className="modal-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-sections">
              <div>
                <h4 className="section-title">Patient Information</h4>
                <div className="section-content">
                  <p><span className="label">Name:</span> {selectedAppointment.patientName}</p>
                  <p><span className="label">Email:</span> {selectedAppointment.patientEmail}</p>
                  <p><span className="label">Contact:</span> {selectedAppointment.contactNumber}</p>
                  <p><span className="label">Age:</span> {selectedAppointment.patientAge}</p>
                  <p><span className="label">Gender:</span> {selectedAppointment.patientGender}</p>
                </div>
              </div>
              <div>
                <h4 className="section-title">Appointment Details</h4>
                <div className="section-content">
                  <p><span className="label">Date & Time:</span> {new Date(selectedAppointment.appointmentDate).toLocaleString()}</p>
                  <p><span className="label">Medical Issue:</span> {selectedAppointment.issue}</p>
                  <p><span className="label">Reason for Visit:</span> {selectedAppointment.reasonForVisit}</p>
                  <p><span className="label">Status:</span>
                    <span className={`status-badge ${selectedAppointment.status}`}>
                      {selectedAppointment.status || 'pending'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => handleApprove(selectedAppointment._id)} className={`btn-approve-modal ${selectedAppointment.status === 'approved' && 'disabled'}`} disabled={selectedAppointment.status === 'approved'}>Approve</button>
              <button onClick={() => handleReject(selectedAppointment._id)} className={`btn-reject-modal ${selectedAppointment.status === 'rejected' && 'disabled'}`} disabled={selectedAppointment.status === 'rejected'}>Reject</button>
              <button onClick={handleCloseDetails} className="btn-close-modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);


};

export default ViewAppointment;
