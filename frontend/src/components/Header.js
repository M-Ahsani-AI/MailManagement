// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

function Header() {
  const { user } = useAuth();
  const { t, language, changeLanguage } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-purple-600">
              {t('appName')}
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="p-1 border rounded text-sm"
              aria-label={t('selectLanguage')}
            >
              <option value="id">🇮🇩 ID</option>
              <option value="en">🇬🇧 EN</option>
            </select>

            {/* Auth Buttons */}
            {!user ? (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-purple-600 transition">
                  {t('login')}
                </Link>
                <Link to="/register" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                  {t('register')}
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;