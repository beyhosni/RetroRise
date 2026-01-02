import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import styled from 'styled-components';

// Layout components
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public pages
import Home from './pages/Home';
import Drops from './pages/Drops';
import Brands from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer pages
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import Orders from './pages/customer/Orders';
import OrderDetail from './pages/customer/OrderDetail';
import Profile from './pages/customer/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminDrops from './pages/admin/Drops';
import AdminDropDetail from './pages/admin/DropDetail';
import AdminBrands from './pages/admin/Brands';
import AdminOrders from './pages/admin/Orders';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminUsers from './pages/admin/Users';

// Loading component
const LoadingSpinner = () => (
  <Container>
    <Spinner />
  </Container>
);

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s infinite linear;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Protected Route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !user?.roles?.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/drops" element={<Layout><Drops /></Layout>} />
      <Route path="/brands" element={<Layout><Brands /></Layout>} />
      <Route path="/brands/:id" element={<Layout><BrandDetail /></Layout>} />
      <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />

      {/* Auth routes */}
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

      {/* Customer routes */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <Layout><Cart /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Layout><Checkout /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/order-confirmation" element={
        <ProtectedRoute>
          <Layout><OrderConfirmation /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout><Orders /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/orders/:id" element={
        <ProtectedRoute>
          <Layout><OrderDetail /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout><Profile /></Layout>
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <AdminLayout><AdminDashboard /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/drops" element={
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <AdminLayout><AdminDrops /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/drops/:id" element={
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <AdminLayout><AdminDropDetail /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/brands" element={
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <AdminLayout><AdminBrands /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <AdminLayout><AdminOrders /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/orders/:id" element={
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <AdminLayout><AdminOrderDetail /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requiredRole="ROLE_ADMIN">
          <AdminLayout><AdminUsers /></AdminLayout>
        </ProtectedRoute>
      } />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
