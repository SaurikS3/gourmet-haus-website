import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

function AdminManagement({ currentUser }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [migratingAdmins, setMigratingAdmins] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Core admin emails
  const CORE_ADMIN_EMAILS = [
    'artkabul@gmail.com',
    'haidarizia@gmail.com',
    'gourmethausva@gmail.com'
  ];

  // Real-time listener for admins
  useEffect(() => {
    setLoading(true);
    
    // Set up real-time listener
    const adminsQuery = query(collection(db, 'admins'), orderBy('addedAt', 'desc'));
    const unsubscribe = onSnapshot(adminsQuery, (snapshot) => {
      const adminsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdmins(adminsList);
      setLoading(false);
    }, (error) => {
      console.error('Error loading admins:', error);
      setMessage({ type: 'error', text: 'Failed to load admins' });
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleMigrateCoreAdmins = async () => {
    setMigratingAdmins(true);
    let addedCount = 0;
    let skippedCount = 0;

    try {
      for (const email of CORE_ADMIN_EMAILS) {
        // Check if already exists
        if (admins.some(admin => admin.email.toLowerCase() === email.toLowerCase())) {
          skippedCount++;
          continue;
        }

        // Add to database
        await addDoc(collection(db, 'admins'), {
          email: email.toLowerCase(),
          addedBy: 'system',
          addedAt: new Date().toISOString(),
          isActive: true,
          isCoreAdmin: true
        });
        addedCount++;
      }

      setMessage({ 
        type: 'success', 
        text: `Migration complete! Added ${addedCount} admin(s), ${skippedCount} already existed.` 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Error migrating admins:', error);
      setMessage({ type: 'error', text: 'Failed to migrate core admins' });
    } finally {
      setMigratingAdmins(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!newAdminEmail.trim()) {
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }

    const emailLower = newAdminEmail.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    // Check if already exists
    if (admins.some(admin => admin.email.toLowerCase() === emailLower)) {
      setMessage({ type: 'error', text: 'This email is already an admin' });
      return;
    }

    try {
      setAddingAdmin(true);
      await addDoc(collection(db, 'admins'), {
        email: emailLower,
        addedBy: currentUser.email,
        addedAt: new Date().toISOString(),
        isActive: true,
        isCoreAdmin: false
      });

      setNewAdminEmail('');
      setMessage({ type: 'success', text: 'Admin added successfully!' });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error adding admin:', error);
      setMessage({ type: 'error', text: 'Failed to add admin' });
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (admin) => {
    // Prevent removing yourself only
    if (admin.email.toLowerCase() === currentUser.email.toLowerCase()) {
      setMessage({ 
        type: 'error', 
        text: 'You cannot remove yourself as an admin' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${admin.email} as an admin?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'admins', admin.id));
      setMessage({ type: 'success', text: 'Admin removed successfully!' });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error removing admin:', error);
      setMessage({ type: 'error', text: 'Failed to remove admin' });
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
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading admins...</p>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
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

      {/* Migrate Core Admins (only show if no core admins exist) */}
      {!admins.some(admin => admin.isCoreAdmin) && (
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#D4AF37'
          }}>First Time Setup</h3>
          <p style={{
            margin: '0 0 16px 0',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.5'
          }}>
            Add the core admin accounts to the database. This will add the 3 hardcoded admin emails as protected core administrators.
          </p>
          <button
            onClick={handleMigrateCoreAdmins}
            disabled={migratingAdmins}
            style={{
              background: migratingAdmins 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'linear-gradient(135deg, #D4AF37 0%, #F4E4B3 100%)',
              border: 'none',
              borderRadius: '8px',
              color: migratingAdmins ? 'rgba(255, 255, 255, 0.5)' : '#000',
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: migratingAdmins ? 'not-allowed' : 'pointer'
            }}
          >
            {migratingAdmins ? 'Adding Core Admins...' : 'Add Core Admins to Database'}
          </button>
        </div>
      )}

      {/* Add Admin Form */}
      <div style={{
        background: '#1A1A1A',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '24px'
      }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#FFFFFF'
        }}>Add New Admin</h2>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>Grant admin privileges to a new user by their email address</p>

        <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Enter email address"
            disabled={addingAdmin}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={addingAdmin}
            style={{
              background: addingAdmin 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'linear-gradient(135deg, #D4AF37 0%, #F4E4B3 100%)',
              border: 'none',
              borderRadius: '8px',
              color: addingAdmin ? 'rgba(255, 255, 255, 0.5)' : '#000',
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: addingAdmin ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {addingAdmin ? 'Adding...' : 'Add Admin'}
          </button>
        </form>
      </div>

      {/* Current Admins List */}
      <div style={{
        background: '#1A1A1A',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '28px'
      }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#FFFFFF'
        }}>Current Admins ({admins.length})</h2>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          Manage admin access for Gourmet Haus • Updates in real-time
        </p>

        {admins.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '8px',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}>👤</div>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0
            }}>No admins found</p>
            <p style={{
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.4)',
              marginTop: '8px'
            }}>Add admins using the form above</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {admins.map((admin) => (
              <div key={admin.id} style={{
                padding: '20px',
                background: admin.isCoreAdmin 
                  ? 'rgba(212, 175, 55, 0.08)' 
                  : 'rgba(255, 255, 255, 0.03)',
                border: admin.isCoreAdmin 
                  ? '1px solid rgba(212, 175, 55, 0.2)' 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#FFFFFF'
                    }}>
                      {admin.email}
                    </div>
                    {admin.isCoreAdmin && (
                      <span style={{
                        padding: '4px 10px',
                        background: 'rgba(212, 175, 55, 0.2)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: '#D4AF37',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Core Admin
                      </span>
                    )}
                    {admin.email.toLowerCase() === currentUser.email.toLowerCase() && (
                      <span style={{
                        padding: '4px 10px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: '#3b82f6',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        You
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    {admin.isCoreAdmin 
                      ? 'Permanent administrator account' 
                      : `Added by ${admin.addedBy} • ${new Date(admin.addedAt).toLocaleDateString()}`
                    }
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveAdmin(admin)}
                  disabled={admin.email.toLowerCase() === currentUser.email.toLowerCase()}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${admin.email.toLowerCase() === currentUser.email.toLowerCase() 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(248, 113, 113, 0.3)'}`,
                    borderRadius: '6px',
                    color: admin.email.toLowerCase() === currentUser.email.toLowerCase() 
                      ? 'rgba(255, 255, 255, 0.3)' 
                      : '#f87171',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: admin.email.toLowerCase() === currentUser.email.toLowerCase() 
                      ? 'not-allowed' 
                      : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (admin.email.toLowerCase() !== currentUser.email.toLowerCase()) {
                      e.target.style.background = 'rgba(248, 113, 113, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminManagement;
