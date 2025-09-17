import React from 'react';
import { Link } from 'react-router-dom';

// Helper untuk format Rupiah
const formatRupiah = (number) => {
  if (isNaN(number)) return "Rp 0";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

// Helper untuk format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export default function KwitansiList({
  kwitansiList, // KOREKSI 1: Nama prop disesuaikan menjadi 'kwitansiList'
  searchTerm,
  currentPage,
  entriesPerPage,
  onPageChange,
  onEntriesChange,
  onEdit,
  onDelete,
  loading,
  error,
}) {
  
  // KOREKSI 2: Safeguard untuk memastikan kwitansiList adalah array sebelum di-filter
  const safeKwitansiList = Array.isArray(kwitansiList) ? kwitansiList : [];

  const filtered = safeKwitansiList.filter((k) => {
    if (!searchTerm) return true; // Tampilkan semua jika tidak ada pencarian
    const search = searchTerm.toLowerCase();
    
    // KOREKSI 3: Logika filter yang lebih aman dan lengkap
    return (
      k.no_kwitansi?.toLowerCase().includes(search) ||
      k.untuk?.toLowerCase().includes(search) ||
      k.jumlah?.toString().includes(search) || // Angka diubah ke string
      k.profil?.nama?.toLowerCase().includes(search) // Tambah search by nama profil
    );
  });
  
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / entriesPerPage);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No Kwitansi</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Untuk Pembayaran</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jumlah</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                Memuat...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : current.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                Tidak ada data ditemukan
              </td>
            </tr>
          ) : (
            current.map((k) => (
              <tr key={k.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{k.no_kwitansi}</td>
                <td className="px-4 py-3 text-sm">{k.untuk}</td>
                <td className="px-4 py-3 text-sm font-semibold">{formatRupiah(k.jumlah)}</td>
                <td className="px-4 py-3 text-sm">{formatDate(k.tanggal)}</td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <button
                    onClick={() => onEdit(k)}
                    className="w-8 h-8 bg-yellow-500 text-white rounded flex items-center justify-center hover:bg-yellow-600"
                    title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button
                    onClick={() => onDelete(k.id)}
                    className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600"
                    title="Hapus">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                  <Link
                    to={`/kwitansi/${k.id}`}
                    className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600"
                    title="Lihat & Cetak">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-3 bg-gray-50 flex items-center justify-between border-t">
        <div className="flex items-center space-x-2">
          <label htmlFor="entries" className="text-sm text-gray-700">Entri per halaman</label>
          <select
            id="entries"
            value={entriesPerPage}
            onChange={(e) => onEntriesChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`px-2 py-1 text-sm border rounded ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

