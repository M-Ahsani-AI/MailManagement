// frontend/components/layout/AppLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from '../Sidebar';

function AppLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isMinimized={isSidebarMinimized} 
        toggleMinimize={() => setIsSidebarMinimized(!isSidebarMinimized)} 
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarMinimized ? 'ml-16' : 'ml-64'} p-6 overflow-y-auto`}>
        <Outlet /> {/* ← Ini akan merender halaman seperti Profil, Bank, dll */}
      </div>
    </div>
  );
}

export default AppLayout;