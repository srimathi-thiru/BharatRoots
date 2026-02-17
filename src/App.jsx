import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";


import Register from "./pages/Register";
import AddHeritage from "./pages/AddHeritage";
import HeritageList from "./pages/HeritageList";
import Login from "./pages/Login";
import RegisterArtisan from "./pages/RegisterArtisan";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import VerifyProduct from "./pages/VerifyProduct";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import AdminArtisanPanel from "./pages/AdminArtisanPanel";
import ArtisanProfile from "./pages/ArtisanProfile";
import Verify from "./pages/Verify";
import FloatingChatbot from "./components/FloatingChatbot";


function App() {
  const handleLogout = async () => {
    await signOut(auth);
  };


  const { currentUser, userRole } = useContext(AuthContext);

  return (
    <Router>

      {/* Full Page Wrapper */}
      <div className="min-h-screen w-full bg-gray-100">

        {/* Navbar */}
        <nav className="bg-gray-900 text-white px-8 py-4 shadow-lg">

          <div className="flex justify-between items-center">

            <h1 className="text-3xl font-bold text-blue-400">
              BharatRoots
            </h1>

            <div className="space-x-6">
              {userRole === "ADMIN" && (
                <Link to="/admin-artisans">Admin Panel</Link>
              )}

              <Link to="/search">Search</Link>

              <Link to="/" className="hover:text-blue-400">Heritage</Link>

              <Link to="/products" className="hover:text-blue-400">Marketplace</Link>

              <Link to="/verify" className="hover:text-blue-400">Verify</Link>

              <Link to="/register-artisan" className="hover:text-blue-400">Artisan</Link>

              {userRole === "ADMIN" && (
                <Link to="/add-heritage" className="hover:text-blue-400">
                  Add Heritage
                </Link>
              )}

              <Link to="/add-product" className="hover:text-blue-400">
                Add Product
              </Link>

              {currentUser ? (
                  <button
                    onClick={handleLogout}
                    className="hover:text-red-400"
                  >
                    Logout
                  </button>
              ) : (
                  <Link to="/login" className="hover:text-blue-400">
                    Login
                  </Link>
              )}

              <Link to="/dashboard" className="hover:text-blue-400">
                Dashboard
              </Link>

              <Link to="/verify">Verify</Link>

            </div>

          </div>

          {/* Logged-in user info */}
          {currentUser && (
            <div className="text-sm text-gray-300 mt-2">
              Logged in as: {currentUser.email} | Role: {userRole}
            </div>
          )}

        </nav>

        {/* Page Content */}
        <div className="max-w-6xl mx-auto p-6">

          <Routes>

            <Route path="/" element={<HeritageList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-heritage" element={<AddHeritage />} />
            <Route path="/register-artisan" element={<RegisterArtisan />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/verify" element={<VerifyProduct />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin-artisans" element={<AdminArtisanPanel />} />
            <Route path="/artisan/:artisanId" element={<ArtisanProfile />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
          <FloatingChatbot />


        </div>

      </div>

    </Router>
  );
}

export default App;
