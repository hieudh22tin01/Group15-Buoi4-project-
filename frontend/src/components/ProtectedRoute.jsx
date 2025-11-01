import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, token } = useSelector((state) => state.auth);
  const accessToken = token || localStorage.getItem("token");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin" && user?.role !== "admin") {
    alert("⛔ Bạn không có quyền truy cập trang này!");
    return <Navigate to="/users" replace />;
  }

  return children;
}
