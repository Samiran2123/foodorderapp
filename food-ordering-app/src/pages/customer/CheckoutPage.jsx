// src/pages/customer/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { placeOrderApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { FiMapPin, FiPhone, FiCreditCard, FiCheckCircle, FiCheck } from 'react-icons/fi';
import Modal from '../../components/Modal';

const CheckoutPage = () => {
  const { cartItems, currentRestaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + taxes;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      toastError('Please enter a delivery address.');
      return;
    }

    if (!phone.trim()) {
      toastError('Please enter a contact phone number.');
      return;
    }

    // Format payload matching backend POST /orders expectations: { items: [{ id, quantity }] }
    const itemsPayload = cartItems.map((item) => ({
      id: Number(item.id),
      quantity: Number(item.quantity),
    }));

    try {
      setLoading(true);
      const data = await placeOrderApi(itemsPayload);

      if (data.success) {
        setPlacedOrderId(data.orderId);
        
        // Save order to user's order history in localStorage so customer can track their past orders cleanly
        const existingHistory = JSON.parse(localStorage.getItem(`orders_user_${user?.id}`) || '[]');
        const newOrderObj = {
          order_id: data.orderId,
          restaurant_name: currentRestaurant?.name || 'Restaurant',
          total: data.total || grandTotal,
          status: 'Pending',
          ordered_at: new Date().toISOString(),
          items: cartItems.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price }))
        };
        localStorage.setItem(`orders_user_${user?.id}`, JSON.stringify([newOrderObj, ...existingHistory]));

        clearCart();
        setShowSuccessModal(true);
      } else {
        toastError(data.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order error:', err);
      toastError(err.response?.data?.message || 'Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setShowSuccessModal(false);
    navigate('/my-orders');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 20px 60px', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '24px' }}>
        Checkout & Delivery
      </h1>

      <form onSubmit={handlePlaceOrder} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px'
      }}>
        {/* Left Column: Delivery Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.95)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiMapPin color="var(--primary)" /> Delivery Address
            </h3>

            <div className="form-group">
              <label className="form-label">Complete Address</label>
              <textarea
                rows="3"
                placeholder="House/Flat No., Apartment, Street, City, Pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-textarea"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number</label>
              <div style={{ position: 'relative' }}>
                <FiPhone style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.95)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCreditCard color="var(--primary)" /> Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'COD' ? 'rgba(255, 82, 82, 0.05)' : 'white'
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Cash / Pay on Delivery (COD)</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'UPI' ? 'rgba(255, 82, 82, 0.05)' : 'white'
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Instant UPI / QR Code</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Final Summary & Submit */}
        <div className="glass-card" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.95)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
            Final Order Breakdown
          </h3>

          <div style={{ marginBottom: '16px' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Taxes (5%)</span>
              <span>{formatCurrency(taxes)}</span>
            </div>
            <div style={{
              display: 'flex',
              justify: 'space-between',
              paddingTop: '12px',
              borderTop: '2px solid #E2E8F0',
              fontSize: '1.15rem',
              fontWeight: 800
            }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--primary)' }}>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '24px', padding: '14px', fontSize: '1rem' }}
          >
            {loading ? 'Processing Order...' : (
              <>
                <FiCheck size={20} /> Place Order Now ({formatCurrency(grandTotal)})
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Celebration Modal */}
      <Modal isOpen={showSuccessModal} onClose={handleFinish} title="Order Confirmed!">
        <div style={{ textAlign: 'center', padding: '20px 10px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-delivered-bg)',
            color: 'var(--status-delivered)',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
          }}>
            <FiCheckCircle size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            🎉 Order Placed Successfully!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
            Your Order ID is <strong>#{placedOrderId || '101'}</strong>. The kitchen has received your order and is starting preparation.
          </p>

          <button onClick={handleFinish} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
            Track My Order
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
