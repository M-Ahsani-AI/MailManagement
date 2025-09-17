// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // ✅ Penting jika backend kirim cookie
      });

      const data = await response.json();

      if (data.success) {
        login(data.user, data.token);
        const companyId = data.user.company_id;
        navigate(companyId ? `/company/${companyId}` : '/dashboard');
      } else {
        setError(data.message || t('loginFailed'));
      }
    } catch (err) {
      setError(t('connectionError'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-20">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">{t('login')}</h1>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder={t('email')}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
            autoComplete="username" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t('password')}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
            autoComplete="current-password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {t('login')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t('noAccount')}{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            {t('register')}
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;