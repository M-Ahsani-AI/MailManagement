// frontend/src/pages/InvoiceDetailPages.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoiceById } from '../api';

const pageStyle = {
    background: 'white',
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20mm',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const InvoiceDetailPages = () => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoiceDetail = async () => {
            try {
                const response = await getInvoiceById(id);
                setInvoice(response.data.data);
            } catch (error) {
                console.error("Gagal mengambil detail invoice:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoiceDetail();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-6 text-center">Memuat dokumen...</div>;
    if (!invoice) return <div className="p-6 text-center">Dokumen Invoice tidak ditemukan.</div>;

    const backgroundImageUrl = invoice.kategori ? invoice.kategori.background_url : '';

    return (
        <div className="document-container" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', padding: '2rem' }}>
            <div className="action-buttons no-print p-6 max-w-4xl mx-auto flex justify-between">
                <button onClick={() => navigate('/invoice')} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 shadow">
                    Kembali
                </button>
                <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow">
                    Print Invoice
                </button>
            </div>

            <div style={pageStyle} className="document-paper">
                <div dangerouslySetInnerHTML={{ __html: invoice.isi }} />
            </div>

            <footer className="document-footer text-center text-xs text-gray-500 p-6 no-print max-w-4xl mx-auto">
                <p>Dokumen ini diterbitkan oleh sistem dan bersifat asli.</p>
                <p>Keaslian dokumen dapat diverifikasi melalui QR Code yang tertera.</p>
            </footer>
        </div>
    );
};

export default InvoiceDetailPages;