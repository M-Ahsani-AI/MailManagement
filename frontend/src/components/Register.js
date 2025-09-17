// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

function Register() {
    // State yang sudah ada
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [noTelp, setNoTelp] = useState('');
    const [alamat, setAlamat] = useState('');
    const [kode, setKode] = useState('');
    const [logo, setLogo] = useState(null);
    const [roleId, setRoleId] = useState(2);
    
    // ✅ TAMBAHAN: State baru untuk data penandatangan
    const [jabatan, setJabatan] = useState('');
    const [namaPenandatangan, setNamaPenandatangan] = useState('');
    const [tandaTangan, setTandaTangan] = useState(null);

    // State untuk UI
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const formData = new FormData();
        formData.append('nama', nama.trim());
        formData.append('email', email);
        formData.append('password', password);
        formData.append('no_telp', noTelp);
        formData.append('alamat', alamat);
        formData.append('kode', kode);
        formData.append('role_id', roleId);
        
        // ✅ TAMBAHAN: Append data baru ke FormData
        formData.append('jabatan', jabatan);
        formData.append('nama_penandatangan', namaPenandatangan);
        if (logo) formData.append('logo', logo);
        if (tandaTangan) formData.append('tanda_tangan', tandaTangan);


        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setMessage(response.data.message || t('registerSuccess'));
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message || t('registerFailed'));
            }
        } catch (err) {
            setError(err.response?.data?.message || t('connectionError'));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, setFile, maxSizeMB = 2) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setError(`Format file tidak valid. Hanya ${validTypes.join(', ')}.`);
                return;
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                setError(`Ukuran file terlalu besar (maksimal ${maxSizeMB}MB).`);
                return;
            }
            setFile(file);
            setError('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800">{t('register')}</h1>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                {message && <p className="text-green-500 text-center text-sm">{message}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Informasi Perusahaan */}
                    <input type="text" placeholder="Nama Perusahaan (Contoh: CV. Maliki Edulogi)" value={nama} onChange={(e) => setNama(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <input type="email" placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <input type="password" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <input type="tel" placeholder="Nomor Telepon" value={noTelp} onChange={(e) => setNoTelp(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <textarea placeholder="Alamat Perusahaan" value={alamat} onChange={(e) => setAlamat(e.target.value)} rows="3" className="w-full px-4 py-2 border rounded-md" />
                    <input type="text" placeholder="Kode Perusahaan (Contoh: ME)" value={kode} onChange={(e) => setKode(e.target.value)} required maxLength="4" className="w-full px-4 py-2 border rounded-md" />
                    
                    {/* Detail Penandatangan */}
                    <div className="pt-4 border-t">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Detail Penandatangan</h2>
                        <input type="text" placeholder="Jabatan (Contoh: Direktur)" value={jabatan} onChange={(e) => setJabatan(e.target.value)} required className="w-full px-4 py-2 border rounded-md mb-4" />
                        <input type="text" placeholder="Nama Lengkap Penandatangan" value={namaPenandatangan} onChange={(e) => setNamaPenandatangan(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    </div>

                    {/* Upload File */}
                    <div className="pt-4 border-t space-y-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Logo Perusahaan (Opsional, Max 2MB)</label>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogo, 2)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 hover:file:bg-blue-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Gambar Tanda Tangan (Opsional, Max 2MB)</label>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setTandaTangan, 2)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 hover:file:bg-blue-100" />
                        </div>
                    </div>
                    
                    {/* Role & Tombol Submit */}
                    <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full px-4 py-2 border rounded-md">
                        <option value="2">User</option>
                        {/* <option value="3">Role Lain</option> */}
                    </select>
                    <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                        {loading ? 'Mendaftar...' : 'Daftar'}
                    </button>
                </form>
                <div className="text-center text-sm text-gray-500 mt-4">
                    <span>Sudah punya akun? </span>
                    <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Masuk</button>
                </div>
            </div>
        </div>
    );
}

export default Register;