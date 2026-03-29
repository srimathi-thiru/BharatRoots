import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import PageWrapper from "../components/PageWrapper";
import toast from "react-hot-toast";
import { MdCreditCard, MdMoney, MdQrCodeScanner } from "react-icons/md";

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

  const [paymentMethod, setPaymentMethod] = useState("card");
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
      if (paymentMethod !== "cod") {
        toast("Initiating secure payment gateway...", { icon: '🔒' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Payment successful!");
      }

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
          paymentMethod,
          status: "pending",
          createdAt: new Date(),
        });
      });

      await Promise.all(orderPromises);

      toast.success("Order placed successfully! 🎉");
      clearCart();
      navigate("/user-orders");

    } catch (error) {
      console.error("Order error:", error);
      toast.error("Payment failed or order could not be placed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const total = getCartTotal();

  return (
    <PageWrapper className="py-8 px-4 max-w-5xl mx-auto">
      <h1 className="text-4xl font-black font-display tracking-tight text-zinc-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SHIPPING FORM */}
        <div className="lg:w-2/3">
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-zinc-200">
            <h2 className="text-2xl font-black font-display text-zinc-900 mb-8 border-b border-zinc-100 pb-4">Shipping Details</h2>
            
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 bg-[#FCFAFA] border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white outline-none transition-all font-medium text-zinc-900"
                  placeholder="e.g. Aditi Sharma"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 bg-[#FCFAFA] border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white outline-none transition-all font-medium text-zinc-900"
                  placeholder="123 Heritage Lane, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 bg-[#FCFAFA] border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white outline-none transition-all font-medium text-zinc-900"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingDetails.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 bg-[#FCFAFA] border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white outline-none transition-all font-medium text-zinc-900"
                    placeholder="400001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 bg-[#FCFAFA] border border-zinc-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white outline-none transition-all font-medium text-zinc-900"
                  placeholder="+91 98765 43210"
                />
              </div>
            </form>

            <div className="mt-12">
               <h2 className="text-2xl font-black font-display text-zinc-900 mb-6 border-b border-zinc-100 pb-4">Payment Method</h2>
               <div className="space-y-4">
                 <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-50/50' : 'border-zinc-200 hover:border-amber-300'}`}>
                   <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-amber-600 border-zinc-300 focus:ring-amber-500 accent-amber-500" />
                   <MdCreditCard className="mx-4 text-zinc-500" size={28} />
                   <span className="font-bold text-zinc-900">Credit / Debit Card</span>
                 </label>

                 <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-amber-500 bg-amber-50/50' : 'border-zinc-200 hover:border-amber-300'}`}>
                   <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 text-amber-600 border-zinc-300 focus:ring-amber-500 accent-amber-500" />
                   <MdQrCodeScanner className="mx-4 text-zinc-500" size={28} />
                   <span className="font-bold text-zinc-900">UPI (GPay, PhonePe, Paytm)</span>
                 </label>

                 <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-amber-500 bg-amber-50/50' : 'border-zinc-200 hover:border-amber-300'}`}>
                   <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-amber-600 border-zinc-300 focus:ring-amber-500 accent-amber-500" />
                   <MdMoney className="mx-4 text-zinc-500" size={28} />
                   <span className="font-bold text-zinc-900">Cash on Delivery</span>
                 </label>
               </div>
            </div>

          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:w-1/3">
          <div className="bg-zinc-900 text-white p-8 rounded-[2rem] shadow-xl border border-zinc-800 sticky top-8 relative overflow-hidden">
            {/* Background design */}
            <svg className="absolute top-0 right-0 w-32 h-32 opacity-10 translate-x-8 -translate-y-8" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="50" fill="#F59E0B" />
            </svg>

            <h2 className="text-2xl font-black font-display text-white mb-8 relative z-10">Payment Summary</h2>
            
            <div className="space-y-4 mb-8 relative z-10">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="truncate pr-4 text-zinc-400 font-medium">
                    <span className="text-amber-500 font-bold mr-2">{item.quantity}x</span> 
                    {item.name}
                  </span>
                  <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-6 space-y-4 relative z-10">
              <div className="flex justify-between text-zinc-400 font-medium">
                <span>Subtotal</span>
                <span className="text-white">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-medium pb-4 border-b border-zinc-800 border-dashed">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Free</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total to Pay</span>
                <span className="text-4xl font-black font-display text-amber-500">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={isProcessing}
              className={`w-full mt-10 py-4 rounded-xl font-bold text-lg transition-all shadow-md relative z-10 flex justify-center items-center ${
                isProcessing ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700" : "bg-amber-500 text-zinc-900 hover:bg-amber-400 border border-amber-400 shadow-amber-500/20"
              }`}
            >
              {isProcessing ? "Processing..." : paymentMethod === 'cod' ? "Place Order (COD)" : `Pay Securely ₹${total.toFixed(2)}`}
            </button>
            
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default Checkout;
