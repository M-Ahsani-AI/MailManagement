// frontend/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: API_URL });

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        // Redirect ke login untuk memastikan semua state di-reset
        window.location.href = '/login'; 
    }, []);

    // ✅ KOREKSI: Fungsi untuk mengambil data user terbaru dari server
    const fetchAndSetUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Asumsi endpoint untuk mendapatkan profil user adalah '/api/auth/me'
                const response = await api.get('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const userData = response.data.data;
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));

            } catch (error) {
                console.error('Sesi tidak valid atau gagal mengambil data user, logout paksa.', error);
                logout(); // Logout jika token sudah tidak valid
            }
        }
        setLoading(false);
    }, [logout]);

    useEffect(() => {
        fetchAndSetUser();
    }, [fetchAndSetUser]);

    const login = (userData, authToken) => {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };
    
    const isAuthenticated = () => !!localStorage.getItem('token');

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        fetchUserData: fetchAndSetUser // Ekspor fungsi untuk digunakan di komponen lain jika perlu
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};