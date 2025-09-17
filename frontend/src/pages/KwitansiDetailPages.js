// frontend/src/pages/KwitansiDetailPages.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getKwitansiById } from '../api';

// ✅ KOREKSI 1: Optimalkan Style untuk Halaman A5 Landscape
const pageStyle = {
  background: 'white',
  width: '210mm',
  height: '148mm',          // Gunakan 'height' tetap, bukan 'minHeight'
  padding: '10mm',          // Kurangi padding agar konten lebih leluasa
  marginLeft: 'auto',
  marginRight: 'auto',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  boxSizing: 'border-box',  // Pastikan padding termasuk dalam kalkulasi ukuran
  display: 'flex',          // Gunakan flexbox untuk kontrol layout yang lebih baik
  flexDirection: 'column',  // Susun konten secara vertikal
};

const KwitansiDetailPages = () => {
    const [kwitansi, setKwitansi] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await getKwitansiById(id);
                setKwitansi(response.data.data);
            } catch (error) {
                console.error("Gagal mengambil detail kwitansi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handlePrint = () => window.print();

    // ✅ KOREKSI 2: Sempurnakan CSS untuk Print
    const printStyles = `
      @page {
        size: A5 landscape;
        margin: 0;
      }
      @media print {
        html, body {
          width: 210mm;
          height: 148mm;
          background-color: #fff;
        }
        .no-print {
          display: none;
        }
        .printable-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          box-shadow: none;
          margin: 0;
          padding: 0;
        }
        body * {
          visibility: hidden;
          box-sizing: border-box; /* Terapkan box-sizing ke semua elemen saat print */
        }
        .printable-area, .printable-area * {
          visibility: visible;
        }
      }
    `;

    if (loading) return <div className="p-6 text-center">Memuat dokumen...</div>;
    if (!kwitansi) return <div className="p-6 text-center">Dokumen kwitansi tidak ditemukan.</div>;
    
    const backgroundImageUrl = kwitansi.kategori?.background_url || '';

    return (
        <div className="document-container" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', padding: '2rem' }}>
            
            <div className="action-buttons no-print p-6 max-w-4xl mx-auto flex justify-between">
                <button onClick={() => navigate('/kwitansi')} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Kembali</button>
                <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Print Kwitansi</button>
            </div>

            <div className="printable-area">
                <div style={pageStyle}>
                    {kwitansi.isi ? (
                        // ✅ KOREKSI 3: Bungkus isi dengan div flex-grow agar footer menempel di bawah
                        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }} dangerouslySetInnerHTML={{ __html: kwitansi.isi }} />
                    ) : (
                        <p>Konten tidak tersedia.</p>
                    )}
                </div>
            </div>
      
            <footer className="no-print text-center text-xs text-gray-600 p-6 max-w-4xl mx-auto">
                <p>Dokumen ini diterbitkan oleh sistem dan dianggap sah.</p>
                <p>Keaslian dokumen dapat diverifikasi melalui QR Code yang tertera.</p>
            </footer>
        </div>
    );
};

export default KwitansiDetailPages;