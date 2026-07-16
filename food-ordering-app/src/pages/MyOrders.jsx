import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders } from '../services/api';
import { FaHistory, FaCalendarAlt, FaMapMarkerAlt, FaUtensils, FaClipboardList } from 'react-icons/fa';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const fetchedOrders = await fetchUserOrders(user.id);
          setOrders(fetchedOrders);
        } catch (err) {
          console.error('Error fetching orders:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadOrders();
  }, [user]);

  const formatDate = (dateStr) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="loader-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid var(--border-color)',
          borderTop: '5px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
        <div className="orders-empty-state" style={{ maxWidth: '400px' }}>
          <FaClipboardList size={64} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
          <h2>No Orders Placed Yet</h2>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 25px' }}>
            It seems you haven't placed any orders. Order some delicious food now!
          </p>
          <Link to="/" className="auth-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 24px', borderRadius: 'var(--radius-md)' }}>
            Order Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page-wrapper">
      <div className="container" style={{ padding: '40px 24px', minHeight: '70vh' }}>
        <h1 className="page-title" style={{ marginBottom: '30px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center' }}>
          <FaHistory style={{ marginRight: '12px', color: 'var(--primary)' }} /> Order History
        </h1>

        <div className="orders-list">
          {orders.map((order, idx) => (
            <div className="order-history-card" key={order.orderId || idx} style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              marginBottom: '24px',
              padding: '24px',
              overflow: 'hidden'
            }}>
              {/* Card Header */}
              <div className="order-card-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '16px',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Order #{order.orderId}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                    <FaCalendarAlt /> <span>{formatDate(order.date)}</span>
                  </div>
                </div>
                <div>
                  <span style={{
                    backgroundColor: 'rgba(46, 196, 182, 0.1)',
                    color: 'var(--success)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}>
                    {order.status || 'Preparing 🍳'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="order-card-items" style={{ marginBottom: '16px' }}>
                {order.items && order.items.map((item, itemIdx) => (
                  <div key={itemIdx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    fontSize: '15px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', color: 'var(--primary)' }}>
                          <FaUtensils size={14} />
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: '500' }}>{item.name}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '10px', fontSize: '13px' }}>x {item.quantity}</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: '600' }}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Card Footer Info */}
              <div className="order-card-footer" style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', maxWidth: '70%' }}>
                  <FaMapMarkerAlt style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span><strong>Deliver to:</strong> {order.address || 'Address provided at checkout'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'block' }}>Total Paid</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>₹{parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
