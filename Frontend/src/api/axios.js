import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://backend-production-ec018.up.railway.app',
  withCredentials: true, // Include cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR - Automatically add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log('🔍 Request Interceptor Debug:');
    console.log('   URL:', config.url);
    console.log('   Method:', config.method);
    console.log('   Token exists in localStorage:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('   ✅ Authorization header set');
      console.log('   Token preview:', token.substring(0, 30) + '...');
    } else {
      console.warn('   ⚠️ No token found in localStorage for:', config.url);
      console.warn('   localStorage keys:', Object.keys(localStorage));
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR - Handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:');
    console.error('   Status:', error.response?.status);
    console.error('   URL:', error.config?.url);
    console.error('   Message:', error.response?.data?.message);
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.warn('🚫 Unauthorized - Token may be expired or missing');
      
      // Log current token state
      const token = localStorage.getItem('token');
      console.log('   Token in storage:', token ? 'EXISTS' : 'MISSING');
      
      // Clear invalid token
      localStorage.removeItem('token');
      
      // Don't auto-redirect here - let components handle it
      // This prevents redirect loops
    }
    
    return Promise.reject(error);
  }
);

export default api;

// import axios from "axios";

// // CRITICAL: Don't add /api here if backend already has it
// const baseURL = import.meta.env.VITE_BACKEND_URL;

// console.log("📍 API baseURL:", baseURL);

// const api = axios.create({
//   baseURL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // Request interceptor - Add token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
    
//     console.log("🚀 API Request:", {
//       method: config.method,
//       url: config.url,
//       fullURL: `${config.baseURL}${config.url}`,
//       hasToken: !!token
//     });
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error("❌ Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - Handle errors globally
// api.interceptors.response.use(
//   (response) => {
//     console.log("✅ API Response:", response.status, response.config.url);
//     return response;
//   },
//   (error) => {
//     console.error("❌ API Error:", {
//       status: error.response?.status,
//       url: error.config?.url,
//       message: error.response?.data?.message || error.message
//     });
    
//     if (error.response?.status === 401) {
//       console.log("🚪 Unauthorized - Clearing token");
//       localStorage.removeItem("token");
//       // Only redirect if not already on login page
//       if (!window.location.pathname.includes('/login')) {
//         window.location.href = "/login";
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;
