// src/pages/Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t('Welcome')}, {user?.nama}!
      </h1>
      <p className="text-gray-600">
        {t('dashboard Welcome')}
      </p>
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">
          {user?.company?.nama_cv}
        </h2>
        <p>{user?.company?.biografi || t('noCompany')}</p>
      </div>
    </div>
  );
}

export default Dashboard;