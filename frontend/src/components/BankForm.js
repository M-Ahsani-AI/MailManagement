// src/components/BankForm.js
import React from 'react';

function BankForm({ formData, setFormData, onSubmit, onCancel, isEditing }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama_bank || !formData.nomor_rekening || !formData.nama_pemilik) {
      alert('Semua field wajib diisi');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Bank' : 'Tambah Bank'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="nama_bank"
            placeholder="Nama Bank"
            value={formData.nama_bank || ''}
            onChange={handleChange}
            required
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            name="nomor_rekening"
            placeholder="Nomor Rekening"
            value={formData.nomor_rekening || ''}
            onChange={handleChange}
            required
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            name="nama_pemilik"
            placeholder="Nama Pemilik"
            value={formData.nama_pemilik || ''}
            onChange={handleChange}
            required
            className="w-full border p-2 mb-2 rounded"
          />
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BankForm;