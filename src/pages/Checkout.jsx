import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // If cart empty, redirect back to cart
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("You must be logged in to place an order.");
      navigate("/login/user");
      return;
    }

    setIsProcessing(true);

    try {
      // Loop through cart items and create an order for each (or one large order depending on db structure)
      // Since original ProductDetail created 1 order per item, we will create an order document per item.
      const orderPromises = cartItems.map((item) => {
        return addDoc(collection(db, "orders"), {
          userId: currentUser.uid,
          productId: item.id,
          artisanId: item.artisanId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          shippingDetails,
          status: "pending",
          createdAt: new Date(),
        });
      });

      await Promise.all(orderPromises);

      toast.success("Order placed successfully! 🎉");
      clearCart();
      navigate("/my-orders");

    } catch (error) {
      console.error("Order error:", error);
      toast.error("Payment failed or order could not be placed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const total = getCartTotal();

  return (
    <PageWrapper className="py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SHIPPING FORM */}
        <div className="md:w-2/3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Details</h2>
            
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="123 Artisan Lane"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingDetails.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="400001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="+91 9876543210"
                />
              </div>
            </form>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="md:w-1/3">
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Summary</h2>
            
            <div className="space-y-3 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate pr-4">{item.quantity}x {item.name}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-orange-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-800 font-bold text-lg pt-2 mt-2 border-t border-orange-200">
                <span>Total to Pay</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={isProcessing}
              className={`w-full mt-8 py-3.5 rounded-lg font-bold text-white transition shadow-sm ${
                isProcessing ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              }`}
            >
              {isProcessing ? "Processing..." : "Place Order (COD)"}
            </button>
            
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default Checkout;
