import { numberToWords } from './numberToWords';

export function renderSuratTemplate(template, formData, dynamicFields, items, user, profil) {
  if (!template) return '';

  let newContent = template;

  // === HEADER ===
    const baseUrl = process.env.REACT_APP_API_URL.replace('/api', ''); 
    const logoUrl = user?.logo ? `${baseUrl}/uploads/${user.logo}` : '';
    const logo = user?.logo
    ? `<img src="${logoUrl}" alt="Logo" 
        style="max-width:310px; max-height:155px; object-fit:contain; margin-left:auto;">`
    : '';
    const headerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 4px solid black; padding-bottom: 10px; margin-bottom: 20px;">
        <div>
        <h1 style="margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">${user?.nama || ''}</h1>
        <p style="margin: 5px 0; font-size: 12px;">${user?.alamat || ''}</p>
        <p style="margin: 5px 0; font-size: 12px;">Telp: ${user?.no_telp || ''} | Email: ${user?.email || ''}</p>
    </div>
        ${logo ? `<div style="text-align:right;">${logo}</div>` : ''}
    </div>
    `;


const qrCodeHTML = formData.qrcode_base64
  ? `<div style="width:100%; text-align:right; margin:10px 0;">
       <img src="${formData.qrcode_base64}" alt="QR Code" style="width: 80px; height: 80px;">
     </div>`
  : `<div style="width:100%; text-align:right; margin:10px 0;">
       <div style="width: 80px; height: 80px; border: 1px solid #ccc; font-size: 10px; 
                   display: flex; align-items: center; justify-content: center; color: #888;">
         QR Placeholder
       </div>
     </div>`;

  const selectedProfil = profil.find(p => p.id === Number(formData.profil_id));
  const nomorSurat = formData.no_surat || '.../.../.../...';
  const tanggalFormatted = formData.tanggal
    ? new Date(formData.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '[Tanggal Surat]';

  // === REPLACE UMUM ===
  newContent = newContent
    .replace('{{kop_surat}}', headerHTML)
    .replace('{{qrcode}}', qrCodeHTML)
    .replace(/{{tanggal_surat}}/g, tanggalFormatted)
    .replace(/{{nama_penerima}}/g, selectedProfil?.nama || '[Nama Penerima]')
    .replace(/{{jabatan_penerima}}/g, selectedProfil?.jabatan || '[Jabatan]')
    .replace(/{{nomor_surat}}/g, nomorSurat)
    .replace(/{{nama_penandatangan}}/g, dynamicFields.nama_penandatangan || '[Nama Penandatangan]')
    .replace(/{{jabatan_penandatangan}}/g, dynamicFields.jabatan_penandatangan || '[Jabatan Anda]')
    .replace(/{{nama_user}}/g, user?.nama || '[Nama Perusahaan]');

  // === KHUSUS SP (Surat Penawaran) ===
  if (formData.kategori_kode === 'SP') {
    const subTotal = items.reduce((sum, item) => sum + (Number(item.volume) || 0) * (Number(item.harga_satuan) || 0), 0);
    const ppn = Math.max(0, Number(dynamicFields.ppn_persen) || 0);
    const pph = Math.max(0, Number(dynamicFields.pph_persen) || 0);
    const ppnAmount = subTotal * (ppn / 100);
    const pphAmount = subTotal * (pph / 100);
    const grandTotal = subTotal + ppnAmount - pphAmount;

    const tableRows = items.map((item, index) => `
      <tr>
        <td style="border:2px solid #000;text-align:center;color:black">${index + 1}</td>
        <td style="border:2px solid #000;text-align:center;color:black">${item.deskripsi}</td>
        <td style="border:2px solid #000;text-align:center;color:black">${item.merek}</td>
        <td style="border:2px solid #000;text-align:center;color:black">${item.tipe}</td>
        <td style="border:2px solid #000;text-align:center;color:black">${item.volume}</td>
        <td style="border:2px solid #000;text-align:center;color:black">Rp ${Number(item.harga_satuan).toLocaleString('id-ID')}</td>
        <td style="border:2px solid #000;text-align:left;color:black">Rp ${(item.volume * item.harga_satuan).toLocaleString('id-ID')}</td>
      </tr>
    `).join('');

    const tableHTML = `
      <table style="width:100%;border:2px solid #000;font-size:12px">
        <thead>
          <tr style="background:#f2f2f2">
            <th style="border:2px solid #000;">No</th>
            <th style="border:2px solid #000;">Deskripsi</th>
            <th style="border:2px solid #000;">Merek</th>
            <th style="border:2px solid #000;">Tipe</th>
            <th style="border:2px solid #000;">Volume</th>
            <th style="border:2px solid #000;">Harga Satuan</th>
            <th style="border:2px solid #000;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${items.length ? tableRows : `<tr><td colspan="7" style="text-align:center"><i>Belum ada item</i></td></tr>`}
          <tr><td colspan="6" style="border:2px solid #000;text-align:center"><b>Sub Total</b></td><td style="border:2px solid #000;text-align:left">Rp ${subTotal.toLocaleString('id-ID')}</td></tr>
          <tr><td colspan="6" style="border:2px solid #000;text-align:center"><b>PPN ${ppn}%</b></td><td style="border:2px solid #000;text-align:left">Rp ${ppnAmount.toLocaleString('id-ID')}</td></tr>
          <tr><td colspan="6" style="border:2px solid #000;text-align:center"><b>PPh ${pph}%</b></td><td style="border:2px solid #000;text-align:left">Rp ${pphAmount.toLocaleString('id-ID')}</td></tr>
          <tr><td colspan="6" style="border:2px solid #000;text-align:center"><b>Grand Total</b></td><td style="border:2px solid #000;text-align:left">Rp ${grandTotal.toLocaleString('id-ID')}</td></tr>
        </tbody>
      </table>
    `;

    const ketPajak = `Penawaran sudah termasuk PPN ${ppn}% dan PPh ${pph}%`;
    const ketMasaBerlaku = `Masa berlaku penawaran ${dynamicFields.masa_berlaku || '14'} hari.`;

    newContent = newContent
      .replace('{{tabel_penawaran}}', tableHTML)
      .replace(/{{jenis_pekerjaan}}/g, dynamicFields.jenis_pekerjaan || '[Jenis Pekerjaan]')
      .replace('{{keterangan_pajak}}', ketPajak)
      .replace('{{ket_masa_berlaku}}', ketMasaBerlaku);
  }

  // === KHUSUS PP (Permintaan Pembayaran) ===
  if (formData.kategori_kode === 'PP') {
    const jumlah = Number(dynamicFields.jumlah_tagihan) || 0;

    newContent = newContent
      .replace(/{{nama_pekerjaan}}/g, dynamicFields.nama_pekerjaan || '[Nama Pekerjaan]')
      .replace(/{{detail_pekerjaan}}/g, dynamicFields.detail_pekerjaan || '[Detail Pekerjaan]')
      .replace(/{{nomor_sp}}/g, dynamicFields.nomor_sp || '[Nomor SP]')
      .replace(/{{tanggal_sp}}/g, dynamicFields.tanggal_sp ? new Date(dynamicFields.tanggal_sp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Tanggal SP]')
      .replace(/{{nomor_bast}}/g, dynamicFields.nomor_bast || '[Nomor BAST]')
      .replace(/{{tanggal_bast}}/g, dynamicFields.tanggal_bast ? new Date(dynamicFields.tanggal_bast).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Tanggal BAST]')
      .replace(/{{jumlah_tagihan}}/g, jumlah.toLocaleString('id-ID'))
      .replace(/{{terbilang_tagihan}}/g, jumlah > 0 ? numberToWords(jumlah) : 'Nol Rupiah')
      .replace(/{{nama_bank}}/g, dynamicFields.nama_bank || '[Nama Bank]')
      .replace(/{{nama_pemilik}}/g, dynamicFields.nama_pemilik || '[Nama Pemilik]')
      .replace(/{{nomor_rekening}}/g, dynamicFields.nomor_rekening || '[Nomor Rekening]');
  }

  return newContent;
}
