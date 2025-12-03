import React, { useState, useEffect } from "react";
import { AppContent } from "./AppContext";
import api from "../api/axios";

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch current user data
  const getUserData = async () => {
    try {
      console.log("🔍 Fetching user data...");
      const { data } = await api.get("/api/auth/is-auth");
      
      console.log("📦 User data response:", data);
      
      if (data.success && data.userData) {
        setUserData(data.userData);
        setIsLoggedin(true);
        console.log("✅ User authenticated:", data.userData.email);
        return data.userData;
      } else {
        setUserData(null);
        setIsLoggedin(false);
        console.log("❌ User not authenticated");
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error.response?.data || error.message);
      setUserData(null);
      setIsLoggedin(false);
      return null;
    } finally {
      setLoadingUser(false);
    }
  };

  // Refresh user profile
  const refreshUserData = async () => {
    try {
      console.log("🔄 Refreshing user profile...");
      const { data } = await api.get("/api/auth/profile");
      
      if (data.success && (data.userData || data.user)) {
        const user = data.userData || data.user;
        setUserData(user);
        console.log("✅ Profile refreshed:", user.email);
      }
    } catch (error) {
      console.error("❌ Failed to refresh user data:", error.response?.data || error.message);
    }
  };

  // Get auth state on mount
  const getAuthState = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("⚠️ No token found in localStorage");
        throw new Error("No token in storage");
      }

      console.log("🔍 Checking auth state...");
      console.log("🎫 Token exists:", token.substring(0, 20) + "...");

      const { data } = await api.get("/api/auth/is-auth");

      if (data.success && data.userData) {
        setIsLoggedin(true);
        setUserData(data.userData);
        console.log("✅ Auth state verified:", data.userData.email);
      } else {
        setIsLoggedin(false);
        setUserData(null);
        console.log("❌ Auth verification failed");
      }
    } catch (error) {
      console.warn("❌ Auth check failed:", error.response?.data?.message || error.message);
      setIsLoggedin(false);
      setUserData(null);
      
      // Clear invalid token
      if (error.response?.status === 401) {
        console.log("🗑️ Clearing invalid token");
        localStorage.removeItem("token");
      }
    } finally {
      setLoadingUser(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    console.log("🚀 AppContextProvider mounted");
    console.log("🌐 Backend URL:", backendUrl);
    getAuthState();
  }, []);

  // Logout helper
  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      
      // Call logout endpoint to clear server-side cookies
      await api.post("/api/auth/logout");
      
      // Clear client-side storage
      localStorage.removeItem("token");
      setIsLoggedin(false);
      setUserData(null);
      
      console.log("✅ Logged out successfully");
    } catch (error) {
      console.error("❌ Logout error:", error);
      
      // Still clear local data even if API call fails
      localStorage.removeItem("token");
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthState,
    refreshUserData,
    logout,
    loadingUser,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};