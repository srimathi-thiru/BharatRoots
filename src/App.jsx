import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

import FloatingChatbot from "./components/FloatingChatbot";

/* Pages */
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import RegisterArtisan from "./pages/RegisterArtisan";
import ArtisanLogin from "./pages/ArtisanLogin";
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

/* New Pages */
import AddRemedy from "./pages/AddRemedy";
import CreatorStudio from "./pages/CreatorStudio";
import MyShowcase from "./pages/MyShowcase";
import OrderCommand from "./pages/OrderCommand";
import GrowthInsights from "./pages/GrowthInsights";
import CustomerConnect from "./pages/CustomerConnect";
import SmartSuggestions from "./pages/SmartSuggestions";

/* 🔐 ROLE PROTECTION */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole } = useContext(AuthContext);

  const role = userRole?.toLowerCase();

  if (!currentUser) {
    return <Navigate to="/login/user" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

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

  const RoutesContent = (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/register/user" element={<UserRegister />} />
        <Route path="/register-artisan" element={<RegisterArtisan />} />
        <Route path="/login/artisan" element={<ArtisanLogin />} />

        {/* Common */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/heritage" element={<HeritageList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/artisan/:artisanId" element={<ArtisanProfile />} />
        <Route path="/heritage/:id" element={<HeritageDetail />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/remedies" element={<Remedies />} />

        {/* Artisan + Admin */}
        <Route path="/add-product" element={
          <ProtectedRoute allowedRoles={["artisan", "admin"]}>
            <AddProduct />
          </ProtectedRoute>
        } />

        <Route path="/add-heritage" element={
          <ProtectedRoute allowedRoles={["artisan", "admin"]}>
            <AddHeritage />
          </ProtectedRoute>
        } />

        <Route path="/add-remedy" element={
          <ProtectedRoute allowedRoles={["artisan", "admin"]}>
            <AddRemedy />
          </ProtectedRoute>
        } />

        <Route path="/my-orders" element={
          <ProtectedRoute allowedRoles={["artisan"]}>
            <MyOrders />
          </ProtectedRoute>
        } />

        {/* Creator Hub (Artisan only) */}
        <Route path="/creator-studio" element={
          <ProtectedRoute allowedRoles={["artisan"]}>
            <CreatorStudio />
          </ProtectedRoute>
        } />

        <Route path="/showcase" element={
          <ProtectedRoute allowedRoles={["artisan"]}>
            <MyShowcase />
          </ProtectedRoute>
        } />

        <Route path="/order-command" element={
          <ProtectedRoute allowedRoles={["artisan"]}>
            <OrderCommand />
          </ProtectedRoute>
        } />

        <Route path="/growth-insights" element={
          <ProtectedRoute allowedRoles={["artisan"]}>
            <GrowthInsights />
          </ProtectedRoute>
        } />

        <Route path="/customer-connect" element={
          <ProtectedRoute allowedRoles={["artisan"]}>
            <CustomerConnect />
          </ProtectedRoute>
        } />

        <Route path="/smart-suggestions" element={
          <ProtectedRoute allowedRoles={["artisan"]}>
            <SmartSuggestions />
          </ProtectedRoute>
        } />

        {/* Admin Only */}
        <Route path="/admin-artisans" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminArtisanPanel />
          </ProtectedRoute>
        } />

        <Route path="/verify" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Verify />
          </ProtectedRoute>
        } />

      </Routes>
    </AnimatePresence>
  );

  return (
    <>
      <Toaster position="top-center" />

      {currentUser && !isLanding && !isAuthPage ? (
        <DashboardLayout>
          {RoutesContent}
          <FloatingChatbot />
        </DashboardLayout>
      ) : (
        <div>
          {RoutesContent}
        </div>
      )}
    </>
  );
}

/* APP ROOT */
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