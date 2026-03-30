import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, Package, Compass, BarChart3, TrendingUp } from "lucide-react";

const COLORS = ["#4338CA", "#F4F4F5"];
const COLORS_ALT = ["#D97706", "#F4F4F5"];

const StatCard = ({ label, value, sub, color }) => (
  <div>
    <p className="text-sm text-zinc-500 font-semibold tracking-wider uppercase border-b border-zinc-100 pb-2">{label}</p>
    <h3 className={`text-3xl font-black mt-3 font-sans ${color || "text-zinc-900"}`}>{value}</h3>
    <p className="text-xs font-bold mt-1 text-zinc-400">{sub}</p>
  </div>
);

const AdminDashboard = () => {
  const { userName } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0, artisans: 0, heritage: 0, totalSales: 0 });
  const [chartData, setChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [prodVsHeritagePie, setProdVsHeritagePie] = useState([]);
  const [artisanPie, setArtisanPie] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [productsSnap, ordersSnap, artisansSnap, heritageSnap] = await Promise.all([
        getDocs(collection(db, "products")),
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "artisans")),
        getDocs(collection(db, "heritage")),
      ]);

      let totalSales = 0;
      const activity = [];
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayCounts = {};

      ordersSnap.docs.forEach(d => {
        const data = d.data();
        totalSales += Number(data.totalAmount || data.totalPrice || 0);
        if (data.createdAt) activity.push({ type: "order", text: `New order: ₹${Number(data.totalAmount || data.totalPrice || 0).toLocaleString()}`, date: data.createdAt.toDate() });
      });

      productsSnap.docs.forEach(d => {
        const data = d.data();
        if (data.createdAt) {
          const day = days[data.createdAt.toDate().getDay()];
          dayCounts[day] = { name: day, value: (dayCounts[day]?.value || 0) + 1 };
          activity.push({ type: "product", text: `New product: ${data.name || "Untitled"}`, date: data.createdAt.toDate() });
        }
      });

      setStats({ products: productsSnap.size, orders: ordersSnap.size, artisans: artisansSnap.size, heritage: heritageSnap.size, totalSales });
      setChartData(days.map(d => dayCounts[d] || { name: d, value: 0 }));

      const total = productsSnap.size + heritageSnap.size;
      const prodPct = total > 0 ? (productsSnap.size / total) * 100 : 50;
      setProdVsHeritagePie([{ name: "Products", value: prodPct }, { name: "Heritage", value: 100 - prodPct }]);

      let verified = 0;
      artisansSnap.docs.forEach(d => { if (d.data().verified) verified++; });
      const artPct = artisansSnap.size > 0 ? (verified / artisansSnap.size) * 100 : 0;
      setArtisanPie([{ name: "Verified", value: artPct }, { name: "Unverified", value: 100 - artPct }]);

      activity.sort((a, b) => b.date - a.date);
      setRecentActivity(activity.slice(0, 4));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse max-w-[1400px] mx-auto">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-lg" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-gray-200 rounded-lg" />
        <div className="space-y-6"><div className="h-40 bg-gray-200 rounded-lg" /><div className="h-40 bg-gray-200 rounded-lg" /></div>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[1400px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-4">
        <div>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Admin Console</p>
          <h1 className="text-2xl font-black text-zinc-900">Welcome back, {userName}</h1>
          <p className="text-sm text-zinc-400 mt-1">Full platform overview — all roles, all data.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Link to="/admin-artisans" className="flex items-center gap-2 px-4 py-1.5 text-sm border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 font-medium text-zinc-700 shadow-sm transition-all">
            <Users size={14} /> Artisan Panel
          </Link>
          <Link to="/verify" className="flex items-center gap-2 px-4 py-1.5 text-sm bg-zinc-900 text-amber-500 rounded-lg hover:bg-black font-medium shadow-sm transition-all">
            <ShieldCheck size={14} /> Verify Products
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Products" value={stats.products} sub="▲ Live Inventory" />
        <StatCard label="Total Orders" value={stats.orders} sub="● Lifetime Count" />
        <StatCard label="Total Artisans" value={stats.artisans} sub="★ Active Partners" />
        <StatCard label="Heritage Nodes" value={stats.heritage} sub="⚑ Cultural Spots" />
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: "/admin-artisans", icon: Users, label: "Manage Artisans", color: "bg-amber-50 border-amber-100 text-amber-700" },
          { to: "/verify", icon: ShieldCheck, label: "Verify Products", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
          { to: "/products", icon: Package, label: "All Products", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
          { to: "/heritage", icon: Compass, label: "Heritage Sites", color: "bg-zinc-50 border-zinc-200 text-zinc-700" },
        ].map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to} className={`flex items-center gap-3 p-4 rounded-xl border font-semibold text-sm transition-all hover:shadow-sm ${color}`}>
            <Icon size={18} /> {label}
          </Link>
        ))}
      </div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Platform Activity</h3>
              <p className="text-sm text-zinc-400 mt-1">Products added per day of week</p>
            </div>
            <BarChart3 size={18} className="text-zinc-300" />
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#A1A1AA" }} tickMargin={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#A1A1AA" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e4e4e7" }} />
                <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: "#4F46E5" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="bg-zinc-900 text-white rounded-2xl shadow-xl p-6 flex flex-col justify-between flex-1 relative overflow-hidden">
            <div className="z-10 relative">
              <h3 className="text-lg font-medium tracking-wide text-amber-500">Total Revenue</h3>
              <div className="mt-6">
                <p className="text-zinc-400 text-xs mb-1 uppercase tracking-widest font-bold">Platform Sales (₹)</p>
                <h2 className="text-4xl font-black text-white">{stats.totalSales.toLocaleString()}</h2>
              </div>
            </div>
            <svg className="absolute bottom-0 left-0 w-full h-20 opacity-30" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path d="M0,50 Q25,30 50,40 T100,10" fill="none" stroke="#F59E0B" strokeWidth="2" />
            </svg>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-5 flex justify-around hover:shadow-md transition-shadow">
            {[
              { data: prodVsHeritagePie, colors: COLORS, label: "Market %", value: prodVsHeritagePie[0]?.value },
              { data: artisanPie, colors: COLORS_ALT, label: "Verified %", value: artisanPie[0]?.value },
            ].map(({ data, colors, label, value }, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-20 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data} innerRadius={28} outerRadius={36} dataKey="value" stroke="none">
                        {data.map((_, idx) => <Cell key={idx} fill={colors[idx % colors.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-2">{label}</p>
                <p className="text-sm font-black text-zinc-900">{value?.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow pb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-zinc-900">Recent Activity</h3>
          <TrendingUp size={16} className="text-zinc-300" />
        </div>
        <div className="space-y-3">
          {recentActivity.length > 0 ? recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${item.type === "order" ? "bg-emerald-500" : "bg-indigo-600"}`}>
                {item.type === "order" ? "₹" : "✓"}
              </div>
              <div>
                <p className="text-sm text-zinc-800 font-semibold">{item.text}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{item.date.toLocaleString()}</p>
              </div>
            </div>
          )) : <p className="text-zinc-400 text-sm italic">No recent activity.</p>}
        </div>
      </div>

    </motion.div>
  );
};

export default AdminDashboard;
