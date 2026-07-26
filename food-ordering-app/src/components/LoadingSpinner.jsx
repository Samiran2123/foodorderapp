// src/components/LoadingSpinner.jsx
import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false, onRetry }) => {
  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid rgba(255, 82, 82, 0.2)',
        borderTop: '4px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem' }}>{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary"
          style={{ marginTop: '8px', fontSize: '0.85rem' }}
        >
          <FiRefreshCw size={14} /> Retry Request
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justify: 'center'
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
