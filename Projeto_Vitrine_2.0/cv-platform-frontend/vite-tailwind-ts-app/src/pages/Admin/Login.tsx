import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../../services/apiConfig";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

type AdminLoginProps = {
  onAdminLogin?: () => void;
};

const AdminLogin: React.FC<AdminLoginProps> = ({ onAdminLogin }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(`${API_BASE_URL}/api/admin/login`, { email, senha });
      localStorage.setItem("adminToken", response.data.token);
      onAdminLogin?.();
      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      console.error("AdminLogin handleSubmit:", err.response?.data ?? err);
      setError(err.response?.data?.message || "Email ou senha inválidos.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="auth-container max-w-md w-full p-6 bg-white/5 rounded">
          <h1 className="text-lg font-semibold text-white mb-4">Login de Administrador</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="adminEmail" className="text-sm text-white/80 block mb-1">
                E-mail:
              </label>
              <input
                id="adminEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@inbec.edu.br"
                required
                className="w-full p-2 rounded bg-white/6 text-white border-white/80 border-solid"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="adminPassword" className="text-sm text-white/80 block mb-1">
                Senha:
              </label>
              <input
                id="adminPassword"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                required
                className="w-full p-2 rounded bg-white/6 text-white border-white/80 border-solid"
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading} aria-busy={loading} className="home-button-card">
                {loading ? "Entrando..." : "Entrar como Administrador"}
              </button>
            </div>

            {error && <p className="mt-3 text-sm text-red-400" role="alert">{error}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;