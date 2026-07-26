// src/pages/customer/MyOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FiList, FiClock, FiShoppingBag } from 'react-icons/fi';
import StatusBadge from '../../components/StatusBadge';
import OrderTimeline from '../../components/OrderTimeline';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user?.id]);

  const loadOrders = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(`orders_user_${user?.id}`);
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error loading order history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 20px 60px', maxWidth: '850px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>My Orders</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track live delivery status and view order history
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={FiShoppingBag}
          title="No Orders Yet"
          description="You haven't placed any food orders yet. Start exploring delicious menus!"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <div key={order.order_id} className="glass-card" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.95)' }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justify: 'space-between',
                gap: '12px',
                borderBottom: '1px solid #F1F5F9',
                paddingBottom: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                    ORDER #{order.order_id}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0' }}>
                    {order.restaurant_name}
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock size={12} /> {formatDate(order.ordered_at)}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={order.status} />
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                    {formatCurrency(order.total)}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ marginBottom: '16px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                <OrderTimeline currentStatus={order.status} />
              </div>

              {/* Items Breakdown */}
              {order.items && order.items.length > 0 && (
                <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Items Ordered
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {order.items.map((item, idx) => (
                      <span key={idx} style={{
                        background: '#F1F5F9',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
