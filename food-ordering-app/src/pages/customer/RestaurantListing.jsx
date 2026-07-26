// src/pages/customer/RestaurantListing.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurantsApi } from '../../services/api';
import { FiSearch, FiMapPin, FiStar, FiClock } from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const RestaurantListing = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRestaurantsApi();
      if (data.success) {
        setRestaurants(data.restaurants || []);
      } else {
        setError(data.message || 'Failed to load restaurants');
      }
    } catch (err) {
      setError('Unable to connect to server. Please check backend status.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = restaurants.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.restaurant_name?.toLowerCase().includes(term) ||
      r.description?.toLowerCase().includes(term) ||
      r.address?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      {/* Page Header & Search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justify: 'space-between',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Explore Restaurants
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Find approved local restaurants around you
          </p>
        </div>

        {/* Search */}
        <div className="glass-card" style={{
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          maxWidth: '380px'
        }}>
          <FiSearch size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by restaurant name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.9rem',
              color: 'var(--text-main)',
              background: 'transparent'
            }}
          />
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '24px' }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : error ? (
        <LoadingSpinner message={error} onRetry={fetchRestaurants} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={IoFastFoodOutline}
          title="No Restaurants Found"
          description={search ? `No restaurants matching "${search}"` : 'No approved restaurants currently available.'}
          actionLabel={search ? 'Clear Search' : null}
          onAction={() => setSearch('')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '24px' }}>
          {filtered.map((res) => (
            <div key={res.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={res.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'}
                  alt={res.restaurant_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(8px)',
                  color: '#F59E0B',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FiStar fill="#F59E0B" size={12} /> 4.5
                </div>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    {res.restaurant_name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '12px', lineHeight: '1.4' }}>
                    {res.description || 'Delicious multi-cuisine delicacies, fresh ingredients & signature taste.'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    <FiMapPin size={14} color="var(--primary)" /> {res.address || 'Local Street'}
                  </div>
                </div>

                <div style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock size={14} /> 20-30 min
                  </span>

                  <Link to={`/restaurants/${res.id}/foods`} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantListing;
