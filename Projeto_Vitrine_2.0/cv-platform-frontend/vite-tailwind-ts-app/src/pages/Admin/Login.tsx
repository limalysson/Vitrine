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
      setError(err.response?.data?.message || "Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 animate-fade-in-up">
        
        <div className="card-default group border-indigo-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100 pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-lg text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Área Administrativa</h1>
          <p className="text-slate-400 text-sm mb-6 pb-4 border-b border-white/10 w-full text-center">
            Acesso restrito à diretoria e coordenadores.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 relative z-10">
            <div className="form-field">
              <label htmlFor="adminEmail" className="form-label">
                E-mail Administrativo
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <input
                  id="adminEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@inbec.edu.br"
                  required
                  className="form-input pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="adminPassword" className="form-label">
                Senha de Acesso
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                  </svg>
                </div>
                <input
                  id="adminPassword"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              aria-busy={loading} 
              className="home-button-card w-full mt-2 !from-indigo-600 !to-purple-600 hover:!from-indigo-500 hover:!to-purple-500 flex justify-center py-3"
              style={{ boxShadow: '0 4px 14px 0 rgba(76, 29, 149, 0.39)' }}
            >
              {loading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : "Acessar Painel"}
            </button>
            {error && <p className="mt-2 text-sm text-center text-rose-400 bg-rose-400/10 p-2 rounded w-full border border-rose-400/20" role="alert">{error}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;