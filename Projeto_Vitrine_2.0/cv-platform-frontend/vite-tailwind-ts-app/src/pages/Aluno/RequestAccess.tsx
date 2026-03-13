import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/apiConfig";
import { useAuth } from "../../contexts/AuthContext";

type RequestAccessProps = {
  setAuthenticatedEmail?: (email: string | null) => void;
};

const RequestAccess: React.FC<RequestAccessProps> = ({ setAuthenticatedEmail }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/aluno/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/alunos/solicitar-acesso`, { email });
      setMessage(response.data.message || "Código de acesso enviado para o seu email!");
      setSuccess(true);
      if (setAuthenticatedEmail) setAuthenticatedEmail(email);
      navigate("/aluno/autenticar", { state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao solicitar acesso. Tente novamente.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col flex-grow items-center justify-center py-12 px-4 animate-fade-in-up">
      <div className="card-default group mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-100 pointer-events-none" />
        
        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-lg text-cyan-400">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Acesso do Aluno</h2>
        <p className="text-slate-400 text-sm mb-6 pb-4 border-b border-white/10 w-full text-center">
          Informe seu e-mail institucional para receber o código de acesso.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 relative z-10 box-border">
          <div className="form-field w-full">
            <label htmlFor="email" className="form-label w-full text-left">
              E-mail Institucional
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@inbec.edu.br"
                required
                className="form-input !pl-10 w-full box-border"
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="home-button-card w-full mt-2 flex justify-center py-3">
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : "Solicitar Código"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-emerald-400 bg-emerald-400/10 p-2 rounded w-full border border-emerald-400/20 box-border">{message}</p>}
        {error && <p className="mt-4 text-sm text-rose-400 bg-rose-400/10 p-2 rounded w-full border border-rose-400/20 box-border">{error}</p>}
      </div>
    </div>
  );
};

export default RequestAccess;