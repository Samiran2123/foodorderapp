// src/layouts/CustomerLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomerLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
