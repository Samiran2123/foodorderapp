// src/pages/admin/ViewRestaurants.jsx
import React, { useState, useEffect } from 'react';
import { getAllRestaurantsAdminApi, approveRestaurantApi, rejectRestaurantApi } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/formatters';
import { FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const ViewRestaurants = () => {
  const { success, error: toastError } = useToast();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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
      toastError('Failed to fetch restaurants list.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const data = await approveRestaurantApi(id);
      if (data.success) {
        success('Restaurant status set to Approved.');
        setRestaurants(restaurants.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
      }
    } catch (err) {
      toastError('Error approving restaurant');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this restaurant?')) return;
    try {
      const data = await rejectRestaurantApi(id);
      if (data.success) {
        success('Restaurant status set to Rejected.');
        setRestaurants(restaurants.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)));
      }
    } catch (err) {
      toastError('Error rejecting restaurant');
    }
  };

  const filtered = restaurants.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      r.restaurant_name?.toLowerCase().includes(term) ||
      r.owner_name?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
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
            All Platform Restaurants
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Comprehensive directory of approved, pending, and rejected restaurants.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', maxWidth: '480px' }}>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 14px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved Only</option>
            <option value="Pending">Pending Only</option>
            <option value="Rejected">Rejected Only</option>
          </select>

          {/* Search */}
          <div className="glass-card" style={{
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}>
            <FiSearch size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search restaurant or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', background: 'transparent' }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching system restaurants..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={IoFastFoodOutline}
          title="No Restaurants Found"
          description="No restaurants match your selected status filter and search query."
        />
      ) : (
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.95)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Restaurant Name</th>
                <th style={{ padding: '12px' }}>Owner</th>
                <th style={{ padding: '12px' }}>Contact Email</th>
                <th style={{ padding: '12px' }}>Registered Date</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res) => (
                <tr key={res.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary)' }}>#{res.id}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {res.restaurant_name}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{res.owner_name || 'Owner'}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{res.email}</td>
                  <td style={{ padding: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {formatDate(res.created_at)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <StatusBadge status={res.status} />
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {res.status !== 'Approved' && (
                        <button
                          onClick={() => handleApprove(res.id)}
                          className="btn-primary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'var(--status-delivered)' }}
                        >
                          <FiCheck size={12} /> Approve
                        </button>
                      )}
                      {res.status !== 'Rejected' && (
                        <button
                          onClick={() => handleReject(res.id)}
                          className="btn-danger"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          <FiX size={12} /> Reject
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

export default ViewRestaurants;
