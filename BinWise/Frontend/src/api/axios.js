// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api", // uses your .env backend URL
  withCredentials: true, // 👈 always send/receive cookies
});



export default api;
