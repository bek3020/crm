import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // Backend Bearer kutsa
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔑 Token yuborildi (Bearer):", token.substring(0, 20) + "...");
      } else {
        console.warn("⚠️ Token topilmadi! Login qiling.");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Faqat 401 da logout qilish, 403 da emas
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);