import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para tratar token expirado (erro 401) — mantém comportamento original
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response && error.response.status === 401) {
      try {
        localStorage.removeItem("adminToken");
      } catch {}
      // redirecionamento igual ao original
      window.location.href = "/admin";
    }
    return Promise.reject(error);
  }
);

export default api;