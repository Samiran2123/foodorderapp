// src/components/OrderTimeline.jsx
import React from 'react';
import { FiClock, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

const steps = [
  { key: 'Pending', label: 'Order Placed', icon: FiClock },
  { key: 'Preparing', label: 'Kitchen Preparing', icon: FiPackage },
  { key: 'Out for Delivery', label: 'On The Way', icon: FiTruck },
  { key: 'Delivered', label: 'Delivered', icon: FiCheckCircle },
];

const OrderTimeline = ({ currentStatus }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div style={{
        padding: '16px',
        background: 'var(--status-cancelled-bg)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--status-cancelled)',
        fontWeight: 600,
        textAlign: 'center'
      }}>
        Order was cancelled.
      </div>
    );
  }

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Preparing': return 1;
      case 'Out for Delivery': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '20px 10px',
      position: 'relative',
      overflowX: 'auto'
    }}>
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx <= activeIndex;
        const isCurrent = idx === activeIndex;

        return (
          <div
            key={step.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
              flex: 1,
              minWidth: '90px'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              backgroundColor: isCompleted ? 'var(--primary)' : '#E2E8F0',
              color: isCompleted ? '#FFF' : 'var(--text-muted)',
              boxShadow: isCurrent ? '0 0 0 4px rgba(255, 82, 82, 0.25)' : 'none',
              transition: 'var(--transition)'
            }}>
              <Icon size={18} />
            </div>
            <span style={{
              marginTop: '8px',
              fontSize: '0.78rem',
              fontWeight: isCurrent ? 700 : 500,
              color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)',
              textAlign: 'center'
            }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
