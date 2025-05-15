import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const DoctorPrescriptionForm = () => {
  const DOCTOR_FEE = 500; // Default doctor consultation fee
  const MEDICINE_OPTIONS = [
    { name: 'Paracetamol', price: 10 },
    { name: 'Ibuprofen', price: 15 },
    { name: 'Amoxicillin', price: 30 },
    { name: 'Cetirizine', price: 12 },
    { name: 'Omeprazole', price: 25 },
    { name: 'Atorvastatin', price: 40 },
    { name: 'Metformin', price: 20 },
    { name: 'Losartan', price: 35 },
    { name: 'Azithromycin', price: 50 },
    { name: 'Ciprofloxacin', price: 45 }
  ];

  const [doctorId, setDoctorId] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicines, setMedicines] = useState([
    {
      name: '',
      days: '',
      time: '',
      count: '',
      foodTime: '',
      syrupML: '',
      totalCount: 0,
      price: 0,
      totalPrice: 0
    }
  ]);
  const [notes, setNotes] = useState('');
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [billAmount, setBillAmount] = useState(DOCTOR_FEE);
  const [showBill, setShowBill] = useState(false);

  // Extract doctorId from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setDoctorId(decoded.id);
    }
  }, []);

  // Fetch patients for doctor
  useEffect(() => {
    if (doctorId) {
      axios
        .get(`http://localhost:5000/api/patients/byDoctor/${doctorId}`)
        .then((res) => setPatients(res.data))
        .catch((err) => console.error('Error fetching patients:', err));
    }
  }, [doctorId]);

  // Calculate medicine totals and bill amount
  useEffect(() => {
    const updatedMedicines = medicines.map(med => {
      const days = Number(med.days) || 0;
      const count = Number(med.count) || 0;
      const price = med.price || 0;
      
      // Calculate times per day based on selected time
      let timesPerDay = 1;
      if (med.time === 'Morning,Night') timesPerDay = 2;
      if (med.time === 'Morning,Noon,Night') timesPerDay = 3;
      
      const totalCount = days * count * timesPerDay;
      const totalPrice = totalCount * price;

      return {
        ...med,
        totalCount,
        totalPrice
      };
    });

    if (JSON.stringify(updatedMedicines) !== JSON.stringify(medicines)) {
      setMedicines(updatedMedicines);
    }

    // Calculate total medicines count
    const validMedicines = updatedMedicines.filter(m => m.name.trim() !== '');
    setTotalMedicines(validMedicines.length);

    // Calculate total bill amount
    const medicinesTotal = validMedicines.reduce((sum, med) => sum + med.totalPrice, 0);
    setBillAmount(DOCTOR_FEE + medicinesTotal);
  }, [medicines]);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (index, key, value) => {
    const updated = [...medicines];
    updated[index][key] = value;
    
    // If medicine name changed, update the price
    if (key === 'name') {
      const selectedMedicine = MEDICINE_OPTIONS.find(m => m.name === value);
      updated[index].price = selectedMedicine ? selectedMedicine.price : 0;
    }
    
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: '',
        days: '',
        time: '',
        count: '',
        foodTime: '',
        syrupML: '',
        totalCount: 0,
        price: 0,
        totalPrice: 0
      }
    ]);
  };

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      const updated = medicines.filter((_, i) => i !== index);
      setMedicines(updated);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }

    // Filter out empty medicine entries
    const validMedicines = medicines.filter(med => med.name.trim() !== '');

    if (validMedicines.length === 0) {
      alert('Please add at least one medicine');
      return;
    }

    const payload = {
      userId: selectedPatient.userId,
      patientId: selectedPatient._id,
      doctorId,
      appointmentId: selectedPatient.appointmentId || null,
      medicines: validMedicines,
      notes,
      totalMedicines: validMedicines.length,
      totalItems: validMedicines.reduce((sum, med) => sum + (med.totalCount || 0), 0),
      billAmount
    };

    try {
      await axios.post('http://localhost:5000/api/prescriptions/add', payload);
      alert('Prescription submitted successfully!');
      setShowBill(true);
    } catch (err) {
      console.error(err);
      alert('Error submitting prescription.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '90vh', padding: '20px' }}>
      {/* Left Panel: Patients */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h3 style={{ padding: '10px' }}>Patients</h3>
        <input
          type="text"
          placeholder="Search patients..."
          style={{ width: '90%', margin: '10px', padding: '8px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredPatients.map((p) => (
          <div
            key={p._id}
            onClick={() => {
              setSelectedPatient(p);
              setShowBill(false);
            }}
            style={{
              padding: '15px',
              cursor: 'pointer',
              backgroundColor: selectedPatient?._id === p._id ? '#04c37d' : 'white',
              color: selectedPatient?._id === p._id ? 'white' : 'black',
              borderBottom: '1px solid #ddd'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{p.name}</div>
            <div style={{ fontSize: '0.8em', color: selectedPatient?._id === p._id ? '#e0e0e0' : '#666' }}>
              {p.age ? `${p.age} years` : 'Age not specified'} • {p.gender || 'Gender not specified'}
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel: Prescription Form */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {selectedPatient ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Prescription for {selectedPatient.name}</h2>
              <div style={{ backgroundColor: '#f0f0f0', padding: '5px 10px', borderRadius: '4px' }}>
                Total Medicines: {totalMedicines}
              </div>
            </div>
            
            {medicines.map((med, idx) => (
              <div key={idx} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>Medicine #{idx + 1}</h4>
                  {medicines.length > 1 && (
                    <button 
                      onClick={() => removeMedicine(idx)}
                      style={{ 
                        backgroundColor: '#ff4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        padding: '2px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  <div>
                    <label>Medicine Name</label>
                    <select
                      value={med.name}
                      onChange={(e) => handleChange(idx, 'name', e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="">Select Medicine</option>
                      {MEDICINE_OPTIONS.map((medicine, i) => (
                        <option key={i} value={medicine.name}>
                          {medicine.name} (₹{medicine.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label>Days</label>
                    <select
                      value={med.days}
                      onChange={(e) => handleChange(idx, 'days', e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="">Select Days</option>
                      {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 28].map(day => (
                        <option key={day} value={day}>{day} day{day !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label>Dosage Time</label>
                    <select 
                      onChange={(e) => handleChange(idx, 'time', e.target.value)} 
                      value={med.time}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="">Select Time</option>
                      <option value="Morning">Morning</option>
                      <option value="Noon">Noon</option>
                      <option value="Night">Night</option>
                      <option value="Morning,Night">Morning & Night</option>
                      <option value="Morning,Noon,Night">Morning, Noon & Night</option>
                    </select>
                  </div>
                  
                  <div>
                    <label>Count per dose</label>
                    <select
                      value={med.count}
                      onChange={(e) => handleChange(idx, 'count', e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="">Select Count</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} tablet{num !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label>Food Timing</label>
                    <select 
                      onChange={(e) => handleChange(idx, 'foodTime', e.target.value)} 
                      value={med.foodTime}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="">Before/After Food</option>
                      <option value="Before Food">Before Food</option>
                      <option value="After Food">After Food</option>
                      <option value="With Food">With Food</option>
                    </select>
                  </div>
                  
                  <div>
                    <label>Syrup (ml)</label>
                    <select
                      value={med.syrupML}
                      onChange={(e) => handleChange(idx, 'syrupML', e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="">Select ML</option>
                      <option value="5ml">5ml</option>
                      <option value="10ml">10ml</option>
                      <option value="15ml">15ml</option>
                      <option value="20ml">20ml</option>
                    </select>
                  </div>
                </div>
                
                {med.name && (
                  <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <div><strong>Price:</strong> ₹{med.price} per item</div>
                    <div><strong>Total Count:</strong> {med.totalCount} {med.totalCount === 1 ? 'item' : 'items'}</div>
                    <div><strong>Total Price:</strong> ₹{med.totalPrice}</div>
                  </div>
                )}
              </div>
            ))}

            <button 
              onClick={addMedicine}
              style={{
                backgroundColor: '#04c37d',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              + Add Another Medicine
            </button>
            
            <div>
              <label>Additional Notes</label>
              <textarea
                placeholder="Enter any additional instructions or notes..."
                rows="4"
                style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div style={{ 
              backgroundColor: '#e9f7ef', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <h4 style={{ marginTop: 0 }}>Prescription Summary</h4>
              <div><strong>Patient:</strong> {selectedPatient.name}</div>
              <div><strong>Total Medicines:</strong> {totalMedicines}</div>
              <div><strong>Total Items Needed:</strong> {medicines.reduce((sum, med) => sum + (med.totalCount || 0), 0)}</div>
              <div><strong>Doctor Fee:</strong> ₹{DOCTOR_FEE}</div>
              <div><strong>Medicines Total:</strong> ₹{billAmount - DOCTOR_FEE}</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}><strong>Total Bill Amount:</strong> ₹{billAmount}</div>
            </div>
            
            {showBill && (
              <div style={{ 
                backgroundColor: '#d4edda', 
                padding: '15px', 
                borderRadius: '5px',
                marginBottom: '20px',
                border: '1px solid #c3e6cb'
              }}>
                <h4 style={{ marginTop: 0 }}>Prescription Submitted Successfully!</h4>
                <div><strong>Bill Amount:</strong> ₹{billAmount}</div>
                <div style={{ marginTop: '10px' }}>
                  <button 
                    onClick={() => window.print()}
                    style={{
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      padding: '8px 15px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Print Prescription
                  </button>
                  <button 
                    onClick={() => {
                      setMedicines([{
                        name: '',
                        days: '',
                        time: '',
                        count: '',
                        foodTime: '',
                        syrupML: '',
                        totalCount: 0,
                        price: 0,
                        totalPrice: 0
                      }]);
                      setNotes('');
                      setShowBill(false);
                    }}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '8px 15px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Create New Prescription
                  </button>
                </div>
              </div>
            )}
            
            {!showBill && (
              <button
                onClick={handleSubmit}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '12px 25px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  width: '100%'
                }}
              >
                Submit Prescription
              </button>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#666'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h3>No Patient Selected</h3>
              <p>Please select a patient from the list to create a prescription</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescriptionForm;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const DoctorPrescriptionForm = () => {
//   const [doctorId, setDoctorId] = useState('');
//   const [patients, setPatients] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [medicines, setMedicines] = useState([
//     {
//       name: '',
//       days: '',
//       time: '',
//       count: '',
//       foodTime: '',
//       syrupML: ''
//     }
//   ]);
//   const [notes, setNotes] = useState('');

//   // 🔐 Extract doctorId from token
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     console.log('Token:', token);
//     if (token) {
//       const decoded = jwtDecode(token);
//       setDoctorId(decoded.id); // assuming _id is in the payload
//     }
//   }, []);

//   // 🧾 Fetch patients for doctor
//   useEffect(() => {
//     console.log('Doctor ID:', doctorId);
//     if (doctorId) {
//       axios
//         .get(`http://localhost:5000/api/patients/byDoctor/${doctorId}`)
//         .then((res) => setPatients(res.data))
//         .catch((err) => console.error('Error fetching patients:', err));
//     }
//   }, [doctorId]);

//   const handleChange = (index, key, value) => {
//     const updated = [...medicines];
//     updated[index][key] = value;
//     setMedicines(updated);
//   };

//   const addMedicine = () => {
//     setMedicines([
//       ...medicines,
//       {
//         name: '',
//         days: '',
//         time: '',
//         count: '',
//         foodTime: '',
//         syrupML: ''
//       }
//     ]);
//   };

//   const handleSubmit = async () => {
//     const payload = {
//       userId: selectedPatient.userId,
//       patientId: selectedPatient._id,
//       doctorId,
//       appointmentId: selectedPatient.appointmentId || null,
//       medicines,
//       notes
//     };

//     try {
//       await axios.post('http://localhost:5000/api/prescriptions/add', payload);
//       alert('Prescription submitted successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Error submitting prescription.');
//     }
//   };

//   return (
//     <div style={{ display: 'flex', height: '90vh', padding: '20px' }}>
//       {/* Left Panel: Patients */}
//       <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
//         <h3 style={{ padding: '10px' }}>Patients</h3>
//         {patients.map((p) => (
//           <div
//             key={p._id}
//             onClick={() => setSelectedPatient(p)}
//             style={{
//               padding: '15px',
//               cursor: 'pointer',
//               backgroundColor: selectedPatient?._id === p._id ? '#04c37d' : 'white',
//               color: selectedPatient?._id === p._id ? 'white' : 'black',
//               borderBottom: '1px solid #ddd'
//             }}
//           >
//             {p.name}
//           </div>
//         ))}
//       </div>

//       {/* Right Panel: Prescription Form */}
//       <div style={{ flex: 1, padding: '20px' }}>
//         {selectedPatient ? (
//           <div>
//             <h2>Prescription for {selectedPatient.name}</h2>
//             {medicines.map((med, idx) => (
//               <div key={idx} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
//                 <input
//                   type="text"
//                   placeholder="Medicine Name"
//                   value={med.name}
//                   onChange={(e) => handleChange(idx, 'name', e.target.value)}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Days"
//                   value={med.days}
//                   onChange={(e) => handleChange(idx, 'days', e.target.value)}
//                 />
//                 <select onChange={(e) => handleChange(idx, 'time', e.target.value)} value={med.time}>
//                   <option value="">Inhale Time</option>
//                   <option value="Morning">Morning</option>
//                   <option value="Noon">Noon</option>
//                   <option value="Night">Night</option>
//                 </select>
//                 <input
//                   type="number"
//                   placeholder="Count"
//                   value={med.count}
//                   onChange={(e) => handleChange(idx, 'count', e.target.value)}
//                 />
//                 <select onChange={(e) => handleChange(idx, 'foodTime', e.target.value)} value={med.foodTime}>
//                   <option value="">Before/After Food</option>
//                   <option value="Before Food">Before Food</option>
//                   <option value="After Food">After Food</option>
//                 </select>
//                 <input
//                   type="text"
//                   placeholder="Syrup (ml)"
//                   value={med.syrupML}
//                   onChange={(e) => handleChange(idx, 'syrupML', e.target.value)}
//                 />
//               </div>
//             ))}

//             <button onClick={addMedicine}>+ Add Another Medicine</button>
//             <br /><br />
//             <textarea
//               placeholder="Additional Notes"
//               rows="4"
//               style={{ width: '100%' }}
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//             />
//             <br />
//             <button
//               onClick={handleSubmit}
//               style={{
//                 backgroundColor: '#007bff',
//                 color: 'white',
//                 padding: '10px 20px',
//                 marginTop: '10px'
//               }}
//             >
//               Submit Prescription
//             </button>
//           </div>
//         ) : (
//           <p>Please select a patient to create a prescription.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DoctorPrescriptionForm;




// import React, { useState } from 'react';

// const DoctorPrescriptionForm = () => {
//   const [formData, setFormData] = useState({
//     medicineName: '',
//     days: '',
//     inhaleTime: '',
//     medicineCount: '',
//     foodTiming: '',
//     syrupMl: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.medicineName.trim()) newErrors.medicineName = 'Medicine name is required';
//     if (!formData.days || formData.days <= 0) newErrors.days = 'Days must be a positive number';
//     if (!formData.inhaleTime) newErrors.inhaleTime = 'Inhale time is required';
//     if (!formData.medicineCount || formData.medicineCount <= 0) newErrors.medicineCount = 'Medicine count must be a positive number';
//     if (!formData.foodTiming) newErrors.foodTiming = 'Food timing is required';
//     if (formData.syrupMl && formData.syrupMl < 0) newErrors.syrupMl = 'Syrup ml cannot be negative';
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }
//     setSubmitted(true);
//     // Simulate API call
//     console.log('Prescription Submitted:', formData);
//     // In a real app, send formData to backend here
//   };

//   const resetForm = () => {
//     setSubmitted(false);
//     setFormData({
//       medicineName: '',
//       days: '',
//       inhaleTime: '',
//       medicineCount: '',
//       foodTiming: '',
//       syrupMl: ''
//     });
//     setErrors({});
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-bold text-center mb-6">Prescription Form</h1>
//       {submitted ? (
//         <div className="bg-green-100 p-4 rounded-lg">
//           <h2 className="text-lg font-semibold text-green-800">Prescription Submitted Successfully!</h2>
//           <p><strong>Medicine:</strong> {formData.medicineName}</p>
//           <p><strong>Duration:</strong> {formData.days} days</p>
//           <p><strong>Inhale Time:</strong> {formData.inhaleTime}</p>
//           <p><strong>Medicine Count:</strong> {formData.medicineCount}</p>
//           <p><strong>Food Timing:</strong> {formData.foodTiming}</p>
//           {formData.syrupMl && <p><strong>Syrup:</strong> {formData.syrupMl} ml</p>}
//           <button
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             onClick={resetForm}
//           >
//             Create New Prescription
//           </button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
//             <input
//               type="text"
//               name="medicineName"
//               value={formData.medicineName}
//               onChange={handleChange}
//               className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
//               placeholder="e.g., Paracetamol"
//             />
//             {errors.medicineName && <p className="text-red-500 text-sm">{errors.medicineName}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
//             <input
//               type="number"
//               name="days"
//               value={formData.days}
//               onChange={handleChange}
//               className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
//               min="1"
//             />
//             {errors.days && <p className="text-red-500 text-sm">{errors.days}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Inhale Time</label>
//             <select
//               name="inhaleTime"
//               value={formData.inhaleTime}
//               onChange={handleChange}
//               className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Time</option>
//               <option value="Morning">Morning</option>
//               <option value="Noon">Noon</option>
//               <option value="Night">Night</option>
//             </select>
//             {errors.inhaleTime && <p className="text-red-500 text-sm">{errors.inhaleTime}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Medicine Count (per dose)</label>
//             <input
//               type="number"
//               name="medicineCount"
//               value={formData.medicineCount}
//               onChange={handleChange}
//               className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
//               min="1"
//             />
//             {errors.medicineCount && <p className="text-red-500 text-sm">{errors.medicineCount}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Food Timing</label>
//             <select
//               name="foodTiming"
//               value={formData.foodTiming}
//               onChange={handleChange}
//               className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Timing</option>
//               <option value="Before Food">Before Food</option>
//               <option value="After Food">After Food</option>
//             </select>
//             {errors.foodTiming && <p className="text-red-500 text-sm">{errors.foodTiming}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Syrup (ml, if applicable)</label>
//             <input
//               type="number"
//               name="syrupMl"
//               value={formData.syrupMl}
//               onChange={handleChange}
//               className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
//               min="0"
//               placeholder="Leave blank if not applicable"
//             />
//             {errors.syrupMl && <p className="text-red-500 text-sm">{errors.syrupMl}</p>}
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Submit Prescription
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default DoctorPrescriptionForm;
