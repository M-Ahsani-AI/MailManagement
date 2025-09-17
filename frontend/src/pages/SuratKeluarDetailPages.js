// src/pages/SuratKeluarDetailPages.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSuratKeluarById } from '../api';

const pageStyle = {
    background: 'white',
    width: '210mm',
    minHeight: '297mm',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20mm',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const printStyles = `
  @media print {
    body * { visibility: hidden; }
    .no-print, .no-print * { display: none !important; }
    .printable-area, .printable-area * { visibility: visible; }
    .printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; box-shadow: none; }
  }
`;

const suratContentStyles = `
    .surat-content {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.0; 
    }
    .surat-content p, .surat-content h1, .surat-content h2, .surat-content h3 {
    margin-top: 0;
    margin-bottom: 0; /* Dibuat 0 agar 'enter' di Word tidak terlalu jauh */
    text-align: justify;
    }
    .surat-content h1, .surat-content h2, .surat-content h3 {
    text-align: left; /* Judul biasanya rata kiri */
    font-weight: bold;
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    }
    .surat-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;
    }
    .surat-content th, .surat-content td {
    border: 1px solid black;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
    }
    .surat-content th {
    font-weight: bold;
    background-color: #f2f2f2;
    }
`;

function SuratKeluarDetailPages() {
    const [letter, setLetter] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLetter = async () => {
            try {
                const res = await getSuratKeluarById(id);
                setLetter(res.data.data);
            } catch (error) {
                alert('Gagal memuat detail surat.');
            } finally {
                setLoading(false);
            }
        };
        fetchLetter();
    }, [id]);

    const handlePrint = () => window.print();

    if (loading) return <div className="p-6 text-center">Memuat dokumen...</div>;
    if (!letter) return <div className="p-6 text-center">Dokumen tidak ditemukan.</div>;

    return (
        <div className="bg-gray-100 p-8">
            <style>{printStyles}</style>
            <style>{suratContentStyles}</style>

            <div className="action-buttons no-print max-w-4xl mx-auto mb-4 flex justify-between">
                <button onClick={() => navigate('/surat-keluar')} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Kembali</button>
                <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cetak Surat</button>
            </div>
            
            <div style={pageStyle} className="document-paper printable-area">
                <div className="surat-content" dangerouslySetInnerHTML={{ __html: letter.isi_surat_final }} />
            </div>
        </div>
    );
}
export default SuratKeluarDetailPages;