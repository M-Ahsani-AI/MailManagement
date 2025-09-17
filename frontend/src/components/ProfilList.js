// src/components/ProfilList.js
import React from 'react';

export default function ProfilList({
  profil,
  searchTerm,
  currentPage,
  entriesPerPage,
  onPageChange,
  onEntriesChange,
  onEdit,
  onDelete,
}) {

  const filtered = profil.filter((p) => {
    if (!searchTerm) return true; 
    const search = searchTerm.toLowerCase();
    return (
      p.kategori_kode?.toLowerCase().includes(search) ||
      p.alamat?.toLowerCase().includes(search) ||
      p.email?.toLowerCase().includes(search) 
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
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Alamat</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Telepon</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {current.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                Tidak ada data ditemukan
              </td>
            </tr>
          ) : (
            current.map((p, index) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{indexOfFirst + index + 1}</td>
                <td className="px-4 py-3 text-sm">{p.nama}</td>
                <td className="px-4 py-3 text-sm">{p.alamat || '-'}</td>
                <td className="px-4 py-3 text-sm">{p.email || '-'}</td>
                <td className="px-4 py-3 text-sm">{p.no_telp || '-'}</td>
                <td className="px-4 py-3 text-sm flex gap-1">
                  <button
                    onClick={() => onEdit(p)}
                    className="w-8 h-8 bg-yellow-500 text-white rounded flex items-center justify-center hover:bg-yellow-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="px-6 py-3 bg-gray-50 flex items-center justify-between border-t">
        <div className="flex items-center space-x-2">
          <label htmlFor="entries" className="text-sm text-gray-700">Entri per halaman</label>
          <select
            id="entries"
            value={entriesPerPage}
            onChange={onEntriesChange}
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
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-2 py-1 text-sm border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
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