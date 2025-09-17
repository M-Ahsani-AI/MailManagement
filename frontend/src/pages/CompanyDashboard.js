// pages/CompanyDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CompanyDashboard() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/companies/${companyId}`);
        setCompany(res.data);
      } catch (err) {
        console.error('Gagal ambil data CV:', err);
      }
    };
    fetchCompany();
  }, [companyId]);

  if (!company) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{company.nama_cv}</h1>
      {company.logo && (
        <img src={`/uploads/${company.logo}`} alt="Logo" className="w-24 h-24 mt-4" />
      )}
      <p><strong>Tahun Berdiri:</strong> {company.tahun_berdiri}</p>
      <p><strong>Biografi:</strong> {company.biografi}</p>
    </div>
  );
}

export default CompanyDashboard;