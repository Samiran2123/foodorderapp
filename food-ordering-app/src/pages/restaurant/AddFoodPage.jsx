// src/pages/restaurant/AddFoodPage.jsx
import React, { useState } from 'react';
import { addFoodApi } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { validateRequired } from '../../utils/validators';

const AddFoodPage = ({ onSuccess }) => {
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateRequired(formData.name, 'Food Name');
    const categoryErr = validateRequired(formData.category, 'Category');
    const priceErr = validateRequired(formData.price, 'Price');

    if (nameErr || categoryErr || priceErr) {
      setErrors({ name: nameErr, category: categoryErr, price: priceErr });
      return;
    }

    try {
      setLoading(true);
      const data = await addFoodApi({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      });

      if (data.success) {
        success('Food item added successfully!');
        setFormData({ name: '', description: '', price: '', category: '', image: '' });
        if (onSuccess) onSuccess();
      } else {
        toastError(data.message || 'Failed to add food');
      }
    } catch (err) {
      toastError('Error adding food item to menu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="form-group">
        <label className="form-label">Dish Name *</label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Margherita Pizza"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Category *</label>
        <input
          type="text"
          name="category"
          placeholder="e.g. Pizza, Fast Food, Desserts"
          value={formData.category}
          onChange={handleChange}
          className="form-input"
        />
        {errors.category && <span className="form-error">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Price (₹) *</label>
        <input
          type="number"
          name="price"
          placeholder="299"
          value={formData.price}
          onChange={handleChange}
          className="form-input"
        />
        {errors.price && <span className="form-error">{errors.price}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Image URL</label>
        <input
          type="url"
          name="image"
          placeholder="https://images.unsplash.com/..."
          value={formData.image}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          rows="3"
          name="description"
          placeholder="Short description of taste and ingredients..."
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ width: '100%', marginTop: '12px', padding: '12px' }}
      >
        {loading ? 'Adding Dish...' : 'Publish Dish to Menu'}
      </button>
    </form>
  );
};

export default AddFoodPage;
