import React from "react";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute – Redirects to /login if no valid token is present.
 * StaffRoute  – Redirects to /dashboard if the role is not YOGA_INSTRUCTOR or GYM_TRAINER.
 */

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function StaffRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "YOGA_INSTRUCTOR" && role !== "GYM_TRAINER" && role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
