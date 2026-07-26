// src/pages/customer/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurantsApi } from '../../services/api';
import { FiSearch, FiMapPin, FiStar, FiClock, FiArrowRight, FiShield, FiZap, FiAward } from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const defaultBanner = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80';

const categories = [
  { name: 'All', icon: '🍽️' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Biryani & Indian', icon: '🍲' },
  { name: 'Asian & Chinese', icon: '🍜' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Beverages', icon: '🧃' },
];

const LandingPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantsApi();
      if (data.success) {
        setRestaurants(data.restaurants || []);
      }
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.restaurant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        padding: '80px 0',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${defaultBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 82, 82, 0.25)',
            border: '1px solid rgba(255, 82, 82, 0.5)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#FF7A00',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            🚀 Superfast Delivery in 30 Mins
          </span>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>
            Craving Premium Food? <br />
            <span style={{
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Order from Top Restaurants
            </span>
          </h1>

          <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: '32px' }}>
            Discover mouth-watering dishes delivered fresh and piping hot to your doorstep.
          </p>

          {/* Search Box */}
          <div className="glass-card" style={{
            padding: '8px 12px 8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '650px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)'
          }}>
            <FiSearch size={22} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search for restaurants, cuisines or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                fontSize: '1rem',
                color: 'var(--text-main)',
                background: 'transparent'
              }}
            />
            <button className="btn-primary" style={{ borderRadius: 'var(--radius-md)' }}>
              Find Food
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter Chips */}
      <section className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-main)' }}>
          Popular Categories
        </h3>
        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '10px' }}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="glass-card"
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
                backgroundColor: selectedCategory === cat.name ? 'var(--primary)' : 'rgba(255, 255, 255, 0.85)',
                color: selectedCategory === cat.name ? 'white' : 'var(--text-main)',
                borderColor: selectedCategory === cat.name ? 'var(--primary)' : 'var(--glass-border)'
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant Listing Section */}
      <section className="container" style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Featured Restaurants
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Handpicked dining spots approved for cleanliness & taste
            </p>
          </div>
          <Link to="/restaurants" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700 }}>
            View All ({restaurants.length}) <FiArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <EmptyState
            icon={IoFastFoodOutline}
            title="No Restaurants Found"
            description="We couldn't find any approved restaurants matching your search criteria."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filteredRestaurants.map((res) => (
              <div key={res.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Image Header */}
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

                {/* Body */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      {res.restaurant_name}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '12px', lineHeight: '1.4' }}>
                      {res.description || 'Authentic multi-cuisine delicacies, fresh ingredients & signature taste.'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      <FiMapPin size={14} color="var(--primary)" /> {res.address || 'Central City'}
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
                      <FiClock size={14} /> 25-35 min
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
      </section>

      {/* Why Choose Us */}
      <section style={{ background: '#F1F5F9', padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Why Foodies Love BiteDash</h2>
            <p style={{ color: 'var(--text-muted)' }}>Built with passion for high quality dining at your convenience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
            <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 82, 82, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FiZap size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Lightning Fast</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time order tracking and optimized routing for quick delivery.</p>
            </div>

            <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FiShield size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Quality Assured</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>All restaurants are verified by administrators for strict hygiene.</p>
            </div>

            <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FiAward size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Best Offers</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unbeatable prices, discount vouchers, and zero hidden charges.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
