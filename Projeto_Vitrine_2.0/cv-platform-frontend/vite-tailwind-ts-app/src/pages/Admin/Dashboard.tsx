import React, { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../services/apiConfig";
import CurriculumFullDetailsInline from "../../components/Curriculum/CurriculumFullDetailsInline";
import { useNavigate } from "react-router-dom";

type Curriculum = {
  _id: string;
  nomeCompleto: string;
  curso?: string;
  periodoAtual?: string | number;
  status?: string;
  selecionadoParaEmpresa?: boolean;
  habilidadesTecnicas?: string;
  resumoProfissional?: string;
  pdfUrl?: string;
  [key: string]: any;
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | React.ReactNode>("");
  const [message, setMessage] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPeriodo, setFilterPeriodo] = useState<string>("all");
  const [filterCurso, setFilterCurso] = useState<string>("all");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const fetchCurriculums = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      setError("Token de administrador não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`${API_BASE_URL}/api/admin/curriculos`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const filteredData: Curriculum[] = (response.data as Curriculum[]).filter((cur) => {
        const statusOk = filterStatus === "all" || cur.status === filterStatus;
        const periodoOk = filterPeriodo === "all" || String(cur.periodoAtual) === filterPeriodo;
        const cursoOk = filterCurso === "all" || cur.curso === filterCurso;
        return statusOk && periodoOk && cursoOk;
      });

      setCurriculums(filteredData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Não foi possível carregar os currículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculums();
  }, [filterStatus, filterPeriodo, filterCurso]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setMessage("");
    setError("");
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) return setError("Token de administrador não encontrado.");

    try {
      const response = await api.put(
        `${API_BASE_URL}/api/admin/curriculos/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setCurriculums((current) =>
        current.map((cv) => (cv._id === id ? { ...cv, status: newStatus } : cv))
      );

      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao atualizar o status do currículo.");
    }
  };

  const handleSelectForCompany = async (id: string) => {
    setMessage("");
    setError("");
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) return setError("Token não encontrado.");

    try {
      const response = await api.put(
        `${API_BASE_URL}/api/admin/curriculos/${id}/select`,
        null,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setCurriculums((current) =>
        current.map((cv) => (cv._id === id ? { ...cv, selecionadoParaEmpresa: response.data.selecionadoParaEmpresa } : cv))
      );

      setMessage(response.data.selecionadoParaEmpresa ? "Currículo selecionado para empresa!" : "Currículo ocultado para empresa!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao selecionar o currículo.");
    }
  };

  const copyLandingPageLink = () => {
    const selecionados = curriculums.filter((cv) => cv.selecionadoParaEmpresa);
    if (selecionados.length === 0) {
      setMessage("Nenhum currículo selecionado!");
      return;
    }
    const ids = selecionados.map((cv) => cv._id).join(",");
    const link = `${window.location.origin}/empresa?ids=${ids}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => setMessage("Link copiado para a área de transferência!"));
    } else {
      setError(<>Copie o link manualmente: <a href={link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">{link}</a></>);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ativo': return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case 'pendente': return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case 'inativo': return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Notificações Topo Direita */}
      <div className="fixed top-6 right-6 z-[100] w-full max-w-sm pointer-events-none flex flex-col gap-2">
        {message && <div className="animate-fade-in-up bg-emerald-500/90 border border-emerald-400 text-white px-6 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] shadow-emerald-500/20 text-sm font-medium backdrop-blur-md">{message}</div>}
        {error && <div className="animate-fade-in-up bg-rose-500/90 border border-rose-400 text-white px-6 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] shadow-rose-500/20 text-sm font-medium backdrop-blur-md">{error}</div>}
      </div>

      <main className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in-up">

      <header className="card-default-large mb-8 border-indigo-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative z-10 border-b border-white/10 pb-6 gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
            Dashboard Administrativo
          </h1>
          <div className="flex gap-3">
            <button onClick={() => navigate("/admin/vagas")} className="home-button-card !py-2 !px-4 text-sm bg-white/5 border border-white/10 hover:bg-white/10">
              Gerenciar Vagas
            </button>
            <button onClick={handleLogout} className="home-button-logout !py-2 !px-4 text-sm">
              Encerrar Sessão
            </button>
          </div>
        </div>

        {/* Painel de Filtros e Ações em Lote */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Filtros */}
          <div className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <div className="form-field !mb-0">
              <label htmlFor="status-select" className="form-label text-xs uppercase tracking-wider">Status do Currículo</label>
              <select id="status-select" className="form-select text-sm mt-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Ver Todos</option>
                <option value="ativo">Apenas Ativos</option>
                <option value="pendente">Apenas Pendentes</option>
                <option value="inativo">Apenas Inativos</option>
              </select>
            </div>

            <div className="form-field !mb-0">
              <label htmlFor="periodo-select" className="form-label text-xs uppercase tracking-wider">Período Acadêmico</label>
              <select id="periodo-select" className="form-select text-sm mt-1" value={filterPeriodo} onChange={(e) => setFilterPeriodo(e.target.value)}>
                <option value="all">Todos os Períodos</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={`${n}º Semestre`}>{n}º Semestre</option>)}
              </select>
            </div>

            <div className="form-field !mb-0">
              <label htmlFor="curso-select" className="form-label text-xs uppercase tracking-wider">Curso</label>
              <select id="curso-select" className="form-select text-sm mt-1" value={filterCurso} onChange={(e) => setFilterCurso(e.target.value)}>
                <option value="all">Todos os Cursos</option>
                <option value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento de Sistemas</option>
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Engenharia Civil">Engenharia Civil</option>
              </select>
            </div>
          </div>

          {/* Ações Rápidas Topo */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-3 justify-center">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col justify-center items-center h-full text-center">
              <p className="text-3xl font-black text-indigo-400 mb-1">{curriculums.length}</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Currículos Filtrados</p>
            </div>
          </div>
        </div>

        {/* Barra de Ações em Lote */}
        <div className="relative z-10 w-full mt-6 bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-wrap gap-4 items-center justify-between md:pr-4 md:box-border">
          <div className="flex gap-2 flex-wrap w-full md:w-auto justify-center md:justify-start">
            <button
              onClick={() => {
                const ids = curriculums.filter(cv => cv.status !== "ativo").map(cv => cv._id);
                Promise.all(ids.map(id => handleStatusChange(id, "ativo"))).then(() => setMessage("Currículos filtrados aprovados."));
              }}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Aprovar Todos
            </button>
            <button
              onClick={() => {
                const idsFazenda = curriculums.filter(cv => !cv.selecionadoParaEmpresa).map(cv => cv._id);
                Promise.all(idsFazenda.map(id => handleSelectForCompany(id))).then(() => setMessage("Selecionados para vitrine."));
              }}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Destacar Todos
            </button>
            <button
              onClick={() => {
                const idsLimpar = curriculums.filter(cv => cv.selecionadoParaEmpresa).map(cv => cv._id);
                Promise.all(idsLimpar.map(id => handleSelectForCompany(id))).then(() => setMessage("Vitrine limpa."));
              }}
              className="bg-slate-500/10 hover:bg-slate-500/20 text-slate-300 border border-slate-500/30 px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Ocultar Todos da Vitrine
            </button>
          </div>
          <button onClick={copyLandingPageLink} className="w-full md:w-auto home-button-card !py-2 !px-5 text-sm !from-indigo-600 !to-indigo-500 shadow-indigo-500/20 whitespace-nowrap">
            Copiar Link da Vitrine Pública
          </button>
        </div>
      </header>

      {/* Lista de Currículos */}
      {curriculums.length === 0 ? (
        <div className="card-default-large text-center py-16 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <p className="text-lg">Nenhum currículo encontrado para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {curriculums.map((curriculum) => (
            <article key={curriculum._id} className="card-default-large !p-5 transition-all duration-300 hover:border-indigo-500/30">
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                {/* Header Info */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-white">{curriculum.nomeCompleto}</h2>
                    {curriculum.selecionadoParaEmpresa && (
                      <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
                        Destaque
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">
                    {curriculum.curso} • <span className="text-slate-300">{curriculum.periodoAtual}</span>
                  </p>
                </div>

                {/* Status e Ações Primárias */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold border ${getStatusBadge(curriculum.status)}`}>
                    {curriculum.status}
                  </span>

                  <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

                  <div className="flex border border-white/10 rounded-lg overflow-hidden bg-slate-900/50 shadow-inner">
                    <button
                      onClick={() => handleStatusChange(curriculum._id, "ativo")}
                      disabled={curriculum.status === 'ativo'}
                      className={`px-3 py-1.5 text-xs font-bold uppercase transition-all min-w-[80px] ${curriculum.status === 'ativo'
                          ? 'bg-emerald-400 text-slate-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] cursor-default'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300'
                        }`}
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleStatusChange(curriculum._id, "pendente")}
                      disabled={curriculum.status === 'pendente'}
                      className={`px-3 py-1.5 text-xs font-bold uppercase border-l border-white/5 transition-all min-w-[80px] ${curriculum.status === 'pendente'
                          ? 'bg-amber-400 text-slate-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] cursor-default'
                          : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 hover:text-amber-300'
                        }`}
                    >
                      Pendente
                    </button>
                    <button
                      onClick={() => handleStatusChange(curriculum._id, "inativo")}
                      disabled={curriculum.status === 'inativo'}
                      className={`px-3 py-1.5 text-xs font-bold uppercase border-l border-white/5 transition-all min-w-[80px] ${curriculum.status === 'inativo'
                          ? 'bg-rose-400 text-slate-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] cursor-default'
                          : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:text-rose-300'
                        }`}
                    >
                      Inativar
                    </button>
                  </div>
                </div>
              </div>

              {/* Detalhes Resumidos */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-4">
                <div className="md:col-span-8 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Habilidades</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{curriculum.habilidadesTecnicas || "Não preenchido."}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Resumo Perfil</p>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{curriculum.resumoProfissional || "Não preenchido."}</p>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col justify-start items-start md:items-end gap-3">
                  <button
                    onClick={async () => {
                      if (!curriculum.selecionadoParaEmpresa && curriculum.status !== "ativo") {
                        if (window.confirm('Deseja aprovar e colocar este currículo na vitrine simultaneamente?')) {
                          await handleStatusChange(curriculum._id, "ativo");
                          handleSelectForCompany(curriculum._id);
                        }
                      } else {
                        handleSelectForCompany(curriculum._id);
                      }
                    }}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all border ${curriculum.selecionadoParaEmpresa ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400' : 'bg-slate-800/50 border-white/10 text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400'}`}
                  >
                    {curriculum.selecionadoParaEmpresa ? (
                      <><span>Remover da Vitrine</span></>
                    ) : (
                      <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
                      Destacar na Vitrine</>
                    )}
                  </button>

                  {curriculum.pdfUrl ? (
                    <a href={`${API_BASE_URL}${curriculum.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" /></svg>
                      Ver PDF Anexo
                    </a>
                  ) : (
                    <span className="w-full sm:w-auto text-center px-4 py-2 rounded-lg text-sm bg-slate-800/50 border border-white/5 text-slate-500 cursor-not-allowed">
                      Sem PDF
                    </span>
                  )}
                </div>
              </div>

              {/* Toggle Detalhes Expandidos */}
              <div className="mt-4">
                <button
                  onClick={() => setExpandedCardId(expandedCardId === curriculum._id ? null : curriculum._id)}
                  className="w-full bg-slate-800/80 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 text-center text-xs text-slate-400 hover:text-indigo-300 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold uppercase tracking-widest shadow-sm"
                >
                  {expandedCardId === curriculum._id ? 'Ocultar Detalhes Completos' : 'Ver Detalhes Completos do Aluno'}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform duration-300 ${expandedCardId === curriculum._id ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${expandedCardId === curriculum._id
                      ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-white/10'
                      : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0 border-transparent'
                    }`}
                >
                  <div className="overflow-hidden">
                    <CurriculumFullDetailsInline curriculum={curriculum} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
    </>
  );
};

export default AdminDashboard;