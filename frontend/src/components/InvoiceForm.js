// frontend/src/components/InvoiceForm.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { renderInvoiceTemplate } from '../utils/renderInvoiceTemplate';

function InvoiceForm({ initialData, onSubmit, onCancel, isEditing, profil = [], kategori = [], user }) {
  const [formData, setFormData] = useState(initialData);
  const [dynamicFields, setDynamicFields] = useState(initialData.meta_data?.dynamicFields || {});
  const [items, setItems] = useState(initialData.meta_data?.items || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ✅ KOREKSI: Menyesuaikan state item
  const [currentItem, setCurrentItem] = useState({ produk: '', deskripsi: '', qty: 1, harga: '' });
  const [originalTemplate, setOriginalTemplate] = useState('');

  useEffect(() => {
      // Hanya jalankan saat membuat invoice baru (bukan saat mengedit)
      if (!isEditing && user?.npwp) {
          setDynamicFields(prevFields => ({
              ...prevFields,
              npwp: user.npwp // Ambil NPWP dari prop 'user'
          }));
      }
  }, [isEditing, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDynamicChange = (e) => {
    setDynamicFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemFormChange = (e) => {
    setCurrentItem(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveItem = () => {
    if (!currentItem.produk || !currentItem.harga) {
      alert('Nama produk dan harga wajib diisi.');
      return;
    }
    setItems([...items, currentItem]);
    setCurrentItem({ produk: '', deskripsi: '', qty: 1, harga: '' });
    setIsModalOpen(false);
  };

  const handleRemoveItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  // Efek untuk mengambil template
  useEffect(() => {
    const invKategori = kategori.find(k => k.kode === 'INV');
    if (invKategori) {
      setOriginalTemplate(invKategori.template || '');
    }
  }, [kategori]);

  // Efek untuk render preview
  useEffect(() => {
    if (!originalTemplate) return;
    const newContent = renderInvoiceTemplate(originalTemplate, formData, dynamicFields, items, user, profil);
    if (newContent !== formData.isi) {
      setFormData(prev => ({ ...prev, isi: newContent }));
    }
  }, [originalTemplate, formData.profil_id, formData.tanggal, dynamicFields, items, user, profil, formData.isi]);

  // Efek untuk reset form
  useEffect(() => {
    setFormData(initialData);
    setDynamicFields(initialData.meta_data?.dynamicFields || {});
    setItems(initialData.meta_data?.items || []);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.profil_id || !formData.tanggal) {
      alert('Tujuan dan Tanggal wajib diisi.');
      return;
    }
    const dataToSend = { ...formData, meta_data: { dynamicFields, items } };
    onSubmit(dataToSend);
  };

  const modules = useMemo(() => ({ toolbar: [['bold', 'italic'],[{'list': 'ordered'}, {'list': 'bullet'}]] }), []);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col max-h-[95vh]">
          <h3 className="text-xl font-bold p-6 pb-4 flex-shrink-0">{isEditing ? 'Edit Invoice' : 'Tambah Invoice'}</h3>
          <div className="flex-grow overflow-y-auto px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- BAGIAN DATA UTAMA --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Tanggal Invoice</label>
                  <input id="tanggal" name="tanggal" type="date" value={formData.tanggal || ''} onChange={handleChange} required className="mt-1 w-full border p-2 rounded-md shadow-sm"/>
                </div>
                <div>
                  <label htmlFor="profil_id" className="block text-sm font-medium text-gray-700">Tujuan (Profil)</label>
                  <select id="profil_id" name="profil_id" value={formData.profil_id || ''} onChange={handleChange} required className="mt-1 w-full border p-2 rounded-md shadow-sm">
                    <option value="">-- Pilih Profil Tujuan --</option>
                    {profil.map(p => (<option key={p.id} value={p.id}>{p.nama}</option>))}
                  </select>
                </div>
              </div>

              {/* --- BAGIAN DETAIL INVOICE & PAJAK --- */}
              <div className="p-4 border-l-4 border-gray-300 bg-gray-50 my-4 rounded-r-lg space-y-4">
                <h4 className="font-bold text-gray-800">Detail Invoice</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="tanggal_jatuh_tempo" type="date" value={dynamicFields.tanggal_jatuh_tempo || ''} onChange={handleDynamicChange} placeholder="Tgl Jatuh Tempo" className="border p-2 rounded-md"/>
                                    <input 
                                        name="npwp" 
                                        value={dynamicFields.npwp || ''} 
                                        onChange={handleDynamicChange} 
                                        placeholder="NPWP (Otomatis dari profil user)" 
                                        className="border p-2 rounded-md bg-gray-200" 
                                        readOnly 
                                        title="NPWP diisi otomatis dari data profil Anda"
                                    />
                    <input name="nama_penandatangan" value={dynamicFields.nama_penandatangan || ''} onChange={handleDynamicChange} placeholder="Nama Penandatangan" className="border p-2 rounded-md"/>
                    <input name="kota_surat" value={dynamicFields.kota_surat || ''} onChange={handleDynamicChange} placeholder="Kota Penerbitan" className="border p-2 rounded-md"/>
                </div>
              </div>

              {/* --- BAGIAN ITEM & KALKULASI --- */}
              <div className="p-4 border-l-4 border-blue-300 bg-blue-50 my-4 rounded-r-lg space-y-4">
                  <h4 className="font-bold text-gray-800">Item & Kalkulasi</h4>
                  <button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Tambah Item</button>
                  <div className="space-y-2 mt-2">
                      {items.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-blue-100 rounded">
                              <span className="font-semibold">{index + 1}.</span>
                              <span className="flex-grow">{item.produk} (Qty: {item.qty})</span>
                              <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 font-bold">X</button>
                          </div>
                      ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
                      <input name="ppn_persen" type="number" value={dynamicFields.ppn_persen || ''} onChange={handleDynamicChange} placeholder="PPN (%)" className="border p-2 rounded-md"/>
                      <input name="pph_persen" type="number" value={dynamicFields.pph_persen || ''} onChange={handleDynamicChange} placeholder="PPh (%)" className="border p-2 rounded-md"/>
                      <input name="pembulatan" type="number" value={dynamicFields.pembulatan || ''} onChange={handleDynamicChange} placeholder="Pembulatan" className="border p-2 rounded-md"/>
                      <input name="lunas" type="number" value={dynamicFields.lunas || ''} onChange={handleDynamicChange} placeholder="Sudah Dibayar" className="border p-2 rounded-md"/>
                  </div>
              </div>
              
              {/* --- PREVIEW --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Preview Invoice</label>
                <ReactQuill theme="snow" value={formData.isi || ''} onChange={(content) => setFormData(prev => ({ ...prev, isi: content }))} modules={modules} className="mt-1"/>
              </div>

              <div className="flex justify-end pt-4 gap-2 border-t mt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{isEditing ? 'Simpan Perubahan' : 'Buat Invoice'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
            <h3 className="text-xl font-bold">Tambah Item Invoice</h3>
            <input name="produk" value={currentItem.produk} onChange={handleItemFormChange} placeholder="Nama Produk/Jasa" className="w-full border p-2 rounded"/>
            <input name="deskripsi" value={currentItem.deskripsi} onChange={handleItemFormChange} placeholder="Deskripsi (Opsional)" className="w-full border p-2 rounded"/>
            <div className="grid grid-cols-2 gap-4">
                <input name="qty" type="number" min="1" value={currentItem.qty} onChange={handleItemFormChange} placeholder="Qty" className="w-full border p-2 rounded"/>
                <input name="harga" type="number" min="0" value={currentItem.harga} onChange={handleItemFormChange} placeholder="Harga Satuan" className="w-full border p-2 rounded"/>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded">Batal</button>
              <button type="button" onClick={handleSaveItem} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan Item</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InvoiceForm;