// src/pages/restaurant/MyFoodsPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyFoodsApi, deleteFoodApi, updateFoodApi } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTag } from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';
import Modal from '../../components/Modal';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import AddFoodPage from './AddFoodPage';

const MyFoodsPage = () => {
  const { success, error: toastError } = useToast();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);

  // Form State for Edit
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const data = await getMyFoodsApi();
      if (data.success) {
        setFoods(data.foods || []);
      }
    } catch (err) {
      toastError('Failed to load foods list.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;

    try {
      const data = await deleteFoodApi(foodId);
      if (data.success) {
        success('Food deleted successfully!');
        setFoods(foods.filter((f) => f.id !== foodId));
      } else {
        toastError(data.message || 'Failed to delete food.');
      }
    } catch (err) {
      toastError('Error deleting food item.');
    }
  };

  const openEditModal = (food) => {
    setCurrentFood(food);
    setEditForm({
      name: food.name || '',
      description: food.description || '',
      price: food.price || '',
      category: food.category || '',
      image: food.image || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const data = await updateFoodApi(currentFood.id, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        category: editForm.category,
        image: editForm.image,
      });

      if (data.success) {
        success('Food updated successfully!');
        setIsEditModalOpen(false);
        fetchFoods();
      } else {
        toastError(data.message || 'Failed to update food.');
      }
    } catch (err) {
      toastError('Error updating food.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = foods.filter((f) => {
    const term = search.toLowerCase();
    return (
      f.name?.toLowerCase().includes(term) ||
      f.category?.toLowerCase().includes(term) ||
      f.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justify: 'space-between',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>My Food Menu</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Add, update, or remove dishes offered by your restaurant
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '400px' }}>
          {/* Search */}
          <div className="glass-card" style={{
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}>
            <FiSearch size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', background: 'transparent' }}
            />
          </div>

          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
            <FiPlus size={18} /> Add Dish
          </button>
        </div>
      </div>

      {/* Food Items Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={IoFastFoodOutline}
          title="No Food Items"
          description={search ? `No food items match "${search}"` : 'You haven\'t added any food items to your menu yet.'}
          actionLabel="Add Your First Dish"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filtered.map((food) => (
            <div key={food.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.95)' }}>
              <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                  alt={food.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {food.category && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <FiTag size={12} color="var(--secondary)" /> {food.category}
                  </span>
                )}
              </div>

              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    {food.name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '12px' }}>
                    {food.description || 'Tasty specialty prepared daily.'}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
                    {formatCurrency(food.price)}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(food)}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '6px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="btn-danger"
                      style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Food Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Dish">
        <AddFoodPage
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchFoods();
          }}
        />
      </Modal>

      {/* Edit Food Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Dish Details">
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Dish Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              placeholder="e.g. Pizza, Main Course, Drinks"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={editForm.image}
              onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows="3"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            {submitting ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MyFoodsPage;
