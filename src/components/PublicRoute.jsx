import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PublicRoute({ children }) {

  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="text-center mt-20">
        Loading...
      </div>
    );
  }

  // If logged in → redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PublicRoute;
