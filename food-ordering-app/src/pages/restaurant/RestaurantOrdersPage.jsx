// src/pages/restaurant/RestaurantOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { getRestaurantOrdersApi, updateOrderStatusApi } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FiClock, FiSearch } from 'react-icons/fi';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const validStatuses = [
  'Pending',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

const RestaurantOrdersPage = () => {
  const { success, error: toastError } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantOrdersApi();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      toastError('Failed to fetch restaurant orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const data = await updateOrderStatusApi(orderId, newStatus);
      if (data.success) {
        success(`Order #${orderId} status updated to ${newStatus}`);
        setOrders(orders.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o)));
      } else {
        toastError(data.message || 'Failed to update status');
      }
    } catch (err) {
      toastError('Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    return (
      String(o.order_id).includes(term) ||
      o.customer_name?.toLowerCase().includes(term) ||
      o.email?.toLowerCase().includes(term) ||
      o.status?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="animate-fade-in">
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justify: 'space-between',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>Restaurant Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time management of customer orders and order fulfillment status
          </p>
        </div>

        {/* Search */}
        <div className="glass-card" style={{
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          maxWidth: '320px'
        }}>
          <FiSearch size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Filter by Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', background: 'transparent' }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching customer orders..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="No Orders Received"
          description={search ? `No orders matching "${search}"` : 'There are currently no orders for your restaurant.'}
        />
      ) : (
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.95)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Order ID</th>
                <th style={{ padding: '12px' }}>Customer Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Ordered At</th>
                <th style={{ padding: '12px' }}>Total Price</th>
                <th style={{ padding: '12px' }}>Current Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.order_id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                    #{order.order_id}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{order.customer_name || 'Customer'}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{order.email}</td>
                  <td style={{ padding: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {formatDate(order.ordered_at)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 800 }}>{formatCurrency(order.total)}</td>
                  <td style={{ padding: '12px' }}>
                    <StatusBadge status={order.status} />
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <select
                      value={order.status}
                      disabled={updatingId === order.order_id}
                      onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                      className="form-select"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        width: 'auto',
                        cursor: 'pointer'
                      }}
                    >
                      {validStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RestaurantOrdersPage;
