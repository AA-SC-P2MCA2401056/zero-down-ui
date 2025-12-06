import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwt_token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("jwt_token");

  // If token exists, redirect to home/dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
