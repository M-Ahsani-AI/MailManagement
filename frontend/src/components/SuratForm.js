import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
//import { numberToWords } from '../utils/numberToWords';
import { renderSuratTemplate } from '../utils/renderSuratTemplate';


function SuratForm({ initialData, onSubmit, onCancel, isEditing, profil = [], kategori = [], bankList = [], user }) {
  // === STATE MANAGEMENT ===
  const [formData, setFormData] = useState(initialData);
  const [dynamicFields, setDynamicFields] = useState(initialData.meta_data?.dynamicFields || {});
  const [items, setItems] = useState(initialData.meta_data?.items || []);
  const [originalTemplate, setOriginalTemplate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ deskripsi: '', tipe: '', merek: '', volume: 1, harga_satuan: '' });

  // === HANDLER & FUNGSI BANTU ===

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDynamicChange = (e) => {
    const { name, value } = e.target;
    if (name === 'ppn_persen' || name === 'pph_persen') {
      setDynamicFields(prev => ({ ...prev, [name]: value.replace(',', '.') }));
    } else {
      setDynamicFields(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBankChange = (e) => {
    const selectedBankId = e.target.value;
    const selectedBank = bankList.find(bank => bank.id === Number(selectedBankId));
    if (selectedBank) {
      setDynamicFields(prev => ({
        ...prev,
        bank_id: selectedBank.id,
        nama_bank: selectedBank.nama_bank,
        nomor_rekening: selectedBank.nomor_rekening,
        nama_pemilik: selectedBank.nama_pemilik,
      }));
    } else {
      setDynamicFields(prev => ({ ...prev, bank_id: '', nama_bank: '', nomor_rekening: '', nama_pemilik: '' }));
    }
  };
  
  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveItem = () => {
    setItems([...items, currentItem]);
    setCurrentItem({ deskripsi: '', tipe: '', merek: '', volume: 1, harga_satuan: '' });
    setIsModalOpen(false);
  };
  
  const handleRemoveItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };
  
  const generateOfferTable = useCallback(() => {
    const subTotal = items.reduce((sum, item) => sum + (Number(item.volume) || 0) * (Number(item.harga_satuan) || 0), 0);
    const ppn = Math.max(0, Number(dynamicFields.ppn_persen) || 0);
    const pph = Math.max(0, Number(dynamicFields.pph_persen) || 0);
    const ppnAmount = subTotal * (ppn / 100);
    const pphAmount = subTotal * (pph / 100);
    const grandTotal = subTotal + ppnAmount - pphAmount;

    const tableRows = items.map((item, index) => `
      <tr>
        <td style="border: 1px solid #dddddd; text-align: center; padding: 8px;">${index + 1}</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${item.deskripsi || ''}</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${item.tipe || ''}</td>
        <td style="border: 1px solid #dddddd; padding: 8px;">${item.merek || ''}</td>
        <td style="border: 1px solid #dddddd; text-align: center; padding: 8px;">${Number(item.volume) || 0}</td>
        <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;">${(Number(item.harga_satuan) || 0).toLocaleString('id-ID')}</td>
        <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;">${((Number(item.volume) || 0) * (Number(item.harga_satuan) || 0)).toLocaleString('id-ID')}</td>
      </tr>
    `).join('');

    const tableHTML = `
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #dddddd; text-align: center; padding: 8px;">No</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Deskripsi</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Merek</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Tipe</th>
            <th style="border: 1px solid #dddddd; text-align: center; padding: 8px;">Volume</th>
            <th style="border: 1px solid #dddddd; text-align: right; padding: 8px;">Harga Satuan</th>
            <th style="border: 1px solid #dddddd; text-align: right; padding: 8px;">Total Harga</th>
          </tr>
        </thead>
        <tbody>
          ${items.length > 0 ? tableRows : `<tr><td colspan="7" style="text-align: center; padding: 8px;"><i>Belum ada item ditambahkan.</i></td></tr>`}
          <tr><td colspan="6" style="border: 1px solid #dddddd; text-align: right; padding: 8px;"><strong>Sub Total</strong></td><td style="border: 1px solid #dddddd; text-align: right; padding: 8px;"><strong>${subTotal.toLocaleString('id-ID')}</strong></td></tr>
          <tr><td colspan="6" style="border: 1px solid #dddddd; text-align: right; padding: 8px;"><strong>PPN ${ppn}%</strong></td><td style="border: 1px solid #dddddd; text-align: right; padding: 8px;"><strong>${ppnAmount.toLocaleString('id-ID')}</strong></td></tr>
          <tr><td colspan="6" style="border: 1px solid #dddddd; text-align: right; padding: 8px;"><strong>PPh ${pph}%</strong></td><td style="border: 1px solid #dddddd; text-align: right; padding: 8px;"><strong>(${pphAmount.toLocaleString('id-ID')})</strong></td></tr>
          <tr><td colspan="6" style="border: 1px solid #dddddd; text-align: right; padding: 8px; background-color: #f2f2f2;"><strong>Grand Total</strong></td><td style="border: 1px solid #dddddd; text-align: right; padding: 8px; background-color: #f2f2f2;"><strong>${grandTotal.toLocaleString('id-ID')}</strong></td></tr>
        </tbody>
      </table>`;
    return { tableHTML };
  }, [items, dynamicFields]);

  const generateHeaderHTML = useCallback(() => {
    if (!user) return '';
    const logoUrl = user.logo ? `${process.env.REACT_APP_API_URL}/uploads/${user.logo}` : '';
    const logo = user.logo ? `<img src="${logoUrl}" alt="Logo" style="width: auto; height: 60px;">` : '';
    const address = user.alamat || '';
    const contact = `Telp: ${user.no_telp || ''} | Email: ${user.email || ''}`;

    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 4px solid black; padding-bottom: 10px; margin-bottom: 20px; font-family: sans-serif;">
        <div style="text-align: left;">
          <h1 style="margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">${user.nama || ''}</h1>
          <p style="margin: 5px 0; font-size: 12px;">${address}</p>
          <p style="margin: 5px 0; font-size: 12px;">${contact}</p>
        </div>
        <div style="text-align: right;">
          ${logo}
        </div>
      </div>
    `;
  }, [user]);

  useEffect(() => {
    if (!originalTemplate) return;
    const newContent = renderSuratTemplate(originalTemplate, formData, dynamicFields, items, user, profil);
    if (newContent !== formData.isi) {
      setFormData(prev => ({ ...prev, isi: newContent }));
    }
  }, [originalTemplate, formData, dynamicFields, items, user, profil]);
  
  useEffect(() => {
    const selectedKategori = kategori.find(k => k.kode === formData.kategori_kode);
    setOriginalTemplate(selectedKategori?.template || '');
  }, [formData.kategori_kode, kategori]);
  
  useEffect(() => {
    setFormData(initialData);
    setDynamicFields(initialData.meta_data?.dynamicFields || {});
    setItems(initialData.meta_data?.items || []);
    const selectedKategori = kategori.find(k => k.kode === initialData.kategori_kode);
    setOriginalTemplate(selectedKategori?.template || '');
  }, [initialData, kategori]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.profil_id || !formData.kategori_kode || !formData.tanggal) {
      alert('Tujuan, Kategori, dan Tanggal wajib diisi.');
      return;
    }
    const dataToSend = { ...formData, meta_data: { dynamicFields, items } };
    onSubmit(dataToSend);
  };
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'table'],
    ],
  }), []);

  // === RENDER JSX ===
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col max-h-[95vh]">
          <h3 className="text-xl font-bold p-6 pb-4 flex-shrink-0">{isEditing ? 'Edit Surat' : 'Tambah Surat'}</h3>
          <div className="flex-grow overflow-y-auto px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input id="tanggal" name="tanggal" type="date" value={formData.tanggal || ''} onChange={handleChange} required className="mt-1 w-full border p-2 rounded-md" />
                <select id="profil_id" name="profil_id" value={formData.profil_id || ''} onChange={handleChange} required className="mt-1 w-full border p-2 rounded-md">
                  <option value="">-- Pilih Profil Tujuan --</option>
                  {profil.map(p => (<option key={p.id} value={p.id}>{p.nama}</option>))}
                </select>
                <div className="md:col-span-2">
                  <select id="kategori_kode" name="kategori_kode" value={formData.kategori_kode || ''} onChange={handleChange} required disabled={isEditing} className="mt-1 w-full border p-2 rounded-md">
                    <option value="">-- Pilih Kategori Surat --</option>
                    {kategori.map(k => (<option key={k.kode} value={k.kode}>{k.nama_kategori} ({k.kode})</option>))}
                  </select>
                </div>
              </div>

              {formData.kategori_kode && (
                <div className="p-4 border-l-4 border-gray-300 bg-gray-50 my-4 rounded-r-lg space-y-4">
                  <h4 className="font-bold text-gray-800 mb-2">Detail Tambahan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="nama_penandatangan" value={dynamicFields.nama_penandatangan || ''} onChange={handleDynamicChange} placeholder="Nama Penandatangan" className="border p-2 rounded" />
                    <input name="jabatan_penandatangan" value={dynamicFields.jabatan_penandatangan || ''} onChange={handleDynamicChange} placeholder="Jabatan Penandatangan" className="border p-2 rounded" />
                  </div>

                  {formData.kategori_kode === 'SP' && (<>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                      <input name="jenis_pekerjaan" value={dynamicFields.jenis_pekerjaan || ''} onChange={handleDynamicChange} placeholder="Jenis Pekerjaan/Produk" className="border p-2 rounded" />
                      <input name="masa_berlaku" type="number" value={dynamicFields.masa_berlaku || '14'} onChange={handleDynamicChange} placeholder="Masa Berlaku (hari)" className="border p-2 rounded" />
                      <div className="flex items-center gap-2"><input name="ppn_persen" type="number" step="any" min="0" value={dynamicFields.ppn_persen || ''} onChange={handleDynamicChange} className="border p-2 rounded w-full" placeholder="PPN"/><span>%</span></div>
                      <div className="flex items-center gap-2"><input name="pph_persen" type="number" step="any" min="0" value={dynamicFields.pph_persen || ''} onChange={handleDynamicChange} className="border p-2 rounded w-full" placeholder="PPh"/><span>%</span></div>
                    </div>
                    <div><button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Tambah Item Penawaran</button></div>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-blue-100 rounded">
                          <span className="font-semibold">{index + 1}.</span>
                          <span className="flex-grow">{item.deskripsi} ({item.merek} / {item.tipe})</span>
                          <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 font-bold hover:text-red-700">X</button>
                        </div>
                      ))}
                    </div>
                  </>)}
                  
                  {formData.kategori_kode === 'PP' && (<>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                      <input name="nama_pekerjaan" value={dynamicFields.nama_pekerjaan || ''} onChange={handleDynamicChange} placeholder="Nama Pekerjaan" className="border p-2 rounded-md" />
                      <input name="detail_pekerjaan" value={dynamicFields.detail_pekerjaan || ''} onChange={handleDynamicChange} placeholder="Detail Pekerjaan" className="border p-2 rounded-md" />
                      <input name="jumlah_tagihan" type="number" value={dynamicFields.jumlah_tagihan || ''} onChange={handleDynamicChange} placeholder="Jumlah Tagihan (Rp)" className="border p-2 rounded-md" />
                      <input name="nomor_sp" value={dynamicFields.nomor_sp || ''} onChange={handleDynamicChange} placeholder="Nomor SP" className="border p-2 rounded-md" />
                      <input name="tanggal_sp" type="date" value={dynamicFields.tanggal_sp || ''} onChange={handleDynamicChange} className="border p-2 rounded-md" />
                      <input name="nomor_bast" value={dynamicFields.nomor_bast || ''} onChange={handleDynamicChange} placeholder="Nomor BAST" className="border p-2 rounded-md" />
                      <input name="tanggal_bast" type="date" value={dynamicFields.tanggal_bast || ''} onChange={handleDynamicChange} className="border p-2 rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                      <select name="bank_id" value={dynamicFields.bank_id || ''} onChange={handleBankChange} className="border p-2 rounded-md">
                        <option value="">-- Pilih Bank Tersimpan --</option>
                        {bankList.map(bank => (
                          <option key={bank.id} value={bank.id}>
                            {`${bank.nama_bank} - ${bank.nomor_rekening} (a/n ${bank.nama_pemilik})`}
                          </option>
                        ))}
                      </select>
                      <input name="nomor_rekening" value={dynamicFields.nomor_rekening || ''} onChange={handleDynamicChange} placeholder="Nomor Rekening" className="border p-2 rounded-md bg-gray-100" readOnly={!!dynamicFields.bank_id} />
                      <input name="nama_pemilik" value={dynamicFields.nama_pemilik || ''} onChange={handleDynamicChange} placeholder="Nama Pemilik" className="border p-2 rounded-md bg-gray-100" readOnly={!!dynamicFields.bank_id} />
                    </div>
                  </>)}
                </div>
              )}
              
              <ReactQuill theme="snow" value={formData.isi || ''} onChange={(content) => setFormData(prev => ({ ...prev, isi: content }))} modules={modules} className="mt-1" />
              <div className="flex justify-end pt-4 gap-2 border-t mt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{isEditing ? 'Simpan Perubahan' : 'Buat Surat'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
            <h3 className="text-xl font-bold">Tambah Item Penawaran</h3>
            <input name="deskripsi" value={currentItem.deskripsi} onChange={handleItemFormChange} placeholder="Deskripsi Item/Pekerjaan" className="w-full border p-2 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <input name="merek" value={currentItem.merek} onChange={handleItemFormChange} placeholder="Merek" className="w-full border p-2 rounded" />
              <input name="tipe" value={currentItem.tipe} onChange={handleItemFormChange} placeholder="Tipe" className="w-full border p-2 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="volume" type="number" min="1" value={currentItem.volume} onChange={handleItemFormChange} placeholder="Volume/Qty" className="w-full border p-2 rounded" />
              <input name="harga_satuan" type="number" min="0" value={currentItem.harga_satuan} onChange={handleItemFormChange} placeholder="Harga Satuan (Rp)" className="w-full border p-2 rounded" />
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

export default SuratForm;