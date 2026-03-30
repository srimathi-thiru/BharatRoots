import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { ShoppingBag, Compass, Leaf, Search, Package, MessageSquare, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";

const UserDashboard = () => {
  const { currentUser, userName } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, spent: 0 });

  useEffect(() => { if (currentUser) fetchData(); }, [currentUser]);

  const fetchData = async () => {
    try {
      const snap = await getDocs(query(collection(db, "orders"), where("userId", "==", currentUser.uid)));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      let approved = 0, pending = 0, spent = 0;
      list.forEach(o => {
        const s = o.status?.toLowerCase();
        if (s === "approved") { approved++; spent += Number(o.price || o.totalAmount || 0); }
        if (s === "pending") pending++;
      });

      setOrders(list.slice(0, 5));
      setStats({ total: list.length, approved, pending, spent });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    approved: { icon: CheckCircle, badge: "bg-emerald-50 text-emerald-700", label: "Approved" },
    pending: { icon: Clock, badge: "bg-amber-50 text-amber-700", label: "Pending" },
    rejected: { icon: XCircle, badge: "bg-red-50 text-red-600", label: "Cancelled" },
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse max-w-[1400px] mx-auto">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}</div>
      <div className="h-72 bg-gray-200 rounded-2xl" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[1400px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-4">
        <div>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">My Dashboard</p>
          <h1 className="text-2xl font-black text-zinc-900">Welcome back, {userName}</h1>
          <p className="text-sm text-zinc-400 mt-1">Explore authentic crafts and track your orders.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Link to="/products" className="flex items-center gap-2 px-4 py-1.5 text-sm border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 font-medium text-zinc-700 shadow-sm transition-all">
            <ShoppingBag size={14} /> Browse
          </Link>
          <Link to="/user-orders" className="flex items-center gap-2 px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all">
            <Package size={14} /> My Orders
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: stats.total, sub: "All time", color: "text-zinc-900" },
          { label: "Approved", value: stats.approved, sub: "Preparing to ship", color: "text-emerald-700" },
          { label: "Pending", value: stats.pending, sub: "Awaiting artisan", color: stats.pending > 0 ? "text-amber-600" : "text-zinc-900" },
          { label: "Total Spent", value: `₹${stats.spent.toLocaleString()}`, sub: "On approved orders", color: "text-indigo-700" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">{label}</p>
            <h3 className={`text-3xl font-black font-sans ${color}`}>{value}</h3>
            <p className="text-xs font-medium text-zinc-400 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Explore */}
      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Explore</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: "/products", icon: ShoppingBag, label: "Marketplace", desc: "Shop authentic crafts", color: "bg-amber-50 border-amber-100 text-amber-700" },
            { to: "/heritage", icon: Compass, label: "Heritage", desc: "Discover cultural stories", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
            { to: "/remedies", icon: Leaf, label: "Remedies", desc: "Traditional wellness", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
            { to: "/search", icon: Search, label: "Search", desc: "Find anything", color: "bg-zinc-50 border-zinc-200 text-zinc-700" },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to} className={`flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-sm ${color}`}>
              <Icon size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold">{label}</p>
                <p className="text-xs opacity-70 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-zinc-900">Recent Orders</h3>
          <Link to="/user-orders" className="text-xs font-bold text-indigo-600 hover:underline">View all</Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl">
            <ShoppingBag size={36} className="text-zinc-200 mx-auto mb-3" />
            <p className="text-zinc-500 font-medium mb-4">No orders yet</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              <ShoppingBag size={14} /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o, i) => {
              const s = o.status?.toLowerCase() || "pending";
              const cfg = statusConfig[s] || statusConfig.pending;
              const Icon = cfg.icon;
              return (
                <div key={i} className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.badge}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">{o.productName || "Artisan Order"}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        ₹{Number(o.price || o.totalAmount || 0).toLocaleString()}
                        {o.createdAt?.seconds && ` · ${new Date(o.createdAt.seconds * 1000).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${cfg.badge}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Personal Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
        <Link to="/user-suggestions" className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-zinc-200 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-800">Smart Suggestions</p>
            <p className="text-xs text-zinc-400 mt-1">AI-powered craft recommendations just for you.</p>
          </div>
        </Link>
        <Link to="/user-chat" className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-zinc-200 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
            <MessageSquare size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-800">Messages</p>
            <p className="text-xs text-zinc-400 mt-1">Chat directly with artisans about your orders.</p>
          </div>
        </Link>
      </div>

    </motion.div>
  );
};

export default UserDashboard;
