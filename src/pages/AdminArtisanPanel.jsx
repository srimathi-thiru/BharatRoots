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
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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

  if (userRole !== "ADMIN" && userRole !== "admin") {
    return (
      <div className="flex justify-center items-center py-20">
        <h2 className="text-2xl text-red-600 font-bold">Access Denied: Administrator level required.</h2>
      </div>
    );
  }

  return (
    <PageWrapper className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Analytics & Monitoring Dashboard
        </h1>

      <h1 className="text-3xl font-bold mb-6">
        Artisan Verification Panel
      </h1>

        {loading ? (
           <div className="text-center py-20 text-indigo-600">Loading Platform Analytics...</div>
        ) : (
          <>
            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                   <FaUsers size={28} />
                </div>
                <div>
                   <p className="text-gray-500 text-sm font-medium">Total Artisans</p>
                   <p className="text-2xl font-bold text-gray-800">{artisans.length}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-full text-green-600">
                   <FaPalette size={28} />
                </div>
                <div>
                   <p className="text-gray-500 text-sm font-medium">Mapped Heritage Sites</p>
                   <p className="text-2xl font-bold text-gray-800">{heritageData.length}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center gap-4">
                <div className="bg-red-100 p-4 rounded-full text-red-600">
                   <FaExclamationTriangle size={28} />
                </div>
                <div>
                   <p className="text-red-500 text-sm font-medium">Critically Endangered Craft</p>
                   <p className="text-xl font-bold text-gray-800">
                     {endangeredStats.length > 0 ? endangeredStats[0].name : "N/A"}
                   </p>
                </div>
              </div>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
               
               {/* Region Bar Chart */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Regional Engagement (Top 5)</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Endangered Pie Chart */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-6 flex justify-between items-center">
                    Art Form Availability Level
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">Smaller slice = Endangered</span>
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
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center flex-wrap gap-4 mt-2">
                     {endangeredStats.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                           <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                           {entry.name} ({entry.value})
                        </div>
                     ))}
                  </div>
               </div>

            </div>

            {/* ARTISAN VERIFICATION TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                 <h2 className="text-lg font-bold text-gray-800">Pending Artisan Verifications</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                      <th className="px-6 py-4 font-medium">Artisan Name</th>
                      <th className="px-6 py-4 font-medium">Region</th>
                      <th className="px-6 py-4 font-medium">Specialization</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {artisans.map(artisan => (
                      <tr key={artisan.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-800">{artisan.name}</td>
                        <td className="px-6 py-4 text-gray-600">{artisan.region}</td>
                        <td className="px-6 py-4 text-gray-600">{artisan.specialization}</td>
                        <td className="px-6 py-4">
                          {artisan.verified ? (
                            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Verified</span>
                          ) : (
                            <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-medium">Pending Review</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {!artisan.verified && (
                            <button
                              onClick={() => verifyArtisan(artisan.id)}
                              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition"
                            >
                              Approve Identity
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {artisans.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No artisans found in the network.</td>
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
