import React from 'react';

const Navbar = ({ cartItemsCount, onOpenCart }) => {
  return (
    <div className="navbar-wrapper">
      <div className="container">
        <header className="navbar">
          <a href="/" className="logo">
            <i className="fa-solid fa-utensils" style={{ color: 'var(--primary)' }}></i>
            Food<span>Hub</span>
          </a>
          
          <button 
            type="button" 
            className="cart-icon-btn" 
            onClick={onOpenCart}
            aria-label="Open Shopping Cart"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </button>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
