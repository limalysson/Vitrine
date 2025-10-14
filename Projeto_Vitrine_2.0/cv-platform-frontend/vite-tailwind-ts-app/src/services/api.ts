import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import type { AuthResponse, ApiError } from "../types";

const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const api: AxiosInstance = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Attach token from localStorage if present
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const token = localStorage.getItem("token");
    // garantir que headers existe (evita incompatibilidade de tipos)
    config.headers = config.headers ?? {};
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

// Optional: simple response interceptor to normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const payload: ApiError = {
      message: err?.response?.data?.message ?? err.message ?? "Erro na requisição",
      details: err?.response?.data ?? null,
    };
    return Promise.reject(payload);
  }
);

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", { email, password });
  // persist token
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
}

export async function logout(): Promise<void> {
  localStorage.removeItem("token");
  // se API tiver rota de logout, chame-a aqui, ex:
  // await api.post("/auth/logout");
}

export async function uploadFile(formData: FormData) {
  const cfg: AxiosRequestConfig = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await api.post("/uploads", formData, cfg);
  return res.data;
}

// Export default axios instance e helpers
export default api;