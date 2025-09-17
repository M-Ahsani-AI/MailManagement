// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';

// ... (Salin semua icon SVG dari kode asli Anda di sini)
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const ProfilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const BankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v2" />
    </svg>
);
const KategoriIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const SuratIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const BASTIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);
const InvoiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);
const KwitansiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
);
const PenyimpananIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

const DriveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

function Sidebar({ isMinimized, toggleMinimize }) {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const location = useLocation(); // Untuk mengetahui path saat ini

    // State untuk submenu penyimpanan
    const [isPenyimpananOpen, setPenyimpananOpen] = useState(
        location.pathname.startsWith('/penyimpanan')
    );

    const [isDriveOpen, setDriveOpen] = useState(
        location.pathname.startsWith('/surat-keluar')
    );

    return (
        <aside
            className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${isMinimized ? 'w-16' : 'w-64'
                } h-screen fixed top-0 left-0 z-40`}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                {!isMinimized && <span className="font-bold">Surat CV Maliki</span>}
                <button
                    onClick={toggleMinimize}
                    className="text-white hover:bg-gray-700 p-1 rounded text-lg font-bold"
                >
                    {isMinimized ? '>' : '<'}
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {/* BASE */}
                    <li className="mb-2">
                        {!isMinimized && <span className="text-xs uppercase text-gray-400 tracking-wider block mb-2">{t('Base')}</span>}
                    </li>
                    <li>
                        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <UserIcon />
                            {!isMinimized && <span>{t('home')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/profil" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <ProfilIcon />
                            {!isMinimized && <span>{t('Profil')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/bank" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <BankIcon />
                            {!isMinimized && <span>{t('bank')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/kategori" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <KategoriIcon />
                            {!isMinimized && <span>{t('Kategori')}</span>}
                        </Link>
                    </li>

                    {/* EXTRA */}
                    <li className="mb-2 pt-2">
                        {!isMinimized && <span className="text-xs uppercase text-gray-400 tracking-wider block mb-2">{t('Extra')}</span>}
                    </li>
                    <li>
                        <Link to="/surat" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <SuratIcon />
                            {!isMinimized && <span>{t('Surat')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/bast" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <BASTIcon />
                            {!isMinimized && <span>{t('Bast')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/invoice" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <InvoiceIcon />
                            {!isMinimized && <span>{t('Invoice')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/kwitansi" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <KwitansiIcon />
                            {!isMinimized && <span>{t('Kwitansi')}</span>}
                        </Link>
                    </li>
                    <li>
                        <button onClick={() => !isMinimized && setPenyimpananOpen(!isPenyimpananOpen)} className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                                <PenyimpananIcon />
                                {!isMinimized && <span>Penyimpanan</span>}
                            </div>
                            {!isMinimized && (
                                <svg className={`w-4 h-4 transition-transform ${isPenyimpananOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            )}
                        </button>
                        {!isMinimized && isPenyimpananOpen && (
                            <ul className="pl-6 mt-1 space-y-1">
                                <li>
                                    <Link to="/penyimpanan/Faktur" className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700 ${location.pathname === '/penyimpanan/Faktur' ? 'bg-gray-700' : ''}`}>
                                        Faktur
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/penyimpanan/Billing" className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700 ${location.pathname === '/penyimpanan/Billing' ? 'bg-gray-700' : ''}`}>
                                        Billing
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/penyimpanan/Bukti Pembayaran" className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-700 ${location.pathname === '/penyimpanan/Bukti Pembayaran' ? 'bg-gray-700' : ''}`}>
                                        Bukti Pembayaran
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <button onClick={() => !isMinimized && setDriveOpen(!isDriveOpen)} className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                                <DriveIcon />
                                {!isMinimized && <span>Drive Surat</span>}
                            </div>
                            {!isMinimized && (
                                <svg className={`w-4 h-4 transition-transform ${isDriveOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            )}
                        </button>
                        {/* Submenu */}
                        {!isMinimized && isDriveOpen && (
                            <ul className="pl-6 mt-1 space-y-1">
                                <li>
                                    <Link to="/penyimpanan/Surat Masuk" className={`block px-2 py-1 rounded hover:bg-gray-700 ${location.pathname.includes('/Surat Masuk') ? 'bg-gray-700' : ''}`}>
                                        Surat Masuk
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/surat-keluar" className={`block px-2 py-1 rounded hover:bg-gray-700 ${location.pathname === '/surat-keluar' ? 'bg-gray-700' : ''}`}>
                                        Surat Keluar
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="my-4 border-t border-gray-700"></li>
                    <li>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-red-600 w-full text-left"
                        >
                            <LogoutIcon />
                            {!isMinimized && <span>{t('logout')}</span>}
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;