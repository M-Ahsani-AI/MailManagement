// frontend/src/utils/renderKwitansiTemplate.js
import { numberToWords } from './numberToWords';

export function renderKwitansiTemplate(template, formData, dynamicFields, user, profil) {
  if (!template || !user) return '';

  let newContent = template;
  const baseUrl = process.env.REACT_APP_API_URL.replace('/api', '');
  const logoUrl = user?.logo ? `${baseUrl}/uploads/${user.logo}` : '';
  const logo = user?.logo
    ? `<img src="${logoUrl}" alt="Logo" style="height: 90px; width: auto; max-width: 200px; object-fit: contain;">`
    : '';

  // ✅ KOREKSI: Membuat kop surat inti tanpa tabel pembungkus
  const kopSuratIntiHTML = `
    <div style="display: flex; align-items: flex-start;">
        ${logo ? `<div style="margin-right: 15px;">${logo}</div>` : ''}
        <div>
            <h1 style="margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase;">${user?.nama || ''}</h1>
            <p style="margin: 2px 0; font-size: 12px;">${user?.alamat || ''}</p>
            <p style="margin: 2px 0; font-size: 12px;">Telp: ${user?.no_telp || ''} | Email: ${user?.email || ''}</p>
        </div>
    </div>
  `;

  const qrCodeHTML = formData.qrcode_base64
    ? `<img src="${formData.qrcode_base64}" alt="QR Code" style="width: 80px; height: 80px;">`
    : '';

  const selectedProfil = profil.find(p => p.id === Number(formData.profil_id));
  const jumlah = dynamicFields.jumlah ?? formData.jumlah ?? 0;
  const untuk_pembayaran = dynamicFields.untuk_pembayaran ?? formData.untuk ?? '[Tujuan Pembayaran]';
  const terbilangValue = dynamicFields.terbilang ?? formData.terbilang ?? numberToWords(jumlah);

  const tanggalFormatted = formData.tanggal
    ? new Date(formData.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '[Tanggal]';

  newContent = newContent
    // ✅ KOREKSI: Menggunakan placeholder baru
    .replace('{{kop_surat_inti}}', kopSuratIntiHTML)
    .replace('{{qrcode}}', qrCodeHTML)
    .replace(/{{nomor_kwitansi}}/g, formData.no_kwitansi || '001/KWT/XX/IX/2025')
    .replace(/{{nama_penerima}}/g, selectedProfil?.nama || '[Nama Penerima]')
    .replace(/{{terbilang}}/g, terbilangValue || 'Nol')
    .replace(/{{untuk_pembayaran}}/g, untuk_pembayaran)
    .replace(/{{jumlah_rupiah}}/g, Number(jumlah).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(",00", ",-"))
    .replace(/{{tanggal_kwitansi}}/g, tanggalFormatted)
    .replace(/{{nama_perusahaan}}/g, user?.nama || '[Nama Perusahaan]')
    .replace(/{{nama_penandatangan}}/g, dynamicFields.nama_penandatangan || user?.nama || '[Nama Penandatangan]');
    
  return newContent;
}   