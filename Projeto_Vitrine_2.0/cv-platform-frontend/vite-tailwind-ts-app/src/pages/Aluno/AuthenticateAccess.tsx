import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { API_BASE_URL } from "../../services/apiConfig";
import { useAuth } from "../../contexts/AuthContext"; // ADICIONADO

type AuthenticateAccessProps = {
  email?: string;
  setAuthenticated?: (v: boolean) => void;
  setAuthenticatedEmail?: (email: string | null) => void;
};

const AuthenticateAccess: React.FC<AuthenticateAccessProps> = ({ email, setAuthenticated, setAuthenticatedEmail }) => {
  const [tempPassword, setTempPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setSession, logout } = useAuth(); // ajustado para usar contexto
  const location = useLocation() as any;

  const currentEmail = email || location.state?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!currentEmail) {
      setError("E-mail para autenticação não encontrado. Por favor, volte e solicite um novo código.");
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

      // navegar para home do aluno antes de qualquer logout/limpeza futura
      navigate("/aluno/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao autenticar. Verifique o código.");
    }
  };

  // Expor botão de logout se presente (caso precise)
  const handleLogout = () => {
    navigate("/", { replace: true });
    setTimeout(() => logout(), 0);
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
      <div className="auth-container max-w-md mx-auto p-6 bg-white/5 rounded">
        <p className="text-sm text-red-400">
          Por favor, primeiro solicite o código de acesso na{" "}
          <Link to="/aluno" className="underline">
            página de login do aluno
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center p-0">
      <div className="card-default">
        <h1 className="text-lg font-semibold text-white mb-2">Verificar Código de Acesso</h1>
        <p className="text-sm text-white/80 mb-2">Um código foi gerado para: <strong>{currentEmail}</strong></p>
        <p className="text-xs text-white/60 mb-4">Verifique o console do servidor backend para o código de teste.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="tempPassword" className="text-sm text-white/80 block mb-1">Código de Acesso:</label>
            <input
              type="text"
              id="tempPassword"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder="Digite o código"
              required
              className="w-full p-2 rounded bg-white/6 text-white border-white/50"
            />
          </div>
          <div className="flex justify-between">
            <button type="button"
              className="home-button-card border-none mr-2"
              onClick={handleRequestNewCode}
            >
              Solicitar novo código
            </button>
            <button type="submit" className="home-button-card border-none">Entrar</button>
          </div>
        </form>
        {message && <p className="mt-3 text-sm text-green-400">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </main>
  );
};

export default AuthenticateAccess;