import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { API_BASE_URL } from "../../services/apiConfig";
import { useAuth } from "../../contexts/AuthContext";

type AuthenticateAccessProps = {
  email?: string;
  setAuthenticated?: (v: boolean) => void;
  setAuthenticatedEmail?: (email: string | null) => void;
};

const AuthenticateAccess: React.FC<AuthenticateAccessProps> = ({ email, setAuthenticated, setAuthenticatedEmail }) => {
  const [tempPassword, setTempPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const location = useLocation() as any;

  const currentEmail = email || location.state?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    
    if (!currentEmail) {
      setError("E-mail não encontrado. Volte e solicite um novo código.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/alunos/autenticar-acesso`, {
        email: currentEmail,
        tempPassword,
      });

      setMessage(response.data.message);

      if (response.data.token) {
        const user = response.data.user ?? { email: currentEmail };
        setSession(response.data.token, user);
      }

      if (setAuthenticated) setAuthenticated(true);
      if (setAuthenticatedEmail) setAuthenticatedEmail(null);

      navigate("/aluno/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao autenticar. Verifique o código.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewCode = async () => {
    setMessage("");
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/alunos/solicitar-acesso`, { email: currentEmail });
      setMessage("Novo código enviado para seu e-mail.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao solicitar novo código.");
    }
  };

  if (!currentEmail) {
    return (
      <div className="w-full flex flex-col flex-grow items-center justify-center py-12 px-4">
        <div className="card-default group mx-auto max-w-md border-rose-500/30 bg-rose-500/5 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-rose-500 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Acesso Restrito</h3>
            <p className="text-slate-300 mb-6">Por favor, primeiro solicite o código de acesso.</p>
            <Link to="/aluno" className="home-button-card w-full">Voltar para Login</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full flex flex-col flex-grow items-center justify-center py-12 px-4 animate-fade-in-up">
      <div className="card-default group mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-100 pointer-events-none" />
        
        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-lg text-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Verificar Acesso</h1>
        <p className="text-slate-400 text-sm mb-2 text-center text-wrap truncate w-full">
          Código enviado para: <strong className="text-cyan-400 font-medium break-words whitespace-normal">{currentEmail}</strong>
        </p>
        
        <div className="w-full h-px bg-white/10 my-4" />

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 relative z-10 box-border">
          <div className="form-field w-full">
             <label htmlFor="tempPassword" className="form-label w-full text-left">
                Código de 6 dígitos
             </label>
             <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="tempPassword"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value.toUpperCase())}
                  placeholder="EX: A1B2C3"
                  maxLength={6}
                  required
                  className="form-input !pl-10 tracking-widest uppercase font-mono text-center w-full box-border"
                />
             </div>
          </div>

          <div className="flex flex-col gap-3">
             <button type="submit" disabled={loading} className="home-button-card w-full shadow-lg">
                {loading ? "Verificando..." : "Entrar e Acessar"}
             </button>
             <button 
                type="button"
                onClick={handleRequestNewCode}
                className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors bg-transparent border border-white/10 py-2 rounded-full hover:border-cyan-500/30"
             >
                Solicitar novo código
             </button>
          </div>
        </form>

        {message && <p className="mt-4 text-sm text-emerald-400 bg-emerald-400/10 p-2 rounded w-full border border-emerald-400/20 box-border">{message}</p>}
        {error && <p className="mt-4 text-sm text-rose-400 bg-rose-400/10 p-2 rounded w-full border border-rose-400/20 box-border">{error}</p>}
      </div>
    </main>
  );
};

export default AuthenticateAccess;