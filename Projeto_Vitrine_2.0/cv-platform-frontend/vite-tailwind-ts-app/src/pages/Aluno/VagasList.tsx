import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../../services/apiConfig";

type Vaga = {
  _id: string;
  titulo?: string;
  area?: string;
  descricao?: string;
  requisitos?: string;
  beneficios?: string;
  tipo?: string;
  localizacao?: string;
  curso?: string;
  salario?: string;
  contatoEmpresa?: string;
  status?: string;
  candidatos?: { _id: string; nomeCompleto?: string; curso?: string }[];
  [key: string]: any;
};

const VagasList: React.FC = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [curriculoStatus, setCurriculoStatus] = useState<string>("");
  const [candidaturasPendentes, setCandidaturasPendentes] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVagas = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/vagas", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setVagas(res.data.vagas || res.data || []);
      } catch (err: any) {
        console.error("Erro ao carregar vagas:", err?.response ?? err);
        setError("Erro ao carregar vagas.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCurriculoStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/alunos/curriculo", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setCurriculoStatus(res.data?.curriculo?.status || "");
      } catch (err) {
        setCurriculoStatus("");
      }
    };

    fetchVagas();
    fetchCurriculoStatus();
  }, []);

  useEffect(() => {
    if (!message && !error) return;
    const timer = setTimeout(() => { setMessage(""); setError(""); }, 4000);
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleCandidatar = async (vagaId: string) => {
    if (candidaturasPendentes.has(vagaId)) return;
    
    setCandidaturasPendentes(prev => new Set(prev).add(vagaId));
    setMessage("");
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/api/vagas/${vagaId}/candidatar`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      setMessage("Candidatura enviada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao se candidatar:", err);
      setError(err?.response?.data?.message || "Erro ao se candidatar à vaga.");
    } finally {
      setCandidaturasPendentes(prev => {
        const next = new Set(prev);
        next.delete(vagaId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const vagasAtivas = vagas.filter((vaga) => vaga.status === "ativo");

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-[100] w-full max-w-sm pointer-events-none flex flex-col gap-2">
         {message && <div className="animate-fade-in-up bg-emerald-500/90 border border-emerald-400 text-white px-6 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] shadow-emerald-500/20 text-sm font-medium backdrop-blur-md">{message}</div>}
         {error && <div className="animate-fade-in-up bg-rose-500/90 border border-rose-400 text-white px-6 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] shadow-rose-500/20 text-sm font-medium backdrop-blur-md">{error}</div>}
      </div>

      <main className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">

      <header className="card-default-large mb-8 border-cyan-500/20">
         <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-100 pointer-events-none" />
         <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 gap-4">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg shadow-cyan-500/10 text-cyan-400">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                 </svg>
               </div>
               <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Mural de Vagas</h1>
                  <p className="text-slate-400 text-sm mt-1">Oportunidades disponíveis para seu perfil</p>
               </div>
            </div>
            <button
               type="button"
               className="home-button-card !py-2 !px-4 text-sm bg-white/5 border border-white/10 hover:bg-white/10"
               onClick={() => navigate("/aluno")}
            >
               Voltar ao Painel
            </button>
         </div>
         
         {curriculoStatus !== "ativo" && (
            <div className="mt-6 bg-amber-500/10 border border-amber-500/20 text-amber-400/90 p-4 rounded-lg flex items-start gap-3 relative z-10 text-sm">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               <div>
                  <p className="font-semibold text-amber-500 mb-1">Currículo Inativo</p>
                  <p>Seu currículo não está ativo no momento. Você ainda pode visualizar as vagas, mas não poderá se candidatar até que a administração confirme seu cadastro.</p>
               </div>
            </div>
         )}
      </header>

      {vagasAtivas.length === 0 ? (
         <div className="card-default-large text-center py-16 text-slate-400 border-cyan-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
            <p className="text-lg">Nenhuma vaga ativa disponível no momento.</p>
            <p className="text-sm mt-2 opacity-70">Volte mais tarde para conferir novas oportunidades.</p>
         </div>
      ) : (
        <section className="space-y-6">
          {vagasAtivas.map((vaga) => (
            <article
              key={vaga._id}
              className="card-default-large !p-6 md:!p-8 group relative overflow-hidden transition-all hover:border-cyan-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start justify-between">
                 <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                       <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">{vaga.titulo}</h2>
                       <span className="px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                         {vaga.tipo}
                       </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400 mb-6">
                       <div className="flex items-center gap-1.5" title="Área / Curso">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
                         {vaga.area}
                       </div>
                       <div className="flex items-center gap-1.5" title="Localização">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                         {vaga.localizacao}
                       </div>
                       {vaga.salario && (
                         <div className="flex items-center gap-1.5" title="Salário / Bolsa">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                           {vaga.salario}
                         </div>
                       )}
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Descrição</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{vaga.descricao}</p>
                      </div>
                      
                      {vaga.requisitos && (
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Requisitos</h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{vaga.requisitos}</p>
                        </div>
                      )}
                      
                      {vaga.beneficios && (
                         <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Benefícios</h4>
                          <ul className="flex flex-wrap gap-2">
                            {vaga.beneficios.split(",").map((ben:string) => ben.trim()).filter(Boolean).map((ben:string) => (
                              <li key={ben} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full">{ben}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                 </div>

                 <div className="shrink-0 lg:w-48 lg:-mt-2 flex flex-col justify-end lg:justify-start">
                    <button
                      className={`w-full py-4 px-6 rounded-xl font-bold tracking-wide transition-all duration-300 flex justify-center items-center gap-2
                        ${curriculoStatus === "ativo" 
                          ? candidaturasPendentes.has(vaga._id)
                              ? "bg-cyan-600/50 text-white cursor-wait border border-cyan-500/50"
                              : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_4px_14px_0_rgba(8,145,178,0.39)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.23)] border border-cyan-400/20" 
                          : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"}`}
                      disabled={curriculoStatus !== "ativo" || candidaturasPendentes.has(vaga._id)}
                      onClick={() => handleCandidatar(vaga._id)}
                    >
                      {candidaturasPendentes.has(vaga._id) ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        "Quero me Candidatar"
                      )}
                    </button>
                    {curriculoStatus !== "ativo" && (
                      <p className="text-xs text-amber-500 mt-2 text-center">Currículo inativo</p>
                    )}
                 </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
    </>
  );
};

export default VagasList;