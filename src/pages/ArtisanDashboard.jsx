import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { Plus, Package, BarChart3, Palette, Zap, Leaf, MessageCircle, TrendingUp, ShoppingBag } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const StatCard = ({ label, value, sub, accent }) => (
  <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">{label}</p>
    <h3 className={`text-3xl font-black font-sans ${accent || "text-zinc-900"}`}>{value}</h3>
    <p className="text-xs font-medium text-zinc-400 mt-2">{sub}</p>
  </div>
);

const ArtisanDashboard = () => {
  const { currentUser, userName } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, earnings: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => { if (currentUser) fetchData(); }, [currentUser]);

  const fetchData = async () => {
    try {
      const [productsSnap, ordersSnap] = await Promise.all([
        getDocs(query(collection(db, "products"), where("artisanId", "==", currentUser.uid))),
        getDocs(query(collection(db, "orders"), where("artisanId", "==", currentUser.uid))),
      ]);

      let earnings = 0, pending = 0;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlySales = {};

      const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      orders.forEach(o => {
        if (o.status?.toLowerCase() === "pending") pending++;
        if (o.status?.toLowerCase() !== "rejected") {
          earnings += Number(o.price || o.totalAmount || 0);
          if (o.createdAt?.seconds) {
            const m = months[new Date(o.createdAt.seconds * 1000).getMonth()];
            monthlySales[m] = (monthlySales[m] || 0) + Number(o.price || o.totalAmount || 0);
          }
        }
      });

      orders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRecentOrders(orders.slice(0, 4));

      const now = new Date();
      const last6 = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        return months[d.getMonth()];
      });
      setChartData(last6.map(m => ({ month: m, earnings: monthlySales[m] || 0 })));

      setStats({ products: productsSnap.size, orders: orders.length, pending, earnings });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse max-w-[1400px] mx-auto">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 h-72 bg-gray-200 rounded-2xl" /><div className="h-72 bg-gray-200 rounded-2xl" /></div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[1400px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-4">
        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mb-2">Artisan Studio</span>
          <h1 className="text-2xl font-black text-zinc-900">Welcome back, {userName}</h1>
          <p className="text-sm text-zinc-400 mt-1">Your craft business at a glance.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Link to="/add-product" className="flex items-center gap-2 px-4 py-1.5 text-sm border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 font-medium text-zinc-700 shadow-sm transition-all">
            <Plus size={14} /> Add Product
          </Link>
          <Link to="/order-command" className="flex items-center gap-2 px-4 py-1.5 text-sm bg-zinc-900 text-amber-500 rounded-lg hover:bg-black font-medium shadow-sm transition-all">
            <Package size={14} /> Orders {stats.pending > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.pending}</span>}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Products" value={stats.products} sub="Listed in marketplace" accent="text-zinc-900" />
        <StatCard label="Total Orders" value={stats.orders} sub="All time received" accent="text-indigo-700" />
        <StatCard label="Pending Orders" value={stats.pending} sub="Awaiting your action" accent={stats.pending > 0 ? "text-red-600" : "text-zinc-900"} />
        <StatCard label="Total Earnings" value={`₹${stats.earnings.toLocaleString()}`} sub="Approved orders only" accent="text-emerald-700" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: "/add-product", icon: Plus, label: "Add Product", color: "bg-amber-50 border-amber-100 text-amber-700" },
          { to: "/creator-studio", icon: Palette, label: "Creator Studio", color: "bg-purple-50 border-purple-100 text-purple-700" },
          { to: "/growth-insights", icon: BarChart3, label: "Growth Insights", color: "bg-blue-50 border-blue-100 text-blue-700" },
          { to: "/customer-connect", icon: MessageCircle, label: "Customer Connect", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
        ].map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to} className={`flex items-center gap-3 p-4 rounded-xl border font-semibold text-sm transition-all hover:shadow-sm ${color}`}>
            <Icon size={18} /> {label}
          </Link>
        ))}
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Earnings (Last 6 Months)</h3>
              <p className="text-sm text-zinc-400 mt-1">Revenue from approved orders</p>
            </div>
            <TrendingUp size={18} className="text-zinc-300" />
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#A1A1AA" }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#A1A1AA" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e4e4e7" }} formatter={(v) => [`₹${v}`, "Earnings"]} />
                <Bar dataKey="earnings" fill="#D97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-zinc-900">Recent Orders</h3>
            <Link to="/order-command" className="text-xs font-bold text-amber-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? recentOrders.map((o, i) => {
              const status = o.status?.toLowerCase() || "pending";
              const badge = status === "approved" ? "bg-emerald-50 text-emerald-700" : status === "rejected" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700";
              return (
                <div key={i} className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-zinc-800 truncate max-w-[140px]">{o.productName || "Order"}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">₹{Number(o.price || o.totalAmount || 0).toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${badge}`}>{status}</span>
                </div>
              );
            }) : (
              <div className="text-center py-8">
                <ShoppingBag size={32} className="text-zinc-200 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">No orders yet</p>
                <Link to="/products" className="text-xs text-amber-600 font-bold hover:underline mt-1 block">View marketplace</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Content CTA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-10">
        {[
          { to: "/add-heritage", icon: Zap, label: "Add Heritage Story", desc: "Share a cultural heritage site or tradition.", color: "border-amber-200 bg-amber-50" },
          { to: "/add-remedy", icon: Leaf, label: "Add Remedy", desc: "Document a traditional remedy or practice.", color: "border-emerald-200 bg-emerald-50" },
          { to: "/showcase", icon: Palette, label: "My Showcase", desc: "View and manage your public artisan profile.", color: "border-indigo-200 bg-indigo-50" },
        ].map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to} className={`flex items-start gap-4 p-5 rounded-2xl border transition-all hover:shadow-sm ${color}`}>
            <Icon size={20} className="mt-0.5 shrink-0 text-zinc-600" />
            <div>
              <p className="text-sm font-bold text-zinc-800">{label}</p>
              <p className="text-xs text-zinc-500 mt-1">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

    </motion.div>
  );
};

export default ArtisanDashboard;
