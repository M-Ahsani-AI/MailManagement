export function renderBastTemplate(template, formData, dynamicFields, items, user) {
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

    // QR Code
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

    // Tabel Produk
    const tableRows = items.map(item => {
        const totalHarga = (Number(item.qty) || 0) * (Number(item.harga_per_unit) || 0);
        const formatCurrency = (num) => `Rp ${Number(num || 0).toLocaleString('id-ID')}`;
        return `
            <tr>
                <td style="border: 2px solid #000; padding: 6px;">${item.produk || ''}</td>
                <td style="border: 2px solid #000; padding: 6px;">${item.deskripsi || ''}</td>
                <td style="border: 2px solid #000; text-align: center; padding: 6px;">${item.qty || 0}</td>
                <td style="border: 2px solid #000; text-align: center; padding: 6px;">${formatCurrency(item.harga_per_unit)}</td>
                <td style="border: 2px solid #000; text-align: center; padding: 6px;">${formatCurrency(totalHarga)}</td>
                <td style="border: 2px solid #000; padding: 6px;">${item.kondisi || ''}</td>
            </tr>
        `;
    }).join('');

    const tableHTML = items.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 20px 0;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 2px solid #000; padding: 8px; text-align: left;">Produk</th>
                    <th style="border: 2px solid #000; padding: 8px; text-align: left;">Deskripsi</th>
                    <th style="border: 2px solid #000; padding: 8px;">Qty</th>
                    <th style="border: 2px solid #000; padding: 8px;">Harga per unit</th>
                    <th style="border: 2px solid #000; padding: 8px;">Total harga</th>
                    <th style="border: 2px solid #000; padding: 8px; text-align: left;">Kondisi barang</th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>` : '<p><i>(Belum ada rincian produk/jasa)</i></p>';

    // Data Tanggal
    const tanggal = new Date(formData.tanggal || Date.now());
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const tanggalLengkap = tanggal.toLocaleDateString('id-ID', options).split(', ')[1];
    const namaHari = tanggal.toLocaleDateString('id-ID', { weekday: 'long' });
    const tanggalSingkat = tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // ✅ KOREKSI 2: Ganti semua placeholder dengan data yang relevan
    newContent = newContent
        .replace('{{kop_surat}}', headerHTML)
        .replace('{{qrcode}}', qrCodeHTML)
        .replace('{{tabel_produk}}', tableHTML)
        .replace(/{{nomor_dokumen}}/g, formData.no_bast || '...')
        .replace(/{{perihal}}/g, formData.perihal || '...')
        .replace(/{{nama_hari}}/g, namaHari)
        .replace(/{{tanggal_dokumen}}/g, tanggalLengkap)
        .replace(/{{tanggal_dokumen_singkat}}/g, tanggalSingkat)
        .replace(/{{nama_pihak_pertama}}/g, dynamicFields?.nama_pihak_pertama || user?.nama || '-')
        .replace(/{{jabatan_pihak_pertama}}/g, dynamicFields?.jabatan_pihak_pertama || '-')
        .replace(/{{alamat_pihak_pertama}}/g, user?.alamat || '-')
        .replace(/{{nama_pihak_kedua}}/g, dynamicFields?.nama_pihak_kedua || '-')
        .replace(/{{jabatan_pihak_kedua}}/g, dynamicFields?.jabatan_pihak_kedua || '-')
        .replace(/{{nip_pihak_kedua}}/g, dynamicFields?.nip_pihak_kedua || '-')
        .replace(/{{alamat_pihak_kedua}}/g, dynamicFields?.alamat_pihak_kedua || '-');

    return newContent;
}