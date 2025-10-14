import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/apiConfig";
import { useAuth } from "../../contexts/AuthContext"; // ADICIONADO

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
  const { isAuthenticated } = useAuth(); // ADICIONADO

  useEffect(() => {
    // se o contexto já marca autenticado, vai direto para a home do aluno
    if (isAuthenticated) {
      navigate("/aluno/home", { replace: true });
    }
  }, [isAuthenticated, navigate]); // dependências corretas

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("RequestAccess handleSubmit: Função chamada!");
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    console.log("RequestAccess handleSubmit: Email a ser enviado:", email);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/alunos/solicitar-acesso`, { email });
      console.log("RequestAccess handleSubmit: Requisição POST bem-sucedida!", response.data);
      setMessage(response.data.message || "Código de acesso enviado para o seu email!");
      setSuccess(true);
      if (setAuthenticatedEmail) setAuthenticatedEmail(email);
      // passa o email via state para a próxima rota (igual ao fluxo antigo)
      navigate("/aluno/autenticar", { state: { email } });
    } catch (err: any) {
      console.error("RequestAccess handleSubmit: Erro na requisição:", err);
      setError(err?.response?.data?.message || "Erro ao solicitar acesso. Tente novamente.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center bg-transparent">
      <div className="card-default">
        <h2 className="text-lg font-semibold text-white mb-3">Acessar Plataforma de Currículos</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-white/80 mb-1 text-left">
              E-mail Institucional:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@inbec.edu.br"
              required
              className="w-full p-2 rounded bg-white/6 text-white border-none"
            />
            <div className="flex justify-end mt-3">
              <button type="submit" disabled={loading} className="home-button-card border-none">
                {loading ? "Enviando..." : "Solicitar Código de Acesso"}
              </button>
            </div>
          </div>
        </form>
        {message && <p className="mt-3 text-sm text-green-400">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default RequestAccess;