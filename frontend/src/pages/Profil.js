// src/pages/Profil.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfil, createProfil, updateProfil, deleteProfil } from '../api';
import { Navigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import ProfilForm from '../components/ProfilForm';
import ProfilList from '../components/ProfilList'; 

function Profil() {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();

  const [profil, setProfil] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editingProfil, setEditingProfil] = useState(null);

  if (loading) return <div>{t('Loading...')}</div>;
  if (!isAuthenticated()) return <Navigate to="/login" />;

  // Ambil data profil
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await getProfil();
        console.log('🚀 API Response:', res);

        const profilData = res.data?.data;

        if (Array.isArray(profilData)) {
          setProfil(profilData);
        } else {
          console.warn('⚠️ Data profil bukan array:', profilData);
          setProfil([]);
        }
      } catch (err) {
        console.error('Gagal ambil data profil:', err);
        alert(t('Gagal memuat data profil. Cek koneksi atau database.'));
      }
    };
    fetchProfil();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createProfil(data);
      const res = await getProfil();
      setProfil(res.data?.data || []); // ✅ Ambil dari .data
      setEditingProfil(null);
    } catch (err) {
      console.error('Gagal tambah profil:', err);
      alert('Gagal menambahkan data. Cek konsol untuk detail.');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateProfil(id, data);
      const res = await getProfil();
      setProfil(res.data?.data || []);
      setEditingProfil(null);
    } catch (err) {
      console.error('Gagal update profil:', err);
      alert('Gagal memperbarui data.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('Apakah Anda yakin ingin menghapus data ini?'))) {
      try {
        await deleteProfil(id);
        const res = await getProfil();
        setProfil(res.data?.data || []);
      } catch (err) {
        console.error('Gagal hapus profil:', err);
        alert('Gagal menghapus data.');
      }
    }
  };

  const handleEdit = (profil) => {
    setEditingProfil(profil);
  };

  const handleCancelEdit = () => {
    setEditingProfil(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('Data Profil')}</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setEditingProfil({ id: null, nama: '', alamat: '', no_telp: '', email: '' })}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <ProfilList
        profil={profil}
        searchTerm={searchTerm}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalPages={Math.ceil(
          profil.filter((p) =>
            p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.alamat && p.alamat.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
          ).length / entriesPerPage
        )}
        onPageChange={setCurrentPage}
        onEntriesChange={(e) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingProfil && (
        <ProfilForm
          formData={editingProfil}
          setFormData={setEditingProfil}
          // ✅ Perbaiki: kirim data saat submit
          onSubmit={(data) => {
            if (editingProfil.id) {
              handleUpdate(editingProfil.id, data);
            } else {
              handleCreate(data);
            }
          }}
          onCancel={handleCancelEdit}
          isEditing={!!editingProfil.id}
        />
      )}
    </div>
  );
}

export default Profil;