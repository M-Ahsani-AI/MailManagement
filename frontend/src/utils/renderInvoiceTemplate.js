// frontend/src/utils/renderInvoiceTemplate.js
import { numberToWords } from './numberToWords';

// Pastikan 'user' dan 'profil' menjadi parameter fungsi ini
export function renderInvoiceTemplate(template, formData, dynamicFields, items, user, profil) {
    if (!template) return '';

    let newContent = template;

    // === 1. HEADER ===
    const baseUrl = process.env.REACT_APP_API_URL.replace('/api', '');
    const logoUrl = user?.logo ? `${baseUrl}/uploads/${user.logo}` : '';
    const logo = user?.logo
        ? `<img src="${logoUrl}" alt="Logo" style="max-width:310px; max-height:155px; object-fit:contain; margin-left:auto;">`
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

    // === 2. QR CODE ===
    const qrCodeHTML = formData.qrcode_base64
        ? `<img src="${formData.qrcode_base64}" alt="QR Code" style="width: 80px; height: 80px;">`
        : `<div style="width: 80px; height: 80px; border: 1px solid #ccc; font-size: 10px; display: flex; align-items: center; justify-content: center; color: #888;">QR Code</div>`;

    // === 3. KALKULASI & TABEL ITEM ===
    const subtotal = items.reduce((sum, item) => sum + ((Number(item.qty) || 0) * (Number(item.harga) || 0)), 0);
    const ppn_persen = Number(dynamicFields?.ppn_persen) || 0;
    const pph_persen = Number(dynamicFields?.pph_persen) || 0;
    const pembulatan = Number(dynamicFields?.pembulatan) || 0;
    const lunas = Number(dynamicFields?.lunas) || 0;

    const ppn_jumlah = subtotal * (ppn_persen / 100);
    const pph_jumlah = subtotal * (pph_persen / 100);
    const total = subtotal + ppn_jumlah - pph_jumlah;
    const jumlah_tertagih = total + pembulatan - lunas;

    const tableRows = items.map((item, index) => `
    <tr>
        <td style="border: 1px solid #333; padding: 6px;">${item.produk || ''}</td>
        <td style="border: 1px solid #333; padding: 6px;">${item.deskripsi || ''}</td>
        <td style="border: 1px solid #333; text-align: center; padding: 6px;">${item.qty || 0}</td>
        <td style="border: 1px solid #333; text-align: right; padding: 6px;">Rp ${Number(item.harga).toLocaleString('id-ID')}</td>
        <td style="border: 1px solid #333; text-align: right; padding: 6px;">Rp ${((Number(item.qty) || 0) * (Number(item.harga) || 0)).toLocaleString('id-ID')}</td>
    </tr>
    `).join('');

    const tableHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
            <tr style="background-color: #f2f2f2; color: black;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Produk</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Deskripsi</th>
                <th style="border: 1px solid #333; padding: 8px; width: 10%;">Qty</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: right; width: 20%;">Harga</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: right; width: 20%;">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            ${items.length > 0 ? tableRows : `<tr><td colspan="5" style="text-align: center; padding: 10px;"><i>Belum ada item ditambahkan.</i></td></tr>`}
        </tbody>
    </table>
    `;
    
    // === 4. DATA UMUM & GANTI PLACEHOLDER ===
    const selectedProfil = profil.find(p => p.id === Number(formData.profil_id));
    const tanggalFormatted = formData.tanggal
        ? new Date(formData.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '[Tanggal]';
    const jatuhTempoFormatted = dynamicFields?.tanggal_jatuh_tempo
        ? new Date(dynamicFields.tanggal_jatuh_tempo).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-';

    newContent = newContent
        // Header & User Info
        .replace('{{kop_surat}}', headerHTML)
        .replace(/{{nama_user}}/g, user?.nama || '[Nama Perusahaan]')
        .replace(/{{alamat_user}}/g, user?.alamat || '[Alamat Perusahaan]')
        .replace(/{{telepon_user}}/g, user?.no_telp || '[Telepon]')
        .replace(/{{email_user}}/g, user?.email || '[Email]')
        .replace(/{{npwp_user}}/g, user?.npwp || 'NPWP tidak diatur') 
        
        // Invoice Info
        .replace(/{{no_invoice}}/g, formData.no_invoice || '.../.../.../.../...')
        .replace(/{{tanggal_invoice}}/g, tanggalFormatted)
        .replace(/{{tanggal_jatuh_tempo}}/g, jatuhTempoFormatted)
        
        // Klien Info
        .replace(/{{nama_klien}}/g, selectedProfil?.nama || '[Nama Klien]')
        .replace(/{{alamat_klien}}/g, selectedProfil?.alamat || '[Alamat Klien]')
        .replace(/{{telepon_klien}}/g, selectedProfil?.no_telp || '[Telepon Klien]')
        .replace(/{{email_klien}}/g, selectedProfil?.email || '[Email Klien]')
        
        // Tabel & Kalkulasi
        .replace('{{tabel_invoice}}', tableHTML)
        .replace(/{{subtotal}}/g, subtotal.toLocaleString('id-ID'))
        .replace(/{{ppn_persen}}/g, ppn_persen)
        .replace(/{{ppn_jumlah}}/g, ppn_jumlah.toLocaleString('id-ID'))
        .replace(/{{pph_persen}}/g, pph_persen)
        .replace(/{{pph_jumlah}}/g, pph_jumlah.toLocaleString('id-ID'))
        .replace(/{{total}}/g, total.toLocaleString('id-ID'))
        .replace(/{{pembulatan}}/g, pembulatan.toLocaleString('id-ID'))
        .replace(/{{lunas}}/g, lunas.toLocaleString('id-ID'))
        .replace(/{{jumlah_tertagih}}/g, jumlah_tertagih.toLocaleString('id-ID'))
        
        // Footer & TTD
        .replace(/{{kota_surat}}/g, dynamicFields?.kota_surat || 'Malang')
        .replace('{{qrcode}}', qrCodeHTML)
        .replace(/{{nama_penandatangan}}/g, dynamicFields?.nama_penandatangan || user?.nama_penandatangan || '[Nama Penandatangan]');

    return newContent;
}