import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const pageStyle = {
    background: 'white',
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20mm',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const InvoiceVerifyPage = () => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoice/verify/${id}`);
                setInvoice(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal memuat dokumen invoice.');
                console.error("Gagal verifikasi invoice:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    if (loading) return <div className="p-6 text-center">Memverifikasi dokumen...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    const backgroundImageUrl = invoice?.kategori?.background_url ? `${process.env.REACT_APP_API_URL}/uploads/${invoice.kategori.background_url}` : '';

    return (
        <div className="document-container" style={{ backgroundImage: `url(${backgroundImageUrl})`, padding: '2rem', backgroundColor: '#f0f0f0' }}>
            <div style={pageStyle} className="document-paper">
                <div dangerouslySetInnerHTML={{ __html: invoice.isi }} />
            </div>
            <footer className="document-footer text-center text-xs text-gray-500 p-6 max-w-4xl mx-auto">
                <p>Dokumen ini diterbitkan oleh sistem dan bersifat asli.</p>
                <p>Keaslian dokumen dapat diverifikasi melalui QR Code yang tertera.</p>
            </footer>
        </div>
    );
};

export default InvoiceVerifyPage;