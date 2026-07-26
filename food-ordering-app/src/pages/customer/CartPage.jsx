// src/pages/customer/CartPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import EmptyState from '../../components/EmptyState';

const CartPage = () => {
  const {
    cartItems,
    currentRestaurant,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal
  } = useCart();
  
  const navigate = useNavigate();
  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + deliveryFee + taxes;

  if (cartItems.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '60px 20px', maxWidth: '600px' }}>
        <EmptyState
          icon={FiShoppingBag}
          title="Your Cart is Empty"
          description="Good food is always waiting for you. Add items from top restaurants to get started!"
          actionLabel="Explore Restaurants"
          onAction={() => navigate('/restaurants')}
        />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 20px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>Your Shopping Cart</h1>
          {currentRestaurant && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Ordering from <strong style={{ color: 'var(--primary)' }}>{currentRestaurant.name}</strong>
            </p>
          )}
        </div>
        <button onClick={clearCart} className="btn-danger" style={{ fontSize: '0.85rem' }}>
          <FiTrash2 size={16} /> Clear Cart
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cartItems.map((item) => (
            <div key={item.id} className="glass-card" style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              gap: '16px',
              background: 'rgba(255, 255, 255, 0.95)'
            }}>
              {/* Item details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                  alt={item.name}
                  style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {formatCurrency(item.price)} each
                  </span>
                </div>
              </div>

              {/* Quantity controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F1F5F9',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 10px'
                }}>
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <FiMinus size={14} color="var(--text-main)" />
                  </button>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <FiPlus size={14} color="var(--text-main)" />
                  </button>
                </div>

                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', minWidth: '70px', textAlign: 'right' }}>
                  {formatCurrency(item.price * item.quantity)}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-cancelled)', padding: '6px' }}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          <Link to="/restaurants" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, marginTop: '10px' }}>
            <FiArrowLeft size={16} /> Add more items from menu
          </Link>
        </div>

        {/* Order Summary Box */}
        <div className="glass-card" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.95)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Item Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Delivery Partner Fee</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Taxes & Restaurant Charges (5%)</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(taxes)}</span>
            </div>
            <div style={{
              display: 'flex',
              justify: 'space-between',
              paddingTop: '14px',
              borderTop: '2px dashed #E2E8F0',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-main)'
            }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--primary)' }}>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            Proceed to Checkout <FiArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
