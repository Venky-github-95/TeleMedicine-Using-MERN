import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Image placeholders - replace with your actual images
import heroImage from '../images/hero-image.jpg';
import doctorConsult from '../images/doctor-consultation.jpg';
import pharmacy from '../images/pharmacy-delivery.jpg';
import healthRecords from '../images/health-records.png';
import testimonial1 from '../images/testimonial1.jpg';
import testimonial2 from '../images/testimonial2.jpg';
import trustedBy from '../images/trusted-by-logos.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo"><img src={trustedBy} alt="Trusted by logos" width={100} height={100}/></span>
          <span className="navbar-title">TeleMedicine</span>
        </div>
        <div className="navbar-links">
          <button className="nav-btn" onClick={() => navigate('/about')}>About</button>
          <button className="nav-btn" onClick={() => navigate('/services')}>Services</button>
          <button className="nav-btn" onClick={() => navigate('/')}></button>
          <button className="nav-btn primary" onClick={() => navigate('/register')}>Register</button>
          <button className="nav-btn primary" onClick={() => navigate('/login')}>Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Healthcare Made Simple, Accessible, and Secure</h1>
          <p className="hero-subtitle">Connect with board-certified  in minutes from the comfort of your home. Available 24/7 for all your healthcare needs.</p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate('/register')}>Book an Appointment</button>
            <button className="secondary-btn" onClick={() => navigate('/login')}>Patient Portal</button>
          </div>
        </div>
        <img src={heroImage} alt="Doctor consultation" className="hero-image" />
        {/* <div className="hero-image-placeholder"></div> */}
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <h3>500+</h3>
          <p>Certified </p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Availability</p>
        </div>
        <div className="stat-item">
          <h3>98%</h3>
          <p>Patient Satisfaction</p>
        </div>
        <div className="stat-item">
          <h3>50K+</h3>
          <p>Patients Served</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="section-header">
          <h2>Our Comprehensive Services</h2>
          <p className="section-subtitle">Quality healthcare solutions tailored to your needs</p>
        </div>
        <div className="service-cards">
          <div className="card">
            <img src={doctorConsult} alt="Virtual Consultations" className='card-image'/>
            {/* <div className="card-image-placeholder"></div> */}
            <div className="card-content">
              <h3>Virtual Consultations</h3>
              <p>Secure video consultations with specialists across 50+ medical fields.</p>
              <button className="card-btn" onClick={() => navigate('/services#consultations')}>Learn More</button>
            </div>
          </div>
          <div className="card">
            <img src={pharmacy} alt="Pharmacy Services" className='card-image'/>
            {/* <div className="card-image-placeholder"></div> */}
            <div className="card-content">
              <h3>Pharmacy Services</h3>
              <p>Prescription fulfillment with same-day delivery available.</p>
              <button className="card-btn" onClick={() => navigate('/services#pharmacy')}>Learn More</button>
            </div>
          </div>
          <div className="card">
            <img src={healthRecords} alt="Health Records" className='card-image' />
            {/* <div className="card-image-placeholder"></div> */}
            <div className="card-content">
              <h3>Digital Health Records</h3>
              <p>Centralized, encrypted storage for all your medical documents.</p>
              <button className="card-btn" onClick={() => navigate('/services#records')}>Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How TeleCare Works</h2>
          <p className="section-subtitle">Three simple steps to better healthcare</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Your Profile</h3>
            <p>Register and complete your medical history</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Book Your Appointment</h3>
            <p>Select a doctor and convenient time slot</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Connect & Consult</h3>
            <p>Video consultation via our secure platform</p>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-by">
        <h3>Trusted By Leading Healthcare Organizations</h3>
        <img src={trustedBy} alt="Trusted by logos" />
        {/* <div className="trusted-logos-placeholder"></div> */}
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header">
          <h2>Patient Experiences</h2>
          <p className="section-subtitle">What our community says about us</p>
        </div>
        <div className="testimonial-cards">
          <div className="testimonial">
            <img src={testimonial1} alt="Patient" className="testimonial-image" />
            {/* <div className="testimonial-image-placeholder"></div> */}
            <div className="testimonial-content">
              <p>"The convenience of consulting specialists without leaving home has been life-changing for my chronic condition management."</p>
              <div className="testimonial-author">
                <h4>Anjali R.</h4>
                <span>Hypertension Patient</span>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <img src={testimonial2} alt="Patient" className="testimonial-image" />
            {/* <div className="testimonial-image-placeholder"></div> */}
            <div className="testimonial-content">
              <p>"As a working professional, TeleCare saves me hours of waiting time. The  are just as thorough as in-person visits."</p>
              <div className="testimonial-author">
                <h4>Prakash M.</h4>
                <span>Diabetes Management</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Experience Modern Healthcare?</h2>
        <p>Join thousands of satisfied patients today</p>
        <div className="cta-buttons">
          <button className="primary-btn" onClick={() => navigate('/register')}>Get Started</button>
          <button className="secondary-btn" onClick={() => navigate('/')}>Meet Our </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo"> <img src={trustedBy} alt="Trusted by logos" width={100} height={100} style={{borderRadius: '50%'}}/> </span>
            <span className="footer-title">TeleCare</span>
            <p>Redefining healthcare accessibility through technology</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Company</h4>
              <a href="/about">About Us</a>
              <a href="/careers">Careers</a>
              <a href="/press">Press</a>
            </div>
            <div className="link-group">
              <h4>Services</h4>
              <a href="/services#consultations">Consultations</a>
              <a href="/services#pharmacy">Pharmacy</a>
              <a href="/services#records">Health Records</a>
            </div>
            <div className="link-group">
              <h4>Support</h4>
              <a href="/contact">Contact Us</a>
              <a href="/faq">FAQs</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TeleCare. All rights reserved.</p>
          <div className="social-links">
            <a href="#facebook">Facebook</a>
            <a href="#twitter">Twitter</a>
            <a href="#linkedin">LinkedIn</a>
            <a href="#instagram">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;