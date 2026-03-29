import React, { useContext, useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { MdLocalShipping, MdOutlineInventory2, MdCheckCircle, MdCancel } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";

const OrderCommand = () => {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Metrics
  const [metrics, setMetrics] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalVolume: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, "orders"),
        where("artisanId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(docItem => ({
        id: docItem.id,
        ...docItem.data()
      }));
      
      // Calculate metrics
      let pendingCount = 0;
      let approvedCount = 0;
      let rejectedCount = 0;
      let volume = 0;
      
      data.forEach(order => {
        if (!order.status || order.status.toLowerCase() === "pending") pendingCount++;
        else if (order.status.toLowerCase() === "approved") approvedCount++;
        else if (order.status.toLowerCase() === "rejected") rejectedCount++;
        
        // Sum total volume from approved/pending orders
        if (order.price && order.status?.toLowerCase() !== "rejected") {
           volume += Number(order.price);
        }
      });
      
      setMetrics({ pending: pendingCount, approved: approvedCount, rejected: rejectedCount, totalVolume: volume });
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync logistics hub.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    const loadingToast = toast.loading(`Updating order status to ${newStatus}...`);
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      await fetchOrders();
      toast.success(`Order ${newStatus} successfully.`, { id: loadingToast });
    } catch(err) {
      toast.error("Failed to update status. Please try again.", { id: loadingToast });
    }
  };

  return (
    <PageWrapper className="w-full bg-[#FAF7F2] min-h-[90vh] pb-24 px-4 md:px-8 py-10 overflow-hidden relative">
      
      {/* BACKGROUND ELEMENTS (Warm, earthy) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/40 hidden lg:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* EDITORIAL HEADER */}
        <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 border border-stone-300 mb-6 font-sans">
              <MdLocalShipping className="text-stone-700" size={16} />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Fulfillment Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-stone-900 font-display">
              Order <span className="text-emerald-600 italic">Command.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-xl">
              Review and process global requests for your authentic handmade goods. Manage your logistics pipeline securely.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 min-w-[200px]">
             <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                <MdOutlineInventory2 size={28} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-1 font-sans">Pending Dispatches</p>
                <p className="text-2xl font-bold text-stone-800">{metrics.pending} <span className="text-sm font-medium text-stone-400">awaiting</span></p>
             </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-6 rounded-[1.5rem] border border-stone-200 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-sans"><MdCheckCircle className="text-emerald-500" size={16} /> Verified Orders</p>
              <p className="text-4xl font-display font-bold text-stone-800">{metrics.approved}</p>
           </div>
           <div className="bg-white p-6 rounded-[1.5rem] border border-stone-200 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-sans"><MdCancel className="text-red-500" size={16} /> Declined Orders</p>
              <p className="text-4xl font-display font-bold text-stone-800">{metrics.rejected}</p>
           </div>
           <div className="bg-white p-6 rounded-[1.5rem] border border-stone-200 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-sans"><MdLocalShipping className="text-stone-500" size={16} /> Pipeline Value</p>
              <p className="text-4xl font-display font-bold text-stone-800">₹{metrics.totalVolume.toLocaleString()}</p>
           </div>
        </div>

        {/* LOGISTICS HUB LIST */}
        <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden p-6 md:p-8 font-sans">
           <h2 className="flex items-center gap-2 font-bold text-stone-800 mb-8 uppercase tracking-widest text-xs">
            <MdOutlineInventory2 className="text-emerald-600 w-4 h-4" /> Global Order Ledger
          </h2>
          
          {loading ? (
             <div className="flex justify-center flex-col items-center py-16 gap-4 border border-dashed border-stone-200 rounded-[2rem]">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-stone-500 italic font-medium">Syncing logistics ledger...</p>
             </div>
          ) : orders.length === 0 ? (
             <div className="bg-[#FAF7F2] rounded-[2rem] border border-dashed border-stone-300 p-16 text-center shadow-inner">
               <MdLocalShipping className="text-stone-300 mx-auto mb-4" size={48} />
               <h3 className="text-2xl font-display font-bold text-stone-800 mb-2">No Active Orders</h3>
               <p className="text-stone-500 mb-6 font-medium">You currently have no incoming requests for your handmade goods.</p>
             </div>
          ) : (
            <div className="space-y-5">
              {orders.map(order => {
                const status = order.status ? order.status.toLowerCase() : "pending";
                
                let badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                if (status === "approved") badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                if (status === "rejected") badgeClass = "bg-red-50 text-red-700 border-red-200";

                return (
                  <div key={order.id} className="bg-white border border-stone-200 p-5 lg:p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row justify-between lg:items-center gap-6 hover:shadow-lg transition-all hover:border-stone-300 group">
                     
                     <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-stone-200 flex items-center justify-center text-stone-400 shrink-0 group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                           <MdLocalShipping size={28} />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 text-lg md:text-xl mb-1">{order.productName || order.productId || "Custom Artisan Order"}</p>
                          <div className="flex flex-wrap items-center gap-3">
                             <p className="text-[10px] uppercase tracking-widest font-black text-stone-400 px-2 py-0.5 bg-stone-100 rounded">Order #{order.id.substring(0, 8)}</p>
                             {order.price && (
                               <p className="text-[11px] uppercase tracking-widest font-black text-emerald-700">₹{order.price}</p>
                             )}
                          </div>
                        </div>
                     </div>

                     <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto mt-2 lg:mt-0">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border shadow-sm ${badgeClass}`}>
                          {status}
                       </span>
                       
                       {status === "pending" && (
                         <div className="flex gap-2 ml-auto lg:ml-0 bg-stone-50 p-1.5 rounded-xl border border-stone-200">
                           <button onClick={() => updateStatus(order.id, "Approved")} className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                             <MdCheckCircle size={16} /> Verify
                           </button>
                           <button onClick={() => updateStatus(order.id, "Rejected")} className="px-5 py-2.5 bg-white text-red-600 border border-stone-200 text-xs font-bold rounded-lg shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors flex items-center gap-1.5">
                             <MdCancel size={16} /> Decline
                           </button>
                         </div>
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
};

export default OrderCommand;