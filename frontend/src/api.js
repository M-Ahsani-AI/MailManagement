// frontend/src/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: tambahkan token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: tangani 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid → logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => api.post('/api/auth/login', data);
export const register = (data) => api.post('/api/auth/register', data);

// Companies
export const getCompanies = () => api.get('/api/companies');
export const createCompany = (data) => api.post('/api/companies', data);
export const updateCompany = (id, data) => api.put(`/api/companies/${id}`, data);
export const deleteCompany = (id) => api.delete(`/api/companies/${id}`);

// Profil
export const getProfil = () => api.get('/api/profil');
export const createProfil = (data) => api.post('/api/profil', data);
export const updateProfil = (id, data) => api.put(`/api/profil/${id}`, data);
export const deleteProfil = (id) => api.delete(`/api/profil/${id}`);

// Bank
export const getBank = () => api.get('/api/bank');
export const createBank = (data) => api.post('/api/bank', data);
export const updateBank = (id, data) => api.put(`/api/bank/${id}`, data);
export const deleteBank = (id) => api.delete(`/api/bank/${id}`); 

// Kategori
export const getKategori = () => api.get('/api/kategori');
export const createKategori = (data) => api.post('/api/kategori', data);
export const updateKategori = (kode, data) => api.put(`/api/kategori/${kode}`, data);
export const deleteKategori = (kode) => api.delete(`/api/kategori/${kode}`);

// Surat
export const getSurat = () => api.get('/api/surat');
export const getSuratById = (id) => api.get(`/api/surat/${id}`);
export const createSurat = (data) => api.post('/api/surat', data);
export const updateSurat = (id, data) => api.put(`/api/surat/${id}`, data);
export const deleteSurat = (id) => api.delete(`/api/surat/${id}`);

// BAST
export const getBast = () => api.get('/api/bast');
export const getBastById = (id) => api.get(`/api/bast/${id}`);
export const createBast = (data) => api.post('/api/bast', data);
export const updateBast = (id, data) => api.put(`/api/bast/${id}`, data);
export const deleteBast = (id) => api.delete(`/api/bast/${id}`);

// Invoice
export const getInvoice = () => api.get('/api/invoice');
export const getInvoiceById = (id) => api.get(`/api/invoice/${id}`);
export const createInvoice = (data) => api.post('/api/invoice', data);
export const updateInvoice = (id, data) => api.put(`/api/invoice/${id}`, data);
export const deleteInvoice = (id) => api.delete(`/api/invoice/${id}`);

// Kwitansi
export const getKwitansi = () => api.get('/api/kwitansi');
export const getKwitansiById = (id) => api.get(`/api/kwitansi/${id}`);
export const createKwitansi = (data) => api.post('/api/kwitansi', data);
export const updateKwitansi = (id, data) => api.put(`/api/kwitansi/${id}`, data);
export const deleteKwitansi = (id) => api.delete(`/api/kwitansi/${id}`);

// Arsip
export const getArsipFiles = (kategori, search = '') => api.get(`/api/arsip?kategori=${kategori}&search=${search}`);
export const uploadArsipFile = (formData) => api.post('/api/arsip', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteArsipFile = (id) => api.delete(`/api/arsip/${id}`);

// Surat Keluar
export const getSuratKeluar = () => api.get('/api/surat-keluar');
export const getSuratKeluarById = (id) => api.get(`/api/surat-keluar/${id}`);
export const createSuratKeluar = (formData) => api.post('/api/surat-keluar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteSuratKeluar = (id) => api.delete(`/api/surat-keluar/${id}`);

// Pembayaran
export const getPembayaran = () => api.get('/api/pembayaran');
export const createPembayaran = (data) => api.post('/api/pembayaran', data);
export const updatePembayaran = (id, data) => api.put(`/api/pembayaran/${id}`, data);
export const deletePembayaran = (id) => api.delete(`/api/pembayaran/${id}`);