// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      console.warn('Unauthorized access (401). Token might be invalid or expired.');
      // Optional: Clear expired token if needed
    } else if (status === 403) {
      console.warn('Forbidden resource access (403).');
    } else if (status === 404) {
      console.warn('Requested API resource not found (404).');
    } else if (status >= 500) {
      console.error('Server error occurred (500+).');
    }
    return Promise.reject(error);
  }
);

/* ====================================================
   1. AUTH APIs
==================================================== */
export const registerUserApi = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const loginUserApi = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/* ====================================================
   2. CUSTOMER APIs
==================================================== */
export const getRestaurantsApi = async () => {
  const response = await api.get('/restaurants');
  return response.data;
};

export const getRestaurantFoodsApi = async (restaurantId) => {
  const response = await api.get(`/restaurants/${restaurantId}/foods`);
  return response.data;
};

export const placeOrderApi = async (items) => {
  const response = await api.post('/orders', { items });
  return response.data;
};

/* ====================================================
   3. RESTAURANT OWNER APIs
==================================================== */
export const getMyFoodsApi = async () => {
  const response = await api.get('/restaurant/foods');
  return response.data;
};

export const addFoodApi = async (foodData) => {
  const response = await api.post('/restaurant/foods', foodData);
  return response.data;
};

export const updateFoodApi = async (foodId, foodData) => {
  const response = await api.put(`/restaurant/foods/${foodId}`, foodData);
  return response.data;
};

export const deleteFoodApi = async (foodId) => {
  const response = await api.delete(`/restaurant/foods/${foodId}`);
  return response.data;
};

export const getRestaurantOrdersApi = async () => {
  const response = await api.get('/restaurant/orders');
  return response.data;
};

export const updateOrderStatusApi = async (orderId, status) => {
  const response = await api.put(`/restaurant/orders/${orderId}/status`, { status });
  return response.data;
};

/* ====================================================
   4. ADMIN APIs
==================================================== */
export const getAllRestaurantsAdminApi = async () => {
  const response = await api.get('/admin/restaurants');
  return response.data;
};

export const approveRestaurantApi = async (restaurantId) => {
  const response = await api.put(`/admin/restaurants/${restaurantId}/approve`);
  return response.data;
};

export const rejectRestaurantApi = async (restaurantId) => {
  const response = await api.put(`/admin/restaurants/${restaurantId}/reject`);
  return response.data;
};

/* ====================================================
   5. RESTAURANT APPLICATION APIs
==================================================== */
export const applyRestaurantApi = async (applicationData) => {
  const response = await api.post('/restaurants/apply', applicationData);
  return response.data;
};

export const getMyRestaurantApplicationApi = async () => {
  const response = await api.get('/restaurants/my-application');
  return response.data;
};

export default api;

