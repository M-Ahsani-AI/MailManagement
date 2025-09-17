// frontend/src/pages/SuratDetailPages.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSuratById } from '../api'; 

const pageStyle = {
    background: 'white',
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20mm',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    position: 'relative',
};

const SuratDetailPages = () => {
    const [surat, setSurat] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuratDetail = async () => {
            try {
                const response = await getSuratById(id);
                setSurat(response.data.data);
            } catch (error) {
                console.error("Gagal mengambil detail surat:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSuratDetail();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-6 text-center">Memuat dokumen...</div>;
    if (!surat) return <div className="p-6 text-center">Dokumen tidak ditemukan.</div>;

    const backgroundImageUrl = surat.kategori ? surat.kategori.background_url : '';

    return (
        <div className="document-container" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', padding: '2rem' }}>
            <div className="action-buttons no-print p-6 max-w-4xl mx-auto flex justify-between">
                <button onClick={() => navigate('/surat')} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                    Kembali
                </button>
                <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Print Surat
                </button>
            </div>

            <div style={pageStyle} className="document-paper">
                <div dangerouslySetInnerHTML={{ __html: surat.isi }} />
            </div>

            {/* ✅ KOREKSI: Tambahkan kembali footer di sini */}
            <footer className="document-footer text-center text-xs text-gray-500 p-6 no-print max-w-4xl mx-auto">
                <p>Dokumen ini diterbitkan oleh CV Maliki Edulogi dan bersifat asli.</p>
                <p>Keaslian dokumen dapat diverifikasi melalui QR Code yang tertera.</p>
            </footer>

        </div>
    );
};

export default SuratDetailPages;