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

/* New User Pages matching Use Case */
import UserOrders from "./pages/UserOrders";
import UserSmartSuggestions from "./pages/UserSmartSuggestions";
import UserChat from "./pages/UserChat";

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

        <Route path="/heritage" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <HeritageList />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <ProductList />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <Search />
          </ProtectedRoute>
        } />
        <Route path="/artisan/:artisanId" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <ArtisanProfile />
          </ProtectedRoute>
        } />
        <Route path="/heritage/:id" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <HeritageDetail />
          </ProtectedRoute>
        } />
        <Route path="/product/:id" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <ProductDetail />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/remedies" element={
          <ProtectedRoute allowedRoles={["user", "artisan", "admin"]}>
             <Remedies />
          </ProtectedRoute>
        } />

        {/* User Specific Use Cases */}
        <Route path="/user-orders" element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <UserOrders />
          </ProtectedRoute>
        } />
        <Route path="/user-suggestions" element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <UserSmartSuggestions />
          </ProtectedRoute>
        } />
        <Route path="/user-chat" element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <UserChat />
          </ProtectedRoute>
        } />

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