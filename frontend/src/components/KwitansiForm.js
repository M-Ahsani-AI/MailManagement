// frontend/src/components/KwitansiForm.js
import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { renderKwitansiTemplate } from '../utils/renderKwitansiTemplate';

function KwitansiForm({ initialData, onSubmit, onCancel, isEditing, profil = [], kategori = [], user }) {
  const [formData, setFormData] = useState(initialData);
  const [dynamicFields, setDynamicFields] = useState(initialData.meta_data?.dynamicFields || {});
  const [originalTemplate, setOriginalTemplate] = useState('');

  useEffect(() => {
    const kwitansiKategori = kategori.find(k => k.kode === 'KWT');
    if (kwitansiKategori) {
      setOriginalTemplate(kwitansiKategori.template || '');
    }
  }, [kategori]);

  useEffect(() => {
    if (!originalTemplate) return;
    const newContent = renderKwitansiTemplate(originalTemplate, formData, dynamicFields, user, profil);
    if (newContent !== formData.isi) {
      setFormData(prev => ({ ...prev, isi: newContent }));
    }
  }, [originalTemplate, formData, dynamicFields, user, profil]);

  useEffect(() => {
    setFormData(initialData);
    setDynamicFields(initialData.meta_data?.dynamicFields || {});
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDynamicChange = (e) => setDynamicFields(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.profil_id || !formData.tanggal || !dynamicFields.jumlah || !dynamicFields.untuk_pembayaran) {
      alert('Tujuan, Tanggal, Jumlah, dan Untuk Pembayaran wajib diisi.');
      return;
    }
    const dataToSend = { ...formData, meta_data: { dynamicFields } };
    onSubmit(dataToSend);
  };

  const modules = useMemo(() => ({ toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]] }), []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col max-h-[95vh]">
        <h3 className="text-xl font-bold p-6 pb-4 flex-shrink-0">{isEditing ? 'Edit Kwitansi' : 'Tambah Kwitansi'}</h3>
        <div className="flex-grow overflow-y-auto px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input id="tanggal" name="tanggal" type="date" value={formData.tanggal || ''} onChange={handleChange} required className="mt-1 w-full border p-2 rounded-md"/>
              <select id="profil_id" name="profil_id" value={formData.profil_id || ''} onChange={handleChange} required className="mt-1 w-full border p-2 rounded-md">
                <option value="">-- Pilih Profil Tujuan --</option>
                {profil.map(p => (<option key={p.id} value={p.id}>{p.nama}</option>))}
              </select>
            </div>

            <div className="p-4 border-l-4 border-gray-300 bg-gray-50 my-4 rounded-r-lg space-y-4">
              <input name="jumlah" type="number" value={dynamicFields.jumlah || ''} onChange={handleDynamicChange} placeholder="Jumlah (Rp)" className="border p-2 rounded-md w-full" required/>
              <textarea name="untuk_pembayaran" value={dynamicFields.untuk_pembayaran || ''} onChange={handleDynamicChange} placeholder="Untuk pembayaran..." className="border p-2 rounded-md w-full" rows="3" required/>
              <input name="nama_penandatangan" value={dynamicFields.nama_penandatangan || ''} onChange={handleDynamicChange} placeholder="Nama Penandatangan (otomatis nama Anda jika kosong)" className="border p-2 rounded-md w-full"/>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Preview</label>
              <ReactQuill theme="snow" value={formData.isi || ''} modules={modules} className="mt-1 bg-gray-50"/>
            </div>

            <div className="flex justify-end pt-4 gap-2 border-t mt-4">
              <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Batal</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{isEditing ? 'Simpan Perubahan' : 'Buat Kwitansi'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default KwitansiForm;