import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach Authorization token if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

// Foods API
export const fetchFoods = async () => {
  try {
    const response = await api.get('/foods');
    return response.data;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
};

// Orders API
export const placeOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// Get User Orders API (with client-side localStorage fallback for offline/backend limitation)
export const fetchUserOrders = async (userId) => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.warn('API error fetching orders, loading from localStorage history:', error);
    const stored = localStorage.getItem(`orders_user_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }
};

export default api;
