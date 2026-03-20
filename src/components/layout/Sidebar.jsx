import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  MdDashboard, 
  MdCategory, 
  MdStorefront, 
  MdAddCircleOutline, 
  MdReceipt, 
  MdAnalytics,
  MdHealthAndSafety
} from 'react-icons/md';

const Sidebar = ({ isArtisan }) => {
  const { userRole } = useContext(AuthContext);
  const location = useLocation();

  const isAdmin = userRole?.toLowerCase() === "admin";

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-amber-50 text-amber-700 border-r-4 border-amber-500 shadow-inner' 
        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-r-4 border-transparent'
    }`;
  };

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 h-full flex flex-col hidden md:flex sticky top-0 h-screen shadow-sm">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-100">
        <div className="p-1.5 bg-zinc-900 rounded-lg shadow-sm">
           <img src="/bharatroots-logo.svg" alt="BharatRoots Logo" className="h-6 w-6 filter brightness-0 invert" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <h1 className="text-2xl font-black font-display text-zinc-900 tracking-tight">Bharat<span className="font-normal text-amber-600 tracking-normal">Roots</span></h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 space-y-1">
        {/* Core section */}
        <div className="mb-2">
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>
            <MdDashboard size={20} />
            Dashboard
          </Link>
        </div>

        {/* User Sections */}
        <div className="px-6 py-3 mt-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Explore
        </div>
        <Link to="/heritage" className={getLinkClass('/heritage')}>
          <MdCategory size={20} />
          Heritage
        </Link>
        <Link to="/products" className={getLinkClass('/products')}>
          <MdStorefront size={20} />
          Marketplace
        </Link>
        <Link to="/remedies" className={getLinkClass('/remedies')}>
          <MdHealthAndSafety size={20} />
          Remedies
        </Link>

        {/* Artisan Actions */}
        {isArtisan && (
          <>
            <div className="px-6 py-3 mt-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Creator Portal
            </div>
            <Link to="/my-orders" className={getLinkClass('/my-orders')}>
              <MdReceipt size={20} />
              My Orders
            </Link>
            <Link to="/add-product" className={getLinkClass('/add-product')}>
              <MdAddCircleOutline size={20} />
              Add Product
            </Link>
          </>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <>
            <div className="px-6 py-3 mt-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Admin Controls
            </div>
            <Link to="/add-product" className={getLinkClass('/add-product')}>
               <MdAddCircleOutline size={20} />
               Add Product
            </Link>
            <Link to="/add-heritage" className={getLinkClass('/add-heritage')}>
               <MdAddCircleOutline size={20} />
               Add Heritage
            </Link>
            <Link to="/admin-artisans" className={getLinkClass('/admin-artisans')}>
               <MdAnalytics size={20} />
               System Analytics
            </Link>
          </>
        )}
      </div>
      <div className="p-4 text-xs font-medium text-zinc-400 text-center border-t border-zinc-100 bg-[#FCFAFA]">
        &copy; {new Date().getFullYear()} BharatRoots
      </div>
    </aside>
  );
};

export default Sidebar;
