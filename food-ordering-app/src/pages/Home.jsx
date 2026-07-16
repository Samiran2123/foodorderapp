import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import SearchBar from '../components/SearchBar';
import { fetchFoods } from '../services/api';
import heroImg from '../assets/hero.png';
import { FaFire, FaStar, FaClock, FaPlus, FaExclamationTriangle, FaTimes, FaSearch } from 'react-icons/fa';

const descMap = {
  1: 'Freshly baked pizza loaded with mozzarella cheese and garden-fresh toppings.',
  2: 'Juicy flame-grilled beef patty with lettuce, tomatoes, cheese, and signature sauce.',
  3: 'Al dente penne pasta tossed in rich, creamy tomato Alfredo sauce and herbs.',
  4: 'Crispy golden French fries sprinkled with savory sea salt.',
  5: 'Chilled cream-blended coffee topped with rich cocoa powder.'
};

const imageMap = {
  1: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
  2: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
  3: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
  4: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
  5: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600'
};

const ratingMap = {
  1: 4.8,
  2: 4.7,
  3: 4.5,
  4: 4.4,
  5: 4.5
};

const mockFoods = [
  { id: 1, name: 'Pizza', price: 299.00, image: 'pizza.jpg' },
  { id: 2, name: 'Burger', price: 149.00, image: 'burger.jpg' },
  { id: 3, name: 'Pasta', price: 199.00, image: 'pasta.jpg' },
  { id: 4, name: 'French Fries', price: 99.00, image: 'fries.jpg' },
  { id: 5, name: 'Cold Coffee', price: 129.00, image: 'coffee.jpg' }
];

const categories = [
  { name: 'All', emoji: '🍽️' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Burgers', emoji: '🍔' },
  { name: 'Pasta', emoji: '🍝' },
  { name: 'Drinks', emoji: '☕' }
];

const Home = () => {
  const { addToCart } = useCart();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const loadFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFoods();
      const enriched = data.map((item) => {
        const nameLower = item.name.toLowerCase();
        let category = 'Pizza';
        if (nameLower.includes('burger') || nameLower.includes('fries') || nameLower.includes('fry')) {
          category = 'Burgers';
        } else if (nameLower.includes('pasta') || nameLower.includes('noodle')) {
          category = 'Pasta';
        } else if (nameLower.includes('coffee') || nameLower.includes('tea') || nameLower.includes('drink') || nameLower.includes('juice') || nameLower.includes('soda')) {
          category = 'Drinks';
        } else if (nameLower.includes('pizza')) {
          category = 'Pizza';
        }

        const description = descMap[item.id] || `Fresh and delicious ${item.name} prepared with the finest ingredients.`;
        const image = imageMap[item.id] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600';
        const rating = ratingMap[item.id] || 4.5;

        return {
          ...item,
          category,
          description,
          image,
          rating
        };
      });
      setFoods(enriched);
    } catch (err) {
      console.warn('API connection failed, falling back to mock data:', err);
      const enrichedMock = mockFoods.map((item) => {
        const nameLower = item.name.toLowerCase();
        let category = 'Pizza';
        if (nameLower.includes('burger') || nameLower.includes('fries') || nameLower.includes('fry')) {
          category = 'Burgers';
        } else if (nameLower.includes('pasta') || nameLower.includes('noodle')) {
          category = 'Pasta';
        } else if (nameLower.includes('coffee') || nameLower.includes('tea') || nameLower.includes('drink') || nameLower.includes('juice') || nameLower.includes('soda')) {
          category = 'Drinks';
        }

        const description = descMap[item.id] || `Fresh and delicious ${item.name} prepared with the finest ingredients.`;
        const image = imageMap[item.id] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600';
        const rating = ratingMap[item.id] || 4.5;

        return {
          ...item,
          category,
          description,
          image,
          rating
        };
      });
      setFoods(enrichedMock);
      showToast('Offline Mode: Loaded local menu catalog.', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const handleAddToCart = (food) => {
    addToCart(food, showToast);
  };

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-page">
      <div className="hero-wrapper">
        <div className="container">
          <div className="hero">
            <div className="hero-content">
              <div className="hero-tag">
                <FaFire style={{ color: 'var(--primary)', marginRight: '6px' }} /> Hungry? Grab it now!
              </div>
              <h1 className="hero-title">
                Delicious Food, Delivered <span>Fast</span>
              </h1>
              <p className="hero-desc">
                Craving your favorite food? Order from our wide variety of dishes and get it delivered hot and fresh to your doorstep in minutes!
              </p>
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <div className="hero-image-section">
              <div className="hero-image-container">
                <img src={heroImg} className="hero-main-img" alt="Delicious Food Hero" />
                <div className="floating-card fc-1">
                  <FaStar style={{ color: 'var(--rating)', marginRight: '6px' }} />
                  <div>
                    <h5>4.9 Rating</h5>
                    <p>Over 10k reviews</p>
                  </div>
                </div>
                <div className="floating-card fc-2">
                  <FaClock style={{ color: 'var(--primary)', marginRight: '6px' }} />
                  <div>
                    <h5>25 Mins</h5>
                    <p>Super fast delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse Categories</h2>
          </div>
          <div className="categories-container">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                className={`category-tab ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <span className="category-emoji" style={{ marginRight: '6px' }}>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="food-grid-section" style={{ paddingBottom: '80px' }}>
        <div className="container">
          {loading ? (
            <div className="food-grid">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div className="skeleton-card" key={idx}>
                  <div className="skeleton-image skeleton"></div>
                  <div className="skeleton-text-title skeleton"></div>
                  <div className="skeleton-text-desc skeleton"></div>
                  <div className="skeleton-footer">
                    <div className="skeleton-price skeleton"></div>
                    <div className="skeleton-btn skeleton"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error && foods.length === 0 ? (
            <div className="error-wrapper">
              <FaExclamationTriangle size={48} style={{ color: 'var(--primary)', marginBottom: '15px' }} />
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="retry-btn" type="button" onClick={loadFoods}>Retry</button>
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="empty-grid-wrapper">
              <FaSearch size={48} style={{ color: 'var(--text-muted)', marginBottom: '15px' }} />
              <h3>No dishes found</h3>
              <p>We couldn't find any dishes matching "{searchQuery}". Try searching for something else!</p>
              <button className="clear-search-btn" type="button" onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
          ) : (
            <div className="food-grid">
              {filteredFoods.map((food) => (
                <div className="food-card" key={food.id}>
                  <div className="card-image-wrapper">
                    <img src={food.image} className="food-card-img" alt={food.name} />
                    <div className="card-rating-badge">
                      <FaStar style={{ color: 'var(--rating)', marginRight: '4px' }} />
                      {food.rating}
                    </div>
                    <div className="card-category-badge">{food.category}</div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{food.name}</h3>
                    <p className="card-desc">{food.description}</p>
                    <div className="card-footer">
                      <span className="card-price">₹{parseFloat(food.price).toFixed(2)}</span>
                      <button
                        type="button"
                        className="add-btn"
                        onClick={() => handleAddToCart(food)}
                        aria-label={`Add ${food.name} to cart`}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.type}`} key={toast.id}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
