import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  ShieldCheck,
  Users,
  Compass,
  ShoppingBag,
  Leaf
} from "lucide-react";

const AdminSidebar = () => {
  const linkStyle =
    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200";

  return (
    <div className="w-64 h-screen overflow-y-auto bg-white border-r p-5 space-y-4">

      {/* Dashboard */}
      <Link to="/dashboard" className={linkStyle}>
        <Home size={18} /> Dashboard
      </Link>

      {/* ADMIN ACTIONS */}
      <div>
        <p className="text-xs text-gray-400 mb-1 mt-3">ADMIN ACTIONS</p>
        <div className="space-y-1">
          <Link to="/admin-artisans" className={linkStyle}>
            <Users size={16} /> Artisan Control Panel
          </Link>
          <Link to="/verify" className={linkStyle}>
            <ShieldCheck size={16} /> Authenticity Verification
          </Link>
        </div>
      </div>

      {/* EXPLORE */}
      <div>
        <p className="text-xs text-gray-400 mb-1 mt-3">EXPLORE</p>
        <div className="space-y-1">
          <Link to="/heritage" className={linkStyle}>
            <Compass size={16} /> Heritage
          </Link>
          <Link to="/products" className={linkStyle}>
            <ShoppingBag size={16} /> Marketplace
          </Link>
          <Link to="/remedies" className={linkStyle}>
            <Leaf size={16} /> Remedies
          </Link>
        </div>
      </div>

    </div>
  );
};

export default AdminSidebar;
