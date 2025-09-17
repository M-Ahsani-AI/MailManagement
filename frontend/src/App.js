// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Profil from './pages/Profil';
import Bank from './pages/Bank';
import Kategori from './pages/Kategori';
import Surat from './pages/Surat';
import SuratDetailPages from './pages/SuratDetailPages';
import SuratVerifyPages from './pages/SuratVerifyPages';
import Bast from './pages/Bast';
import BastDetailPages from './pages/BastDetailPages';
import BastVerifyPages from './pages/BastVerifyPages';
import Invoice from './pages/Invoice';
import InvoiceDetailPages from './pages/InvoiceDetailPages';
import InvoiceVerifyPages from './pages/InvoiceVerifyPages';
import Kwitansi from './pages/Kwitansi';
import KwitansiDetailPages from './pages/KwitansiDetailPages';
import KwitansiVerifyPages from './pages/KwitansiVerifyPages';
import ArsipPages from './pages/ArsipPages';
import SuratKeluarPages from './pages/SuratKeluarPages';
import SuratKeluarDetailPages from './pages/SuratKeluarDetailPages';
import PembayaranPages from './pages/PembayaranPages';
import CompanyDashboard from './pages/CompanyDashboard';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/surat/verify/:id" element={<SuratVerifyPages />} />
      <Route path="/bast/verify/:id" element={<BastVerifyPages />} />
      <Route path="/invoice/verify/:id" element={<InvoiceVerifyPages />} />
      <Route path="/kwitansi/verify/:id" element={<KwitansiVerifyPages />} />

      {/* Protected Routes - Semua menggunakan AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/kategori" element={<Kategori />} />
        <Route path="/surat" element={<Surat />} />
        <Route path="/surat/:id" element={<SuratDetailPages />} />
        <Route path="/bast" element={<Bast />} />
        <Route path="/bast/:id" element={<BastDetailPages />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice/:id" element={<InvoiceDetailPages />} />
        <Route path="/kwitansi" element={<Kwitansi />} />
        <Route path="/kwitansi/:id" element={<KwitansiDetailPages />} />
        <Route path="/penyimpanan/:kategori" element={<ArsipPages />} />
        <Route path="/surat-keluar" element={<SuratKeluarPages />} />
        <Route path="/surat-keluar/:id" element={<SuratKeluarDetailPages />} />
        <Route path="/pembayarans" element={<PembayaranPages />} />
        <Route path="/company/:companyId" element={<CompanyDashboard />} />
      </Route>

      {/* Redirect untuk route tidak dikenal */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;