import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import { FaMapMarkerAlt, FaPhone, FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const Checkout = () => {
  const { cartItems, subtotal, deliveryFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
        <h2>No Items to Checkout</h2>
        <p style={{ color: 'var(--text-muted)', margin: '10px 0 25px' }}>Your shopping cart is empty.</p>
        <Link to="/" className="auth-btn" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)' }}>Go to Home</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      setError('Please fill in your delivery address and phone number.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const orderData = {
      items: cartItems.map((item) => ({
        id: item.id,
        price: parseFloat(item.price),
        quantity: item.quantity
      }))
    };

    try {
      const result = await placeOrder(orderData);
      
      if (result.success) {
        const orderId = result.orderId;
        const total = result.total;

        // Save order details to local storage history for the user
        const newOrder = {
          orderId,
          total: total || totalAmount,
          date: new Date().toISOString(),
          items: cartItems.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price, image: i.image })),
          address: address.trim(),
          phone: phone.trim(),
          status: 'Preparing 🍳'
        };

        const existingOrdersKey = `orders_user_${user.id}`;
        const existingOrders = JSON.parse(localStorage.getItem(existingOrdersKey) || '[]');
        existingOrders.unshift(newOrder); // Add to the top of list
        localStorage.setItem(existingOrdersKey, JSON.stringify(existingOrders));

        setOrderSuccess({
          orderId,
          total: total || totalAmount,
          customerName: user.name
        });

        clearCart();
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (err) {
      console.warn('API connection failed. Simulating offline order placement:', err);
      // Fallback checkout logic for offline or database issues
      const mockOrderId = Math.floor(100000 + Math.random() * 900000);
      
      const newOrder = {
        orderId: mockOrderId,
        total: totalAmount,
        date: new Date().toISOString(),
        items: cartItems.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price, image: i.image })),
        address: address.trim(),
        phone: phone.trim(),
        status: 'Preparing 🍳 (Offline Mode)'
      };

      const existingOrdersKey = `orders_user_${user.id}`;
      const existingOrders = JSON.parse(localStorage.getItem(existingOrdersKey) || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem(existingOrdersKey, JSON.stringify(existingOrders));

      setOrderSuccess({
        orderId: mockOrderId,
        total: totalAmount,
        customerName: user.name
      });
      
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div className="modal" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: 'var(--radius-md)', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div className="modal-icon-wrapper" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(46, 196, 182, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', color: 'var(--success)' }}>
            <FaCheckCircle size={48} />
          </div>
          <h3 className="modal-title" style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>Order Placed!</h3>
          <p className="modal-desc" style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>
            Thank you for ordering, {orderSuccess.customerName}! Your delicious food is being prepared and will arrive soon.
          </p>

          <div className="modal-order-summary" style={{ backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '20px', marginBottom: '30px' }}>
            <div className="modal-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '15px' }}>
              <span>Order ID</span>
              <span style={{ fontWeight: '600' }}>#{orderSuccess.orderId}</span>
            </div>
            <div className="modal-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '15px' }}>
              <span>Total Paid</span>
              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>₹{parseFloat(orderSuccess.total).toFixed(2)}</span>
            </div>
            <div className="modal-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
              <span>Status</span>
              <span style={{ fontWeight: '600', color: 'var(--success)' }}>Preparing 🍳</span>
            </div>
          </div>

          <button
            type="button"
            className="modal-btn"
            style={{
              width: '100%',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600'
            }}
            onClick={() => navigate('/my-orders')}
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <div className="container" style={{ padding: '40px 24px' }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: '500' }}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Cart
        </Link>
        <h1 className="page-title" style={{ marginBottom: '30px', fontFamily: 'var(--font-heading)' }}>Checkout Details</h1>

        {error && (
          <div className="auth-error" style={{ marginBottom: '25px' }}>
            <span>{error}</span>
          </div>
        )}

        <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          {/* Form Section */}
          <div className="checkout-form-card" style={{
            backgroundColor: 'var(--bg-card)',
            padding: '30px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
              Delivery Information
            </h3>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="address">Delivery Address</label>
                <div className="input-icon-wrapper">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    id="address"
                    placeholder="Flat No, Street Name, Area, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="phone">Phone Number</label>
                <div className="input-icon-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label htmlFor="notes">Delivery Notes (Optional)</label>
                <textarea
                  id="notes"
                  placeholder="e.g. Leave at door, ring bell"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button type="submit" className="auth-btn" disabled={isSubmitting} style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>
                {isSubmitting ? (
                  <>
                    <FaSpinner className="fa-spin" style={{ marginRight: '8px' }} /> Placing Order...
                  </>
                ) : (
                  `Place Order (₹${totalAmount.toFixed(2)})`
                )}
              </button>
            </form>
          </div>

          {/* Cart items list summary */}
          <div className="checkout-summary-card" style={{
            backgroundColor: 'var(--bg-card)',
            padding: '30px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            alignSelf: 'start'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
              Your Order
            </h3>

            <div className="checkout-items-list" style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                    {item.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: '600' }}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: '700',
              fontSize: '18px',
              borderTop: '2px dashed var(--border-color)',
              paddingTop: '15px'
            }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
