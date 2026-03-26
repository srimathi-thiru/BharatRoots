import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ArtisanSidebar from '../ArtisanSidebar'; // ✅ FIXED IMPORT
import TopNav from './TopNav';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { currentUser, userRole } = useContext(AuthContext);

  // ✅ Normalize role (VERY IMPORTANT)
  const role = userRole?.toLowerCase();

  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFAFA] font-sans">
      
      {/* ✅ ROLE-BASED SIDEBAR */}
      {role === "artisan" && <ArtisanSidebar />}

      {role === "admin" && <Sidebar />} 

      {role === "user" && <Sidebar />}

      {/* ❗ fallback (in case role not loaded yet) */}
      {!role && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <TopNav />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#FCFAFA]">
          {children || <Outlet />}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;