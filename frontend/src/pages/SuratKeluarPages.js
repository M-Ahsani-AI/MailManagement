// src/pages/SuratKeluarPages.js
import React, { useState, useEffect, useCallback } from 'react';
import { getSuratKeluar, createSuratKeluar, deleteSuratKeluar } from '../api';
import SuratKeluarList from '../components/SuratKeluarList';

function SuratKeluarPages() {
    const [letters, setLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [perihal, setPerihal] = useState('');
    const [lampiran, setLampiran] = useState('');
    const [fileWord, setFileWord] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fetchLetters = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getSuratKeluar();
            setLetters(res.data.data || []);
        } catch (error) {
            alert('Gagal memuat daftar surat keluar.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLetters();
    }, [fetchLetters]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!fileWord || !perihal) {
            alert('Perihal dan file Word wajib diisi.');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('perihal', perihal);
        formData.append('lampiran', lampiran);
        formData.append('file_word', fileWord);

        try {
            await createSuratKeluar(formData);
            alert('Surat keluar berhasil dibuat!');
            setPerihal('');
            setLampiran('');
            setFileWord(null);
            document.getElementById('file-input-word').value = '';
            fetchLetters();
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal membuat surat keluar.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus surat ini?')) {
            try {
                await deleteSuratKeluar(id);
                alert('Surat berhasil dihapus.');
                fetchLetters();
            } catch (error) {
                alert('Gagal menghapus surat.');
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">Buat Surat Keluar Baru</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label htmlFor="perihal" className="block text-sm font-medium">Perihal</label>
                        <input type="text" id="perihal" value={perihal} onChange={e => setPerihal(e.target.value)} required className="mt-1 w-full border p-2 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="lampiran" className="block text-sm font-medium">Lampiran</label>
                        <input type="text" id="lampiran" value={lampiran} onChange={e => setLampiran(e.target.value)} placeholder="Contoh: 1 Berkas" className="mt-1 w-full border p-2 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="file-input-word" className="block text-sm font-medium">Upload Isi Surat (.docx)</label>
                        <input type="file" id="file-input-word" accept=".doc,.docx" onChange={e => setFileWord(e.target.files[0])} required className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
                        {uploading ? 'Memproses...' : 'Buat Surat'}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Daftar Surat Keluar</h2>
                {loading ? <p>Memuat...</p> : <SuratKeluarList letters={letters} onDelete={handleDelete} />}
            </div>
        </div>
    );
}
export default SuratKeluarPages;