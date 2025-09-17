// frontend/src/pages/KwitansiVerifyPages.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { renderKwitansiTemplate } from '../utils/renderKwitansiTemplate';

const pageStyle = {
  background: 'white',
  width: '210mm',
  minHeight: '297mm',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '20mm',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const KwitansiVerifyPage = () => {
  const [kwitansi, setKwitansi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchKwitansi = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/kwitansi/verify/${id}`);
        
        // Render ulang template di frontend dengan data user yang lengkap
        const renderedContent = renderKwitansiTemplate(
          response.data.data.kategori.template,
          response.data.data,
          response.data.data.meta_data.dynamicFields,
          response.data.data.user,
          [response.data.data.profil] // Kirim sebagai array
        );
        setKwitansi({ ...response.data.data, isi: renderedContent });

      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat dokumen.');
      } finally {
        setLoading(false);
      }
    };
    fetchKwitansi();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Memverifikasi dokumen...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    const backgroundImageUrl = surat?.kategori?.background_url ? `${process.env.REACT_APP_API_URL}/uploads/${surat.kategori.background_url}` : '';

  return (
        <div className="document-container" style={{ backgroundImage: `url(${backgroundImageUrl})`, padding: '2rem', backgroundColor: '#f0f0f0' }}>
        <div style={pageStyle} className="document-paper">        <div dangerouslySetInnerHTML={{ __html: kwitansi.isi }} />
      </div>
            <footer className="document-footer text-center text-xs text-gray-500 p-6 max-w-4xl mx-auto">
                <p>Dokumen ini diterbitkan oleh CV Maliki Edulogi dan bersifat asli.</p>
                <p>Keaslian dokumen dapat diverifikasi melalui QR Code yang tertera.</p>
      </footer>
    </div>
  );
};

export default KwitansiVerifyPage;