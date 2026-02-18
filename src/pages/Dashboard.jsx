import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {

  const { currentUser, userRole, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (

    <div className="max-w-5xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-4">
        Welcome to BharatRoots
      </h1>

      <p className="mb-6 text-gray-600">
        Logged in as: <strong>{currentUser?.email}</strong>
      </p>

      <p className="mb-6 text-gray-600">
        Role: <strong>{userRole}</strong>
      </p>


      {/* USER DASHBOARD */}

      {userRole === "USER" && (

        <div className="grid grid-cols-2 gap-4">

          <DashboardCard
            title="Explore Heritage"
            link="/heritage"
          />

          <DashboardCard
            title="Browse Marketplace"
            link="/products"
          />

          <DashboardCard
            title="Search"
            link="/search"
          />

          <DashboardCard
            title="Become Artisan"
            link="/register-artisan"
          />

        </div>

      )}


      {/* ARTISAN DASHBOARD */}

      {userRole === "ARTISAN" && (

        <div className="grid grid-cols-2 gap-4">

          <DashboardCard
            title="Add Product"
            link="/add-product"
          />

          <DashboardCard
            title="View Marketplace"
            link="/products"
          />

          <DashboardCard
            title="Search"
            link="/search"
          />

        </div>

      )}


      {/* ADMIN DASHBOARD */}

      {userRole === "ADMIN" && (

        <div className="grid grid-cols-2 gap-4">

          <DashboardCard
            title="Admin Panel"
            link="/admin-artisans"
          />

          <DashboardCard
            title="Add Heritage"
            link="/add-heritage"
          />

          <DashboardCard
            title="Verify Products"
            link="/verify"
          />

          <DashboardCard
            title="Marketplace"
            link="/products"
          />

        </div>

      )}

    </div>

  );

}


// Dashboard Card Component

function DashboardCard({ title, link }) {

  return (

    <Link to={link}>

      <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg hover:bg-blue-50 cursor-pointer">

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

      </div>

    </Link>

  );

}

export default Dashboard;
