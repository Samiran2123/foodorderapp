import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLocationDot, FaPhone, FaEnvelope, FaHeart } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer">
          <div className="footer-brand">
            <h2 className="footer-logo">Food<span>Hub</span></h2>
            <p className="footer-brand-desc">Bringing fresh, delicious meals from our kitchen straight to your doorstep.</p>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Facebook" onClick={(e) => e.preventDefault()}><FaFacebookF /></a>
              <a href="#" className="social-btn" aria-label="Twitter" onClick={(e) => e.preventDefault()}><FaTwitter /></a>
              <a href="#" className="social-btn" aria-label="Instagram" onClick={(e) => e.preventDefault()}><FaInstagram /></a>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">Menu</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => e.preventDefault()}>Pizza</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Burgers</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Pasta</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Drinks</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Help</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => e.preventDefault()}>Contact Support</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Track Order</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Refund Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact-item">
              <FaLocationDot style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>123 Foodie Street, Gourmet City, GC 10001</span>
            </div>
            <div className="footer-contact-item">
              <FaPhone style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>+1 (555) 3663-482</span>
            </div>
            <div className="footer-contact-item">
              <FaEnvelope style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>support@foodhub.com</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FoodHub. All rights reserved.</p>
          <p>Made with <FaHeart style={{ color: 'var(--primary)', margin: '0 4px' }} /> for food lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
