import React, { useState, useEffect } from "react";
import { AppContent } from "./AppContext";
import axios from "axios";
import api from "../api/axios";

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Configure axios globally
  axios.defaults.withCredentials = true;

  // Interceptor to automatically add token from localStorage
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );


  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch current user data
  const getUserData = async () => {
    try {
      const { data } = await api.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success && data.userData) {
        setUserData(data.userData);
        setIsLoggedin(true);
        return data.userData;
      } else {
        setUserData(null);
        setIsLoggedin(false);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      const { data } = await api.get(`${backendUrl}/api/auth/profile`);
      if (data.success && data.user) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

// Inside AppContextProvider
const getAuthState = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ get token from storage
    if (!token) throw new Error("No token in storage");

    const { data } = await api.get(`${backendUrl}./api/auth/is-auth`, {
      headers: { Authorization: `Bearer ${token}` }, // ✅ send token in header
    });

    if (data.success && data.userData) {
      setIsLoggedin(true);
      setUserData(data.userData);
    } else {
      setIsLoggedin(false);
      setUserData(null);
    }
  } catch (error) {
    console.warn("Auth check failed:", error.response?.data?.message || error.message);
    setIsLoggedin(false);
    setUserData(null);
  } finally {
    setLoadingUser(false);
  }
};

// Run once on mount
useEffect(() => {
  getAuthState();
}, []);


  // Logout helper
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedin(false);
    setUserData(null);
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

// import React, { useState, useEffect } from "react";
// import { AppContent } from "./AppContext";
// import axios from "axios";

// export const AppContextProvider = ({ children }) => {
//   // ✅ VITE_BACKEND_URL should already include /api
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   // Configure axios to always send cookies
//   axios.defaults.withCredentials = true;

//   const [isLoggedin, setIsLoggedin] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loadingUser, setLoadingUser] = useState(true);

//   // ✅ Fetch user data from backend
//   const getUserData = async () => {
//     try {
//       // ✅ Don't add /api again - it's already in backendUrl
//       const { data } = await axios.get(`${backendUrl}/auth/is-auth`, {
//         withCredentials: true,
//       });

//       if (data.success && data.userData) {
//         setUserData(data.userData);
//         setIsLoggedin(true);
//         return data.userData;
//       } else {
//         setUserData(null);
//         setIsLoggedin(false);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setUserData(null);
//       setIsLoggedin(false);
//       return null;
//     } finally {
//       setLoadingUser(false);
//     }
//   };

//   // 🔄 Refresh user data after updates
//   const refreshUserData = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/auth/profile`, {
//         withCredentials: true,
//       });

//       if (data.success && data.user) {
//         setUserData(data.user);
//       }
//     } catch (error) {
//       console.error("Failed to refresh user data:", error);
//     }
//   };

//   // ✅ Check authentication state on startup
//   const getAuthState = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token in storage");
  
//       const { data } = await axios.get(`${backendUrl}/auth/is-auth`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       if (data.success && data.userData) {
//         setIsLoggedin(true);
//         setUserData(data.userData);
//       } else {
//         setIsLoggedin(false);
//         setUserData(null);
//       }
//     } catch (error) {
//       console.warn("Auth check failed:", error.response?.data?.message || error.message);
//       setIsLoggedin(false);
//       setUserData(null);
//     } finally {
//       setLoadingUser(false);
//     }
//   };
  
//   // const getAuthState = async () => {
//   //   try {
//   //     const { data } = await axios.get(`${backendUrl}/auth/is-auth`, {
//   //       withCredentials: true,
//   //     });

//   //     if (data.success && data.userData) {
//   //       setIsLoggedin(true);
//   //       setUserData(data.userData);
//   //       console.log("✅ User authenticated on startup:", data.userData);
//   //       console.log("✅ User role:", data.userData.role);
//   //     } else {
//   //       setIsLoggedin(false);
//   //       setUserData(null);
//   //       console.log("❌ No authenticated user on startup");
//   //     }
//   //   } catch (error) {
//   //     console.warn("Auth check failed:", error.response?.data?.message || error.message);
//   //     setIsLoggedin(false);
//   //     setUserData(null);
//   //   } finally {
//   //     setLoadingUser(false);
//   //   }
//   // };

//   // ✅ Run once on mount to load user state
//   useEffect(() => {
//     getAuthState();
//   }, []);

//   const value = {
//     backendUrl,
//     isLoggedin,
//     setIsLoggedin,
//     userData,
//     setUserData,
//     getUserData,
//     getAuthState,
//     refreshUserData,
//     loadingUser,
//   };

//   return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
// };