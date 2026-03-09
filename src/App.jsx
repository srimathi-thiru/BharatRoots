import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

import { collection, query, where, getDocs } from "firebase/firestore";

import FloatingChatbot from "./components/FloatingChatbot";
import CartButton from "./components/CartButton";

/* Pages */
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import RegisterArtisan from "./pages/RegisterArtisan";
import ArtisanLogin from "./pages/ArtisanLogin";   // ✅ added
import HeritageList from "./pages/HeritageList";
import AddHeritage from "./pages/AddHeritage";
import ArtisanProfile from "./pages/ArtisanProfile";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Verify from "./pages/Verify";
import AdminArtisanPanel from "./pages/AdminArtisanPanel";
import Search from "./pages/Search";
import HeritageDetail from "./pages/HeritageDetail";
import ProductDetail from "./pages/ProductDetail";
import MyOrders from "./pages/MyOrders";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";

/* NAVBAR */
function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isArtisan, setIsArtisan] = useState(false);

  useEffect(() => {
    if (currentUser) {
      checkIfArtisan();
    }
  }, [currentUser]);

  const checkIfArtisan = async () => {
    const q = query(
      collection(db, "artisans"),
      where("userId", "==", currentUser.uid)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      setIsArtisan(true);
    }
  };

  if (!currentUser) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-400">BharatRoots</h1>
        <div className="space-x-6">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/heritage">Heritage</Link>
          <Link to="/products">Marketplace</Link>

          {isArtisan && (
            <Link to="/my-orders">My Orders</Link>
          )}

          <Link to="/search">Search</Link>
          <CartButton />

          <button onClick={handleLogout} className="text-red-400">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

/* LAYOUT */
function Layout() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const isLanding = location.pathname === "/";

  const isAuthPage =
    location.pathname === "/login/user" ||
    location.pathname === "/register/user" ||
    location.pathname === "/register-artisan" ||
    location.pathname === "/login/artisan";

  if (!currentUser && !isLanding && !isAuthPage) {
    return <Navigate to="/login/user" replace />;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!isLanding && <Navbar />}

      {/* ✅ Only wrap NON-landing pages */}
      <div className={isLanding ? "" : "max-w-6xl mx-auto p-6"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login/user" element={<UserLogin />} />
            <Route path="/register/user" element={<UserRegister />} />
            <Route path="/register-artisan" element={<RegisterArtisan />} />
            <Route path="/login/artisan" element={<ArtisanLogin />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/heritage" element={<HeritageList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/search" element={<Search />} />
            <Route path="/artisan/:artisanId" element={<ArtisanProfile />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-heritage" element={<AddHeritage />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/admin-artisans" element={<AdminArtisanPanel />} />
            <Route path="/heritage/:id" element={<HeritageDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </AnimatePresence>

        {currentUser && <FloatingChatbot />}

      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/*" element={<Layout />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}