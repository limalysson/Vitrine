import React, { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../services/apiConfig";
import { useNavigate } from "react-router-dom";

type Candidate = {
  _id: string;
  nomeCompleto?: string;
  curso?: string;
  [key: string]: any;
};

type Vaga = {
  _id: string;
  titulo?: string;
  area?: string;
  curso?: string;
  tipo?: string;
  localizacao?: string;
  salario?: string;
  contatoEmpresa?: string;
  status?: string;
  candidatos?: Candidate[];
  [key: string]: any;
};

const AdminVagasDashboard: React.FC = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<React.ReactNode>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVagas = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("adminToken");
        const res = await api.get(`${API_BASE_URL}/api/admin/vagas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVagas(res.data.vagas || []);
      } catch (err: any) {
        console.error("Erro ao carregar vagas:", err?.response?.data ?? err);
        setError("Erro ao carregar vagas.");
      } finally {
        setLoading(false);
      }
    };
    fetchVagas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (vagaId: string, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(
        `${API_BASE_URL}/api/admin/vagas/${vagaId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVagas((prev) => prev.map((v) => (v._id === vagaId ? { ...v, status } : v)));
    } catch (err) {
      console.error("Erro ao alterar status da vaga:", err);
      alert("Erro ao alterar status da vaga.");
    }
  };

  const copyCandidatesLink = (candidatos?: Candidate[] | string[]) => {
    if (!candidatos || candidatos.length === 0) {
      setMessage("Nenhum candidato para esta vaga!");
      return;
    }
    const ids = candidatos.map((c: any) => c._id ?? c).join(",");
    const link = `${window.location.origin}/empresa?ids=${ids}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(link)
        .then(() => setMessage("Link copiado!"))
        .catch(() => setError("Erro ao copiar o link."));
    } else {
      setError(
        <>
          Copiar para a área de transferência não é suportado neste dispositivo.
          <br />
          Copie o link manualmente:{" "}
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </>
      );
    }
  };

  const handleSelecionarCandidato = async (vagaId: string, curriculoId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(
        `${API_BASE_URL}/api/admin/vagas/${vagaId}/selecionar/${curriculoId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Currículo selecionado para a vaga!");
    } catch (err) {
      console.error("Erro ao selecionar currículo:", err);
      alert("Erro ao selecionar currículo.");
    }
  };

  if (loading) return <p className="text-white/90 p-6">Carregando vagas...</p>;
  if (error) return <p className="text-inbec-red p-6">{error}</p>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      {message && <div className="fixed top-6 right-6 z-50 bg-gray-800 text-white px-4 py-2 rounded shadow">{message}</div>}
      <div className="w-full">
        <header className="bg-[rgba(26,35,126,0.18)] backdrop-blur-md border border-white/20 rounded-xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-white">Painel de Vagas</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="action-button glass-action-button" onClick={() => navigate("/admin/cadastrar-vaga")}>
                  Cadastrar Nova Vaga
            </button>
            <button className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700" onClick={() => navigate("/admin/dashboard")}>
              Voltar
            </button>
            
          </div>
        </header>

        <section className="space-y-6">
          {vagas.length === 0 && <p className="text-white/90">Nenhuma vaga cadastrada.</p>}
          {vagas.map((vaga) => (
            <article key={vaga._id} className="bg-[rgba(26,35,126,0.18)] border border-white/20 rounded-xl p-5 shadow-md">
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {vaga.titulo} <span className="text-sm text-white/80">({vaga.status})</span>
                  </h2>
                  <div className="mt-2 text-sm text-white/90 space-y-1">
                    <p>
                      <strong>Área:</strong> {vaga.area}
                    </p>
                    <p>
                      <strong>Curso:</strong> {vaga.curso}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {vaga.tipo}
                    </p>
                    <p>
                      <strong>Localização:</strong> {vaga.localizacao}
                    </p>
                    <p>
                      <strong>Salário:</strong> {vaga.salario}
                    </p>
                    <p>
                      <strong>Contato:</strong> {vaga.contatoEmpresa}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${vaga.status === "ativo" ? "bg-green-600 text-white" : "bg-yellow-500 text-white"}`}
                >
                  {vaga.status?.toUpperCase()}
                </span>
              </header>

              <footer className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusChange(vaga._id, vaga.status === "ativo" ? "inativo" : "ativo")}
                    className="px-3 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800"
                  >
                    {vaga.status === "ativo" ? "Desativar" : "Ativar"}
                  </button>
                  <button className="px-3 py-2 rounded-md bg-slate-600 text-white hover:bg-slate-700" onClick={() => navigate(`/admin/editar-vaga/${vaga._id}`)}>
                    Editar
                  </button>
                </div>
              </footer>

              <div className="mt-4">
                <h4 className="text-lg font-semibold text-white mb-2">Candidatos:</h4>
                <section>
                  {(!vaga.candidatos || vaga.candidatos.length === 0) && <p className="text-white/80">Nenhum candidato.</p>}
                  {vaga.candidatos && vaga.candidatos.length > 0 && (
                    <ul className="space-y-3">
                      {vaga.candidatos.map((curriculo) => (
                        <li key={curriculo._id} className="bg-[rgba(255,255,255,0.03)] border border-white/10 p-3 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-white font-medium">{curriculo.nomeCompleto}</p>
                            <p className="text-sm text-white/80">{curriculo.curso}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => copyCandidatesLink(vaga.candidatos)}>
                              Gerar Link para Currículos
                            </button>
                            <button className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => handleSelecionarCandidato(vaga._id, curriculo._id)}>
                              Selecionar
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default AdminVagasDashboard;