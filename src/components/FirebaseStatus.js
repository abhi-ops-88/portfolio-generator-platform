import React from 'react';
import { auth } from '../config/firebase';

const FirebaseStatus = () => {
  if (!auth) {
    return (
      <div style={{
        background: '#fef3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        padding: '1rem',
        margin: '1rem 0',
        color: '#856404'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
          ⚠️ Firebase Not Configured
        </h3>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>
          Authentication features are currently disabled. The app is running in demo mode.
          To enable full functionality, please configure Firebase environment variables.
        </p>
      </div>
    );
  }

  return null;
};

export default FirebaseStatus;