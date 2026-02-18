import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

import ProtectedRoute from "./components/ProtectedRoute";
import FloatingChatbot from "./components/FloatingChatbot";

/* Pages */
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import HeritageList from "./pages/HeritageList";
import AddHeritage from "./pages/AddHeritage";

import RegisterArtisan from "./pages/RegisterArtisan";
import ArtisanProfile from "./pages/ArtisanProfile";

import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";

import Verify from "./pages/Verify";
import AdminArtisanPanel from "./pages/AdminArtisanPanel";
import Search from "./pages/Search";


/* Navbar Component */
function Navbar() {

  const { currentUser, userRole } = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) return null;

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 shadow-lg">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-blue-400">
          BharatRoots
        </h1>

        <div className="space-x-6">

          <Link to="/dashboard">Dashboard</Link>

          <Link to="/heritage">Heritage</Link>

          <Link to="/products">Marketplace</Link>

          <Link to="/search">Search</Link>

          {userRole === "USER" && (
            <Link to="/register-artisan">
              Become Artisan
            </Link>
          )}

          {(userRole === "ARTISAN" || userRole === "ADMIN") && (
            <Link to="/add-product">
              Add Product
            </Link>
          )}

          {userRole === "ADMIN" && (
            <>
              <Link to="/add-heritage">
                Add Heritage
              </Link>

              <Link to="/verify">
                Verify
              </Link>

              <Link to="/admin-artisans">
                Admin Panel
              </Link>
            </>
          )}

          <button
            onClick={() => signOut(auth)}
            className="text-red-400"
          >
            Logout
          </button>

        </div>

      </div>

      <div className="text-sm text-gray-300 mt-2">
        Logged in as: {currentUser.email} | Role: {userRole}
      </div>

    </nav>
  );
}


/* Layout Controller */
function Layout() {

  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  return (

    <>
      {!isLandingPage && <Navbar />}

      {/* FULL WIDTH for Landing Page */}
      {isLandingPage ? (

        <LandingPage />

      ) : (

        /* Container Width for App Pages */
        <div className="max-w-6xl mx-auto p-6">

          <Routes>

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["USER","ARTISAN","ADMIN"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/heritage"
              element={
                <ProtectedRoute allowedRoles={["USER","ARTISAN","ADMIN"]}>
                  <HeritageList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute allowedRoles={["USER","ARTISAN","ADMIN"]}>
                  <ProductList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute allowedRoles={["USER","ARTISAN","ADMIN"]}>
                  <Search />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-artisan"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <RegisterArtisan />
                </ProtectedRoute>
              }
            />

            <Route
              path="/artisan/:artisanId"
              element={
                <ProtectedRoute allowedRoles={["USER","ARTISAN","ADMIN"]}>
                  <ArtisanProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-product"
              element={
                <ProtectedRoute allowedRoles={["ARTISAN","ADMIN"]}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-heritage"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AddHeritage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/verify"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Verify />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-artisans"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminArtisanPanel />
                </ProtectedRoute>
              }
            />

          </Routes>

          {currentUser && <FloatingChatbot />}

        </div>

      )}

    </>

  );
}


function App() {

  return (

    <Router>

      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Layout />} />

        {/* All other routes */}
        <Route path="/*" element={<Layout />} />

      </Routes>

    </Router>

  );

}

export default App;
