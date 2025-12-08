import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isLoggedin, userData, loadingUser } = useContext(AppContent);

  if (loadingUser) {
    return <LoadingSpinner />;
  }

  // If not logged in → send to login
  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  // If admin required but user is not admin → send to homepage
  if (requireAdmin && userData?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Otherwise → allow access
  return children;
};

export default ProtectedRoute;
