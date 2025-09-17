import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { renderBastTemplate } from '../utils/renderBastTemplate';

function BastForm({ initialData, onSubmit, onCancel, isEditing, kategori = [], user }) {
    const [formData, setFormData] = useState(initialData);
    const [dynamicFields, setDynamicFields] = useState(initialData.meta_data?.dynamicFields || {});
    const [items, setItems] = useState(initialData.meta_data?.items || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState({ produk: '', deskripsi: '', qty: 1, harga_per_unit: '', kondisi: 'Baik' });
    const [originalTemplate, setOriginalTemplate] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleDynamicChange = (e) => setDynamicFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleItemFormChange = (e) => setCurrentItem(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSaveItem = () => {
        if (!currentItem.produk || !currentItem.deskripsi) {
            alert('Nama produk dan deskripsi wajib diisi.');
            return;
        }
        setItems([...items, currentItem]);
        setCurrentItem({ produk: '', deskripsi: '', qty: 1, harga_per_unit: '', kondisi: 'Baik' });
        setIsModalOpen(false);
    };

    const handleRemoveItem = (indexToRemove) => setItems(items.filter((_, index) => index !== indexToRemove));

    useEffect(() => {
        const bastKategori = kategori.find(k => k.kode === 'BAST');
        if (bastKategori) {
            setOriginalTemplate(bastKategori.template || '');
            if (!isEditing && !formData.perihal) {
                setFormData(prev => ({ ...prev, perihal: 'Permohonan Pembayaran' }));
            }
        }
    }, [kategori, isEditing, formData.perihal]);

    useEffect(() => {
        if (!originalTemplate) return;
        const newContent = renderBastTemplate(originalTemplate, formData, dynamicFields, items, user);
        if (newContent !== formData.isi) {
            setFormData(prev => ({ ...prev, isi: newContent }));
        }
    }, [originalTemplate, formData, dynamicFields, items, user]);

    useEffect(() => {
        setFormData(initialData);
        setDynamicFields(initialData.meta_data?.dynamicFields || {});
        setItems(initialData.meta_data?.items || []);
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.tanggal || !formData.perihal || !dynamicFields.nama_pihak_kedua) {
            alert('Tanggal, Perihal, dan Nama Pihak Kedua wajib diisi.');
            return;
        }
        const dataToSend = { ...formData, meta_data: { dynamicFields, items } };
        onSubmit(dataToSend);
    };

    const modules = useMemo(() => ({ toolbar: [['bold', 'italic'], [{'list': 'ordered'}, {'list': 'bullet'}]] }), []);

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col max-h-[95vh]">
                    <h3 className="text-xl font-bold p-6 pb-4 flex-shrink-0">{isEditing ? 'Edit BAST' : 'Tambah BAST'}</h3>
                    <div className="flex-grow overflow-y-auto px-6 pb-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Tanggal BAST</label>
                                    <input id="tanggal" name="tanggal" type="date" value={formData.tanggal || ''} onChange={handleChange} required className="mt-1 w-full border p-2 rounded-md shadow-sm"/>
                                </div>
                                {/* ✨ BARU: Input untuk Perihal */}
                                <div>
                                    <label htmlFor="perihal" className="block text-sm font-medium text-gray-700">Perihal</label>
                                    <input id="perihal" name="perihal" type="text" value={formData.perihal || ''} onChange={handleChange} required className="mt-1 w-full border p-2 rounded-md shadow-sm"/>
                                </div>
                            </div>
                            <div className="p-4 border-l-4 border-gray-300 bg-gray-50 my-4 rounded-r-lg space-y-4">
                               <h4 className="font-bold text-gray-800 mb-2">Pihak Terlibat</h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <input name="nama_pihak_pertama" value={dynamicFields.nama_pihak_pertama || ''} onChange={handleDynamicChange} placeholder="Nama Pihak Pertama (Anda)" className="border p-2 rounded-md" />
                                  <input name="jabatan_pihak_pertama" value={dynamicFields.jabatan_pihak_pertama || ''} onChange={handleDynamicChange} placeholder="Jabatan Pihak Pertama (Anda)" className="border p-2 rounded-md" />
                                  <input name="nama_pihak_kedua" value={dynamicFields.nama_pihak_kedua || ''} onChange={handleDynamicChange} placeholder="Nama Pihak Kedua" className="border p-2 rounded-md" />
                                  <input name="jabatan_pihak_kedua" value={dynamicFields.jabatan_pihak_kedua || ''} onChange={handleDynamicChange} placeholder="Jabatan Pihak Kedua" className="border p-2 rounded-md" />
                                  <input name="nip_pihak_kedua" value={dynamicFields.nip_pihak_kedua || ''} onChange={handleDynamicChange} placeholder="NIP Pihak Kedua (Opsional)" className="border p-2 rounded-md" />
                                  <input name="alamat_pihak_kedua" value={dynamicFields.alamat_pihak_kedua || ''} onChange={handleDynamicChange} placeholder="Alamat Pihak Kedua" className="border p-2 rounded-md" />
                               </div>
                            </div>
                            <div className="p-4 border-l-4 border-blue-300 bg-blue-50 my-4 rounded-r-lg space-y-4">
                                <h4 className="font-bold text-gray-800 mb-2">Detail Produk/Jasa</h4>
                                <div><button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Tambah Produk</button></div>
                                <div className="space-y-2 mt-2">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-blue-100 rounded">
                                            <span className="font-semibold">{index + 1}.</span>
                                            <span className="flex-grow">{item.produk} (Qty: {item.qty})</span>
                                            <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 font-bold hover:text-red-700">X</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preview Dokumen</label>
                                <ReactQuill theme="snow" value={formData.isi || ''} readOnly={true} modules={{ toolbar: false }} className="mt-1 bg-gray-100"/>
                            </div>
                            <div className="flex justify-end pt-4 gap-2 border-t mt-4">
                                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{isEditing ? 'Simpan Perubahan' : 'Buat Dokumen'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
                        <h3 className="text-xl font-bold">Tambah Detail Produk/Jasa</h3>
                        <input name="produk" value={currentItem.produk} onChange={handleItemFormChange} placeholder="Produk (e.g., Service dan Maintenance)" className="w-full border p-2 rounded" />
                        <input name="deskripsi" value={currentItem.deskripsi} onChange={handleItemFormChange} placeholder="Deskripsi (e.g., Printer Epson L4150)" className="w-full border p-2 rounded" />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="qty" type="number" min="1" value={currentItem.qty} onChange={handleItemFormChange} placeholder="Qty" className="w-full border p-2 rounded" />
                            <input name="harga_per_unit" type="number" min="0" value={currentItem.harga_per_unit} onChange={handleItemFormChange} placeholder="Harga per Unit" className="w-full border p-2 rounded" />
                        </div>
                        <input name="kondisi" value={currentItem.kondisi} onChange={handleItemFormChange} placeholder="Kondisi Barang" className="w-full border p-2 rounded" />
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
export default BastForm;