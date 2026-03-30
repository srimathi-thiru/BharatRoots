import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import ArtisanDashboard from "./ArtisanDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const { userRole } = useContext(AuthContext);
  const role = userRole?.toLowerCase();

  if (role === "admin") return <AdminDashboard />;
  if (role === "artisan") return <ArtisanDashboard />;
  return <UserDashboard />;
};

export default Dashboard;
