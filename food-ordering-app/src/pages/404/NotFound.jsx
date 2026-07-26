// src/pages/404/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--status-cancelled)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        marginBottom: '20px'
      }}>
        <FiAlertTriangle size={40} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '28px' }}>
        Oops! The page you are looking for doesn't exist or has been moved to another location.
      </p>

      <Link to="/" className="btn-primary">
        <FiHome size={18} /> Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
