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

function MyOrders() {

  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {

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
    <div>

      <h2 className="text-3xl font-bold mb-6">
        Purchase Requests
      </h2>

      {orders.length === 0 ? (
        <p>No purchase requests yet</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-white shadow-md p-4 mb-4 rounded">

            <p><b>Product ID:</b> {order.productId}</p>
            <p><b>Buyer ID:</b> {order.userId}</p>
            <p><b>Status:</b> {order.status}</p>

            {order.status === "pending" && (
              <div className="mt-2">

                <button
                  onClick={() => updateOrderStatus(order.id, "approved")}
                  className="bg-green-600 text-white px-4 py-2 mr-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateOrderStatus(order.id, "rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>

              </div>
            )}

          </div>
        ))
      )}

    </div>
  );
}

export default MyOrders;