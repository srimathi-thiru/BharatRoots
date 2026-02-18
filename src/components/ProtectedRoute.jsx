import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {

  const { currentUser, userRole, loading } = useContext(AuthContext);

  // Wait until auth loads
  if (loading) {
    return (
      <div className="text-center mt-20 text-lg">
        Loading...
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Role not allowed → redirect to dashboard
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  // Authorized
  return children;
}

export default ProtectedRoute;
