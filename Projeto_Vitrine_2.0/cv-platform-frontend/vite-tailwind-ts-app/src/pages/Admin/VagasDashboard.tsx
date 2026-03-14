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
        setError("Erro ao carregar vagas.");
      } finally {
        setLoading(false);
      }
    };
    fetchVagas();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleStatusChange = async (vagaId: string, status: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(
        `${API_BASE_URL}/api/admin/vagas/${vagaId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVagas((prev) => prev.map((v) => (v._id === vagaId ? { ...v, status } : v)));
      setMessage(`Vaga marcada como ${status}!`);
    } catch (err) {
      setError("Erro ao alterar status da vaga.");
    }
  };

  const copyCandidatesLink = (candidatos?: Candidate[] | string[]) => {
    if (!candidatos || candidatos.length === 0) {
      setError("Nenhum candidato para esta vaga!");
      return;
    }
    const ids = candidatos.map((c: any) => c._id ?? c).join(",");
    const link = `${window.location.origin}/empresa?ids=${ids}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => setMessage("Link copiado para a área de transferência!"));
    } else {
      setError(<>Copie o link manualmente: <a href={link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">{link}</a></>);
    }
  };

  const handleSelecionarCandidato = async (vagaId: string, curriculoId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(
        `${API_BASE_URL}/api/admin/vagas/${vagaId}/selecionar/${curriculoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state to reflect the selection instantaneously
      setVagas((prev) => 
        prev.map((v) => {
          if (v._id === vagaId) {
            const isSelected = v.selecionados?.includes(curriculoId);
            const newSelecionados = isSelected 
              ? v.selecionados.filter((id: string) => id !== curriculoId)
              : [...(v.selecionados || []), curriculoId];
            return { ...v, selecionados: newSelecionados };
          }
          return v;
        })
      );
      
      setMessage("Currículo selecionado/desmarcado para a vaga com sucesso!");
    } catch (err) {
      setError("Erro ao selecionar currículo.");
    }
  };

  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'ativo': return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case 'inativo': return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
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

      <div className="w-full">
        <header className="card-default-large mb-8 border-indigo-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100 pointer-events-none" />
         
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-indigo-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
              </svg>
              Gestão de Vagas
            </h1>
            
            <div className="flex gap-3">
              <button className="home-button-card !py-2 !px-4 text-sm bg-indigo-600/20  border border-indigo-500/30 hover:bg-indigo-600/40" onClick={() => navigate("/admin/cadastrar-vaga")}>
                + Nova Vaga
              </button>
              <button className="home-button-card !py-2 !px-4 text-sm bg-white/5 border border-white/10 hover:bg-white/10" onClick={() => navigate("/admin/dashboard")}>
                Voltar aos Currículos
              </button>
            </div>
          </div>
        </header>

        <section className="space-y-6">
          {vagas.length === 0 ? (
             <div className="card-default-large text-center py-16 text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
               </svg>
               <p className="text-lg">Nenhuma vaga cadastrada no momento.</p>
               <button onClick={() => navigate("/admin/cadastrar-vaga")} className="mt-4 text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                 Cadastre a primeira vaga aqui.
               </button>
             </div>
          ) : (
             <div className="grid grid-cols-1 gap-6">
                {vagas.map((vaga) => (
                  <article key={vaga._id} className="card-default-large !p-6 transition-all duration-300 hover:border-indigo-500/30">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4 mb-6 pb-6 border-b border-white/5">
                      {/* Vaga Header & Detalhes */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                           <h2 className="text-2xl font-bold text-white tracking-wide">
                             {vaga.titulo}
                           </h2>
                           <span className={`px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full border ${getStatusBadge(vaga.status)}`}>
                             {vaga.status}
                           </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                           <div>
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Área / Curso</p>
                              <p className="text-slate-300">{vaga.area} <span className="text-slate-500 mx-1">•</span> {vaga.curso}</p>
                           </div>
                           <div>
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Tipo / Local</p>
                              <p className="text-slate-300">{vaga.tipo} <span className="text-slate-500 mx-1">•</span> {vaga.localizacao}</p>
                           </div>
                           <div>
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Salário / Contato</p>
                              <p className="text-slate-300 truncate" title={`${vaga.salario} • ${vaga.contatoEmpresa}`}>
                                 {vaga.salario} <span className="text-slate-500 mx-1">•</span> {vaga.contatoEmpresa}
                              </p>
                           </div>
                        </div>
                      </div>

                      {/* Ações da Vaga */}
                      <div className="flex sm:flex-col gap-2 shrink-0">
                         <button
                           onClick={() => handleStatusChange(vaga._id, vaga.status === "ativo" ? "inativo" : "ativo")}
                           className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${vaga.status === 'ativo' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}
                         >
                           {vaga.status === "ativo" ? "Pausar Vaga" : "Ativar Vaga"}
                         </button>
                         <button 
                           onClick={() => navigate(`/admin/editar-vaga/${vaga._id}`)}
                           className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50 transition-colors text-center"
                         >
                           Editar Vaga
                         </button>
                      </div>
                    </div>

                    {/* Secão de Candidatos */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                         <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-400">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                           </svg>
                           Candidatos Inscritos <span className="text-sm font-normal text-slate-500 ml-1">({vaga.candidatos?.length || 0})</span>
                         </h4>
                         
                         {vaga.candidatos && vaga.candidatos.length > 0 && (
                            <button 
                              className="home-button-card !py-1.5 !px-4 text-xs !from-indigo-600 !to-indigo-500 shadow-indigo-500/20 whitespace-nowrap flex items-center gap-2"
                              onClick={() => copyCandidatesLink(vaga.candidatos)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                              </svg>
                              Copiar Link Público
                            </button>
                         )}
                      </div>

                      {(!vaga.candidatos || vaga.candidatos.length === 0) ? (
                         <div className="bg-white/5 border border-white/5 rounded-lg p-4 text-center text-sm text-slate-400">
                           Ainda não há candidatos para esta vaga.
                         </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {vaga.candidatos.map((curriculo) => (
                            <div key={curriculo._id} className="bg-slate-900/50 border border-white/5 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/20 transition-colors">
                              <div>
                                <p className="text-white font-medium text-sm">{curriculo.nomeCompleto}</p>
                                <p className="text-xs text-slate-400 truncate">{curriculo.curso}</p>
                              </div>
                              <button 
                                className={`px-5 py-2 text-xs rounded-lg font-bold uppercase tracking-wider transition-all w-full sm:w-auto shadow-sm ${
                                  vaga.selecionados?.includes(curriculo._id)
                                    ? 'bg-emerald-400 text-slate-950 shadow-inner' // Estado selecionado
                                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' // Estado não selecionado
                                }`}
                                onClick={() => handleSelecionarCandidato(vaga._id, curriculo._id)}
                              >
                                {vaga.selecionados?.includes(curriculo._id) ? 'Selecionado' : 'Selecionar'}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
             </div>
          )}
        </section>
      </div>
    </main>
    </>
  );
};

export default AdminVagasDashboard;