import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
import trustedBy from '../images/trusted-by-logos.png';


const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registered successfully! Please login.');
    } catch (err) {
      alert('Registration failed. Try again.');
    }
  };

  return (
    <>
            <div className="navbar-brand" style={{padding: '30px 20px'}}>
              <span className="navbar-logo"><img src={trustedBy} alt="Trusted by logos" width={100} height={100} style={{borderRadius: '50%'}}/></span>
              <span className="navbar-title">TeleMedicine</span>
            </div>
 <div className="container">
      <h2>Hospital Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button> <br></br>
        <p>Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>

    </>
   
  );
};

export default Register;
