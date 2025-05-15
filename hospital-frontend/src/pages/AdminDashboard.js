import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);


  // Check active menu item based on current route
  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/admindashboard' && location.pathname.startsWith(path));
  };

  // Fetch doctor data and appointments on component mount
 useEffect(() => {
  const fetchDoctorData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const doctorRes = await axios.get('http://localhost:5000/api/doctors/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const doctorId = doctorRes.data.doctor._id;

      const [appointmentsRes, messagesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/appointments/fetch?doctorId=${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/messages/unread-count', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setDoctor(doctorRes.data.doctor);
      setAppointments(appointmentsRes.data.appointments || appointmentsRes.data || []);
      setUnreadMessages(messagesRes.data.count || 0);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchDoctorData();

  const timer = setInterval(() => setCurrentTime(new Date()), 60000);
  return () => clearInterval(timer);
}, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="error-screen">
        <p>Failed to load dashboard data</p>
        <button onClick={() => window.location.reload()}>Retry</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-profile">
          {doctor.photoUrl ? (
            <img src={doctor.photoUrl} alt="Doctor" className="admin-photo" />
          ) : (
            <div className="admin-avatar-default">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          <div className="admin-info">
            <h3>Dr. {doctor.name}</h3>
            <p>{doctor.specialty}</p>
            <p className="admin-status online">Online</p>
          </div>
        </div>


        <aside className="admin-menu">
  <ul>
    <li>
      <Link 
        to="/admindashboard" 
        className={`sidebar-link ${isActive('/admindashboard') ? 'active' : ''}`}
      >
        📊 Dashboard
      </Link>
    </li>
    <li>
      <Link 
        to="/admindashboard/appointments" 
        className={`sidebar-link ${isActive('/admindashboard/appointments') ? 'active' : ''}`}
      >
        📅 Appointments
        {appointments.filter(a => new Date(a.appointmentDate) > new Date()).length > 0 && (
          <span className="badge">
            {appointments.filter(a => new Date(a.appointmentDate) > new Date()).length}
          </span>
        )}
      </Link>
    </li>
    {/* <li>
      <Link 
        to="/admindashboard/patients" 
        className={`sidebar-link ${isActive('/admin-dashboard/patients') ? 'active' : ''}`}
      >
        👥 Patients
      </Link>
    </li> */}
    <li>
      <Link 
        to="/admindashboard/prescriptions" 
        className={`sidebar-link ${isActive('/admin-dashboard/prescriptions') ? 'active' : ''}`}
      >
        💊 Prescriptions
      </Link>
    </li>
    <li>
      <Link 
        to="/admindashboard/messages" 
        className={`sidebar-link ${isActive('/admindashboard/messages') ? 'active' : ''}`}
      >
        ✉️ Messages
        {unreadMessages > 0 && <span className="badge">{unreadMessages}</span>}
      </Link>
    </li>
  </ul>
</aside>



        <div className="admin-footer">
          <div className='admin-footer-flex'>
            <p>{currentTime.toLocaleDateString()}</p>
            <p>{formatTime(currentTime)}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <h2>Doctor Dashboard</h2>
          <div className="admin-actions">
            <button className="action-btn">
              🔔
              <span className="badge">3</span>
            </button>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
          
          {/* Default dashboard content */}
          {isActive('/admindashboard') && (
            <div className="dashboard-overview">
              <div className="stats-cards">
                <div className="stats-card">
                  <h3>Today's Appointments</h3>
                  <p className="stat-number">
                    {appointments.filter(a => 
                      new Date(a.appointmentDate).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                  <Link to="/admindashboard/appointments" className="stats-link">
                    View All
                  </Link>
                </div>
                <div className="stats-card">
                  <h3>Pending Prescriptions</h3>
                  <p className="stat-number">12</p>
                  <Link to="/admindashboard/prescriptions" className="stats-link">
                    Review
                  </Link>
                </div>
                <div className="stats-card">
                  <h3>Unread Messages</h3>
                  <p className="stat-number">{unreadMessages}</p>
                  <Link to="/admindashboard/messages" className="stats-link">
                    Respond
                  </Link>
                </div>
              </div>

              <div className="upcoming-appointments">
                <h3>Upcoming Appointments</h3>
                {appointments
                  .filter(a => new Date(a.appointmentDate) > new Date())
                  .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                  .slice(0, 5)
                  .map(appointment => (
                    <div key={appointment._id} className="appointment-card">
                      <div className="appointment-info">
                        <h4>{appointment.patientName}</h4>
                        <p>
                          {formatDate(appointment.appointmentDate)} at{' '}
                          {formatTime(new Date(appointment.appointmentDate))}
                        </p>
                        <p className="appointment-reason">{appointment.reasonForVisit}</p>
                      </div>
                      <div className="appointment-actions">
                        <Link 
                          to={`/admindashboard/appointments/${appointment._id}`}
                          className="action-btn small"
                        >
                          Details
                        </Link>
                        <button className="action-btn small primary">Start</button>
                      </div>
                    </div>
                  ))}
                {appointments.filter(a => new Date(a.appointmentDate) > new Date()).length === 0 && (
                  <p className="no-data">No upcoming appointments</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;