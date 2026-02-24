import React, { useContext } from "react";
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
import { auth } from "./firebaseConfig";

import FloatingChatbot from "./components/FloatingChatbot";

/* Pages */
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import HeritageList from "./pages/HeritageList";
import AddHeritage from "./pages/AddHeritage";
import RegisterArtisan from "./pages/RegisterArtisan";
import ArtisanProfile from "./pages/ArtisanProfile";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Verify from "./pages/Verify";
import AdminArtisanPanel from "./pages/AdminArtisanPanel";
import Search from "./pages/Search";

/* NAVBAR */
function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
          <Link to="/search">Search</Link>
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
    location.pathname === "/register/user";

  /* 🔥 SINGLE GUARD (VERY IMPORTANT) */
  if (!currentUser && !isLanding && !isAuthPage) {
    return <Navigate to="/login/user" replace />;
  }

  return (
    <>
      {!isLanding && <Navbar />}

      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/register/user" element={<UserRegister />} />

          {/* PROTECTED (simple check already done above) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/heritage" element={<HeritageList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/search" element={<Search />} />
          <Route path="/register-artisan" element={<RegisterArtisan />} />
          <Route path="/artisan/:artisanId" element={<ArtisanProfile />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/add-heritage" element={<AddHeritage />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/admin-artisans" element={<AdminArtisanPanel />} />
        </Routes>

        {currentUser && <FloatingChatbot />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}