import React from "react";
import { Navigate } from "react-router-dom";
import { getSession, isLoggedIn, isAdmin } from "../services/AuthService";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin()) {
    return (
      <Navigate to={`/view-employee/${getSession().employeeId}`} replace />
    );
  }
  return children;
};

export default ProtectedRoute;
