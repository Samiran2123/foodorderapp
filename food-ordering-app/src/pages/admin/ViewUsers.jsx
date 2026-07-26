// src/pages/admin/ViewUsers.jsx
import React, { useState, useEffect } from 'react';
import { getAllRestaurantsAdminApi } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { FiUsers, FiSearch, FiShield } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const ViewUsers = () => {
  const { error: toastError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const data = await getAllRestaurantsAdminApi();
      if (data.success) {
        // Extract unique restaurant owners from admin query response
        const ownersMap = new Map();
        (data.restaurants || []).forEach((r) => {
          if (r.owner_id && !ownersMap.has(r.owner_id)) {
            ownersMap.set(r.owner_id, {
              id: r.owner_id,
              name: r.owner_name,
              email: r.email,
              role: 'restaurant',
              restaurantName: r.restaurant_name,
              status: r.status,
            });
          }
        });
        setUsers(Array.from(ownersMap.values()));
      }
    } catch (err) {
      toastError('Failed to fetch user list.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.restaurantName?.toLowerCase().includes(term)
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
            System Users & Owners
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Registered partner accounts and owner profiles
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
            placeholder="Search by name, email, or store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', background: 'transparent' }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No user accounts found matching your query.
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.95)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>User ID</th>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Assigned Store</th>
                <th style={{ padding: '12px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px', fontWeight: 700 }}>#{user.id}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{user.email}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{user.restaurantName || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(59, 130, 246, 0.12)',
                      color: '#3B82F6',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      <FiShield size={12} /> {user.role}
                    </span>
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

export default ViewUsers;
