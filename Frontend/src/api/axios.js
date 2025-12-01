// src/api/axios.js
import axios from "axios";

const api = axios.create({
  // ✅ Remove /api since it's already in your backend routes
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // 👈 always send/receive cookies
});

export default api;