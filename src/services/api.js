import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add token automatically if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Handle Unauthorized (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Unauthorized Access — Logging out...");

      // Clear user data and token
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // if you store user info

      // Redirect to login page
      window.location.href = "/login"; // or your route path
    }

    return Promise.reject(error);
  }
);

export default api;
