// src/pages/customer/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiMail, FiShield, FiLogOut } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px', maxWidth: '600px' }}>
      <div className="glass-card" style={{ padding: '36px', background: 'rgba(255, 255, 255, 0.95)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '14px',
            boxShadow: '0 8px 24px rgba(255, 82, 82, 0.35)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{user?.name || 'User Profile'}</h2>
          <span style={{
            display: 'inline-block',
            marginTop: '4px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 82, 82, 0.1)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            {user?.role || 'Customer'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
            <FiUser size={18} color="var(--primary)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user?.name || 'N/A'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
            <FiMail size={18} color="var(--primary)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user?.email || 'N/A'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
            <FiShield size={18} color="var(--primary)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account ID</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>#{user?.id || '001'}</span>
            </div>
          </div>
        </div>

        <button onClick={logout} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--status-cancelled)' }}>
          <FiLogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
