// src/pages/ArsipPages.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getArsipFiles, uploadArsipFile, deleteArsipFile } from '../api';
import ArsipList from '../components/ArsipList';

function ArsipPages() {
    // ... (state dan fungsi lain biarkan sama) ...
    const { kategori } = useParams();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [judul, setJudul] = useState('');
    const [fileToUpload, setFileToUpload] = useState(null);
    const [uploading, setUploading] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getArsipFiles(kategori, searchTerm);
            setFiles(response.data.data || []);
        } catch (error) {
            console.error(`Gagal memuat ${kategori}:`, error);
            alert(`Gagal memuat data ${kategori}`);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    }, [kategori, searchTerm]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);
    
    useEffect(() => {
        setJudul('');
        setFileToUpload(null);
        setSearchTerm('');
        const fileInputElement = document.getElementById('file-input');
        if (fileInputElement) {
            fileInputElement.value = '';
        }
    }, [kategori]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!fileToUpload || !judul) {
            alert('Judul dan file wajib diisi.');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('judul', judul);
        formData.append('kategori', kategori);

        try {
            await uploadArsipFile(formData);
            alert('File berhasil diupload!');
            setJudul('');
            setFileToUpload(null);
            document.getElementById('file-input').value = '';
            fetchFiles();
        } catch (error) {
            console.error('Gagal upload:', error);
            alert('Gagal mengupload file.');
        } finally {
            setUploading(false);
        }
    };
    
    /**
     * ✅ KOREKSI 4: Fungsi menerima parameter 'judulFile' untuk ditampilkan di prompt.
     */
    const handleDelete = async (id, judulFile) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus file ini secara permanen?\n\n"${judulFile}"`)) {
            try {
                await deleteArsipFile(id);
                alert('File berhasil dihapus.');
                fetchFiles(); // Refresh list
            } catch (error) {
                console.error('Gagal hapus:', error);
                alert('Gagal menghapus file.');
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* ... (Form Upload tidak berubah) ... */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Upload {kategori} Baru</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul / Keterangan File</label>
                        <input type="text" id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} required className="mt-1 w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">Pilih File</label>
                        <input type="file" id="file-input" onChange={(e) => setFileToUpload(e.target.files[0])} required className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <button type="submit" disabled={uploading} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {uploading ? 'Mengupload...' : `Upload ${kategori}`}
                    </button>
                </form>
            </div>


            {/* Daftar File */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-gray-800">Daftar {kategori}</h2>
                    <div className="relative w-full sm:w-1/3">
                        <input type="text" placeholder={`Cari ${kategori}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 p-2 pl-10 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                 {/* ✅ KOREKSI 5: Pastikan `onDelete` yang baru diteruskan ke props */}
                <ArsipList files={files} loading={loading} onDelete={handleDelete} api_url={API_BASE_URL} />
            </div>
        </div>
    );
}

export default ArsipPages;