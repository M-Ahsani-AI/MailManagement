// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              {t('appName')}
            </h1>
            <div className="w-32 h-1 bg-purple-600"></div>
            <p className="text-lg text-gray-700">{t('welcomeToArtOf')}</p>
            <p className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              {t('digitalCorrespondence')}
            </p>
            <p className="text-gray-500 leading-relaxed">
              {t('everyLetterCarriesMeaning')}
            </p>
          </div>

          {/* Right: Login/Register Cards */}
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-all duration-300 hover:scale-105">
              <div className="text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('login')}</h3>
              <p className="text-gray-500 text-sm text-center">{t('accessYourAccount')}</p>
              <Link
                to="/login"
                className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t('signIn')}
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-all duration-300 hover:scale-105">
              <div className="text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('register')}</h3>
              <p className="text-gray-500 text-sm text-center">{t('createNewAccount')}</p>
              <Link
                to="/register"
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('signUp')}
              </Link>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center mt-16 text-gray-400 italic text-sm max-w-lg mx-auto">
          "{t('inEveryCorrespondence')}"
        </div>
      </div>
    </div>
  );
}

export default Home;