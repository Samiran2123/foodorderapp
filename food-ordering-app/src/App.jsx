// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import CustomerLayout from './layouts/CustomerLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import SplashPage from './pages/customer/SplashPage';
import LandingPage from './pages/customer/LandingPage';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import RestaurantListing from './pages/customer/RestaurantListing';
import RestaurantDetails from './pages/customer/RestaurantDetails';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import ProfilePage from './pages/customer/ProfilePage';
import BecomeRestaurantPage from './pages/customer/BecomeRestaurantPage';
import NotFound from './pages/404/NotFound';

// Restaurant Pages
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import MyFoodsPage from './pages/restaurant/MyFoodsPage';
import AddFoodPage from './pages/restaurant/AddFoodPage';
import RestaurantOrdersPage from './pages/restaurant/RestaurantOrdersPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantApplications from './pages/admin/RestaurantApplications';
import ViewRestaurants from './pages/admin/ViewRestaurants';
import ViewUsers from './pages/admin/ViewUsers';

import './styles/global.css';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Splash Screen */}
              <Route path="/splash" element={<SplashPage />} />

              {/* Customer Routes */}
              <Route path="/" element={<CustomerLayout><LandingPage /></CustomerLayout>} />
              <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
              <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
              <Route path="/restaurants" element={<CustomerLayout><RestaurantListing /></CustomerLayout>} />
              <Route path="/restaurants/:id/foods" element={<CustomerLayout><RestaurantDetails /></CustomerLayout>} />
              <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
              
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'restaurant', 'admin']}>
                    <CustomerLayout><CheckoutPage /></CustomerLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'restaurant', 'admin']}>
                    <CustomerLayout><MyOrdersPage /></CustomerLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'restaurant', 'admin']}>
                    <CustomerLayout><ProfilePage /></CustomerLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/become-restaurant"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerLayout><BecomeRestaurantPage /></CustomerLayout>
                  </ProtectedRoute>
                }
              />

              {/* Restaurant Owner Dashboard Routes */}
              <Route
                path="/restaurant/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['restaurant']}>
                    <DashboardLayout role="restaurant"><RestaurantDashboard /></DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restaurant/foods"
                element={
                  <ProtectedRoute allowedRoles={['restaurant']}>
                    <DashboardLayout role="restaurant"><MyFoodsPage /></DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restaurant/add-food"
                element={
                  <ProtectedRoute allowedRoles={['restaurant']}>
                    <DashboardLayout role="restaurant">
                      <div className="glass-card" style={{ padding: '28px', maxWidth: '600px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.95)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Add New Dish to Menu</h2>
                        <AddFoodPage />
                      </div>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restaurant/orders"
                element={
                  <ProtectedRoute allowedRoles={['restaurant']}>
                    <DashboardLayout role="restaurant"><RestaurantOrdersPage /></DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Dashboard Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout role="admin"><AdminDashboard /></DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout role="admin"><RestaurantApplications /></DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/restaurants"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout role="admin"><ViewRestaurants /></DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout role="admin"><ViewUsers /></DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-all */}
              <Route path="*" element={<CustomerLayout><NotFound /></CustomerLayout>} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
