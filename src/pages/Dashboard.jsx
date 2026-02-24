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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* Dummy Analytics Data */
const analyticsData = [
  { name: "Mon", value: 30 },
  { name: "Tue", value: 45 },
  { name: "Wed", value: 60 },
  { name: "Thu", value: 50 },
  { name: "Fri", value: 80 },
];

const Dashboard = () => {
  const { userRole } = useContext(AuthContext);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500); // Skeleton loader
  }, []);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex items-center gap-4">
            <button className="relative">
              <FaBell size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded">
                3
              </span>
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded bg-gray-200 dark:bg-gray-700"
            >
              {dark ? <FaSun /> : <FaMoon />}
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
            className="space-y-10"
          >
            {/* WELCOME CARD */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold">
                Welcome to BharatRoots 🌏
              </h2>
              <p className="opacity-90 mt-1">
                Role: <b>{userRole}</b>
              </p>
            </motion.div>

            {/* ANALYTICS */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Platform Activity
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analyticsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ARTISAN PREVIEW */}
            {userRole !== "USER" && (
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Artisan Profile Preview
                </h3>

                <div className="flex items-center gap-4">
                  <FaUserTie size={40} className="text-indigo-500" />
                  <div>
                    <p className="font-bold">Ravi Kumar</p>
                    <p className="text-sm opacity-70">
                      Handloom Weaver • Tamil Nadu
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Recent Notifications
              </h3>

              <ul className="space-y-3 text-sm">
                <li>✅ Product verified successfully</li>
                <li>🧵 New artisan joined the platform</li>
                <li>📦 New product added</li>
              </ul>
            </div>

            {/* MARKETPLACE CARD */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-orange-400 to-yellow-400 p-6 rounded-xl shadow text-black"
            >
              <div className="flex items-center gap-4">
                <FaStore size={35} />
                <div>
                  <h3 className="text-xl font-bold">Marketplace Live</h3>
                  <p className="text-sm">
                    Discover verified Swadeshi products
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* 🔹 Skeleton Loader */
const Skeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-28 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
    <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
    <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
  </div>
);

export default Dashboard;