import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBell,
  FaMoon,
  FaSun,
  FaUserTie,
  FaStore,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageWrapper from "../components/PageWrapper";

const Dashboard = () => {
  const { userRole, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // State to hold real metrics
  const [chartData, setChartData] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [artisanProfile, setArtisanProfile] = useState(null);

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

      // Fetch chart data (let's aggregate products over time)
      const productsSnapshot = await getDocs(collection(db, "products"));
      
      const dayCounts = {};
      const datesArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const notifications = [];

      productsSnapshot.docs.forEach((docSnap) => {
         const data = docSnap.data();
         
         // Analytics Aggregation (Count products added per weekday)
         if (data.createdAt) {
            const date = data.createdAt.toDate();
            const dayName = datesArray[date.getDay()];
            
            if (!dayCounts[dayName]) {
               dayCounts[dayName] = { name: dayName, value: 0 };
            }
            dayCounts[dayName].value += 1;
         }

         // Collect all products for notifications if they are recent
         notifications.push({
            id: docSnap.id,
            text: `📦 New product added: ${data.name}`,
            date: data.createdAt ? data.createdAt.toDate() : new Date(0)
         });
      });

      // Prepare Chart Data
      const finalChartData = datesArray
        .map(day => dayCounts[day] || { name: day, value: 0 });
      setChartData(finalChartData);

      // Fetch Orders for Notifications
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      ordersSnapshot.docs.forEach((docSnap) => {
         const data = docSnap.data();
         notifications.push({
            id: docSnap.id,
            text: `🛒 New order received for Product ID: ${data.productId}`,
            date: data.createdAt ? data.createdAt.toDate() : new Date() // Assume created now if no timestamp
         });
      });

      // Sort notifications by date (newest first)
      notifications.sort((a, b) => b.date - a.date);
      setRecentNotifications(notifications.slice(0, 3)); // Keep top 3

      // If Artisan, fetch their profile details
      if (userRole === "ARTISAN" && currentUser) {
          const artisanQuery = query(
             collection(db, "artisans"),
             where("userId", "==", currentUser.uid)
          );
          const artisanSnapshot = await getDocs(artisanQuery);
          if (!artisanSnapshot.empty) {
             setArtisanProfile(artisanSnapshot.docs[0].data());
          }
      }

    } catch (error) {
       console.error("Error fetching dashboard data:", error);
    } finally {
       setLoading(false);
    }
  };

  return (
    <PageWrapper>
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-600 hover:text-indigo-600 transition">
              <FaBell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {recentNotifications.length}
              </span>
            </button>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <Skeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* WELCOME CARD */}
            <motion.div
              className="bg-indigo-50 border border-indigo-100 p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-2xl font-bold text-indigo-700">
                Welcome to BharatRoots 🌏
              </h2>
              <p className="text-gray-600 mt-2">
                Logged in as: <span className="font-semibold text-gray-800">{userRole}</span>
              </p>
            </motion.div>

            {/* ANALYTICS */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Platform Activity (Products Added)
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={4}
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ARTISAN PREVIEW */}
              {(userRole === "ARTISAN" && artisanProfile) && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Artisan Profile Preview
                  </h3>

                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <FaUserTie size={32} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">{artisanProfile.name}</p>
                      <p className="text-sm text-gray-500">
                        {artisanProfile.specialization} • {artisanProfile.location || "India"}
                      </p>
                      {artisanProfile.verified && (
                         <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mt-2 font-medium">
                            ✔ Verified Artisan
                         </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MARKETPLACE CARD (Alternate for users/admins or supplementary) */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center gap-5 cursor-pointer hover:shadow-lg transition">
                <div className="bg-green-100 p-4 rounded-full">
                  <FaStore size={32} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Marketplace Live</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Discover verified Swadeshi products directly from artisans.
                  </p>
                  <span className="inline-block text-green-600 font-semibold text-sm mt-2">
                     Browse Products &rarr;
                  </span>
                </div>
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Notifications
              </h3>

              <ul className="space-y-4">
                 {recentNotifications.length > 0 ? (
                    recentNotifications.map(notification => (
                       <li key={notification.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                          <p className="text-gray-700 font-medium">{notification.text}</p>
                          <div className="text-xs text-gray-400 mt-1">
                             {notification.date.toLocaleString()}
                          </div>
                       </li>
                    ))
                 ) : (
                    <li className="text-gray-500 italic">No new notifications.</li>
                 )}
              </ul>
            </div>
          </motion.div>
        )}
    </PageWrapper>
  );
};

/* 🔹 Skeleton Loader */
const Skeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-28 bg-gray-200 rounded-lg"></div>
    <div className="h-64 bg-gray-200 rounded-lg"></div>
    <div className="h-32 bg-gray-200 rounded-lg"></div>
  </div>
);

export default Dashboard;