// src/components/SuratKeluarList.js
import React from 'react';
import { Link } from 'react-router-dom';

// --- (Definisi ikon SVG tidak perlu diubah, biarkan seperti sebelumnya) ---
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

/**
 * ✅ FUNGSI BARU: Untuk memformat tanggal dengan aman.
 * Jika tanggal tidak valid, fungsi ini akan mengembalikan tanda strip "-".
 */
const formatDate = (dateString) => {
    // Cek dulu apakah dateString ada isinya
    if (!dateString) {
        return '-';
    }
    const date = new Date(dateString);
    // Cek apakah hasil konversi tanggalnya valid
    if (isNaN(date.getTime())) {
        return '-';
    }
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};


export default function SuratKeluarList({ letters, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full table-auto">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nomor Surat</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Perihal</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Dibuat</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {letters.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-6">Belum ada surat keluar.</td></tr>
                    ) : (
                        letters.map(letter => (
                            <tr key={letter.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{letter.no_surat}</td>
                                <td className="px-4 py-3">{letter.perihal}</td>
                                
                                {/* ✅ KOREKSI: Gunakan fungsi formatDate yang aman */}
                                <td className="px-4 py-3">{formatDate(letter.created_at)}</td>
                                
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-4">
                                        <Link to={`/surat-keluar/${letter.id}`} className="text-blue-600 hover:text-blue-800" title="Lihat & Cetak">
                                            <ViewIcon />
                                        </Link>
                                        <button onClick={() => onDelete(letter.id)} className="text-red-600 hover:text-red-800" title="Hapus">
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