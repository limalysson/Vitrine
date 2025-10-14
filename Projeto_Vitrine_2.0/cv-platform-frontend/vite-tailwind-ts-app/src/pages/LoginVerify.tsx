import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyLoginCode } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

const LoginVerify: React.FC = () => {
  const location = useLocation() as any;
  const fromState = location.state ?? {};
  const emailFromState = fromState.email ?? "";
  const maskedEmail = fromState.maskedEmail;
  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyLoginCode(email, code);
      // res = { token, user }
      setSession(res.token, res.user);
      navigate("/aluno", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 p-6 rounded space-y-4">
        <h1 className="text-lg font-semibold text-white">Verificar código</h1>
        {maskedEmail && <div className="text-sm text-white/80">Código enviado para: {maskedEmail}</div>}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@inbec.edu.br"
          className="w-full p-2 rounded bg-white/6 text-white"
        />
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código (ex.: 123456)"
          className="w-full p-2 rounded bg-white/6 text-white"
        />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <div className="flex justify-end">
          <button disabled={loading} className="px-4 py-2 rounded bg-inbec-blue-light text-white">
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default LoginVerify;