import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import { MdPersonOutline, MdEmail, MdStorefront, MdAdminPanelSettings } from "react-icons/md";
import EditProfileModal from "../components/EditProfileModal";

import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

// --- REUSABLE COMPONENTS & CONSTANTS ---
const StatCard = ({ label, value }) => (
  <div className="bg-[#FCFAFA] p-6 rounded-2xl border shadow-inner">
    <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-1">{label}</p>
    <h2 className="text-2xl font-black text-zinc-900">{value}</h2>
  </div>
);

const SectionHeader = ({ title }) => (
  <h3 className="text-sm font-bold text-zinc-400 mb-4 border-b pb-2">{title}</h3>
);

const STYLES = {
  cardBase: "bg-[#FCFAFA] p-6 rounded-2xl border shadow-inner",
  listItem: "flex justify-between items-center py-3 border-b border-zinc-200/50 text-sm",
  fallbackText: "Not added"
};
// ---------------------------------------

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
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [adminMetrics, setAdminMetrics] = useState({ totalArtisans: 0, totalProducts: 0 });

  const role = userRole?.toLowerCase() || "user";

  // 🔥 Fetch persistent data
  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        // 1. Fetch persistent personal info
        let loadedProfile = { name: userName || "", phone: "", address: "", dob: "" };
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
           const ud = userDocSnap.data();
           loadedProfile = { 
             ...loadedProfile, 
             phone: ud.phone || ud.mobile || "", 
             address: ud.address || "", 
             dob: ud.dob || "", 
             name: ud.name || loadedProfile.name 
           };
        }

        // 2. Fetch role-specific data
        if (role === "user") {
          const ordersQuery = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
          const ordersSnap = await getDocs(ordersQuery);
          const data = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          setOrders(data);
        } else if (role === "artisan") {
          // Fetch artisan specific profile overrides
          const artisanQuery = query(collection(db, "artisans"), where("userId", "==", currentUser.uid));
          const artisanSnap = await getDocs(artisanQuery);
          if (!artisanSnap.empty) {
             const ad = artisanSnap.docs[0].data();
             loadedProfile.name = ad.name || loadedProfile.name;
             loadedProfile.phone = ad.contact || loadedProfile.phone;
             loadedProfile.address = ad.address || loadedProfile.address;
             loadedProfile.dob = ad.dob || loadedProfile.dob;
          }

          // Fetch products
          const productQuery = query(collection(db, "products"), where("artisanId", "==", currentUser.uid));
          const productSnap = await getDocs(productQuery);
          const pData = productSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setArtisanProducts(pData);
        } else if (role === "admin") {
          const artisansSnap = await getDocs(collection(db, "artisans"));
          const productsSnap = await getDocs(collection(db, "products"));
          setAdminMetrics({
            totalArtisans: artisansSnap.size,
            totalProducts: productsSnap.size
          });
        }
        
        setProfileData(loadedProfile);
        
      } catch (error) {
        console.error("Error fetching profile metrics:", error);
      }
    };

    fetchData();
  }, [currentUser, role, userName]);

  // 🔥 Save to Firestore
  const handleSaveProfile = async (data) => {
    try {
      const loadingToast = toast.loading("Updating profile...");

      // Update base users collection
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        name: data.name,
        phone: data.phone,
        address: data.address,
        dob: data.dob
      });

      // If artisan, ALSO update the artisan collection for sync
      if (role === "artisan") {
        const artisanQuery = query(collection(db, "artisans"), where("userId", "==", currentUser.uid));
        const artisanSnap = await getDocs(artisanQuery);
        if (!artisanSnap.empty) {
          const artisanDocRef = doc(db, "artisans", artisanSnap.docs[0].id);
          await updateDoc(artisanDocRef, {
            name: data.name,
            contact: data.phone, // mapping internal app structure
            address: data.address,
            dob: data.dob
          });
        }
      }

      setProfileData((prev) => ({ ...prev, ...data }));
      toast.success("Profile permanently updated!", { id: loadingToast });
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile to database.");
    }
  };

  if (!currentUser) return null;

  return (
    <PageWrapper className="py-12 px-4 max-w-5xl mx-auto">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-zinc-200 relative overflow-hidden">

        {/* Decorative Graphic Base on Role */}
        {role === "artisan" ? (
           <MdStorefront className="absolute -right-10 -top-10 text-indigo-50/50" size={250} />
        ) : role === "admin" ? (
           <MdAdminPanelSettings className="absolute -right-10 -top-10 text-indigo-50/50" size={250} />
        ) : (
           <MdPersonOutline className="absolute -right-10 -top-10 text-indigo-50/50" size={250} />
        )}

        {/* HEADER */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 border-b border-zinc-100 pb-10 mb-10">
          
          <div className="h-32 w-32 rounded-full bg-zinc-900 text-amber-400 flex items-center justify-center font-display font-black text-6xl shadow-xl border-4 border-white shrink-0">
            {(profileData.name || "U")[0].toUpperCase()}
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-zinc-900 mb-2">
              {profileData.name || "User"}
            </h1>

            <div className="flex items-center gap-2 text-zinc-500 bg-[#FCFAFA] px-4 py-2 rounded-xl border w-fit mx-auto md:mx-0">
              <MdEmail size={18} className="text-indigo-400" />
              <span className="text-sm">{currentUser.email}</span>
            </div>

            <div className="mt-4 flex gap-3 flex-wrap justify-center md:justify-start">
              <span className="bg-indigo-50 text-indigo-700 border px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest">
                {role}
              </span>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-xs shadow-sm hover:bg-blue-600 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 DYNAMIC STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {role === "user" && (
            <>
              <StatCard label="Total Orders" value={orders.length} />
              <StatCard label="Total Spent" value={`₹${orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0)}`} />
            </>
          )}

          {role === "artisan" && (
            <>
              <StatCard label="Total Products Listed" value={artisanProducts.length} />
              <StatCard label="Estimated Catalog Value" value={`₹${artisanProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0)}`} />
            </>
          )}

          {role === "admin" && (
            <>
              <StatCard label="Registered Artisans" value={adminMetrics.totalArtisans} />
              <StatCard label="Global Active Products" value={adminMetrics.totalProducts} />
            </>
          )}
        </div>

        {/* PERSONAL + ACCOUNT DETAILS (Shared across all) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={STYLES.cardBase}>
            <SectionHeader title="Personal Information" />
            <div className="space-y-3 text-sm">
              <p><span className="text-zinc-400 font-medium">Phone:</span> {profileData.phone || STYLES.fallbackText}</p>
              <p><span className="text-zinc-400 font-medium">DOB:</span> {profileData.dob || STYLES.fallbackText}</p>
              <p><span className="text-zinc-400 font-medium">Address:</span> {profileData.address || STYLES.fallbackText}</p>
            </div>
          </div>

          <div className={STYLES.cardBase}>
            <SectionHeader title="Account Details" />
            <div className="space-y-4">
              <p className="text-emerald-600 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Account
              </p>
              <p className="text-sm text-zinc-600">
                Member Since:{" "}
                <span className="font-bold">
                   {currentUser.metadata?.creationTime
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                      : "Recently Joined"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 DYNAMIC LIST SECTION */}
        <div className={`mt-8 ${STYLES.cardBase}`}>
          
          {role === "user" && (
            <>
              <SectionHeader title="Recent Orders" />
              {orders.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {orders.map((order) => (
                    <div key={order.id} className={STYLES.listItem}>
                      <div>
                        <p className="font-bold text-zinc-800">{order.productName || `Order #${order.id.substring(0, 8)}`}</p>
                        <p className="text-xs text-zinc-400">
                          {order.createdAt?.seconds
                            ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md ${
                        order.status === "approved" ? "bg-green-100 text-green-700" :
                        order.status === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {order.status || "pending"}
                      </span>
                      <span className="font-black text-zinc-900">₹{order.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {role === "artisan" && (
            <>
              <SectionHeader title="Your Catalog Preview" />
              {artisanProducts.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No products listed yet.</p>
              ) : (
                <div className="space-y-3">
                  {artisanProducts.slice(0, 5).map(product => (
                    <div key={product.id} className={STYLES.listItem}>
                       <div className="flex items-center gap-4">
                          {product.imageUrl ? (
                             <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-zinc-200 shadow-sm" />
                          ) : (
                             <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400"><MdStorefront size={20}/></div>
                          )}
                          <div>
                            <p className="font-bold text-zinc-800 text-base">{product.name}</p>
                            <p className="text-xs text-zinc-400 line-clamp-1 max-w-[200px]">{product.description}</p>
                          </div>
                       </div>
                       <span className="font-black text-indigo-600 text-lg">₹{product.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {role === "admin" && (
            <>
              <SectionHeader title="System Status Console" />
              <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 rounded-xl">
                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                 <p className="font-bold text-sm tracking-wide">All platform services are secure and fully operational.</p>
              </div>
            </>
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