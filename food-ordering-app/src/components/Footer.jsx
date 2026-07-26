// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { IoFastFoodOutline } from 'react-icons/io5';
import { FiHeart, FiGlobe, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0F172A',
      color: '#94A3B8',
      padding: '60px 0 30px 0',
      marginTop: '60px',
      borderTop: '1px solid #1E293B'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                color: 'white'
              }}>
                <IoFastFoodOutline size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                Bite<span style={{ color: 'var(--primary)' }}>Dash</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Delicious meals delivered to your doorstep from top rated local restaurants with lightning speed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Explore</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <Link to="/" style={{ color: '#94A3B8' }}>Home</Link>
              <Link to="/restaurants" style={{ color: '#94A3B8' }}>Top Restaurants</Link>
              <Link to="/cart" style={{ color: '#94A3B8' }}>My Cart</Link>
              <Link to="/my-orders" style={{ color: '#94A3B8' }}>Track Orders</Link>
            </div>
          </div>

          {/* Dashboards */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Partner with Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <Link to="/login" style={{ color: '#94A3B8' }}>Restaurant Owner Login</Link>
              <Link to="/register" style={{ color: '#94A3B8' }}>Register Restaurant</Link>
              <Link to="/login" style={{ color: '#94A3B8' }}>Admin Portal</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiPhone size={16} color="var(--primary)" /> +91 98765 43210
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiMail size={16} color="var(--primary)" /> support@bitedash.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiGlobe size={16} color="var(--primary)" /> www.bitedash.com
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justify: 'space-between',
          gap: '12px',
          fontSize: '0.85rem'
        }}>
          <p>© {new Date().getFullYear()} BiteDash Food Delivery Platform. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Crafted with <FiHeart color="var(--primary)" fill="var(--primary)" size={14} /> for food lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
