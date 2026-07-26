// src/components/StatusBadge.jsx
import React from 'react';
import { FiClock, FiCheckCircle, FiTruck, FiXCircle, FiPackage } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          bg: 'var(--status-pending-bg)',
          color: 'var(--status-pending)',
          icon: <FiClock size={14} />,
          label: 'Pending'
        };
      case 'preparing':
        return {
          bg: 'var(--status-preparing-bg)',
          color: 'var(--status-preparing)',
          icon: <FiPackage size={14} />,
          label: 'Preparing'
        };
      case 'out for delivery':
        return {
          bg: 'var(--status-delivery-bg)',
          color: 'var(--status-delivery)',
          icon: <FiTruck size={14} />,
          label: 'Out for Delivery'
        };
      case 'delivered':
      case 'approved':
        return {
          bg: 'var(--status-delivered-bg)',
          color: 'var(--status-delivered)',
          icon: <FiCheckCircle size={14} />,
          label: status
        };
      case 'cancelled':
      case 'rejected':
        return {
          bg: 'var(--status-cancelled-bg)',
          color: 'var(--status-cancelled)',
          icon: <FiXCircle size={14} />,
          label: status
        };
      default:
        return {
          bg: 'rgba(100, 116, 139, 0.15)',
          color: 'var(--text-muted)',
          icon: <FiClock size={14} />,
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '5px 12px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.8rem',
      fontWeight: 600,
      backgroundColor: config.bg,
      color: config.color,
      border: `1px solid ${config.color}30`
    }}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
