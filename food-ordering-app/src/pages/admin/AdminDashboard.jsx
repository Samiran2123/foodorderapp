// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllRestaurantsAdminApi } from '../../services/api';
import { FiGrid, FiFileText, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const data = await getAllRestaurantsAdminApi();
      if (data.success) {
        setRestaurants(data.restaurants || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingApps = restaurants.filter((r) => r.status === 'Pending').length;
  const approvedApps = restaurants.filter((r) => r.status === 'Approved').length;

  if (loading) {
    return <LoadingSpinner message="Loading admin control panel..." />;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Administrator Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Overview of platform growth, partner applications, and system restaurants.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL RESTAURANTS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {restaurants.length}
              </h2>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 82, 82, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IoFastFoodOutline size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING APPLICATIONS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-pending)', marginTop: '4px' }}>
                {pendingApps}
              </h2>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-pending)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiClock size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>APPROVED PARTNERS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-delivered)', marginTop: '4px' }}>
                {approvedApps}
              </h2>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-delivered)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiCheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Applications Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Recent Applications ({pendingApps})
        </h3>
        <Link to="/admin/applications" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
          Review Applications <FiArrowRight size={16} />
        </Link>
      </div>

      <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.95)', overflowX: 'auto' }}>
        {restaurants.filter((r) => r.status === 'Pending').length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
            All restaurant applications have been reviewed!
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Restaurant Name</th>
                <th style={{ padding: '12px' }}>Owner</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.filter((r) => r.status === 'Pending').slice(0, 5).map((res) => (
                <tr key={res.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px', fontWeight: 700 }}>{res.restaurant_name}</td>
                  <td style={{ padding: '12px' }}>{res.owner_name || 'Owner'}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{res.email}</td>
                  <td style={{ padding: '12px' }}><StatusBadge status={res.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
