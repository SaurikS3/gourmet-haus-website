import React, { useState } from 'react';
import { migrateMenuData } from '../utils/migrateMenuData';

function AdminSetup() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMigration = async () => {
    if (!window.confirm('This will populate Firestore with menu data. Continue?')) {
      return;
    }

    setLoading(true);
    setStatus('Migrating data...');

    try {
      const result = await migrateMenuData();
      if (result.success) {
        setStatus('✅ Migration completed successfully!');
      } else {
        setStatus(`❌ Migration failed: ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '600px',
      margin: '100px auto',
      background: 'rgba(26, 26, 26, 0.9)',
      borderRadius: '16px',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      color: '#E5E4E2'
    }}>
      <h1 style={{
        color: '#D4AF37',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        Admin Setup
      </h1>
      
      <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
        This is a one-time setup to migrate your menu data to Firestore.
        Click the button below to populate the database with all current menu items and categories.
      </p>

      <button
        onClick={handleMigration}
        disabled={loading}
        style={{
          width: '100%',
          padding: '1rem 2rem',
          background: loading ? '#666' : 'linear-gradient(135deg, #D4AF37, #B76E79)',
          border: '2px solid #D4AF37',
          borderRadius: '50px',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        {loading ? 'Migrating...' : 'Run Migration'}
      </button>

      {status && (
        <div style={{
          padding: '1rem',
          background: status.includes('✅') ? 'rgba(34, 139, 34, 0.2)' : 'rgba(178, 34, 34, 0.2)',
          border: `1px solid ${status.includes('✅') ? 'rgba(34, 139, 34, 0.4)' : 'rgba(178, 34, 34, 0.4)'}`,
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          fontSize: '0.9rem'
        }}>
          {status}
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(212, 175, 55, 0.1)',
        borderRadius: '8px',
        fontSize: '0.85rem'
      }}>
        <strong>Note:</strong> After migration, you can access this page at <code>/admin-setup</code> but you should only run this once. 
        Check your browser console for detailed logs.
      </div>
    </div>
  );
}

export default AdminSetup;
