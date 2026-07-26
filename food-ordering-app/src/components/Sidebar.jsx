// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FiGrid,
  FiList,
  FiFileText,
  FiUsers,
  FiLogOut,
  FiPlusCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    borderRadius: 'var(--radius-md)',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.95rem',
    color: isActive ? 'white' : 'var(--text-main)',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    transition: 'var(--transition)',
    textDecoration: 'none',
    boxShadow: isActive ? '0 4px 14px rgba(255, 82, 82, 0.3)' : 'none',
  });

  return (
    <aside style={{
      width: '260px',
      minHeight: 'calc(100vh - 70px)',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(226, 232, 240, 0.8)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between'
    }}>
      <div>
        {/* Profile Card */}
        <div style={{
          padding: '16px',
          background: 'rgba(241, 245, 249, 0.7)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontWeight: 700,
            fontSize: '1.1rem'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', margin: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {user?.name || 'Dashboard'}
            </p>
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--primary)',
              letterSpacing: '0.5px'
            }}>
              {role === 'restaurant' ? 'Restaurant Owner' : 'Administrator'}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {role === 'restaurant' && (
            <>
              <NavLink to="/restaurant/dashboard" style={navItemStyle}>
                <FiGrid size={18} /> Dashboard
              </NavLink>
              <NavLink to="/restaurant/foods" style={navItemStyle}>
                <IoFastFoodOutline size={18} /> My Foods
              </NavLink>
              <NavLink to="/restaurant/add-food" style={navItemStyle}>
                <FiPlusCircle size={18} /> Add Food
              </NavLink>
              <NavLink to="/restaurant/orders" style={navItemStyle}>
                <FiList size={18} /> Restaurant Orders
              </NavLink>
            </>
          )}

          {role === 'admin' && (
            <>
              <NavLink to="/admin/dashboard" style={navItemStyle}>
                <FiGrid size={18} /> Overview
              </NavLink>
              <NavLink to="/admin/applications" style={navItemStyle}>
                <FiFileText size={18} /> Applications
              </NavLink>
              <NavLink to="/admin/restaurants" style={navItemStyle}>
                <IoFastFoodOutline size={18} /> All Restaurants
              </NavLink>
              <NavLink to="/admin/users" style={navItemStyle}>
                <FiUsers size={18} /> All Users
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div>
        <NavLink to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          marginBottom: '10px'
        }}>
          <FiArrowLeft size={16} /> Back to Public Store
        </NavLink>
        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center', color: 'var(--status-cancelled)' }}
        >
          <FiLogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
