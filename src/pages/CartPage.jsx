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
      <PageWrapper className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md w-full">
          <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Discover beautiful handcrafted items from verified artisans.</p>
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition block"
          >
            Start Shopping
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* CART ITEMS LIST */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-1">{item.description}</p>
                <div className="text-indigo-600 font-semibold">₹{item.price} each</div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200 text-gray-600 transition"
                  disabled={item.quantity <= 1}
                >
                  <FaMinus size={12} />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200 text-gray-600 transition"
                >
                  <FaPlus size={12} />
                </button>
              </div>

              <div className="w-24 text-right">
                <div className="font-bold text-gray-800">
                  ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free Delivery</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-indigo-700">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-lg font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2 shadow-sm shadow-indigo-200"
            >
              Proceed to Checkout
              <FaArrowRight size={14} />
            </button>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Secure payments powered by BharatRoots Promise.
            </p>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default CartPage;
