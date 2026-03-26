import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";

function MyOrders() {

  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  async function fetchOrders() {

    if (!currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("artisanId", "==", currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const orderList = snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    }));

    setOrders(orderList);
  };

  const updateOrderStatus = async (orderId, status) => {

    const orderRef = doc(db, "orders", orderId);

    await updateDoc(orderRef, {
      status: status
    });

    fetchOrders();
  };

  return (
    <PageWrapper className="py-8 px-4 max-w-5xl mx-auto">

      <h2 className="text-4xl font-black font-display tracking-tight text-zinc-900 mb-8 pb-4 border-b border-zinc-200">
        Purchase Requests
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-zinc-200 text-center">
           <p className="text-zinc-500 font-bold text-lg">No purchase requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">

              <div className="space-y-2">
                <p className="text-sm"><span className="font-bold text-zinc-400 uppercase tracking-widest text-[10px] mr-2 block mb-1">Product</span> <span className="font-bold text-zinc-900">{order.productName || order.productId}</span></p>
                <p className="text-sm"><span className="font-bold text-zinc-400 uppercase tracking-widest text-[10px] mr-2 block mb-1">Buyer ID</span> <span className="font-mono text-zinc-600 text-xs">{order.userId}</span></p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Status</span>
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md ${
                    order.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                    order.status === "rejected" ? "bg-red-50 text-red-700 border border-red-100" :
                    "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {order.status === "pending" && (
                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => updateOrderStatus(order.id, "approved")}
                    className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm text-sm"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateOrderStatus(order.id, "rejected")}
                    className="flex-1 md:flex-none bg-red-50 text-red-600 hover:bg-red-500 hover:text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm border border-red-100 hover:border-red-500 text-sm"
                  >
                    Reject
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </PageWrapper>
  );
}

export default MyOrders;