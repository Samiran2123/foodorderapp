// src/components/EmptyState.jsx
import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No Data Found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: 'var(--radius-lg)',
      border: '1px border-dashed #CBD5E1',
      margin: '20px 0'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        marginBottom: '16px'
      }}>
        <Icon size={32} />
      </div>
      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
        {title}
      </h4>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '360px', marginBottom: '20px' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
