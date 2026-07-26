// src/components/Skeleton.jsx
import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div className="skeleton" style={{ width: '100%', height: '160px', borderRadius: '12px' }} />
    <div className="skeleton" style={{ width: '70%', height: '20px' }} />
    <div className="skeleton" style={{ width: '90%', height: '14px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
      <div className="skeleton" style={{ width: '40%', height: '16px' }} />
      <div className="skeleton" style={{ width: '30%', height: '32px', borderRadius: '16px' }} />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {Array.from({ length: rows }).map((_, idx) => (
      <div key={idx} className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '8px' }} />
    ))}
  </div>
);

export default CardSkeleton;
