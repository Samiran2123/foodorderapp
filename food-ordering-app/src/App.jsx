import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import { fetchFoods, placeOrder } from './services/api';
import heroImg from './assets/hero.png';
import './App.css';

const categoryMap = {
  1: 'Pizza',
  2: 'Burgers',
  3: 'Pasta',
  4: 'Burgers',
  5: 'Drinks'
};

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

function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
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
      // Enrich mock data as well
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

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        showToast(`Increased ${item.name} quantity in cart!`, 'success');
        return prevCart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      showToast(`${item.name} added to cart!`, 'success');
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === id);
      if (!item) return prevCart;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        showToast(`${item.name} removed from cart.`, 'info');
        return prevCart.filter((i) => i.id !== id);
      }
      return prevCart.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === id);
      if (item) {
        showToast(`${item.name} removed from cart.`, 'info');
      }
      return prevCart.filter((i) => i.id !== id);
    });
  };

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      setValidationError('Please enter your name to place the order.');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);

    const orderData = {
      customer_name: customerName.trim(),
      items: cart.map((item) => ({
        id: item.id,
        price: parseFloat(item.price),
        quantity: item.quantity
      }))
    };

    try {
      const result = await placeOrder(orderData);
      if (result.success) {
        setOrderSuccess({
          orderId: result.orderId,
          total: result.total,
          customerName: customerName.trim()
        });
        setCart([]);
        setCustomerName('');
        setIsCartOpen(false);
        showToast('Order placed successfully!', 'success');
      } else {
        throw new Error(result.message || 'Order failed');
      }
    } catch (err) {
      console.warn('API Order failed, placing in local/offline mode:', err);
      // Fallback checkout logic
      const mockOrderId = Math.floor(100000 + Math.random() * 900000);
      const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0) + 40;
      setOrderSuccess({
        orderId: mockOrderId,
        total: totalAmount,
        customerName: customerName.trim()
      });
      setCart([]);
      setCustomerName('');
      setIsCartOpen(false);
      showToast('Order placed successfully (Offline Mode)!', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40.00 : 0;
  const totalAmount = subtotal + deliveryFee;

  return (
    <div className="app">
      <Navbar cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />

      <main className="main-content">
        <div className="hero-wrapper">
          <div className="container">
            <div className="hero">
              <div className="hero-content">
                <div className="hero-tag">
                  <i className="fa-solid fa-fire"></i> Hungry? Grab it now!
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
                    <i className="fa-solid fa-star"></i>
                    <div>
                      <h5>4.9 Rating</h5>
                      <p>Over 10k reviews</p>
                    </div>
                  </div>
                  <div className="floating-card fc-2">
                    <i className="fa-solid fa-clock"></i>
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
                  <span className="category-emoji">{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="food-grid-section">
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
                <i className="fa-solid fa-triangle-exclamation"></i>
                <h3>Something went wrong</h3>
                <p>{error}</p>
                <button className="retry-btn" type="button" onClick={loadFoods}>Retry</button>
              </div>
            ) : filteredFoods.length === 0 ? (
              <div className="empty-grid-wrapper">
                <i className="fa-solid fa-magnifying-glass"></i>
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
                        <i className="fa-solid fa-star"></i>
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
                          onClick={() => addToCart(food)}
                          aria-label={`Add ${food.name} to cart`}
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer-wrapper">
        <div className="container">
          <div className="footer">
            <div className="footer-brand">
              <h2 className="footer-logo">Food<span>Hub</span></h2>
              <p className="footer-brand-desc">Bringing fresh, delicious meals from our kitchen straight to your doorstep.</p>
              <div className="footer-socials">
                <a href="#" className="social-btn" aria-label="Facebook" onClick={(e) => e.preventDefault()}><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" className="social-btn" aria-label="Twitter" onClick={(e) => e.preventDefault()}><i className="fa-brands fa-twitter"></i></a>
                <a href="#" className="social-btn" aria-label="Instagram" onClick={(e) => e.preventDefault()}><i className="fa-brands fa-instagram"></i></a>
              </div>
            </div>
            <div>
              <h4 className="footer-heading">Menu</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Pizza'); }}>Pizza</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Burgers'); }}>Burgers</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Pasta'); }}>Pasta</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Drinks'); }}>Drinks</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Help</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => e.preventDefault()}>Contact Support</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Track Order</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Refund Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Contact</h4>
              <div className="footer-contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>123 Foodie Street, Gourmet City, GC 10001</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-phone"></i>
                <span>+1 (555) 3663-482</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>support@foodhub.com</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} FoodHub. All rights reserved.</p>
            <p>Made with <i className="fa-solid fa-heart" style={{ color: 'var(--primary)' }}></i> for food lovers.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer Overlay */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h3 className="cart-header-title">
              <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </h3>
            <button
              type="button"
              className="cart-close-btn"
              onClick={() => setIsCartOpen(false)}
              aria-label="Close Cart"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="cart-body-scroll">
            {cart.length === 0 ? (
              <div className="cart-empty-state">
                <i className="fa-solid fa-basket-shopping"></i>
                <p>Your cart is empty.</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Add delicious items from the menu to get started!</p>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-img-wrapper">
                    <img src={item.image} className="cart-item-img" alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price-unit">₹{parseFloat(item.price).toFixed(2)} x {item.quantity}</span>
                    <span className="cart-item-price-total">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="checkout-form">
                <label className="form-label" htmlFor="customer-name">Name for Order</label>
                <div className="form-input-wrapper">
                  <i className="fa-solid fa-user"></i>
                  <input
                    type="text"
                    id="customer-name"
                    className="form-input"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                  />
                </div>
                {validationError && (
                  <span className="validation-error">
                    <i className="fa-solid fa-circle-exclamation"></i> {validationError}
                  </span>
                )}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="total-price">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Placing Order...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-bag-shopping"></i> Place Order
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon-wrapper">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h3 className="modal-title">Order Placed!</h3>
            <p className="modal-desc">Thank you for ordering, {orderSuccess.customerName}! Your delicious food is being prepared and will arrive soon.</p>

            <div className="modal-order-summary">
              <div className="modal-row">
                <span>Order ID</span>
                <span>#{orderSuccess.orderId}</span>
              </div>
              <div className="modal-row">
                <span>Total Paid</span>
                <span>₹{parseFloat(orderSuccess.total).toFixed(2)}</span>
              </div>
              <div className="modal-row">
                <span>Status</span>
                <span style={{ color: 'var(--success)' }}>Preparing 🍳</span>
              </div>
            </div>

            <button
              type="button"
              className="modal-btn"
              onClick={() => setOrderSuccess(null)}
            >
              Track Order
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.type}`} key={toast.id}>
            {toast.type === 'success' && <i className="fa-solid fa-circle-check"></i>}
            {toast.type === 'error' && <i className="fa-solid fa-circle-exclamation"></i>}
            {toast.type === 'info' && <i className="fa-solid fa-circle-info"></i>}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
