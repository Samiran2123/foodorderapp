import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowRight } from 'react-icons/fa';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    totalAmount
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
        <div className="cart-empty-state" style={{ maxWidth: '400px' }}>
          <FaShoppingCart size={64} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
          <h2>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 25px' }}>
            Browse our delicious menu categories and add your favorite dishes to the cart!
          </p>
          <Link to="/" className="auth-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 24px', borderRadius: 'var(--radius-md)' }}>
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 className="page-title" style={{ marginBottom: '30px', fontFamily: 'var(--font-heading)' }}>
          <FaShoppingCart style={{ marginRight: '10px', color: 'var(--primary)' }} /> Your Shopping Cart
        </h1>

        <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          {/* Cart Items List */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div className="cart-page-item" key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img src={item.image} alt={item.name} style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)'
                  }} />
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{item.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                      ₹{parseFloat(item.price).toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                  {/* Quantity Controls */}
                  <div className="qty-controls" style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px'
                  }}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span style={{ margin: '0 15px', fontWeight: '600', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>

                  {/* Price */}
                  <div style={{ minWidth: '90px', textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--text-main)' }}>
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: '#ef4444', padding: '8px' }}
                    aria-label="Remove item"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Section */}
          <div className="cart-summary-card" style={{
            backgroundColor: 'var(--bg-card)',
            padding: '30px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            alignSelf: 'start'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
              Order Summary
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: '500' }}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
              <span style={{ fontWeight: '500' }}>₹{deliveryFee.toFixed(2)}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: '700',
              fontSize: '20px',
              borderTop: '2px dashed var(--border-color)',
              paddingTop: '20px',
              marginBottom: '25px'
            }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{totalAmount.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="auth-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600'
              }}
            >
              Proceed to Checkout <FaArrowRight style={{ marginLeft: '10px' }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
