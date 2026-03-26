import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Zap,
  Compass,
  ShoppingBag,
  Leaf,
  Palette,
  Sparkles,
  Package,
  BarChart3,
  MessageCircle,
  Brain,
} from "lucide-react";

const ArtisanSidebar = () => {
  const linkStyle =
    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200";

  return (
    <div className="w-64 h-screen overflow-y-auto bg-white border-r p-5 space-y-4">

      {/* Dashboard */}
      <Link to="/dashboard" className={linkStyle}>
        <Home size={18} /> Dashboard
      </Link>

      {/* QUICK ACTIONS */}
      <div>
        <p className="text-xs text-gray-400 mb-1 mt-3">QUICK ACTIONS</p>
        <div className="space-y-1">
          <Link to="/add-product" className={linkStyle}>
            <Zap size={16} /> Add Product
          </Link>
          <Link to="/add-heritage" className={linkStyle}>
            <Zap size={16} /> Add Heritage
          </Link>
          <Link to="/add-remedy" className={linkStyle}>
            <Zap size={16} /> Add Remedy
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

      {/* CREATOR HUB */}
      <div>
        <p className="text-xs text-gray-400 mb-1 mt-3">CREATOR HUB</p>
        <div className="space-y-1">
          <Link to="/creator-studio" className={linkStyle}>
            <Palette size={16} /> Creator Studio
          </Link>
          <Link to="/showcase" className={linkStyle}>
            <Sparkles size={16} /> My Showcase
          </Link>
        </div>
      </div>

      {/* BUSINESS */}
      <div>
        <p className="text-xs text-gray-400 mb-1 mt-3">BUSINESS</p>
        <div className="space-y-1">

          <div className="flex items-center justify-between">
            <Link to="/order-command" className={`${linkStyle} w-full`}>
              <Package size={16} /> Order Command
            </Link>
            <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded ml-2">
              3
            </span>
          </div>

          <Link to="/growth-insights" className={linkStyle}>
            <BarChart3 size={16} /> Growth Insights
          </Link>

        </div>
      </div>

      {/* ENGAGE */}
      <div>
        <p className="text-xs text-gray-400 mb-1 mt-3">ENGAGE</p>
        <div className="space-y-1">

          <div className="flex items-center justify-between">
            <Link
              to="/customer-connect"
              className={`${linkStyle} w-full`}
            >
              <MessageCircle size={16} /> Customer Connect
            </Link>
            <span className="text-xs bg-blue-100 text-blue-500 px-2 py-0.5 rounded ml-2">
              5
            </span>
          </div>

          <Link to="/smart-suggestions" className={linkStyle}>
            <Brain size={16} /> Smart Suggestions
          </Link>

        </div>
      </div>

    </div>
  );
};

export default ArtisanSidebar;
