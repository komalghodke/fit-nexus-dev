import React from "react";
import { Navigate } from "react-router-dom";

/**
 * UserRoute   – Accessible only by Member (USER) role. Staff and Admin redirected to their portals.
 * StaffRoute  – Accessible only by YOGA_INSTRUCTOR and GYM_TRAINER. Others redirected.
 * AdminRoute  – Accessible only by ADMIN. Others redirected.
 * PrivateRoute– Basic token check fallback.
 */

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function UserRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = (localStorage.getItem("role") || "USER").trim().toUpperCase();

  if (!token) return <Navigate to="/login" replace />;
  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "YOGA_INSTRUCTOR" || role === "GYM_TRAINER") return <Navigate to="/staff" replace />;

  return children;
}

export function StaffRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = (localStorage.getItem("role") || "USER").trim().toUpperCase();

  if (!token) return <Navigate to="/login" replace />;
  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role !== "YOGA_INSTRUCTOR" && role !== "GYM_TRAINER") return <Navigate to="/dashboard" replace />;

  return children;
}

export function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = (localStorage.getItem("role") || "USER").trim().toUpperCase();

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") {
    if (role === "YOGA_INSTRUCTOR" || role === "GYM_TRAINER") {
      return <Navigate to="/staff" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
