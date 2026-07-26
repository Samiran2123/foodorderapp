// src/pages/restaurant/RestaurantDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyFoodsApi, getRestaurantOrdersApi } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { FiList, FiClock, FiDollarSign, FiPlusCircle, FiArrowRight } from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const RestaurantDashboard = () => {
  const [foodsCount, setFoodsCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [foodsRes, ordersRes] = await Promise.all([
        getMyFoodsApi().catch(() => ({ success: false, foods: [] })),
        getRestaurantOrdersApi().catch(() => ({ success: false, orders: [] }))
      ]);

      if (foodsRes.success) {
        setFoodsCount(foodsRes.foods?.length || 0);
      }
      if (ordersRes.success) {
        setOrders(ordersRes.orders || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard stats..." />;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Restaurant Overview
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage your dishes, incoming customer orders, and track daily revenue.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE FOODS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {foodsCount}
              </h2>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 82, 82, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IoFastFoodOutline size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ORDERS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {orders.length}
              </h2>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiList size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING ORDERS</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-pending)', marginTop: '4px' }}>
                {pendingOrders}
              </h2>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-pending)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiClock size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>DELIVERED REVENUE</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-delivered)', marginTop: '4px' }}>
                {formatCurrency(totalRevenue)}
              </h2>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-delivered)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiDollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action & Recent Orders Preview */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Recent Orders</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/restaurant/add-food" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <FiPlusCircle size={16} /> Add Food
          </Link>
          <Link to="/restaurant/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
            View All ({orders.length}) <FiArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.95)', overflowX: 'auto' }}>
        {orders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No orders placed yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Order ID</th>
                <th style={{ padding: '12px' }}>Customer</th>
                <th style={{ padding: '12px' }}>Total Amount</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.order_id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px', fontWeight: 700 }}>#{order.order_id}</td>
                  <td style={{ padding: '12px' }}>{order.customer_name || 'Customer'}</td>
                  <td style={{ padding: '12px', fontWeight: 700 }}>{formatCurrency(order.total)}</td>
                  <td style={{ padding: '12px' }}><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
