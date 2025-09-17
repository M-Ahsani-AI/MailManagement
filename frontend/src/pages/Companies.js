import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const res = await axios.get('/api/companies');
    setCompanies(res.data);
  };

  const handleEdit = (company) => {
    setEditingId(company.id);
    setFormData(company);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/companies/${id}`);
    fetchCompanies();
  };

  const handleSubmit = async () => {
    if (editingId) {
      await axios.put(`/api/companies/${editingId}`, formData);
    } else {
      await axios.post('/api/companies', formData);
    }
    setShowModal(false);
    fetchCompanies();
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Tambah</button>

      <table>
        <thead>
          <tr>
            <th>Nama CV</th>
            <th>Logo</th>
            <th>Tahun</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.nama_cv}</td>
              <td><img src={`/uploads/${company.logo}`} alt="Logo" width="50" /></td>
              <td>{company.tahun_berdiri}</td>
              <td>
                <button onClick={() => handleEdit(company)}>Edit</button>
                <button onClick={() => handleDelete(company.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? 'Edit' : 'Tambah'} CV</h3>
            <input value={formData.nama_cv} onChange={(e) => setFormData({...formData, nama_cv: e.target.value})} placeholder="Nama CV" />
            <input value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} placeholder="Logo" />
            <textarea value={formData.biografi} onChange={(e) => setFormData({...formData, biografi: e.target.value})} placeholder="Biografi" />
            <input type="number" value={formData.tahun_berdiri} onChange={(e) => setFormData({...formData, tahun_berdiri: e.target.value})} placeholder="Tahun Berdiri" />
            <div>
              <button onClick={() => setShowModal(false)}>Batal</button>
              <button onClick={handleSubmit}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;