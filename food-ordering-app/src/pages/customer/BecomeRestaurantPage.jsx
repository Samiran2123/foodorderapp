// src/pages/customer/BecomeRestaurantPage.jsx
import React, { useState, useEffect } from 'react';
import { applyRestaurantApi, getMyRestaurantApplicationApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import {
  FiSend,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiHome,
  FiPhone,
  FiImage,
  FiFileText,
  FiAlignLeft,
} from 'react-icons/fi';
import { IoRestaurantOutline } from 'react-icons/io5';

const STATUS_CONFIG = {
  pending: {
    icon: <FiClock size={28} />,
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    label: 'Pending Review',
    message:
      'Your restaurant application has been submitted and is awaiting admin approval.',
  },
  approved: {
    icon: <FiCheckCircle size={28} />,
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    label: 'Approved',
    message:
      'Congratulations! Your restaurant application has been approved. You can now access your Restaurant Dashboard.',
  },
  rejected: {
    icon: <FiXCircle size={28} />,
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    label: 'Rejected',
    message:
      'Unfortunately, your restaurant application was rejected. Please contact support for more information.',
  },
};

const BecomeRestaurantPage = () => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [existingApplication, setExistingApplication] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Check if user already has a pending/existing application
  useEffect(() => {
    if (!isAuthenticated || !isCustomer) {
      setChecking(false);
      return;
    }
    const checkExisting = async () => {
      try {
        const data = await getMyRestaurantApplicationApi();
        if (data && data.application) {
          setExistingApplication(data.application);
        }
      } catch (err) {
        // 404 means no application yet — that's fine
        if (err?.response?.status !== 404) {
          console.warn('Could not check existing application:', err);
        }
      } finally {
        setChecking(false);
      }
    };
    checkExisting();
  }, [isAuthenticated, isCustomer]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const data = await applyRestaurantApi({
        name: formData.name.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        image: formData.image.trim(),
      });

      if (data.success) {
        toastSuccess('Application submitted successfully!');
        setSubmitted(true);
        setExistingApplication({ status: 'pending', ...formData });
      } else {
        toastError(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Something went wrong. Please try again.';
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading skeleton while checking ──────────────────────────────────────────
  if (checking) {
    return (
      <div
        className="container animate-fade-in"
        style={{ padding: '60px 20px', maxWidth: '620px' }}
      >
        <div className="glass-card" style={{ padding: '40px', background: 'rgba(255,255,255,0.95)' }}>
          <div className="skeleton" style={{ height: '32px', width: '60%', marginBottom: '16px' }} />
          <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '32px' }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ marginBottom: '18px' }}>
              <div className="skeleton" style={{ height: '14px', width: '30%', marginBottom: '8px' }} />
              <div className="skeleton" style={{ height: '44px', width: '100%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Existing application status view ─────────────────────────────────────────
  if (existingApplication) {
    const status = existingApplication.status || 'pending';
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
      <div
        className="container animate-fade-in"
        style={{ padding: '60px 20px', maxWidth: '600px' }}
      >
        <div
          className="glass-card"
          style={{ padding: '40px', background: 'rgba(255,255,255,0.97)', textAlign: 'center' }}
        >
          {/* Icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: cfg.bg,
              border: `2px solid ${cfg.border}`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: cfg.color,
              marginBottom: '20px',
              boxShadow: `0 8px 24px ${cfg.bg}`,
            }}
          >
            {cfg.icon}
          </div>

          {/* Status badge */}
          <div style={{ marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                color: cfg.color,
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {cfg.label}
            </span>
          </div>

          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '12px',
            }}
          >
            Application {submitted ? 'Submitted' : 'Status'}
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '28px',
            }}
          >
            {cfg.message}
          </p>

          {/* Application details */}
          {existingApplication.name && (
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                marginBottom: '12px',
                textAlign: 'left',
              }}
            >
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Submitted Details
              </p>
              <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>
                {existingApplication.name}
              </p>
              {existingApplication.address && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {existingApplication.address}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Application form ──────────────────────────────────────────────────────────
  return (
    <div
      className="container animate-fade-in"
      style={{ padding: '50px 20px', maxWidth: '640px' }}
    >
      <div
        className="glass-card"
        style={{ padding: '40px', background: 'rgba(255,255,255,0.97)' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'var(--primary-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(255, 82, 82, 0.35)',
            }}
          >
            <IoRestaurantOutline size={30} />
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '8px',
            }}
          >
            Become a Restaurant
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Fill out the form below to apply for a restaurant partner account. Our
            team will review your application within 1–2 business days.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Restaurant Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="r-name">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiFileText size={14} /> Restaurant Name *
              </span>
            </label>
            <input
              id="r-name"
              type="text"
              name="name"
              placeholder="e.g. The Golden Spoon"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="r-description">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiAlignLeft size={14} /> Description
              </span>
            </label>
            <textarea
              id="r-description"
              rows={3}
              name="description"
              placeholder="Describe your restaurant, cuisine type, and specialties..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="r-address">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiHome size={14} /> Address *
              </span>
            </label>
            <input
              id="r-address"
              type="text"
              name="address"
              placeholder="e.g. 42 MG Road, Bengaluru, Karnataka 560001"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="r-phone">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiPhone size={14} /> Phone *
              </span>
            </label>
            <input
              id="r-phone"
              type="tel"
              name="phone"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="r-image">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiImage size={14} /> Restaurant Image URL
              </span>
            </label>
            <input
              id="r-image"
              type="url"
              name="image"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Disclaimer */}
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '20px',
              padding: '10px 14px',
              background: 'rgba(255,82,82,0.05)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--primary)',
              lineHeight: 1.6,
            }}
          >
            By submitting this form you agree to our partner terms and conditions.
            Applications are reviewed by the admin team before approval.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem' }}
          >
            <FiSend size={17} />
            {loading ? 'Submitting Application…' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomeRestaurantPage;
