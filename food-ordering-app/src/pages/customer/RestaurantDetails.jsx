// src/pages/customer/RestaurantDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRestaurantFoodsApi, getRestaurantsApi } from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';
import { FiPlus, FiShoppingBag, FiArrowLeft, FiTag, FiSearch } from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addToCart, getItemCount } = useCart();
  const { success, warning } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch restaurant header details
      const restaurantsRes = await getRestaurantsApi();
      if (restaurantsRes.success) {
        const found = restaurantsRes.restaurants.find((r) => String(r.id) === String(id));
        setRestaurant(found || { id, restaurant_name: `Restaurant #${id}` });
      }

      // Fetch food items
      const foodsRes = await getRestaurantFoodsApi(id);
      if (foodsRes.success) {
        setFoods(foodsRes.foods || []);
      } else {
        setError(foodsRes.message || 'Failed to load menu items');
      }
    } catch (err) {
      setError('Unable to load menu. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(foods.map((f) => f.category).filter(Boolean))];

  const filteredFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const matchesSearch =
      food.name?.toLowerCase().includes(search.toLowerCase()) ||
      food.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (food) => {
    const restaurantInfo = {
      id: Number(id),
      name: restaurant?.restaurant_name || 'Restaurant'
    };

    const added = addToCart(food, restaurantInfo);
    if (added) {
      success(`Added "${food.name}" to cart!`);
    } else {
      warning('Cart update cancelled');
    }
  };

  const cartCount = getItemCount();

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 20px 60px' }}>
      {/* Back Link */}
      <Link to="/restaurants" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-muted)',
        fontWeight: 600,
        marginBottom: '20px'
      }}>
        <FiArrowLeft size={18} /> Back to Restaurants
      </Link>

      {/* Restaurant Info Header */}
      {restaurant && (
        <div className="glass-card" style={{
          padding: '28px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justify: 'space-between',
          gap: '20px'
        }}>
          <div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Official Menu
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 8px' }}>
              {restaurant.restaurant_name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
              {restaurant.description || 'Serving authentic taste and gourmet dishes crafted with fresh ingredients.'}
            </p>
            {restaurant.address && (
              <span style={{ display: 'inline-block', marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                📍 {restaurant.address}
              </span>
            )}
          </div>

          <Link to="/cart" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <FiShoppingBag size={20} /> View Cart ({cartCount})
          </Link>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justify: 'space-between',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Categories */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.88rem',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--primary)' : '#E2E8F0',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'white',
                color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="glass-card" style={{
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          maxWidth: '300px'
        }}>
          <FiSearch size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.88rem',
              background: 'transparent'
            }}
          />
        </div>
      </div>

      {/* Foods Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : error ? (
        <LoadingSpinner message={error} onRetry={fetchData} />
      ) : filteredFoods.length === 0 ? (
        <EmptyState
          icon={IoFastFoodOutline}
          title="No Dishes Found"
          description="There are no items listed under this menu category."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredFoods.map((food) => (
            <div key={food.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                  alt={food.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {food.category && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <FiTag size={12} color="var(--secondary)" /> {food.category}
                  </span>
                )}
              </div>

              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    {food.name}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '14px' }}>
                    {food.description || 'Deliciously prepared with high quality ingredients and traditional spices.'}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #F1F5F9'
                }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {formatCurrency(food.price)}
                  </span>

                  <button
                    onClick={() => handleAddToCart(food)}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    <FiPlus size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
