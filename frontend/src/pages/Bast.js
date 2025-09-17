// frontend/src/pages/Bast.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getBast, createBast, updateBast, deleteBast, getKategori } from '../api'; // ✅ DIHAPUS: getProfil
import BastList from '../components/BastList';
import BastForm from '../components/BastForm';
import { useTranslation } from '../hooks/useTranslation';

function Bast() {
    const { isAuthenticated, loading, user } = useAuth();
    const { t } = useTranslation();
    const [bastList, setBastList] = useState([]);
    const [kategori, setKategori] = useState([]);
    const [editingBast, setEditingBast] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    // ✅ DIHAPUS: State untuk profil tidak diperlukan lagi
    // const [profil, setProfil] = useState([]);

    if (loading) return <div>{t('Loading...')}</div>;
    if (!isAuthenticated()) return <Navigate to="/login" />;

    const fetchAllBast = async () => {
        try {
            const res = await getBast();
            setBastList(res.data?.data || []);
        } catch (err) {
            console.error('Gagal refresh BAST:', err);
            alert(t('Gagal menyegarkan data BAST.'));
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // ✅ DIHAPUS: getProfil tidak dipanggil lagi
                const [bastRes, kategoriRes] = await Promise.all([
                    getBast(), getKategori()
                ]);
                setBastList(bastRes.data?.data || []);
                setKategori(kategoriRes.data?.data || []);
                // ✅ DIHAPUS: setProfil
            } catch (err) {
                console.error('Gagal memuat data awal BAST:', err);
                alert(t('Gagal memuat data.'));
            }
        };
        fetchInitialData();
    }, []);

    const handleCreate = async (data) => {
        try {
            await createBast(data);
            await fetchAllBast();
            setEditingBast(null);
        } catch (err) {
            console.error('Gagal tambah BAST:', err);
            alert(t('Gagal menambahkan data BAST.'));
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await updateBast(id, data);
            await fetchAllBast();
            setEditingBast(null);
        } catch (err) {
            console.error('Gagal update BAST:', err);
            alert(t('Gagal memperbarui data BAST.'));
        }
    };

    const handleDelete = useCallback(async (id) => {
        if (window.confirm(t('Apakah Anda yakin ingin menghapus data ini?'))) {
            try {
                await deleteBast(id);
                await fetchAllBast(); // Panggil refresh setelah berhasil hapus
            } catch (err) {
                console.error('Gagal hapus BAST:', err);
                alert(t('Gagal menghapus data BAST dari server.'));
            }
        }
    }, [t]);

    const handleEdit = (bastToEdit) => {
        const formattedBast = {
            ...bastToEdit,
            tanggal: bastToEdit.tanggal ? new Date(bastToEdit.tanggal).toISOString().split('T')[0] : '',
        };
        setEditingBast(formattedBast);
    };

    const handleCancelEdit = () => setEditingBast(null);
    const handleEntriesChange = (e) => {
        setEntriesPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('Manajemen BAST')}</h1>
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => setEditingBast({
                        id: null,
                        tanggal: new Date().toISOString().split('T')[0],
                        isi: '',
                        meta_data: {},
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
            <BastList
                bast={bastList}
                searchTerm={searchTerm}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                onPageChange={setCurrentPage}
                onEntriesChange={handleEntriesChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            {editingBast && (
                <BastForm
                    initialData={editingBast}
                    onSubmit={(data) => {
                        if (editingBast.id) {
                            handleUpdate(editingBast.id, data);
                        } else {
                            handleCreate(data);
                        }
                    }}
                    onCancel={handleCancelEdit}
                    isEditing={!!editingBast.id}
                    kategori={kategori}
                    user={user}
                />
            )}
        </div>
    );
}

export default Bast;