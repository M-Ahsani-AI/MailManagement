// frontend/src/components/ProfilForm.js
import React from 'react';

function ProfilForm({ formData, setFormData, onSubmit, onCancel, isEditing }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!formData.nama || !formData.email) {
      alert('Nama dan email wajib diisi');
      return;
    }
    // Kirim data ke parent
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Profil' : 'Tambah Profil'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="nama"
            placeholder="Nama"
            value={formData.nama || ''}
            onChange={handleChange}
            required
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            name="alamat"
            placeholder="Alamat"
            value={formData.alamat || ''}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            name="no_telp"
            placeholder="No Telepon"
            value={formData.no_telp || ''}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email || ''}
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

export default ProfilForm;