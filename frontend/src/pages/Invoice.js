// frontend/src/pages/Invoice.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getInvoice, createInvoice, updateInvoice, deleteInvoice, getProfil, getKategori } from '../api'; 
import InvoiceList from '../components/InvoiceList';
import InvoiceForm from '../components/InvoiceForm';
import { useTranslation } from '../hooks/useTranslation';

function Invoice() {
  const { isAuthenticated, loading, user } = useAuth();
  const { t } = useTranslation();
  const [invoiceList, setInvoiceList] = useState([]);
  const [profil, setProfil] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  if (loading) return <div>{t('Loading...')}</div>;
  if (!isAuthenticated()) return <Navigate to="/login" />;

  const fetchAllInvoices = useCallback(async () => {
    try {
      const res = await getInvoice();
      setInvoiceList(res.data?.data || []);
    } catch (err) {
      console.error('Gagal refresh invoice:', err);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [invoiceRes, profilRes, kategoriRes] = await Promise.all([
          getInvoice(), getProfil(), getKategori()
        ]);
        setInvoiceList(invoiceRes.data?.data || []);
        setProfil(profilRes.data?.data || []);
        setKategori(kategoriRes.data?.data || []);
      } catch (err) {
        console.error('Gagal ambil data awal:', err);
        alert(t('Gagal memuat data. Cek koneksi atau database.'));
      }
    };
    fetchInitialData();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createInvoice(data);
      await fetchAllInvoices();
      setEditingInvoice(null);
    } catch (err) {
      console.error('Gagal tambah invoice:', err);
      alert(t('Gagal menambahkan data invoice.'));
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateInvoice(id, data);
      await fetchAllInvoices();
      setEditingInvoice(null);
    } catch (err) {
      console.error('Gagal update invoice:', err);
      alert(t('Gagal memperbarui data invoice.'));
    }
  };

  const handleDelete = useCallback(async (id) => {
    if (window.confirm(t('Apakah Anda yakin ingin menghapus data ini?'))) {
      const originalList = [...invoiceList];
      const updatedList = invoiceList.filter(inv => inv.id !== id);
      setInvoiceList(updatedList);
      try {
        await deleteInvoice(id);
      } catch (err) {
        console.error('Gagal hapus invoice:', err);
        alert(t('Gagal menghapus data dari server.'));
        setInvoiceList(originalList); 
      }
    }
  }, [invoiceList, t]);

  const handleEdit = (invoiceToEdit) => {
    const formattedInvoice = {
      ...invoiceToEdit,
      tanggal: invoiceToEdit.tanggal ? new Date(invoiceToEdit.tanggal).toISOString().split('T')[0] : '',
    };
    setEditingInvoice(formattedInvoice);
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
  };
  
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('Manajemen Invoice')}</h1>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setEditingInvoice({
            id: null,
            tanggal: new Date().toISOString().split('T')[0],
            profil_id: '',
            isi: '',
            meta_data: {
                dynamicFields: {
                    ppn_persen: 0,
                    pph_persen: 0,
                    ongkir: 0,
                    pembulatan: 0,
                    nama_penandatangan: user?.nama || '',
                    jabatan_penandatangan: 'Direktur'
                },
                items: []
            },
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

      <InvoiceList
        invoice={invoiceList}
        searchTerm={searchTerm}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
        onEntriesChange={handleEntriesChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingInvoice && (
        <InvoiceForm
          initialData={editingInvoice}
          onSubmit={(data) => {
            if (editingInvoice.id) {
              handleUpdate(editingInvoice.id, data);
            } else {
              handleCreate(data);
            }
          }}
          onCancel={handleCancelEdit}
          isEditing={!!editingInvoice.id}
          profil={profil}
          kategori={kategori}
          user={user}
        />
      )}
    </div>
  );
}

export default Invoice;