import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const HomePage = () => (
  <div className="home-container">
    <nav className="home-navbar">
      <div className="logo">🏥 MyHospital</div>
      <div>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </div>
    </nav>
    <div className="home-content">
      <h1>Welcome to MyHospital</h1>
      <p>Your health, our priority. Book appointments, view records, and stay connected with your doctors.</p>
      <Link to="/login" className="home-button">Get Started</Link>
    </div>
  </div>
);

export default HomePage;
