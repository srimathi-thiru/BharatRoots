import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";

const COLORS = ["#4338CA", "#F4F4F5"]; // Indigo-700, Zinc-100
const COLORS_ALT = ["#D97706", "#F4F4F5"]; // Amber-600, Zinc-100

const Skeleton = () => (
  <div className="space-y-6 animate-pulse max-w-[1400px] mx-auto">
    <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="h-24 bg-gray-200 rounded-lg"></div>
      <div className="h-24 bg-gray-200 rounded-lg"></div>
      <div className="h-24 bg-gray-200 rounded-lg"></div>
      <div className="h-24 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-80 bg-gray-200 rounded-lg"></div>
      <div className="space-y-6">
         <div className="h-40 bg-gray-200 rounded-lg"></div>
         <div className="h-40 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { userRole, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // States for real data
  const [stats, setStats] = useState({ products: 0, orders: 0, artisans: 0, heritage: 0, totalSales: 0 });
  const [chartData, setChartData] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  
  // Pie states
  const [prodVsHeritagePie, setProdVsHeritagePie] = useState([]);
  const [artisanPie, setArtisanPie] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const productsSnap = await getDocs(collection(db, "products"));
      const ordersSnap = await getDocs(collection(db, "orders"));
      const artisansSnap = await getDocs(collection(db, "artisans"));
      const heritageSnap = await getDocs(collection(db, "heritage"));

      // 1. STATS CALCULATION
      let totalSales = 0;
      const notifications = [];

      ordersSnap.docs.forEach((docSnap) => {
         const data = docSnap.data();
         totalSales += (Number(data.totalAmount) || Number(data.totalPrice) || 0);
         
         if (data.createdAt) {
           notifications.push({
             id: docSnap.id,
             type: 'order',
             text: `New order: ₹${Number(data.totalAmount || data.totalPrice || 0).toLocaleString()}`,
             date: data.createdAt.toDate()
           });
         }
      });

      setStats({
          products: productsSnap.size,
          orders: ordersSnap.size,
          artisans: artisansSnap.size,
          heritage: heritageSnap.size,
          totalSales: totalSales
      });

      // 2. LINE CHART CALCULATION (Products added over past week)
      const datesArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayCounts = {};
      
      productsSnap.docs.forEach((docSnap) => {
         const data = docSnap.data();
         if (data.createdAt) {
            const date = data.createdAt.toDate();
            const dayName = datesArray[date.getDay()];
            if (!dayCounts[dayName]) dayCounts[dayName] = { name: dayName, value: 0 };
            dayCounts[dayName].value += 1;
            
            notifications.push({
               id: docSnap.id,
               type: 'product',
               text: `New product: ${data.name || 'Untitled'}`,
               date: date
            });
         }
      });

      const finalChartData = datesArray.map(day => dayCounts[day] || { name: day, value: 0 });
      setChartData(finalChartData);

      // 3. PIE CHARTS CALCULATION
      const totalContent = productsSnap.size + heritageSnap.size;
      const prodPercent = totalContent > 0 ? (productsSnap.size / totalContent) * 100 : 50;
      setProdVsHeritagePie([
          { name: "Products", value: prodPercent },
          { name: "Heritage", value: 100 - prodPercent }
      ]);

      let verifiedArtisans = 0;
      artisansSnap.docs.forEach(docSnap => {
          if (docSnap.data().verified) verifiedArtisans += 1;
      });
      const artisanPercent = artisansSnap.size > 0 ? (verifiedArtisans / artisansSnap.size) * 100 : 0;
      setArtisanPie([
          { name: "Verified", value: artisanPercent },
          { name: "Unverified", value: 100 - artisanPercent }
      ]);

      // 4. NOTIFICATIONS
      notifications.sort((a, b) => b.date - a.date);
      setRecentNotifications(notifications.slice(0, 3)); // Keep top 3

    } catch (error) {
       console.error("Error fetching dashboard data:", error);
    } finally {
       setLoading(false);
    }
  };

  if (loading) {
     return <Skeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1400px] mx-auto space-y-6"
    >
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-4">
        <div className="flex space-x-6 text-sm font-medium text-zinc-500 overflow-x-auto">
          <button className="text-zinc-900 border-b-2 border-amber-500 pb-1 whitespace-nowrap">Overview</button>
          <button className="hover:text-zinc-800 pb-1 whitespace-nowrap transition-colors">Audiences</button>
          <button className="hover:text-zinc-800 pb-1 whitespace-nowrap transition-colors">Demographics</button>
          <button className="hover:text-zinc-800 pb-1 whitespace-nowrap transition-colors">More</button>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button className="px-4 py-1.5 text-sm border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 font-medium text-zinc-700 shadow-sm flex items-center transition-all">
             &lt; Share
          </button>
          <button className="px-4 py-1.5 text-sm border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50 font-medium text-zinc-700 shadow-sm transition-all">
             $ Print
          </button>
          <button className="px-4 py-1.5 text-sm bg-zinc-900 text-amber-500 rounded-lg hover:bg-black font-medium shadow-sm flex items-center transition-all">
             + Export
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div>
          <p className="text-sm text-zinc-500 font-semibold tracking-wider uppercase border-b border-zinc-100 pb-2">Total Products</p>
          <h3 className="text-3xl font-black text-zinc-900 mt-3 font-sans">{stats.products}</h3>
          <p className="text-xs text-emerald-500 font-bold mt-1">▲ Live Inventory</p>
        </div>
        <div>
          <p className="text-sm text-zinc-500 font-semibold tracking-wider uppercase border-b border-zinc-100 pb-2">Total Orders</p>
          <h3 className="text-3xl font-black text-zinc-900 mt-3 font-sans">{stats.orders}</h3>
          <p className="text-xs text-indigo-500 font-bold mt-1">● Lifetime Count</p>
        </div>
        <div>
          <p className="text-sm text-zinc-500 font-semibold tracking-wider uppercase border-b border-zinc-100 pb-2">Total Artisans</p>
          <h3 className="text-3xl font-black text-zinc-900 mt-3 font-sans">{stats.artisans}</h3>
          <p className="text-xs text-amber-600 font-bold mt-1">★ Active Partners</p>
        </div>
        <div>
          <p className="text-sm text-zinc-500 font-semibold tracking-wider uppercase border-b border-zinc-100 pb-2">Heritage Nodes</p>
          <h3 className="text-3xl font-black text-zinc-900 mt-3 font-sans">{stats.heritage}</h3>
          <p className="text-xs text-indigo-500 font-bold mt-1">⚑ Cultural Spots</p>
        </div>
      </div>

      {/* Main Grid: Chart + Right Blue Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Big Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="text-lg font-bold text-zinc-900">Platform Activity</h3>
                <p className="text-sm text-zinc-400 mt-1">Products added per day</p>
             </div>
             <div className="flex items-center space-x-4 text-sm font-medium">
                <span className="flex items-center text-zinc-600"><span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>Recent additions</span>
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A1A1AA' }} tickMargin={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A1A1AA' }} />
                <Tooltip cursor={{ stroke: '#f4f4f5', strokeWidth: 2 }} 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} />
                <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right side: Premium Card and Donuts */}
        <div className="space-y-6 flex flex-col">
           {/* Premium Summary Card */}
           <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-xl p-6 flex flex-col justify-between flex-1 relative overflow-hidden">
             <div className="z-10 relative">
                 <h3 className="text-xl font-display font-medium tracking-wide text-amber-500">Status Summary</h3>
                 <div className="mt-8 mb-2">
                     <p className="text-zinc-400 text-sm mb-1 uppercase tracking-widest font-bold">Total Sales (₹)</p>
                     <h2 className="text-5xl font-black font-sans text-white">
                        {stats.totalSales.toLocaleString()}
                     </h2>
                 </div>
             </div>
             {/* Decorative wave */}
             <svg className="absolute bottom-0 left-0 w-full h-24 opacity-30" viewBox="0 0 100 50" preserveAspectRatio="none">
                 <path d="M0,40 Q25,10 50,30 T100,20 L100,50 L0,50 Z" fill="rgba(245,158,11,0.1)" />
                 <path d="M0,50 Q25,30 50,40 T100,10" fill="none" stroke="#F59E0B" strokeWidth="2" />
             </svg>
           </div>

           {/* White Donut Charts Row */}
           <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 flex justify-around hover:shadow-md transition-shadow">
               <div className="flex flex-col items-center">
                   <div className="h-20 w-20 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={prodVsHeritagePie} innerRadius={28} outerRadius={36} fill="#8884d8" dataKey="value" stroke="none">
                            {prodVsHeritagePie.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="text-center mt-2">
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Market %</p>
                      <p className="text-sm font-black text-zinc-900">{prodVsHeritagePie[0]?.value.toFixed(1)}%</p>
                   </div>
               </div>
               <div className="flex flex-col items-center">
                   <div className="h-20 w-20 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={artisanPie} innerRadius={28} outerRadius={36} fill="#8884d8" dataKey="value" stroke="none">
                            {artisanPie.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_ALT[index % COLORS_ALT.length]} />)}
                          </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="text-center mt-2">
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Verified %</p>
                      <p className="text-sm font-black text-zinc-900">{artisanPie[0]?.value.toFixed(1)}%</p>
                   </div>
               </div>
           </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
         <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-zinc-900">Platform Overview</h3>
              <select className="text-sm bg-[#FCFAFA] border border-zinc-200 rounded-lg px-3 py-1.5 outline-none font-medium text-zinc-600 focus:ring-amber-500 focus:border-amber-500 transition-all">
                 <option>All time</option>
              </select>
            </div>
            <p className="text-sm text-zinc-400 mb-6">Volume indicator representing the distribution of entities within the platform.</p>
            {/* Placeholder for market graph */}
            <div className="h-40 bg-[#FCFAFA] rounded-xl relative flex items-end justify-between px-4 pb-2 pt-6 border-b border-zinc-200">
               <div className="w-8 bg-indigo-100 h-10 rounded-t-sm" title="Early Activity"></div>
               <div className="w-8 bg-indigo-200 h-24 rounded-t-sm" title="Mid Activity"></div>
               <div className="w-8 bg-indigo-300 h-32 rounded-t-sm" title="High Activity"></div>
               <div className="w-8 bg-zinc-200 h-16 rounded-t-sm" title="Dip"></div>
               <div className="w-8 bg-indigo-500 h-36 rounded-t-sm" title="Peak Activity"></div>
               <div className="w-8 bg-zinc-300 h-28 rounded-t-sm" title="Stabilization"></div>
               <div className="w-8 bg-zinc-200 h-20 rounded-t-sm" title="Current Level"></div>
            </div>
         </div>
         <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-zinc-900">Recent Activity</h3>
               <button className="bg-zinc-900 text-amber-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg hover:bg-black transition-all shadow border border-zinc-800">
                  +
               </button>
            </div>
            <div className="space-y-4">
               {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif, i) => (
                    <div key={i} className="flex items-center space-x-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${notif.type === 'order' ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
                           {notif.type === 'order' ? '₹' : '✓'}
                        </div>
                        <div>
                          <p className="text-sm text-zinc-800 font-semibold">{notif.text}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{notif.date.toLocaleString()}</p>
                        </div>
                    </div>
                  ))
               ) : (
                  <p className="text-zinc-500 text-sm italic">No recent activity detected.</p>
               )}
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;