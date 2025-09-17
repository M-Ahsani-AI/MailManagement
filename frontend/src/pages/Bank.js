// src/pages/Bank.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getBank, createBank, updateBank, deleteBank } from '../api';
import BankList from '../components/BankList';
import BankForm from '../components/BankForm';
import { useTranslation } from '../hooks/useTranslation';

function Bank() {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();
  const [bank, setBank] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editingBank, setEditingBank] = useState(null);

  if (loading) return <div>{t('Loading...')}</div>;
  if (!isAuthenticated()) return <Navigate to="/login" />;

  // Ambil data bank
  useEffect(() => {
    const fetchBank = async () => {
      try {
        const res = await getBank();
        const data = res.data?.data;

        if (Array.isArray(data)) {
          setBank(data);
        } else {
          console.warn('⚠️ Data bank bukan array:', data);
          setBank([]);
        }
      } catch (err) {
        console.error('Gagal ambil data bank:', err);
        alert(t('Gagal memuat data bank. Cek koneksi atau database.'));
      }
    };
    fetchBank();
  }, []);

  // Tambah data
  const handleCreate = async (data) => {
    try {
      await createBank(data);
      const res = await getBank(); // Refetch data
      setBank(res.data?.data || []);
      setEditingBank(null);
    } catch (err) {
      console.error('Gagal tambah bank:', err);
      alert(t('Gagal menambahkan data bank.'));
    }
  };

  // Update data
  const handleUpdate = async (id, data) => {
    try {
      await updateBank(id, data);
      const res = await getBank(); // Refetch data
      setBank(res.data?.data || []);
      setEditingBank(null);
    } catch (err) {
      console.error('Gagal update bank:', err);
      alert(t('Gagal memperbarui data bank.'));
    }
  };

  // Hapus data
  const handleDelete = async (id) => {
    if (window.confirm(t('Apakah Anda yakin ingin menghapus data ini?'))) {
      try {
        await deleteBank(id);
        const res = await getBank(); // Refetch data
        setBank(res.data?.data || []);
      } catch (err) {
        console.error('Gagal hapus bank:', err);
        alert(t('Gagal menghapus data bank.'));
      }
    }
  };

  // Buka modal edit
  const handleEdit = (bank) => {
    setEditingBank(bank);
  };

  // Tutup modal
  const handleCancelEdit = () => {
    setEditingBank(null);
  };

  // Handle perubahan jumlah entri
  const handleEntriesChange = (e) => {
    const value = Number(e.target.value);
    if (value > 0) {
      setEntriesPerPage(value);
      setCurrentPage(1);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('Bank Management')}</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() =>
            setEditingBank({
              id: null,
              nama_bank: '',
              nomor_rekening: '',
              nama_pemilik: '',
              profil_id: null,
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('Create')}
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder={t('Search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <BankList
        bank={bank}
        searchTerm={searchTerm}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
        onEntriesChange={handleEntriesChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingBank && (
        <BankForm
          formData={editingBank}
          setFormData={setEditingBank}
          onSubmit={(data) => {
            if (editingBank.id) {
              handleUpdate(editingBank.id, data);
            } else {
              handleCreate(data);
            }
          }}
          onCancel={handleCancelEdit}
          isEditing={!!editingBank.id}
        />
      )}
    </div>
  );
}

export default Bank;