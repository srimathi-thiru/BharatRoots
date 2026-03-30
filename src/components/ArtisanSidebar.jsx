import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, Compass, ShoppingBag, Leaf, Palette, Sparkles, Package, BarChart3, MessageCircle, Brain, Plus } from "lucide-react";
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

const NavLink = ({ to, icon: Icon, label, badge }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-amber-50 text-amber-700 font-bold" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"}`}>
      <span className="flex items-center gap-3">
        <Icon size={16} className={active ? "text-amber-600" : "text-zinc-400"} />
        {label}
      </span>
      {badge > 0 && (
        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
    </Link>
  );
};

const ArtisanSidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "orders"), where("artisanId", "==", currentUser.uid), where("status", "==", "pending"));
    const unsub = onSnapshot(q, snap => setPendingOrders(snap.size));
    return () => unsub();
  }, [currentUser]);

  return (
    <div className="w-64 h-screen overflow-y-auto bg-white border-r border-zinc-200 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="p-1.5 bg-zinc-900 rounded-lg shadow-sm">
            <img src="/bharatroots-logo.svg" alt="Logo" className="h-5 w-5 filter brightness-0 invert" onError={e => e.target.style.display = 'none'} />
          </div>
          <span className="text-lg font-black tracking-tight text-zinc-900 font-display">Bharat<span className="text-amber-600 font-normal">Roots</span></span>
        </Link>
        <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">Artisan Studio</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5">
        <div className="space-y-1">
          <NavLink to="/dashboard" icon={Home} label="Dashboard" />
        </div>

        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">Quick Actions</p>
          <div className="space-y-1">
            <NavLink to="/add-product" icon={Plus} label="Add Product" />
            <NavLink to="/add-heritage" icon={Zap} label="Add Heritage" />
            <NavLink to="/add-remedy" icon={Leaf} label="Add Remedy" />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">Explore</p>
          <div className="space-y-1">
            <NavLink to="/heritage" icon={Compass} label="Heritage" />
            <NavLink to="/products" icon={ShoppingBag} label="Marketplace" />
            <NavLink to="/remedies" icon={Leaf} label="Remedies" />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">Creator Hub</p>
          <div className="space-y-1">
            <NavLink to="/creator-studio" icon={Palette} label="Creator Studio" />
            <NavLink to="/showcase" icon={Sparkles} label="My Showcase" />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">Business</p>
          <div className="space-y-1">
            <NavLink to="/order-command" icon={Package} label="Order Command" badge={pendingOrders} />
            <NavLink to="/growth-insights" icon={BarChart3} label="Growth Insights" />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">Engage</p>
          <div className="space-y-1">
            <NavLink to="/customer-connect" icon={MessageCircle} label="Customer Connect" />
            <NavLink to="/smart-suggestions" icon={Brain} label="Smart Suggestions" />
          </div>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-zinc-100">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
          <p className="text-xs font-bold text-amber-800 mb-1">🎨 Artisan Workspace</p>
          <p className="text-[11px] text-amber-700 leading-relaxed">Manage your crafts, orders, and connect with buyers worldwide.</p>
        </div>
      </div>
    </div>
  );
};

export default ArtisanSidebar;
