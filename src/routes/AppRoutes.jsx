import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import AppDetails from '../pages/AppDetails';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/app/:id"
        element={
          <MainLayout>
            <AppDetails />
          </MainLayout>
        }
      />
      <Route
        path="/admin/login"
        element={
          <MainLayout>
            <AdminLogin />
          </MainLayout>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <MainLayout>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
