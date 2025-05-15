// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import './styles.css';
// import trustedBy from '../images/trusted-by-logos.png';


// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const navigate = useNavigate(); // ✅ Added this line

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', form);
//       if (res.data && res.data.user) {
//         alert(`Welcome, ${res.data.user.name}`);
//         navigate('/dashboard'); // ✅ Correctly call navigate after login
//       } else {
//         alert('Unexpected response from server.');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       alert('Login failed. Please check your email and password.');
//     }
//   };

//   return (<>
//         <div className="navbar-brand" style={{padding: '30px 20px'}}>
//           <span className="navbar-logo"><img src={trustedBy} alt="Trusted by logos" width={100} height={100} style={{borderRadius: '50%'}}/></span>
//           <span className="navbar-title">TeleMedicine</span>
//           <div><button> ADMIN LOGIN </button></div>
//         </div>
//         <div className="container">

//       <h2 className="form-title">Hospital Login</h2>
//       <form onSubmit={handleSubmit} className="form">
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//           className="form-input"
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//           className="form-input"
//         />
//         <button type="submit" className="form-button">Login</button> <br></br>
//         <p className="form-text">
//           Don&apos;t have an account? <Link to="/register" className="form-link">Register</Link>
//         </p>
//       </form>
//     </div>
//   </>
    
//   );
// };

// export default Login;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles.css';
import trustedBy from '../images/trusted-by-logos.png';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [adminForm, setAdminForm] = useState({ name: '', password: '', calculation: '', userInput: '' });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [calculation, setCalculation] = useState(generateRandomCalculation());
  const navigate = useNavigate();

  // Generate random calculation for admin verification
  function generateRandomCalculation() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      text: `${num1} + ${num2}`,
      answer: num1 + num2
    };
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdminChange = e => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post('http://localhost:5000/api/auth/login', form);
  //     if (res.data && res.data.user) {
  //       alert(`Welcome, ${res.data.user.name}`);
  //       navigate('/dashboard');
  //     } else {
  //       alert('Unexpected response from server.');
  //     }
  //   } catch (err) {
  //     console.error('Login error:', err);
  //     alert('Login failed. Please check your email and password.');
  //   }
  // };

  const handleSubmit = async e => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', form);
    if (res.data && res.data.user) {
      alert(`Welcome, ${res.data.user.name}`);

      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');
    } else {
      alert('Unexpected response from server.');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Login failed. Register then, Please check your email and password.');
  }
};

  const handleAdminSubmit = async e => {

    console.log('Admin form:', adminForm);
    console.log('Calculation:', calculation);

    e.preventDefault();
    
    // Verify calculation
    if (parseInt(adminForm.userInput) !== calculation.answer) {
      alert('Incorrect calculation. Please try again.');
      setCalculation(generateRandomCalculation());
      return;
    }

    try {
      // Check if doctor exists in the database
      const res = await axios.post('http://localhost:5000/api/doctors/verify', {
        name: adminForm.name,
        password: adminForm.password
      });

      console.log('Logging in with:', adminForm.name, adminForm.password);


      if (res.data && res.data.doctor && res.data.token) {
      localStorage.setItem('token', res.data.token); // ✅ Save token
      alert(`Welcome, Dr. ${res.data.doctor.name}`);
      navigate('/admindashboard'); // ✅ Use the correct route path (match your Router)
    }
    else {
        alert('Doctor not found or credentials incorrect.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      alert('Login failed. Please check your name and password.');
    }
  };

  const toggleAdminLogin = () => {
    setShowAdminLogin(!showAdminLogin);
    setCalculation(generateRandomCalculation());
  };

  return (
    <>
      <div className="navbar-brand" style={{ padding: '30px 20px' }}>
        <span className="navbar-logo">
          <img src={trustedBy} alt="Trusted by logos" width={100} height={100} style={{ borderRadius: '50%' }} />
        </span>
        <span className="navbar-title">TeleMedicine</span>
        <div>
          <button 
            onClick={toggleAdminLogin} 
            className={`admin-toggle-btn ${showAdminLogin ? 'active' : ''}`}
          >
            {showAdminLogin ? 'USER LOGIN' : 'ADMIN LOGIN'}
          </button>
        </div>
      </div>
      
      <div className="container">
        {!showAdminLogin ? (
          <>
            <h2 className="form-title">Patient Login</h2>
            <form onSubmit={handleSubmit} className="form">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button type="submit" className="form-button">Login</button>
              <br />
              <p className="form-text">
                Don't have an account? <Link to="/register" className="form-link">Register</Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="form-title">Doctor Login</h2>
            <form onSubmit={handleAdminSubmit} className="form">
              <input
                name="name"
                type="text"
                placeholder="Doctor Name"
                value={adminForm.name}
                onChange={handleAdminChange}
                required
                className="form-input"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={adminForm.password}
                onChange={handleAdminChange}
                required
                className="form-input"
              />
              <div className="calculation-verification">
                <label>Verification: What is {calculation.text}?</label>
                <input
                  name="userInput"
                  type="number"
                  placeholder="Your answer"
                  value={adminForm.userInput}
                  onChange={handleAdminChange}
                  required
                  className="form-input"
                />
              </div>
              <button type="submit" className="form-button">Login as Doctor</button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Login;