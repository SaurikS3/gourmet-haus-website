import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../services/authService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { isAdmin } from '../services/adminService';
import MenuManager from './MenuManager';
import { migrateMenuData } from '../utils/migrateMenuData';
import { collection, getDocs } from 'firebase/firestore';

function ProfilePage({ user }) {
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState({ loading: false, message: '', hasData: false });
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    address: {
      street: '',
      apt: '',
      city: '',
      state: '',
      zipCode: ''
    },
    dietaryPreferences: [],
    favoriteItems: [],
    orderHistory: []
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user?.email) {
      const adminStatus = isAdmin(user.email);
      setIsUserAdmin(adminStatus);
      
      if (adminStatus) {
        checkMenuData();
      }
    }
    
    const loadProfileData = async () => {
      try {
        if (!db) return;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData({
            fullName: data.fullName || user?.displayName || '',
            phone: data.phone || '',
            address: {
              street: data.address?.street || '',
              apt: data.address?.apt || '',
              city: data.address?.city || '',
              state: data.address?.state || '',
              zipCode: data.address?.zipCode || ''
            },
            dietaryPreferences: data.dietaryPreferences || [],
            favoriteItems: data.favoriteItems || [],
            orderHistory: data.orderHistory || []
          });
        } else {
          // Initialize with user display name if available
          setProfileData(prev => ({
            ...prev,
            fullName: user?.displayName || ''
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfileData();
  }, [user, navigate]);

  const checkMenuData = async () => {
    try {
      const menuSnapshot = await getDocs(collection(db, 'menuItems'));
      setMigrationStatus(prev => ({ ...prev, hasData: menuSnapshot.size > 0 }));
    } catch (error) {
      console.error('Error checking menu data:', error);
    }
  };

  const handleMigration = async () => {
    setMigrationStatus({ loading: true, message: 'Migrating menu data...', hasData: false });
    try {
      const result = await migrateMenuData();
      if (result.success) {
        setMigrationStatus({ 
          loading: false, 
          message: '✅ Migration completed successfully!', 
          hasData: true 
        });
        setTimeout(() => {
          setMigrationStatus(prev => ({ ...prev, message: '' }));
        }, 5000);
      } else {
        setMigrationStatus({ 
          loading: false, 
          message: `❌ Migration failed: ${result.error}`, 
          hasData: false 
        });
      }
    } catch (error) {
      setMigrationStatus({ 
        loading: false, 
        message: `❌ Migration error: ${error.message}`, 
        hasData: false 
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!db) return;
      await updateDoc(doc(db, 'users', user.uid), {
        fullName: profileData.fullName,
        phone: profileData.phone,
        address: {
          street: profileData.address.street,
          apt: profileData.address.apt,
          city: profileData.address.city,
          state: profileData.address.state,
          zipCode: profileData.address.zipCode
        },
        dietaryPreferences: profileData.dietaryPreferences,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleDietaryPreference = (pref) => {
    setProfileData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(pref)
        ? prev.dietaryPreferences.filter(p => p !== pref)
        : [...prev.dietaryPreferences, pref]
    }));
  };

  const getUserInitials = () => {
    if (!user?.displayName) return 'G';
    return user.displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '🛍️' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    ...(isUserAdmin ? [{ id: 'menu', label: 'Menu Manager', icon: '🍽️' }] : [])
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0D0D',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#FFFFFF',
      display: 'flex',
      position: 'relative'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: isSidebarOpen ? '240px' : '80px',
        background: '#1A1A1A',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        transition: 'width 0.3s ease',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '80px'
        }}>
          <img 
            src="/Icon Logo transparent gourmet-haus-logo.svg"
            alt="Gourmet Haus"
            style={{
              width: '40px',
              height: '40px',
              filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))'
            }}
          />
          {isSidebarOpen && (
            <span style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#D4AF37',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap'
            }}>Gourmet Haus</span>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              style={{
                width: '100%',
                padding: isSidebarOpen ? '14px 20px' : '14px 0',
                background: activeTab === item.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                border: 'none',
                borderLeft: activeTab === item.id ? '3px solid #D4AF37' : '3px solid transparent',
                color: activeTab === item.id ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.95rem',
                fontWeight: activeTab === item.id ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s ease',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.6)';
                }
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            padding: '16px',
            background: 'transparent',
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isSidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: isSidebarOpen ? '240px' : '80px',
        flex: 1,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {/* Top Header */}
        <header style={{
          background: '#1A1A1A',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '-0.5px'
            }}>Welcome, {user?.displayName?.split(' ')[0] || 'Guest'}.</h1>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>Manage your account.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                padding: '10px 18px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#D4AF37';
                e.target.style.color = '#D4AF37';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.color = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              Home
            </button>

            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
              fontWeight: '700',
              color: '#000',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}>
              {getUserInitials()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{
          flex: 1,
          padding: '32px',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'auto'
        }}>
          {/* PROFILE Tab */}
          {activeTab === 'profile' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              {/* Account Info Card */}
              <div style={{
                background: '#1A1A1A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '28px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#FFFFFF'
                  }}>Account Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#D4AF37',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter full name"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: isEditing ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isEditing ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: isEditing ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isEditing ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Delivery Address</label>
                    
                    {/* Street Address */}
                    <input
                      type="text"
                      value={profileData.address.street}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, street: e.target.value }
                      })}
                      disabled={!isEditing}
                      placeholder="Street Address"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: isEditing ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isEditing ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.95rem',
                        outline: 'none',
                        marginBottom: '12px'
                      }}
                    />
                    
                    {/* Apt/Unit */}
                    <input
                      type="text"
                      value={profileData.address.apt}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, apt: e.target.value }
                      })}
                      disabled={!isEditing}
                      placeholder="Apt, Suite, Unit (Optional)"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: isEditing ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isEditing ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.95rem',
                        outline: 'none',
                        marginBottom: '12px'
                      }}
                    />
                    
                    {/* City, State, Zip Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                      <input
                        type="text"
                        value={profileData.address.city}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          address: { ...profileData.address, city: e.target.value }
                        })}
                        disabled={!isEditing}
                        placeholder="City"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: isEditing ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${isEditing ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                      <input
                        type="text"
                        value={profileData.address.state}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          address: { ...profileData.address, state: e.target.value }
                        })}
                        disabled={!isEditing}
                        placeholder="State"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: isEditing ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${isEditing ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                      <input
                        type="text"
                        value={profileData.address.zipCode}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          address: { ...profileData.address, zipCode: e.target.value }
                        })}
                        disabled={!isEditing}
                        placeholder="ZIP"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: isEditing ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${isEditing ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Account Created</label>
                    <input
                      type="text"
                      value={user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button
                      onClick={handleSaveProfile}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B3 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000',
                        padding: '12px',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        padding: '12px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Sign-in Methods */}
              <div style={{
                background: '#1A1A1A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '28px'
              }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}>Sign-in methods</h3>
                <p style={{
                  margin: '0 0 24px 0',
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  lineHeight: '1.5'
                }}>Manage how you sign in to your account</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#FFFFFF',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>
                        G
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#FFFFFF' }}>Google</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>Connected</div>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        padding: '8px 14px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS Tab */}
          {activeTab === 'orders' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
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
                }}>Order History</h2>
                <p style={{
                  margin: '0 0 24px 0',
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>View your past orders and reorder favorites</p>
                
                {profileData.orderHistory.length === 0 ? (
                  <div style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}>🛍️</div>
                    <p style={{
                      fontSize: '1rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0
                    }}>No orders yet</p>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.4)',
                      marginTop: '8px'
                    }}>Your order history will appear here</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {profileData.orderHistory.map((order, index) => (
                      <div key={index} style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                      >
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#FFFFFF', marginBottom: '6px' }}>
                            Order #{order.id}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                            {order.date}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: '#D4AF37',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>{order.status}</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF' }}>
                            ${order.total}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FAVORITES Tab */}
          {activeTab === 'favorites' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
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
                }}>Favorite Items</h2>
                <p style={{
                  margin: '0 0 24px 0',
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>Your saved menu items for quick ordering</p>

                {profileData.favoriteItems.length === 0 ? (
                  <div style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}>❤️</div>
                    <p style={{
                      fontSize: '1rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0
                    }}>No favorites yet</p>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.4)',
                      marginTop: '8px'
                    }}>Save items from the menu to see them here</p>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px' 
                  }}>
                    {profileData.favoriteItems.map((item, index) => (
                      <div key={index} style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                      >
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#FFFFFF', marginBottom: '8px' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '12px' }}>
                          {item.description}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#D4AF37' }}>
                          ${item.price}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PREFERENCES Tab */}
          {activeTab === 'preferences' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
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
                }}>Dietary Preferences</h2>
                <p style={{
                  margin: '0 0 24px 0',
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>Select your dietary preferences</p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Dairy-Free', 'Nut-Free'].map((pref) => (
                    <button
                      key={pref}
                      onClick={() => toggleDietaryPreference(pref)}
                      style={{
                        padding: '12px',
                        background: profileData.dietaryPreferences.includes(pref)
                          ? 'rgba(212, 175, 55, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: profileData.dietaryPreferences.includes(pref)
                          ? '1px solid #D4AF37'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        color: profileData.dietaryPreferences.includes(pref) ? '#D4AF37' : 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {pref}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSaveProfile}
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B3 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    padding: '12px 24px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* MENU MANAGER Tab */}
          {activeTab === 'menu' && isUserAdmin && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              {!migrationStatus.hasData && (
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
                    Populate Firestore database with menu data.
                  </p>
                  <button
                    onClick={handleMigration}
                    disabled={migrationStatus.loading}
                    style={{
                      background: migrationStatus.loading 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'linear-gradient(135deg, #D4AF37 0%, #F4E4B3 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: migrationStatus.loading ? 'rgba(255, 255, 255, 0.5)' : '#000',
                      padding: '12px 24px',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      cursor: migrationStatus.loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {migrationStatus.loading ? 'Migrating...' : 'Populate Database'}
                  </button>
                  {migrationStatus.message && (
                    <p style={{
                      margin: '16px 0 0 0',
                      fontSize: '0.9rem',
                      color: migrationStatus.message.includes('✅') ? '#4ade80' : '#f87171',
                      fontWeight: '600'
                    }}>
                      {migrationStatus.message}
                    </p>
                  )}
                </div>
              )}
              <MenuManager />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B3 100%)',
          border: 'none',
          borderRadius: '50%',
          color: '#000',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
          zIndex: 101
        }}
      >
        ☰
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          aside {
            transform: translateX(${isSidebarOpen ? '0' : '-100%'});
            width: 240px !important;
            position: fixed !important;
            z-index: 100 !important;
          }
          
          main {
            margin-left: 0 !important;
            width: 100% !important;
          }

          main > header {
            padding: 16px 20px !important;
          }

          main > header h1 {
            font-size: 1.3rem !important;
          }

          main > header p {
            font-size: 0.85rem !important;
          }

          main > div {
            padding: 20px 16px !important;
          }

          button[style*="display: none"] {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }

        @media (max-width: 600px) {
          main > header {
            padding: 12px 16px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }

          main > header > div:last-child {
            width: 100% !important;
            justify-content: space-between !important;
          }

          main > div {
            padding: 16px 12px !important;
          }
        }

        @media (max-width: 480px) {
          main > header h1 {
            font-size: 1.2rem !important;
          }

          main > div {
            padding: 12px 10px !important;
          }
        }

        /* Ensure all cards are responsive */
        @media (max-width: 768px) {
          main > div > div > div {
            padding: 20px 16px !important;
          }
        }

        @media (max-width: 600px) {
          main > div > div > div {
            padding: 16px 12px !important;
          }
        }

        input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* Prevent horizontal scroll */
        * {
          box-sizing: border-box;
        }

        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;
