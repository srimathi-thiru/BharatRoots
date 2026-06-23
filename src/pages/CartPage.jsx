import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import PageWrapper from "../components/PageWrapper";
import { FaTrash, FaMinus, FaPlus, FaArrowRight } from "react-icons/fa";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <PageWrapper className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-zinc-200 text-center max-w-md w-full">
          <div className="bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-amber-100/50">
            <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black font-display tracking-tight text-zinc-900 mb-3">Your Cart is Empty</h2>
          <p className="text-zinc-500 mb-10 text-lg">Discover beautiful handcrafted items from verified artisans.</p>
          <Link
            to="/products"
            className="bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors block w-full shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-black font-display tracking-tight text-zinc-900 mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* CART ITEMS LIST */}
        <div className="lg:w-2/3 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-zinc-200 flex flex-col sm:flex-row items-center gap-4 relative group hover:shadow-md transition-shadow">
              <img src={item.imageUrl} alt={item.name} className="w-full sm:w-32 h-32 object-cover rounded-2xl bg-zinc-100" />
              
              <div className="flex-1 w-full text-center sm:text-left">
                <h3 className="text-xl font-bold text-zinc-900 font-display mb-1">{item.name}</h3>
                <p className="text-zinc-500 text-sm mb-3 line-clamp-1">{item.description}</p>
                <div className="text-indigo-600 font-black text-lg">₹{item.price}</div>
              </div>

              <div className="flex items-center gap-4 bg-[#FCFAFA] p-2 rounded-xl border border-zinc-200">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm border border-zinc-200 flex justify-center items-center hover:bg-zinc-50 text-zinc-600 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <FaMinus size={10} />
                </button>
                <span className="w-6 text-center font-bold text-zinc-800">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm border border-zinc-200 flex justify-center items-center hover:bg-zinc-50 text-zinc-600 transition-colors"
                >
                  <FaPlus size={10} />
                </button>
              </div>

              <div className="w-24 text-center sm:text-right hidden sm:block">
                <div className="font-black text-zinc-900 text-xl">
                  ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-3 bg-red-50 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                title="Remove item"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:w-1/3">
          <div className="bg-[#FCFAFA] p-6 md:p-8 rounded-[2rem] shadow-sm border border-zinc-200 sticky top-8">
            <h2 className="text-2xl font-black font-display text-zinc-900 mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-zinc-600 font-medium pb-4 border-b border-zinc-200 border-dashed">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="text-zinc-900 font-bold">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 font-medium pb-4 border-b border-zinc-200 border-dashed">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm">Free Delivery</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="font-bold text-zinc-500 uppercase tracking-widest text-sm">Total</span>
                <span className="text-4xl font-black text-indigo-900 font-display">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-zinc-900 text-amber-500 py-4 rounded-xl font-bold text-lg hover:bg-black transition-all flex justify-center items-center gap-3 shadow-md group"
            >
              Proceed to Checkout
              <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-xs text-center font-bold text-zinc-400 mt-6 uppercase tracking-widest">
              Secure payments by BharatRoots Promise
            </p>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default CartPage;
