// src/layouts/DashboardLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = ({ role, children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar role={role} />
        <main style={{ flex: 1, padding: '30px', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
