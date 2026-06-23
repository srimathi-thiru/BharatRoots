import React, { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ArtisanSidebar from '../ArtisanSidebar';
import AdminSidebar from './AdminSidebar';
import TopNav from './TopNav';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { userRole } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = userRole?.toLowerCase();

  const SidebarComponent = role === "artisan" ? ArtisanSidebar : role === "admin" ? AdminSidebar : Sidebar;

  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFAFA] font-sans">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slide-in when open */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <SidebarComponent onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        <TopNav onMenuClick={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#FCFAFA]">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;