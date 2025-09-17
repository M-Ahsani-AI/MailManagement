// src/components/ArsipList.js
import React from 'react';

// --- (Salin semua komponen Ikon dan fungsi formatBytes dari kode sebelumnya) ---
const ViewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};


export default function ArsipList({ files, loading, onDelete, api_url }) {

    const handlePreview = (filePath) => {
        const urlPath = filePath.replace(/\\/g, '/');
        window.open(`${api_url}/${urlPath}`, '_blank', 'noopener,noreferrer');
    };

    /**
     * ✅ KOREKSI 1: Fungsi download sekarang menggunakan 'namaTampilan' sebagai nama file
     */
    const handleDownload = (filePath, namaTampilan) => {
        const urlPath = filePath.replace(/\\/g, '/');
        const link = document.createElement('a');
        link.href = `${api_url}/${urlPath}`;
        link.setAttribute('download', namaTampilan); // Menggunakan nama tampilan yang bersih
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full table-auto">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Judul</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama File</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ukuran</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Upload</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-6 text-gray-500">Memuat data...</td></tr>
                    ) : files.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-6 text-gray-500">Tidak ada file yang ditemukan.</td></tr>
                    ) : (
                        files.map(file => (
                            <tr key={file.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{file.judul}</td>
                                
                                {/* ✅ KOREKSI 2: Menampilkan nama file yang bersih */}
                                <td className="px-4 py-3 text-sm">{file.nama_tampilan}</td>
                                
                                <td className="px-4 py-3 text-sm">{formatBytes(file.ukuran_file)}</td>
                                <td className="px-4 py-3 text-sm">{new Date(file.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handlePreview(file.path_file)} className="text-blue-600 hover:text-blue-800" title="Lihat File">
                                            <ViewIcon />
                                        </button>                                       
                                        <button onClick={() => onDelete(file.id, file.judul)} className="text-red-600 hover:text-red-800" title="Hapus File">
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}