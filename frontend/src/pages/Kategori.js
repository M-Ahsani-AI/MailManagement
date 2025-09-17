import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getKategori, createKategori, updateKategori, deleteKategori } from '../api';
import KategoriList from '../components/KategoriList';
import KategoriForm from '../components/KategoriForm';
import { useTranslation } from '../hooks/useTranslation';

function Kategori() {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();
  const [kategori, setKategori] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editingKategori, setEditingKategori] = useState(null);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated()) return <Navigate to="/login" />;

  // ✅ BEST PRACTICE: Membungkus fungsi fetch dengan useCallback
  const fetchKategori = useCallback(async () => {
    try {
      const res = await getKategori();
      setKategori(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error('Gagal ambil data kategori:', err);
      alert(t('Gagal memuat data kategori.'));
    }
  }, []); // 't' dimasukkan sebagai dependency

  // Panggil fetchKategori sekali saat komponen dimuat
  useEffect(() => {
    fetchKategori();
  }, [fetchKategori]);

  // ✅ PENINGKATAN PERFORMA: Update state secara langsung
  const handleCreate = async (data) => {
    try {
      const res = await createKategori(data);
      // Tambahkan data baru ke state tanpa refetch
      setKategori(prevKategori => [...prevKategori, res.data.data]);
      setEditingKategori(null);
    } catch (err) {
      console.error('Gagal tambah kategori:', err);
      alert(t('Gagal menambahkan data kategori.'));
    }
  };

  // ✅ PENINGKATAN PERFORMA: Update state secara langsung
  const handleUpdate = async (kode, data) => {
    try {
      const res = await updateKategori(kode, data);
      // Cari dan ganti data di state tanpa refetch
      setKategori(prevKategori => 
        prevKategori.map(item => (item.kode === kode ? res.data.data : item))
      );
      setEditingKategori(null);
    } catch (err) {
      console.error('Gagal update kategori:', err);
      alert(t('Gagal memperbarui data kategori.'));
    }
  };

  // ✅ PENINGKATAN PERFORMA: Update state secara langsung
  const handleDelete = async (kode) => {
    if (window.confirm(t('Apakah Anda yakin ingin menghapus data ini?'))) {
      try {
        await deleteKategori(kode);
        // Hapus data dari state tanpa refetch
        setKategori(prevKategori => prevKategori.filter(item => item.kode !== kode));
      } catch (err) {
        console.error('Gagal hapus kategori:', err);
        alert(t('Gagal menghapus data kategori.'));
      }
    }
  };

  const handleEdit = (kategoriToEdit) => {
    setEditingKategori({
      ...kategoriToEdit,
      template: kategoriToEdit.template || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingKategori(null);
  };

  const handleEntriesChange = (e) => {
    const value = Number(e.target.value);
    if (value > 0) {
      setEntriesPerPage(value);
      setCurrentPage(1);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('Kategori Management')}</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() =>
            setEditingKategori({
              kode: '',
              nama_kategori: '', 
              template: '',
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
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <KategoriList
        kategori={kategori}
        searchTerm={searchTerm}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
        onEntriesChange={handleEntriesChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingKategori && (
        <KategoriForm
          formData={editingKategori}
          onSubmit={(data) => {
            // ✅ KOREKSI KRITIS: Hapus referensi ke 'isEditing'
            if (editingKategori.kode) {
              handleUpdate(editingKategori.kode, data);
            } else {
              handleCreate(data);
            }
          }}
          onCancel={handleCancelEdit}
          isEditing={!!editingKategori.kode}
        />
      )}
    </div>
  );
}

export default Kategori;