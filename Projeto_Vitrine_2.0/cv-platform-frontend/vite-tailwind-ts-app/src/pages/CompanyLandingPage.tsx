import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../services/apiConfig";
import CurriculumDetail from "../components/Curriculum/CurriculumDetail";
import CurriculumFullDetailsInline from "../components/Curriculum/CurriculumFullDetailsInline";

type Curriculum = {
  _id: string;
  nomeCompleto?: string;
  curso?: string;
  periodoAtual?: string;
  resumoProfissional?: string;
  habilidadesTecnicas?: string;
  fotoUrl?: string;
  pdfUrl?: string;
  [key: string]: any;
};

const CompanyLandingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const idsParam = params.get("ids");
  const selectedIds = idsParam ? idsParam.split(",") : [];

  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/curriculos/ativos?ids=${idsParam}`);
        setCurriculums(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Não foi possível carregar os currículos no momento.");
        setCurriculums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, [idsParam]);

  if (!idsParam || selectedIds.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="card-default-large text-center py-16 px-8 border-rose-500/30 bg-rose-500/5 max-w-lg mx-auto">
           <p className="text-rose-400 font-medium text-lg">Acesso inválido: nenhum currículo selecionado. Solicite um novo link.</p>
        </div>
      </main>
    );
  }

  const filteredCurriculums = curriculums.filter((curriculum) =>
    selectedIds.includes(curriculum._id)
  );

  const handleCloseDetails = () => {
    setSelectedCurriculum(null);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="card-default-large text-center py-16 px-8 border-rose-500/30 bg-rose-500/5 max-w-lg mx-auto">
           <p className="text-rose-400 font-medium text-lg">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in-up">
      <header className="card-default-large mb-8 border-indigo-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-100 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Vitrine de Talentos
          </h1>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2 flex items-center gap-3">
             <p className="text-2xl font-black text-indigo-400">{filteredCurriculums.length}</p>
             <p className="text-xs text-slate-400 uppercase tracking-widest leading-tight">Currículos<br/>Disponíveis</p>
          </div>
        </div>
      </header>

      {selectedCurriculum ? (
        <CurriculumDetail curriculum={selectedCurriculum} onClose={handleCloseDetails} />
      ) : (
        <section className="flex flex-col gap-4">
          {filteredCurriculums.length > 0 ? (
            filteredCurriculums.map((curriculum) => (
              <article
                key={curriculum._id}
                className="card-default-large !p-5 transition-all duration-300 hover:border-indigo-500/30"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Foto Área */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/30 bg-slate-800 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                      {curriculum.fotoUrl ? (
                        <img
                          src={`${API_BASE_URL}${curriculum.fotoUrl}`}
                          alt={`Foto de ${curriculum.nomeCompleto}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Info Área */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                         <div>
                           <h2 className="text-xl font-bold text-white mb-1">{curriculum.nomeCompleto}</h2>
                           <p className="text-slate-400 text-sm">
                             {curriculum.curso} • <span className="text-slate-300">{curriculum.periodoAtual}</span>
                           </p>
                         </div>
                         <div className="flex flex-col sm:flex-row gap-2">
                            {curriculum.pdfUrl ? (
                              <a
                                href={`${API_BASE_URL}${curriculum.pdfUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" /></svg>
                                Ver PDF
                              </a>
                            ) : (
                              <span className="px-4 py-2 rounded-lg text-sm bg-slate-800/50 border border-white/5 text-slate-500 cursor-not-allowed text-center">
                                Sem PDF
                              </span>
                            )}
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Resumo Profissional</p>
                          <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{curriculum.resumoProfissional || "Nenhum resumo disponível."}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Habilidades</p>
                          <p className="text-sm text-slate-300 leading-relaxed">{curriculum.habilidadesTecnicas || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-white/5 pt-4">
                      <button
                        className="w-full bg-slate-800/80 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 text-center text-xs text-slate-400 hover:text-indigo-300 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold uppercase tracking-widest shadow-sm"
                        onClick={() => setExpandedCardId(expandedCardId === curriculum._id ? null : curriculum._id)}
                        aria-expanded={expandedCardId === curriculum._id}
                      >
                        {expandedCardId === curriculum._id ? "Ocultar Detalhes Completos" : "Ver Detalhes Completos"}
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
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="card-default-large text-center py-16 text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
               </svg>
               <p className="text-lg">Nenhum currículo ativo encontrado com os filtros aplicados.</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default CompanyLandingPage;