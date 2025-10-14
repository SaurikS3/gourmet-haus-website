import React, { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

function SiteSettings() {
  const [settings, setSettings] = useState({
    location: 'TBD',
    hours: 'TBD',
    contact: '(703) 867-5112'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Real-time listener for site settings
  useEffect(() => {
    const settingsDocRef = doc(db, 'siteSettings', 'contact');
    
    const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
      setLoading(false);
    }, (error) => {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const settingsDocRef = doc(db, 'siteSettings', 'contact');
      await setDoc(settingsDocRef, settings);
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '48px 24px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading settings...</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: 0,
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Message Alert */}
      {message.text && (
        <div style={{
          padding: '16px 20px',
          background: message.type === 'success' 
            ? 'rgba(74, 222, 128, 0.1)' 
            : 'rgba(248, 113, 113, 0.1)',
          border: `1px solid ${message.type === 'success' 
            ? 'rgba(74, 222, 128, 0.3)' 
            : 'rgba(248, 113, 113, 0.3)'}`,
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <p style={{
            margin: 0,
            color: message.type === 'success' ? '#4ade80' : '#f87171',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {message.text}
          </p>
        </div>
      )}

      {/* Header Info */}
      <div style={{
        background: 'rgba(212, 175, 55, 0.1)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '12px',
        padding: window.innerWidth <= 599 ? '20px' : '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#D4AF37'
        }}>Site Information</h3>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1.5'
        }}>
          Manage location, hours, and contact information. Changes update in real-time on both the homepage footer and contact page.
        </p>
      </div>

      {/* Location Settings */}
      <div style={{
        background: '#1A1A1A',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: window.innerWidth <= 599 ? '20px' : '28px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📍 Location
        </h2>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          Physical address displayed on homepage footer and contact page
        </p>
        <textarea
          value={settings.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Enter business address"
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: window.innerWidth <= 599 ? '16px' : '0.95rem',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'vertical',
            minHeight: '80px',
            boxSizing: 'border-box',
            lineHeight: '1.6'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#D4AF37';
            e.target.style.background = 'rgba(212, 175, 55, 0.05)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.target.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
        />
      </div>

      {/* Hours Settings */}
      <div style={{
        background: '#1A1A1A',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: window.innerWidth <= 599 ? '20px' : '28px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🕐 Hours
        </h2>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          Business hours displayed on homepage footer and contact page
        </p>
        <textarea
          value={settings.hours}
          onChange={(e) => handleChange('hours', e.target.value)}
          placeholder="Enter business hours (e.g., Mon-Fri: 11am-9pm)"
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: window.innerWidth <= 599 ? '16px' : '0.95rem',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'vertical',
            minHeight: '100px',
            boxSizing: 'border-box',
            lineHeight: '1.6'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#D4AF37';
            e.target.style.background = 'rgba(212, 175, 55, 0.05)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.target.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
        />
      </div>

      {/* Contact Settings */}
      <div style={{
        background: '#1A1A1A',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: window.innerWidth <= 599 ? '20px' : '28px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📞 Contact
        </h2>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          Phone number displayed on homepage footer and contact page
        </p>
        <input
          type="tel"
          value={settings.contact}
          onChange={(e) => handleChange('contact', e.target.value)}
          placeholder="Enter phone number"
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: window.innerWidth <= 599 ? '16px' : '0.95rem',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#D4AF37';
            e.target.style.background = 'rgba(212, 175, 55, 0.05)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.target.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
        />
      </div>

      {/* Save Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        paddingTop: '8px'
      }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'linear-gradient(135deg, #D4AF37 0%, #F4E4B3 100%)',
            border: 'none',
            borderRadius: '8px',
            color: saving ? 'rgba(255, 255, 255, 0.5)' : '#000',
            padding: window.innerWidth <= 599 ? '14px 24px' : '12px 28px',
            fontSize: window.innerWidth <= 599 ? '0.9rem' : '0.95rem',
            fontWeight: '700',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: saving ? 'none' : '0 2px 8px rgba(212, 175, 55, 0.25)',
            minHeight: window.innerWidth <= 599 ? '48px' : 'auto',
            width: window.innerWidth <= 599 ? '100%' : 'auto',
            letterSpacing: '0.3px'
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.25)';
            }
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Preview */}
      <div style={{
        marginTop: '32px',
        padding: window.innerWidth <= 599 ? '20px' : '24px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '1rem',
          fontWeight: '600',
          color: 'rgba(255, 255, 255, 0.8)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Preview
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 599 ? '1fr' : 'repeat(3, 1fr)',
          gap: window.innerWidth <= 599 ? '16px' : '24px'
        }}>
          <div>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              LOCATION
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {settings.location}
            </p>
          </div>
          <div>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              HOURS
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {settings.hours}
            </p>
          </div>
          <div>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              CONTACT
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              {settings.contact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteSettings;
