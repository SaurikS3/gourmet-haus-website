import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    botcheck: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactSettings, setContactSettings] = useState({
    location: 'TBD',
    phone: '(703) 867-5112',
    hours: 'TBD'
  });

  useEffect(() => {
    // Real-time listener for contact settings
    const contactDocRef = doc(db, 'siteSettings', 'contact');
    const unsubscribe = onSnapshot(contactDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setContactSettings({
          location: data.location || 'TBD',
          phone: data.phone || '(703) 867-5112',
          hours: data.hours || 'TBD'
        });
      }
    }, (error) => {
      console.error('Error fetching contact settings:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Web3Forms submission
      const formDataWithKey = {
        access_key: '77e836f2-6d09-49b4-8381-c9e100bd0435',
        ...formData
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formDataWithKey)
      });

      const data = await response.json();

      if (response.status === 200) {
        setStatus({
          type: 'success',
          message: 'Thank you for contacting us! We\'ll get back to you shortly.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setLoading(false);
      
      // Hide status message after 3 seconds on success
      if (status.type === 'success') {
        setTimeout(() => {
          setStatus({ type: '', message: '' });
        }, 3000);
      }
    }
  };

  return (
    <div className="contact-page">
      {/* Gradient Orbs Background */}
      <div className="gradient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Navigation */}
      <nav className="luxury-nav">
        <div className="nav-logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/Icon Logo transparent gourmet-haus-logo.svg" alt="Gourmet Haus" className="nav-logo-svg" />
        </div>
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <button 
            className="nav-link" 
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/');
            }}
          >
            HOME
          </button>
          <button 
            className="nav-link active"
            onClick={() => setMobileMenuOpen(false)}
          >
            CONTACT
          </button>
        </div>
      </nav>

      <div className="contact-container">
        <div className="contact-header">
          <div className="contact-ornament top"></div>
          <h1 className="contact-title">
            <span className="title-line">GET IN</span>
            <span className="title-brand">TOUCH</span>
          </h1>
          <div className="contact-divider">
            <span className="divider-ornament"></span>
            <span className="divider-diamond">◆</span>
            <span className="divider-ornament"></span>
          </div>
          <p className="contact-subtitle">We'd love to hear from you</p>
          <div className="contact-ornament bottom"></div>
        </div>

        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input
                type="text"
                name="subject"
                className="form-input"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                name="message"
                className="form-textarea"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us more..."
              ></textarea>
            </div>

            {/* Honeypot field for bot protection */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: 'none' }}
              value={formData.botcheck}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
            />

            {status.message && (
              <div className={`status-message ${status.type}`}>
                <span className="status-icon">
                  {status.type === 'success' ? '✓' : '⚠'}
                </span>
                <span>{status.message}</span>
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3 className="info-title">Visit Us</h3>
              <p className="info-text">{contactSettings.location}</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3 className="info-title">Call Us</h3>
              <p className="info-text">{contactSettings.phone}</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3 className="info-title">Hours</h3>
              <p className="info-text">{contactSettings.hours}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
