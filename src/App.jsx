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
import UserProfile from "./pages/UserProfile";
import Remedies from "./pages/Remedies";
import DashboardLayout from "./components/layout/DashboardLayout";

/* NAVBAR */
function Navbar() {
  const { currentUser, userRole } = useContext(AuthContext);
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
    <nav className="w-full bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3 h-10">
          <img
            src="/bharatroots-logo.svg"
            alt="BharatRoots Logo"
            className="h-10 w-10"
          />
          <h1 className="text-3xl font-bold text-blue-400">BharatRoots</h1>
        </div>
        <div className="flex items-center space-x-6 h-10">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/heritage">Heritage</Link>
          <Link to="/products">Marketplace</Link>
          <Link to="/remedies">Remedies</Link>

          {isArtisan && (
            <>
              <Link to="/my-orders">My Orders</Link>
              <Link to="/add-product" className="text-green-400 font-bold ml-4 border border-green-400 px-3 py-1 rounded hover:bg-green-800 transition">
                + Add Product
              </Link>
            </>
          )}

          <Link to="/search">Search</Link>
          
          {(userRole === "ADMIN" || userRole === "admin") && (
            <>
              <Link to="/add-product" className="text-green-300 font-bold ml-4 border border-green-400 px-3 py-1 rounded hover:bg-green-800 transition">
                + Add Product
              </Link>
              <Link to="/add-heritage" className="text-purple-300 font-bold ml-4 border border-purple-400 px-3 py-1 rounded hover:bg-purple-800 transition">
                + Add Heritage
              </Link>
              <Link to="/admin-artisans" className="text-blue-300 font-bold ml-4 border border-blue-400 px-3 py-1 rounded hover:bg-blue-800 transition">
                Admin Analytics
              </Link>
            </>
          )}

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

  const RoutesContent = (
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
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/remedies" element={<Remedies />} />
      </Routes>
    </AnimatePresence>
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* 
        If it's auth pages, show old Navbar and constrained container.
        If it's landing, show no Navbar and full width.
        If it's authenticated (dashboard, etc), show DashboardLayout.
      */}
      {(!currentUser && isAuthPage) && <Navbar />}
      
      {currentUser && !isLanding && !isAuthPage ? (
        <DashboardLayout>
           {RoutesContent}
           <FloatingChatbot />
        </DashboardLayout>
      ) : (
        <div className={(isLanding || isAuthPage) ? "" : "max-w-6xl mx-auto p-6"}>
          {RoutesContent}
        </div>
      )}
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