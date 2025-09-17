import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Menggunakan axios untuk request publik tanpa token

const pageStyle = {
    background: 'white',
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20mm',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const BastVerifyPages = () => {
    const [bast, setBast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchBast = async () => {
            try {
                // Panggil endpoint publik verifikasi BAST
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bast/verify/${id}`);
                setBast(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal memuat dokumen BAST.');
                console.error("Gagal verifikasi BAST:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBast();
    }, [id]);

    if (loading) return <div className="p-6 text-center">Memverifikasi dokumen...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    const backgroundImageUrl = bast?.kategori?.background_url ? `${process.env.REACT_APP_API_URL}/uploads/${bast.kategori.background_url}` : '';

    return (
        <div className="document-container" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', padding: '2rem', backgroundColor: '#f0f2f5' }}>
            <div style={pageStyle} className="document-paper">
                {/* 'bast.isi' sudah berisi HTML lengkap dari server */}
                <div dangerouslySetInnerHTML={{ __html: bast.isi }} />
            </div>
            <footer className="document-footer text-center text-xs text-gray-500 p-6 max-w-4xl mx-auto no-print">
                <p>Dokumen ini diterbitkan oleh sistem dan bersifat asli.</p>
                <p>Keaslian dokumen dapat diverifikasi melalui QR Code yang tertera.</p>
            </footer>
        </div>
    );
};

export default BastVerifyPages;
