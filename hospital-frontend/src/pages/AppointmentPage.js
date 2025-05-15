import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const AppointmentPage = () => {
  // Form state
  const [form, setForm] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientEmail: '',
    patientPhone: '',
    date: '',
    time: '',
    doctorId: '',
    reason: '',
    otherReason: '',
    issue: ''
  });

  // UI and data states
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showOtherReason, setShowOtherReason] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Constants for dropdown options
  const suggestedReasons = [
    'Consultation',
    'Follow-up',
    'Routine Check-up',
    'Other'
  ];

  // Organized issue options with categories for better UX
  // Issue options mapped to doctor's bestFor terms
  const issueOptions = [
    { label: 'Chest Pain', matches: ['chest pain'] },
    { label: 'Heart Issues', matches: ['heart palpitations', 'hypertension'] },
    { label: 'Joint Pain', matches: ['joint pain', 'arthritis'] },
    { label: 'Bone Fractures', matches: ['bone fractures'] },
    { label: 'Fever', matches: ['fever', 'flu'] },
    { label: 'Common Cold', matches: ['common cold in kids'] },
    { label: 'Skin Rash', matches: ['skin rash', 'eczema'] },
    { label: 'Acne', matches: ['acne'] },
    { label: 'Pregnancy Care', matches: ['pregnancy care'] },
    { label: 'Menstrual Disorders', matches: ['menstrual disorders', 'PCOS'] },
    { label: 'Migraines', matches: ['migraines'] },
    { label: 'Nerve Pain', matches: ['nerve pain'] },
    { label: 'Seizures', matches: ['seizures'] },
    { label: 'Body Pain', matches: ['body pain'] },
    { label: 'Ear Infection', matches: ['ear infection'] },
    { label: 'Throat Pain', matches: ['throat pain'] },
    { label: 'Sinus Issues', matches: ['sinus issues'] },
    { label: 'Anxiety', matches: ['anxiety'] },
    { label: 'Depression', matches: ['depression'] },
    { label: 'Sleep Disorders', matches: ['sleep disorders'] },
    { label: 'Kidney Stones', matches: ['kidney stones'] },
    { label: 'UTIs', matches: ['UTIs'] },
    { label: 'Bladder Issues', matches: ['bladder issues'] },
    { label: 'General Checkup', matches: [] } // Matches all doctors
  ];

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctor data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors based on selected issue
   useEffect(() => {
    if (!form.issue) {
      setFilteredDoctors([]);
      return;
    }

    const selectedIssue = issueOptions.find(opt => opt.label === form.issue);
    if (!selectedIssue) {
      setFilteredDoctors([]);
      return;
    }

    // For general checkup, show all available doctors
    if (form.issue === 'General Checkup') {
      setFilteredDoctors(doctors.filter(doc => doc.available));
      return;
    }

    const filtered = doctors.filter(doctor => {
      if (!doctor.available) return false;
      
      // Check if doctor's bestFor includes any of the matching terms
      return selectedIssue.matches.some(match => 
        doctor.bestFor.some(bf => 
          bf.toLowerCase().includes(match.toLowerCase())
        )
      );
    });

    setFilteredDoctors(filtered);
  }, [form.issue, doctors]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'reason') {
      setShowOtherReason(value === 'Other');
    }

    // Reset doctor selection when issue changes
    if (name === 'issue') {
      setForm(prev => ({ 
        ...prev, 
        [name]: value, 
        doctorId: '' 
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    // Clear any previous errors
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  // Validate form fields
  const validateForm = () => {
    const requiredFields = [
      'patientName',
      'patientAge',
      'patientGender',
      'patientPhone',
      'date',
      'time',
      'issue',
      'doctorId'
    ];

    // Check all required fields
    for (const field of requiredFields) {
      if (!form[field]) {
        setError(`Please fill in the ${field.replace('patient', '').toLowerCase()} field`);
        return false;
      }
    }

    // Validate email if provided
    if (form.patientEmail && !/^\S+@\S+\.\S+$/.test(form.patientEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate phone number
    if (!/^\d{10,15}$/.test(form.patientPhone)) {
      setError('Please enter a valid phone number (10-15 digits)');
      return false;
    }

    // Validate age
    if (form.patientAge < 0 || form.patientAge > 120) {
      setError('Please enter a valid age');
      return false;
    }

    // Validate reason (either reason or otherReason if 'Other' is selected)
    if (!form.reason || (form.reason === 'Other' && !form.otherReason)) {
      setError('Please provide a reason for your visit');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const appointmentData = {
    patientName: form.patientName,
    patientAge: form.patientAge,
    patientGender: form.patientGender,
    contactNumber: form.patientPhone,
    patientEmail: form.patientEmail,
    reasonForVisit: form.reason === 'Other' ? form.otherReason : form.reason,
    issue: form.issue,
    doctorId: form.doctorId,
    appointmentDate: new Date(`${form.date}T${form.time}`)
  };

  try {
    setIsLoading(true);

    const token = localStorage.getItem('token'); // ✅ Get user token

    const response = await axios.post(
      'http://localhost:5000/api/appointments/book',
      appointmentData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ Pass JWT token to backend
        }
      }
    );

    if (response.status === 201) {
      setSuccess('Appointment booked successfully!');
      setForm({
        patientName: '',
        patientAge: '',
        patientGender: '',
        patientEmail: '',
        patientPhone: '',
        date: '',
        time: '',
        doctorId: '',
        reason: '',
        otherReason: '',
        issue: ''
      });
      setFilteredDoctors([]);
    }
  } catch (err) {
    console.error('Error booking appointment:', err);
    setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  // Format time options for better UX
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(<option key={time} value={time}>{time}</option>);
      }
    }
    return options;
  };

  return (<>
    
    <div className="form-container-appointment">
      <h2>Book an Appointment</h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="patientName">Full Name *</label>
            <input 
              type="text" 
              id="patientName"
              name="patientName" 
              value={form.patientName} 
              onChange={handleChange} 
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="patientPhone">Phone Number *</label>
            <input 
              type="tel" 
              id="patientPhone"
              name="patientPhone" 
              value={form.patientPhone} 
              onChange={handleChange} 
              placeholder="Enter your phone number"
              required
            />
          </div>
           <div className="form-group">
            <label htmlFor="patientGender">Gender *</label>
            <select 
              id="patientGender"
              name="patientGender" 
              value={form.patientGender} 
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          

           <div className="form-group">
            <label htmlFor="patientEmail">Email</label>
            <input 
              type="email" 
              id="patientEmail"
              name="patientEmail" 
              value={form.patientEmail} 
              onChange={handleChange} 
              placeholder="Enter your email"
            />
          </div>

          
          
          <div className="form-group">
            <label htmlFor="patientAge">Age *</label>
            <input 
              type="number" 
              id="patientAge"
              name="patientAge" 
              value={form.patientAge} 
              onChange={handleChange} 
              min="0"
              max="120"
              placeholder="Age"
              required
            />
          </div>
           <div className="form-group">
            <label htmlFor="date">Appointment Date *</label>
            <input 
              type="date" 
              id="date"
              name="date" 
              value={form.date} 
              onChange={handleChange} 
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="issue">What's your primary health concern? *</label>
          <select 
            id="issue"
            name="issue" 
            value={form.issue} 
            onChange={handleChange} 
            required
          >
            <option value="">Select your health concern</option>
            {issueOptions.map((opt, idx) => (
              <option key={idx} value={opt.label}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="time">Preferred Time *</label>
            <select 
              id="time"
              name="time" 
              value={form.time} 
              onChange={handleChange}
              required
            >
              <option value="">Select time</option>
              {generateTimeOptions()}
            </select>
          </div>

          </div>

          <div className="form-row">
          
          <div className="form-group">
            <label htmlFor="doctorId">Select Doctor *</label>
            {isLoading ? (
              <select disabled>
                <option>Loading doctors...</option>
              </select>
            ) : (
              <select 
                id="doctorId"
                name="doctorId" 
                value={form.doctorId} 
                onChange={handleChange}
                required
                disabled={!form.issue || filteredDoctors.length === 0}
              >
                <option value="">
                  {form.issue 
                    ? filteredDoctors.length === 0 
                      ? 'No available doctors for this issue' 
                      : 'Select a doctor'
                    : 'First select your health concern'}
                </option>
                {filteredDoctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} - {doc.specialty}
                    {doc.availableTime && ` (Available: ${doc.availableTime})`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="reason">Reason for Visit *</label>
          <select 
            id="reason"
            name="reason" 
            value={form.reason} 
            onChange={handleChange}
            required
          >
            <option value="">Select reason</option>
            {suggestedReasons.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {showOtherReason && (
          <div className="form-group full-width">
            <label htmlFor="otherReason">Please specify your reason *</label>
            <textarea
              id="otherReason"
              name="otherReason"
              value={form.otherReason}
              onChange={handleChange}
              placeholder="Describe your reason for the visit"
              rows="3"
              required={showOtherReason}
            />
          </div>
        )}

        <div className="form-column">
          <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Booking...
            </>
          ) : 'Book Appointment'}
        </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default AppointmentPage;