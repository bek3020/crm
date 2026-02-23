import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";

console.log("Axios Base URL:", baseURL);

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: false, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token yuborildi:", token.substring(0, 20) + "...");
      } else {
        console.warn("Token topilmadi! Login qiling.");
      }
    }

    console.log(" Request:", config.method?.toUpperCase(), `${config.baseURL || ''}${config.url || ''}`);
    return config;
  },
  (error) => {
    console.error(" Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(" Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Response error:", error.message);

    if (error.code === "ECONNABORTED") {
      console.error("⏱Request timeout!");
    }

    if (error.message === "Network Error") {
      console.error("Network error - Backend ishlamayapti yoki CORS muammosi!");
      console.error(" Backend serverni ishga tushiring: http://localhost:7070");
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn(" Authentication xatosi - lekin davom etamiz");
    }

    return Promise.reject(error);
  }
);
