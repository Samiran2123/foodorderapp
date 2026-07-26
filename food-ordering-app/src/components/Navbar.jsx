// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import {
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiGrid,
  FiList,
  FiFileText,
  FiUsers
} from 'react-icons/fi';
import { IoFastFoodOutline, IoRestaurantOutline } from 'react-icons/io5';

const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isRestaurant, isAdmin, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    padding: '8px 14px',
    borderRadius: 'var(--radius-full)',
    fontWeight: isActive(path) ? 700 : 500,
    color: isActive(path) ? 'var(--primary)' : 'var(--text-main)',
    backgroundColor: isActive(path) ? 'rgba(255, 82, 82, 0.1)' : 'transparent',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  });

  return (
    <header className="glass-nav" style={{ sticky: 'top', position: 'sticky', top: 0, zIndex: 900 }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(255, 82, 82, 0.3)'
          }}>
            <IoFastFoodOutline size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Bite<span style={{ color: 'var(--primary)' }}>Dash</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '-4px' }}>
              FOOD DELIVERY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {!isAuthenticated && (
            <>
              <Link to="/" style={navLinkStyle('/')}><FiHome size={16} /> Home</Link>
              <Link to="/restaurants" style={navLinkStyle('/restaurants')}><FiGrid size={16} /> Restaurants</Link>
              <Link to="/login" style={navLinkStyle('/login')}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                Register
              </Link>
            </>
          )}

          {isAuthenticated && isCustomer && (
            <>
              <Link to="/" style={navLinkStyle('/')}><FiHome size={16} /> Home</Link>
              <Link to="/restaurants" style={navLinkStyle('/restaurants')}><FiGrid size={16} /> Restaurants</Link>
              <Link to="/my-orders" style={navLinkStyle('/my-orders')}><FiList size={16} /> My Orders</Link>
              
              <Link to="/cart" style={{ ...navLinkStyle('/cart'), position: 'relative' }}>
                <FiShoppingBag size={18} /> Cart
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/profile" style={navLinkStyle('/profile')}>
                <FiUser size={16} /> {user?.name || 'Profile'}
              </Link>

              <Link to="/become-restaurant" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <IoRestaurantOutline size={16} /> Become a Restaurant
              </Link>
              
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <FiLogOut size={16} /> Logout
              </button>
            </>
          )}

          {isAuthenticated && isRestaurant && (
            <>
              <Link to="/restaurant/dashboard" style={navLinkStyle('/restaurant/dashboard')}><FiGrid size={16} /> Dashboard</Link>
              <Link to="/restaurant/foods" style={navLinkStyle('/restaurant/foods')}><IoFastFoodOutline size={16} /> My Foods</Link>
              <Link to="/restaurant/orders" style={navLinkStyle('/restaurant/orders')}><FiList size={16} /> Orders</Link>
              <Link to="/restaurant/dashboard" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <IoRestaurantOutline size={16} /> Restaurant Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <FiLogOut size={16} /> Logout
              </button>
            </>
          )}


          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin/dashboard" style={navLinkStyle('/admin/dashboard')}><FiGrid size={16} /> Dashboard</Link>
              <Link to="/admin/applications" style={navLinkStyle('/admin/applications')}><FiFileText size={16} /> Applications</Link>
              <Link to="/admin/restaurants" style={navLinkStyle('/admin/restaurants')}><FiGrid size={16} /> Restaurants</Link>
              <Link to="/admin/users" style={navLinkStyle('/admin/users')}><FiUsers size={16} /> Users</Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <FiLogOut size={16} /> Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-toggle btn-icon"
          style={{ display: 'flex' }}
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E2E8F0',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {!isAuthenticated && (
            <>
              <Link to="/" onClick={() => setMobileOpen(false)} style={navLinkStyle('/')}>Home</Link>
              <Link to="/restaurants" onClick={() => setMobileOpen(false)} style={navLinkStyle('/restaurants')}>Restaurants</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} style={navLinkStyle('/login')}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary">Register</Link>
            </>
          )}

          {isAuthenticated && isCustomer && (
            <>
              <Link to="/" onClick={() => setMobileOpen(false)} style={navLinkStyle('/')}>Home</Link>
              <Link to="/restaurants" onClick={() => setMobileOpen(false)} style={navLinkStyle('/restaurants')}>Restaurants</Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} style={navLinkStyle('/cart')}>Cart ({cartCount})</Link>
              <Link to="/my-orders" onClick={() => setMobileOpen(false)} style={navLinkStyle('/my-orders')}>My Orders</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} style={navLinkStyle('/profile')}>Profile</Link>
              <Link to="/become-restaurant" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ justifyContent: 'flex-start' }}>
                <IoRestaurantOutline size={16} /> Become a Restaurant
              </Link>
              <button onClick={handleLogout} className="btn-secondary"><FiLogOut size={16} /> Logout</button>
            </>
          )}

          {isAuthenticated && isRestaurant && (
            <>
              <Link to="/restaurant/dashboard" onClick={() => setMobileOpen(false)} style={navLinkStyle('/restaurant/dashboard')}>Dashboard</Link>
              <Link to="/restaurant/foods" onClick={() => setMobileOpen(false)} style={navLinkStyle('/restaurant/foods')}>My Foods</Link>
              <Link to="/restaurant/orders" onClick={() => setMobileOpen(false)} style={navLinkStyle('/restaurant/orders')}>Orders</Link>
              <Link to="/restaurant/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ justifyContent: 'flex-start' }}>
                <IoRestaurantOutline size={16} /> Restaurant Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary"><FiLogOut size={16} /> Logout</button>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} style={navLinkStyle('/admin/dashboard')}>Dashboard</Link>
              <Link to="/admin/applications" onClick={() => setMobileOpen(false)} style={navLinkStyle('/admin/applications')}>Applications</Link>
              <Link to="/admin/restaurants" onClick={() => setMobileOpen(false)} style={navLinkStyle('/admin/restaurants')}>Restaurants</Link>
              <Link to="/admin/users" onClick={() => setMobileOpen(false)} style={navLinkStyle('/admin/users')}>Users</Link>
              <button onClick={handleLogout} className="btn-secondary"><FiLogOut size={16} /> Logout</button>
            </>
          )}
        </div>
      )}

      {/* Media Query CSS for Desktop vs Mobile Nav */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
