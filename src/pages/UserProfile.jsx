import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import { MdPersonOutline, MdEmail } from "react-icons/md";
import EditProfileModal from "../components/EditProfileModal";
import { getUserOrders } from "../services/orderService";

function UserProfile() {
  const { currentUser, userName, userRole } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName || "",
    phone: "",
    address: "",
    dob: "",
  });

  const [orders, setOrders] = useState([]);

  // 🔥 Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getUserOrders(currentUser?.uid);
      setOrders(data);
    };

    if (currentUser) fetchOrders();
  }, [currentUser]);

  const handleSaveProfile = (data) => {
    setProfileData((prev) => ({ ...prev, ...data }));
  };

  if (!currentUser) return null;

  // 🔥 Derived Data (IMPORTANT)
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <PageWrapper className="py-12 px-4 max-w-5xl mx-auto">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-zinc-200 relative overflow-hidden">

        {/* Decorative Graphic */}
        <MdPersonOutline className="absolute -right-10 -top-10 text-indigo-50/50" size={250} />

        {/* HEADER */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 border-b border-zinc-100 pb-10 mb-10">
          
          <div className="h-32 w-32 rounded-full bg-zinc-900 text-amber-400 flex items-center justify-center font-display font-black text-6xl shadow-xl border-4 border-white">
            {(profileData.name || "U")[0].toUpperCase()}
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-zinc-900 mb-2">
              {profileData.name || "User"}
            </h1>

            <div className="flex items-center gap-2 text-zinc-500 bg-[#FCFAFA] px-4 py-2 rounded-xl border w-fit">
              <MdEmail size={18} className="text-indigo-400" />
              <span className="text-sm">{currentUser.email}</span>
            </div>

            <div className="mt-4 flex gap-3 flex-wrap">
              <span className="bg-indigo-50 text-indigo-700 border px-4 py-1.5 rounded-md text-xs font-bold">
                {userRole || "USER"}
              </span>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-xs hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-[#FCFAFA] p-6 rounded-2xl border shadow-inner">
            <p className="text-xs text-zinc-400 uppercase mb-1">Total Orders</p>
            <h2 className="text-2xl font-bold text-zinc-900">{totalOrders}</h2>
          </div>

          <div className="bg-[#FCFAFA] p-6 rounded-2xl border shadow-inner">
            <p className="text-xs text-zinc-400 uppercase mb-1">Total Spent</p>
            <h2 className="text-2xl font-bold text-zinc-900">₹{totalSpent}</h2>
          </div>

        </div>

        {/* PERSONAL + ACCOUNT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PERSONAL INFO */}
          <div className="bg-[#FCFAFA] p-6 rounded-2xl border shadow-inner">
            <h3 className="text-sm font-bold text-zinc-400 mb-4 border-b pb-2">
              Personal Information
            </h3>

            <div className="space-y-3 text-sm">
              <p><span className="text-zinc-400">Phone:</span> {profileData.phone || "Not added"}</p>
              <p><span className="text-zinc-400">DOB:</span> {profileData.dob || "Not added"}</p>
              <p><span className="text-zinc-400">Address:</span> {profileData.address || "Not added"}</p>
            </div>
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="bg-[#FCFAFA] p-6 rounded-2xl border shadow-inner">
            <h3 className="text-sm font-bold text-zinc-400 mb-4 border-b pb-2">
              Account Details
            </h3>

            <div className="space-y-4">
              <p className="text-emerald-600">● Active Account</p>

              <p className="text-sm text-zinc-600">
                Member Since:{" "}
                {currentUser.metadata?.creationTime
                  ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                  : "Recently Joined"}
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 ORDERS SECTION (ENHANCED) */}
        <div className="mt-8 bg-[#FCFAFA] p-6 rounded-2xl border shadow-inner">
          <h3 className="text-sm font-bold text-zinc-400 mb-4 border-b pb-2">
            Recent Orders
          </h3>

          {orders.length === 0 ? (
            <p className="text-sm text-zinc-500">No orders yet</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center py-3 border-b text-sm"
              >
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-xs text-zinc-400">{order.date}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {order.status}
                </span>

                <span className="font-semibold">₹{order.amount}</span>
              </div>
            ))
          )}
        </div>

      </div>

      {/* MODAL */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={profileData}
        onSave={handleSaveProfile}
      />
    </PageWrapper>
  );
}

export default UserProfile;