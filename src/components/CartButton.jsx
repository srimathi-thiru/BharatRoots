import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

const CartButton = () => {
  const { cartItems } = useContext(CartContext);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link to="/cart" className="relative text-white hover:text-indigo-400 transition flex items-center">
      <FaShoppingCart size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px]">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
