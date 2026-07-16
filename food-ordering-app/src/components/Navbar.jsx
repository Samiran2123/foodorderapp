import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaUtensils, FaShoppingCart, FaSignOutAlt, FaUser, FaHistory, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar-wrapper">
      <div className="container">
        <header className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          {/* Logo */}
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaUtensils style={{ color: 'var(--primary)' }} />
            Food<span>Hub</span>
          </Link>
          
          {/* Navigation Links */}
          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                fontWeight: '600',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              })}
            >
              <FaHome size={14} /> Home
            </NavLink>

            {user ? (
              <>
                <NavLink 
                  to="/cart" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    fontWeight: '600',
                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    position: 'relative'
                  })}
                >
                  <FaShoppingCart size={14} /> Cart
                  {cartItemsCount > 0 && (
                    <span className="cart-badge" style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-12px',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: '700'
                    }}>{cartItemsCount}</span>
                  )}
                </NavLink>

                <NavLink 
                  to="/my-orders" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    fontWeight: '600',
                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  })}
                >
                  <FaHistory size={14} /> My Orders
                </NavLink>

                {/* User Profile and Logout */}
                <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px', borderLeft: '1px solid var(--border-color)', paddingLeft: '15px' }}>
                  <span className="user-name" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', color: 'var(--text-muted)' }}>
                    <FaUser size={12} style={{ color: 'var(--primary)' }} /> {user.name}
                  </span>
                  <button 
                    type="button" 
                    onClick={handleLogout} 
                    className="logout-btn" 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#ef4444',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    aria-label="Logout"
                  >
                    <FaSignOutAlt size={14} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    fontWeight: '600',
                    color: isActive ? 'var(--primary)' : 'var(--text-main)'
                  })}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="register-btn"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
