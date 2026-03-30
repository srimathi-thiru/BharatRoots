import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBag, Leaf, Package, TrendingUp, MessageSquare, Search } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
];
const exploreItems = [
  { to: "/heritage", icon: Compass, label: "Heritage" },
  { to: "/products", icon: ShoppingBag, label: "Marketplace" },
  { to: "/remedies", icon: Leaf, label: "Remedies" },
  { to: "/search", icon: Search, label: "Search" },
];
const personalItems = [
  { to: "/user-orders", icon: Package, label: "Track Orders" },
  { to: "/user-suggestions", icon: TrendingUp, label: "Smart Suggestions" },
  { to: "/user-chat", icon: MessageSquare, label: "Messages" },
];

const NavLink = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-indigo-50 text-indigo-700 font-bold" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"}`}>
      <Icon size={16} className={active ? "text-indigo-600" : "text-zinc-400"} />
      {label}
    </Link>
  );
};

const Sidebar = () => (
  <div className="w-64 h-screen overflow-y-auto bg-white border-r border-zinc-200 flex flex-col">
    {/* Logo */}
    <div className="px-5 py-5 border-b border-zinc-100">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="p-1.5 bg-indigo-600 rounded-lg shadow-sm">
          <img src="/bharatroots-logo.svg" alt="Logo" className="h-5 w-5 filter brightness-0 invert" onError={e => e.target.style.display = 'none'} />
        </div>
        <span className="text-lg font-black tracking-tight text-zinc-900 font-display">Bharat<span className="text-indigo-600 font-normal">Roots</span></span>
      </Link>
    </div>

    <nav className="flex-1 px-3 py-4 space-y-5">
      <div className="space-y-1">
        {navItems.map(item => <NavLink key={item.to} {...item} />)}
      </div>

      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">Explore</p>
        <div className="space-y-1">
          {exploreItems.map(item => <NavLink key={item.to} {...item} />)}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">Personal</p>
        <div className="space-y-1">
          {personalItems.map(item => <NavLink key={item.to} {...item} />)}
        </div>
      </div>
    </nav>

    <div className="px-4 py-4 border-t border-zinc-100">
      <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
        <p className="text-xs font-bold text-indigo-800 mb-1">Discover Heritage</p>
        <p className="text-[11px] text-indigo-600 leading-relaxed">Explore authentic crafts from verified artisans across India.</p>
      </div>
    </div>
  </div>
);

export default Sidebar;
