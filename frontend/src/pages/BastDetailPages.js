import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBastById } from '../api'; // Pastikan API call benar

// KOREKSI: Mengadopsi gaya halaman A4 yang lebih baik dari SuratDetailPages
const pageStyle = {
    background: 'white',
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20mm',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    position: 'relative', // Dibutuhkan untuk elemen-elemen di dalamnya jika diperlukan
};

const BastDetailPages = () => {
    const [bast, setBast] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBastDetail = async () => {
            try {
                const response = await getBastById(id);
                setBast(response.data.data);
            } catch (error) {
                console.error("Gagal mengambil detail BAST:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBastDetail();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-6 text-center">Memuat dokumen...</div>;
    if (!bast) return <div className="p-6 text-center">Dokumen BAST tidak ditemukan.</div>;

    // KOREKSI: Ambil URL background dari data kategori yang di-include
    const backgroundImageUrl = bast.kategori ? bast.kategori.background_url : '';

    return (
        // KOREKSI: Menggunakan struktur layout dan styling dari SuratDetailPages
        <div className="document-container" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', padding: '2rem', backgroundColor: '#f0f2f5' }}>
            
            <div className="action-buttons no-print p-6 max-w-4xl mx-auto flex justify-between">
                <button onClick={() => navigate('/bast')} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 shadow">
                    Kembali
                </button>
                <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow">
                    Print BAST
                </button>
            </div>

            <div style={pageStyle} className="document-paper">
                {/* KUNCI PERBAIKAN: 
                  Langsung render 'bast.isi'. 
                  'isi' sudah berisi HTML lengkap (header, logo, konten, QR code) 
                  yang dihasilkan oleh renderSuratTemplate di backend/frontend form.
                  Tidak perlu lagi membangun header atau QR code secara manual di sini.
                */}
                <div dangerouslySetInnerHTML={{ __html: bast.isi }} />
            </div>

            <footer className="document-footer text-center text-xs text-gray-500 p-6 no-print max-w-4xl mx-auto">
                <p>Dokumen ini diterbitkan oleh sistem dan bersifat asli.</p>
                <p>Keaslian dokumen dapat diverifikasi melalui QR Code yang tertera.</p>
            </footer>

        </div>
    );
};

export default BastDetailPages;
