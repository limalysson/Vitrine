import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestLoginCode } from "../services/auth";

const LoginRequest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      const res = await requestLoginCode(email);
      setStatus(res.message ?? "Código enviado. Verifique seu e-mail institucional.");
      navigate("/login/verify", { state: { email, maskedEmail: res.maskedEmail } });
    } catch (err: any) {
      setStatus(err?.message ?? "Erro ao solicitar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 p-6 rounded space-y-4">
        <h1 className="text-lg font-semibold text-white">Entrar (Aluno)</h1>
        <p className="text-sm text-white/80">Informe seu e-mail institucional para receber o código.</p>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@inbec.edu.br"
          className="w-full p-2 rounded bg-white/6 text-white"
        />
        <div className="flex justify-end">
          <button disabled={loading} className="px-4 py-2 rounded bg-inbec-blue-light text-white">
            {loading ? "Enviando..." : "Enviar código"}
          </button>
        </div>
        {status && <div className="text-sm text-white/80">{status}</div>}
      </form>
    </main>
  );
};

export default LoginRequest;