import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FaUsers, FaPalette, FaExclamationTriangle } from "react-icons/fa";

function AdminArtisanPanel() {

  const { userRole } = useContext(AuthContext);
  const [artisans, setArtisans] = useState([]);
  const [heritageData, setHeritageData] = useState([]);
  const [regionStats, setRegionStats] = useState([]);
  const [endangeredStats, setEndangeredStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Colors for charts
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']; // Indigo, Emerald, Amber, Red, Violet

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // 1. Fetch Artisans
    const artisanSnap = await getDocs(collection(db, "artisans"));
    const artisanList = artisanSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setArtisans(artisanList);

    // 2. Fetch Heritage Data for Analytics
    const heritageSnap = await getDocs(collection(db, "heritage"));
    const hData = heritageSnap.docs.map(doc => doc.data());
    setHeritageData(hData);

    // 3. Aggregate Regions
    const regionAgg = {};
    hData.forEach(h => {
       const reg = h.region || "Unknown";
       regionAgg[reg] = (regionAgg[reg] || 0) + 1;
    });
    
    const formattedRegions = Object.keys(regionAgg).map(key => ({
      name: key,
      count: regionAgg[key]
    })).sort((a,b) => b.count - a.count).slice(0, 5); // Top 5
    
    setRegionStats(formattedRegions);

    // 4. Determine "Endangered" Categories (Categories with least entries)
    const catAgg = {};
    hData.forEach(h => {
       const cat = h.category || "Uncategorized";
       catAgg[cat] = (catAgg[cat] || 0) + 1;
    });

    const formattedCats = Object.keys(catAgg).map(key => ({
      name: key,
      value: catAgg[key]
    })).sort((a,b) => a.value - b.value); // Sort ascending to show most endangered first

    setEndangeredStats(formattedCats);
    setLoading(false);
  };

  const verifyArtisan = async (id) => {

    const artisanRef = doc(db, "artisans", id);

    await updateDoc(artisanRef, {
      verified: true
    });

    fetchArtisans();
  };

  const normalizedRole = userRole?.toLowerCase();
  if (normalizedRole !== "admin") {
    return (
      <div className="flex justify-center items-center py-20">
        <h2 className="text-2xl text-red-600 font-bold">Access Denied: Administrator level required.</h2>
      </div>
    );
  }

  return (
    <PageWrapper className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black font-display tracking-tight mb-2 text-zinc-900">
          Analytics & Monitoring Dashboard
        </h1>
        <p className="text-zinc-500 mb-8 font-medium">System overview and artisan verification queue.</p>

        {loading ? (
           <div className="text-center py-20 text-indigo-600 font-bold flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              Loading Platform Analytics...
           </div>
        ) : (
          <>
            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow flex items-center gap-5">
                <div className="bg-zinc-900 p-4 rounded-xl text-amber-500 shadow-sm border border-zinc-800">
                   <FaUsers size={28} />
                </div>
                <div>
                   <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Artisans</p>
                   <p className="text-3xl font-black text-zinc-900 mt-1">{artisans.length}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow flex items-center gap-5">
                <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
                   <FaPalette size={28} />
                </div>
                <div>
                   <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Heritage Sites</p>
                   <p className="text-3xl font-black text-zinc-900 mt-1">{heritageData.length}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow flex items-center gap-5">
                <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600 shadow-sm border border-emerald-100">
                   <FaExclamationTriangle size={28} />
                </div>
                <div>
                   <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Endangered Craft</p>
                   <p className="text-xl font-bold text-zinc-900 mt-1 line-clamp-1">
                     {endangeredStats.length > 0 ? endangeredStats[0].name : "N/A"}
                   </p>
                </div>
              </div>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
               
               {/* Region Bar Chart */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-bold text-zinc-900 mb-6 font-display">Regional Engagement (Top 5)</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                        <XAxis dataKey="name" tick={{fill: '#71717a', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#71717a', fontSize: 12}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f4f4f5'}} contentStyle={{borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}} />
                        <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Endangered Pie Chart */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-bold text-zinc-900 mb-6 flex justify-between items-center font-display">
                    Art Form Availability Level
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-100 px-2 py-1 rounded">Smaller slice = Endangered</span>
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={endangeredStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {endangeredStats.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                         </Pie>
                         <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}} />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="flex justify-center flex-wrap gap-4 mt-2">
                      {endangeredStats.map((entry, index) => (
                         <div key={entry.name} className="flex items-center gap-2 text-xs text-zinc-600 font-bold uppercase tracking-wide">
                            <span className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                            {entry.name} ({entry.value})
                         </div>
                      ))}
                   </div>
                </div>

             </div>

             {/* ARTISAN VERIFICATION TABLE */}
             <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow">
               <div className="p-6 border-b border-zinc-100 bg-[#FCFAFA] flex justify-between items-center">
                  <div>
                     <h2 className="text-lg font-bold text-zinc-900 font-display">Artisan Verifications</h2>
                     <p className="text-xs text-zinc-500 font-medium">Review pending applications below.</p>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-[#FCFAFA] text-zinc-500 text-xs font-bold uppercase tracking-widest border-b border-zinc-200">
                     <tr>
                       <th className="px-6 py-4">Artisan Name</th>
                       <th className="px-6 py-4">Region</th>
                       <th className="px-6 py-4">Specialization</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-100">
                     {artisans.map(artisan => (
                       <tr key={artisan.id} className="hover:bg-zinc-50 transition-colors">
                         <td className="px-6 py-4 font-bold text-zinc-900">{artisan.name}</td>
                         <td className="px-6 py-4 text-zinc-600 font-medium">{artisan.region}</td>
                         <td className="px-6 py-4 text-zinc-600 font-medium">{artisan.specialization}</td>
                         <td className="px-6 py-4">
                           {artisan.verified ? (
                             <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md">Verified</span>
                           ) : (
                             <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md">Pending Review</span>
                           )}
                         </td>
                         <td className="px-6 py-4">
                           {!artisan.verified && (
                             <button
                               onClick={() => verifyArtisan(artisan.id)}
                               className="text-amber-600 hover:text-amber-800 font-bold text-sm transition-colors border-b border-transparent hover:border-amber-600"
                             >
                               Approve Identity
                             </button>
                           )}
                         </td>
                       </tr>
                     ))}
                     {artisans.length === 0 && (
                       <tr>
                         <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 italic font-medium">No artisans found in the network.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </PageWrapper>
  );
}

export default AdminArtisanPanel;
