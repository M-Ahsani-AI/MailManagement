// frontend/src/pages/Kwitansi.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getKwitansi, createKwitansi, updateKwitansi, deleteKwitansi, getProfil, getKategori } from '../api'; 
import KwitansiList from '../components/KwitansiList'; 
import KwitansiForm from '../components/KwitansiForm';
import { useTranslation } from '../hooks/useTranslation';

function Kwitansi() {
  const { isAuthenticated, loading, user } = useAuth();
  const { t } = useTranslation();
  const [kwitansiList, setKwitansiList] = useState([]);
  const [profil, setProfil] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [editingKwitansi, setEditingKwitansi] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  if (loading) return <div>{t('Loading...')}</div>;
  if (!isAuthenticated()) return <Navigate to="/login" />;

  const fetchAllKwitansi = useCallback(async () => {
    try {
      const res = await getKwitansi();
      setKwitansiList(res.data?.data || []);
    } catch (err) {
      console.error('Gagal refresh Kwitansi:', err);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [kwitansiRes, profilRes, kategoriRes] = await Promise.all([
          getKwitansi(), getProfil(), getKategori()
        ]);
        setKwitansiList(kwitansiRes.data?.data || []);
        setProfil(profilRes.data?.data || []);
        setKategori(kategoriRes.data?.data || []);
      } catch (err) {
        console.error('Gagal ambil data awal:', err);
        alert(t('Gagal memuat data.'));
      }
    };
    fetchInitialData();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createKwitansi(data);
      await fetchAllKwitansi();
      setEditingKwitansi(null);
    } catch (err) {
      console.error('Gagal tambah kwitansi:', err);
      alert(t('Gagal menambahkan data kwitansi.'));
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateKwitansi(id, data);
      await fetchAllKwitansi();
      setEditingKwitansi(null);
    } catch (err) {
      console.error('Gagal update kwitansi:', err);
      alert(t('Gagal memperbarui data kwitansi.'));
    }
  };

  const handleDelete = useCallback(async (id) => {
    if (window.confirm(t('Apakah Anda yakin ingin menghapus data ini?'))) {
      const originalList = [...kwitansiList];
      setKwitansiList(kwitansiList.filter(k => k.id !== id));
      try {
        await deleteKwitansi(id);
      } catch (err) {
        console.error('Gagal hapus kwitansi:', err);
        alert(t('Gagal menghapus data kwitansi.'));
        setKwitansiList(originalList);
      }
    }
  }, [kwitansiList, t]);

  const handleEdit = (kwitansi) => {
    setEditingKwitansi({
      ...kwitansi,
      tanggal: kwitansi.tanggal ? new Date(kwitansi.tanggal).toISOString().split('T')[0] : '',
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('Manajemen Kwitansi')}</h1>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setEditingKwitansi({
            id: null,
            tanggal: new Date().toISOString().split('T')[0],
            profil_id: '',
            isi: '',
            meta_data: {},
            kategori_kode: 'KWT',
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('Create')}
        </button>
          <input
            type="text"
            placeholder={t('Search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-lg"
          />
      </div>

      <KwitansiList
        kwitansiList={kwitansiList}
        searchTerm={searchTerm}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
        onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingKwitansi && (
        <KwitansiForm
          initialData={editingKwitansi}
          onSubmit={(data) => {
            if (editingKwitansi.id) {
              handleUpdate(editingKwitansi.id, data);
            } else {
              handleCreate(data);
            }
          }}
          onCancel={() => setEditingKwitansi(null)}
          isEditing={!!editingKwitansi.id}
          profil={profil}
          kategori={kategori}
          user={user}
        />
      )}
    </div>
  );
}

export default Kwitansi;