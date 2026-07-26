// src/pages/admin/RestaurantApplications.jsx
import React, { useState, useEffect } from 'react';
import { getAllRestaurantsAdminApi, approveRestaurantApi, rejectRestaurantApi } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/formatters';
import { FiCheck, FiX, FiClock, FiSearch } from 'react-icons/fi';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const RestaurantApplications = () => {
  const { success, error: toastError } = useToast();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getAllRestaurantsAdminApi();
      if (data.success) {
        setRestaurants(data.restaurants || []);
      }
    } catch (err) {
      toastError('Failed to fetch restaurant applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionId(id);
      const data = await approveRestaurantApi(id);
      if (data.success) {
        success('Restaurant approved successfully! Role updated to restaurant.');
        setRestaurants(restaurants.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
      } else {
        toastError(data.message || 'Failed to approve restaurant.');
      }
    } catch (err) {
      toastError('Error approving restaurant.');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this application?')) return;

    try {
      setActionId(id);
      const data = await rejectRestaurantApi(id);
      if (data.success) {
        success('Restaurant application rejected.');
        setRestaurants(restaurants.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)));
      } else {
        toastError(data.message || 'Failed to reject application.');
      }
    } catch (err) {
      toastError('Error rejecting application.');
    } finally {
      setActionId(null);
    }
  };

  const filtered = restaurants.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.restaurant_name?.toLowerCase().includes(term) ||
      r.owner_name?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term) ||
      r.status?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="animate-fade-in">
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justify: 'space-between',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Restaurant Applications
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Review pending partner applications, verify owner credentials, and approve listing access.
          </p>
        </div>

        {/* Search */}
        <div className="glass-card" style={{
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          maxWidth: '320px'
        }}>
          <FiSearch size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', background: 'transparent' }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching applications..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="No Applications Found"
          description="There are no partner applications matching your search criteria."
        />
      ) : (
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.95)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Restaurant Name</th>
                <th style={{ padding: '12px' }}>Owner Name</th>
                <th style={{ padding: '12px' }}>Contact Email</th>
                <th style={{ padding: '12px' }}>Address</th>
                <th style={{ padding: '12px' }}>Submitted Date</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res) => (
                <tr key={res.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {res.restaurant_name}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{res.owner_name || 'Owner'}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{res.email}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {res.address || 'N/A'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {formatDate(res.created_at)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <StatusBadge status={res.status} />
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {res.status !== 'Approved' && (
                        <button
                          disabled={actionId === res.id}
                          onClick={() => handleApprove(res.id)}
                          className="btn-primary"
                          style={{
                            padding: '6px 14px',
                            fontSize: '0.8rem',
                            background: 'var(--status-delivered)'
                          }}
                        >
                          <FiCheck size={14} /> Approve
                        </button>
                      )}
                      {res.status !== 'Rejected' && (
                        <button
                          disabled={actionId === res.id}
                          onClick={() => handleReject(res.id)}
                          className="btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          <FiX size={14} /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RestaurantApplications;
