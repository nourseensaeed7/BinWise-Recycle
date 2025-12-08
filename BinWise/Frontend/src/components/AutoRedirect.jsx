import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContent } from "../context/AppContext";

const AutoRedirect = () => {
  const { isLoggedin, userData, loadingUser } = useContext(AppContent);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if not loading and user is logged in
    if (!loadingUser && isLoggedin && userData) {
      console.log("🔄 AutoRedirect - User is logged in:", userData);
      
      // If admin user is on home page, redirect to admin
      if (userData.role === "admin" && location.pathname === "/") {
        console.log("🔄 Redirecting admin from home to admin page");
        navigate("/admin", { replace: true });
      }
      // If regular user is on admin page, redirect to home
      else if (userData.role !== "admin" && location.pathname === "/admin") {
        console.log("🔄 Redirecting non-admin from admin to home page");
        navigate("/", { replace: true });
      }
    }
  }, [isLoggedin, userData, loadingUser, location.pathname, navigate]);

  return null; // This component doesn't render anything
};

export default AutoRedirect;
