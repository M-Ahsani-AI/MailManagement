import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getSurat, createSurat, updateSurat, deleteSurat, getProfil, getKategori, getBank } from '../api'; 
import SuratList from '../components/SuratList';
import SuratForm from '../components/SuratForm';
import { useTranslation } from '../hooks/useTranslation';

function Surat() {
  const { isAuthenticated, loading, user } = useAuth();
  const { t } = useTranslation();
  const [surat, setSurat] = useState([]);
  const [profil, setProfil] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [editingSurat, setEditingSurat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  if (loading) return <div>{t('Loading...')}</div>;
  if (!isAuthenticated()) return <Navigate to="/login" />;

  const fetchAllSurat = async () => {
    try {
      const res = await getSurat();
      setSurat(res.data?.data || []);
    } catch (err) {
      console.error('Gagal refresh surat:', err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [suratRes, profilRes, kategoriRes, bankRes] = await Promise.all([
          getSurat(),
          getProfil(),
          getKategori(),
          getBank()
        ]);
        setSurat(suratRes.data?.data || []);
        setProfil(profilRes.data?.data || []);
        setKategori(kategoriRes.data?.data || []);
        setBankList(bankRes.data?.data || []);
      } catch (err) {
        console.error('Gagal ambil data awal:', err);
        alert(t('Gagal memuat data. Cek koneksi atau database.'));
      }
    };
    fetchInitialData();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createSurat(data);
      await fetchAllSurat();
      setEditingSurat(null);
    } catch (err) {
      console.error('Gagal tambah surat:', err);
      alert(t('Gagal menambahkan data surat. Periksa kembali isian Anda.'));
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateSurat(id, data);
      await fetchAllSurat();
      setEditingSurat(null);
    } catch (err) {
      console.error('Gagal update surat:', err);
      alert(t('Gagal memperbarui data surat.'));
    }
  };

  const handleDelete = useCallback(async (id) => {
    if (window.confirm(t('Apakah Anda yakin ingin menghapus data ini?'))) {
      const originalSurat = [...surat];
      const updatedSurat = surat.filter(s => s.id !== id);
      setSurat(updatedSurat);
      try {
        await deleteSurat(id);
      } catch (err) {
        console.error('Gagal hapus surat:', err);
        alert(t('Gagal menghapus data surat dari server.'));
        setSurat(originalSurat); 
      }
    }
  }, [surat]);

  const handleEdit = (suratToEdit) => {
    const formattedSurat = {
      ...suratToEdit,
      tanggal: suratToEdit.tanggal ? new Date(suratToEdit.tanggal).toISOString().split('T')[0] : '',
    };
    setEditingSurat(formattedSurat);
  };

  const handleCancelEdit = () => {
    setEditingSurat(null);
  };
  
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // ✅ KOREKSI: Filter kategori agar hanya SP dan PP yang bisa dipilih
  const filteredKategori = kategori.filter(k => k.kode === 'SP' || k.kode === 'PP');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('Manajemen Surat')}</h1>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() =>
            setEditingSurat({
              id: null,
              tanggal: new Date().toISOString().split('T')[0],
              isi: '',
              kategori_kode: '',
              profil_id: '',
              perihal: ''
            })
          }
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

      <SuratList
        surat={surat}
        searchTerm={searchTerm}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
        onEntriesChange={handleEntriesChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingSurat && (
        <SuratForm
          initialData={editingSurat}
          onSubmit={(data) => {
            if (editingSurat.id) {
              handleUpdate(editingSurat.id, data);
            } else {
              handleCreate(data);
            }
          }}
          onCancel={handleCancelEdit}
          isEditing={!!editingSurat.id}
          profil={profil}
          kategori={filteredKategori}
          bankList={bankList}
          user={user}
        />
      )}
    </div>
  );
}

export default Surat;