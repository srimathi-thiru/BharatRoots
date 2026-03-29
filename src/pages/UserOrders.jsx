import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import { MdShoppingBag, MdLocalShipping, MdCheckCircle, MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";

function UserOrders() {

  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  async function fetchOrders() {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const orderList = snapshot.docs.map(docItem => ({
        id: docItem.id,
        ...docItem.data()
      }));

      // Sort by latest created (simplistic sort since createdAt might be a firebase timestamp)
      orderList.sort((a, b) => {
         const timeA = a.createdAt?.seconds || 0;
         const timeB = b.createdAt?.seconds || 0;
         return timeB - timeA;
      });

      setOrders(orderList);
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      
      {/* BACKGROUND ELEMENTS (Warm, earthy) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        
        {/* EDITORIAL HEADER */}
        <div className="mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
            <MdShoppingBag className="text-stone-700" size={16} />
            <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Order History</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
            Track <span className="text-amber-600 italic">Purchases.</span>
          </h1>
          <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
            Monitor the status of your handcrafted goods and heritage commissions.
          </p>
        </div>

        {/* LOGISTICS HUB LIST */}
        <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden p-6 md:p-8 font-sans">
          
          {loading ? (
             <div className="flex justify-center flex-col items-center py-16 gap-4 border border-dashed border-stone-200 rounded-[2rem]">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-stone-500 italic font-medium">Fetching active shipments...</p>
             </div>
          ) : orders.length === 0 ? (
             <div className="bg-[#FAF7F2] rounded-[2rem] border border-dashed border-stone-300 p-16 text-center shadow-inner">
               <MdShoppingBag className="text-stone-300 mx-auto mb-4" size={48} />
               <h3 className="text-2xl font-display font-bold text-stone-800 mb-2">No Past Orders</h3>
               <p className="text-stone-500 mb-6 font-medium">You haven't purchased any artisan goods yet.</p>
               <Link to="/products" className="inline-flex px-6 py-3 bg-stone-900 text-white font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-stone-800 transition-colors">
                  Explore Marketplace
               </Link>
             </div>
          ) : (
            <div className="space-y-5">
              {orders.map(order => {
                const status = order.status ? order.status.toLowerCase() : "pending";
                
                let badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                let StatusIcon = MdLocalShipping;
                
                if (status === "approved") {
                   badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                   StatusIcon = MdCheckCircle;
                }
                if (status === "rejected") {
                   badgeClass = "bg-red-50 text-red-700 border-red-200";
                   StatusIcon = MdCancel;
                }

                return (
                  <div key={order.id} className="bg-white border border-stone-200 p-5 lg:p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row justify-between lg:items-center gap-6 hover:shadow-lg transition-all hover:border-stone-300 group">
                     
                     <div className="flex items-start gap-5">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${
                            status === "approved" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                            status === "rejected" ? "bg-red-50 border-red-100 text-red-600" :
                            "bg-amber-50 border-amber-100 text-amber-600"
                        }`}>
                           <StatusIcon size={28} />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 text-lg md:text-xl mb-1">{order.productName || "Custom Artisan Order"}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                             <p className="text-[10px] uppercase tracking-widest font-black text-stone-400 px-2 py-0.5 bg-stone-100 rounded">Order #{order.id.substring(0, 8)}</p>
                             {order.price && (
                               <p className="text-[11px] uppercase tracking-widest font-black text-emerald-700">₹{order.price} <span className="text-zinc-400">× {order.quantity || 1}</span></p>
                             )}
                          </div>
                          {order.artisanId && (
                             <p className="text-xs text-stone-500 font-medium mt-2">
                               Sold by: <Link to={`/artisan/${order.artisanId}`} className="text-amber-600 hover:underline">View Artisan</Link>
                             </p>
                          )}
                        </div>
                     </div>

                     <div className="flex flex-col items-start lg:items-end gap-2 w-full lg:w-auto mt-2 lg:mt-0">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border shadow-sm ${badgeClass}`}>
                          {status === "pending" ? "Awaiting Artisan" :
                           status === "approved" ? "Preparing to Ship" :
                           status === "rejected" ? "Cancelled by Artisan" : status}
                       </span>
                       
                       {status === "approved" && (
                         <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest bg-stone-50 px-3 py-1 rounded">Estimated Delivery: 5-7 Days</p>
                       )}
                     </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
}

export default UserOrders;
