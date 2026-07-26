// src/pages/customer/SplashPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoFastFoodOutline } from 'react-icons/io5';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/restaurants');
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'var(--dark)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'var(--primary)',
        filter: 'blur(120px)',
        opacity: 0.3,
        borderRadius: '50%'
      }} />

      <div className="animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(255, 82, 82, 0.5)'
        }}>
          <IoFastFoodOutline size={48} color="white" />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>
          Bite<span style={{ color: 'var(--primary)' }}>Dash</span>
        </h1>
        <p style={{ color: 'var(--text-light)', marginTop: '8px', fontSize: '1rem' }}>
          Taste the extraordinary, delivered fast.
        </p>

        <div style={{ marginTop: '40px', width: '120px', height: '4px', background: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'var(--primary-gradient)',
            animation: 'loading 2s infinite'
          }} />
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
