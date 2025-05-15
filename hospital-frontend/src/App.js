import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import AppointmentPage from './pages/AppointmentPage';
import DasboardHome from './pages/DasboardHome';
import AdminDashboard from './pages/AdminDashboard';
import ViewAppointment from './pages/ViewAppointment';
import './pages/styles.css';
import Messagepage from './pages/MessagePage';
import DoctorMessagePage from './pages/DoctorMessagePage';
import UserPrescriptions from './pages/UserPrescriptions';
import DoctorPrescriptionForm from './pages/DoctorPrescriptionForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
       <Route path="/admindashboard" element={<AdminDashboard />}>
          <Route path="/admindashboard/appointments" element={<ViewAppointment />} />
          {/*<Route path="appointments/:id" element={<ViewAppointment />} />
           <Route path="patients" element={<Patients />} */}
          <Route path="/admindashboard/prescriptions" element={<DoctorPrescriptionForm />} />
          <Route path="/admindashboard/messages" element={<DoctorMessagePage />} /> 
        </Route>
        <Route path="/dashboard" element={<UserDashboard />}>
          <Route path="doctor" element={<DasboardHome />} />
          <Route path="appointments" element={<AppointmentPage />} />
          <Route path="messages" element={<Messagepage />} />
          <Route path="medical-records" element={<UserPrescriptions />} />
        </Route>      
        </Routes>
    </Router>
  );
}

export default App;
