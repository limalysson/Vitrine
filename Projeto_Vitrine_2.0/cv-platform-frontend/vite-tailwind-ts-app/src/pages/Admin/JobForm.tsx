import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../../services/apiConfig";

type JobData = {
  titulo: string;
  area: string;
  descricao: string;
  requisitos: string;
  beneficios: string;
  tipo: string;
  modalidade: string;
  localizacao: string;
  curso: string;
  salario: string;
  contatoEmpresa: string;
  [key: string]: any;
};

type JobFormProps = {
  onSuccess?: () => void;
  modoEdicao?: boolean;
};

const JobForm: React.FC<JobFormProps> = ({ onSuccess, modoEdicao = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<JobData>({
    titulo: "",
    area: "",
    descricao: "",
    requisitos: "",
    beneficios: "",
    tipo: "",
    modalidade: "",
    localizacao: "",
    curso: "",
    salario: "",
    contatoEmpresa: "",
  });

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (modoEdicao && id) {
      const token = localStorage.getItem("adminToken");
      api
        .get(`${API_BASE_URL}/api/admin/vagas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFormData((prev) => ({ ...prev, ...(res.data.vaga || res.data) }));
        })
        .catch(() => setError("Erro ao carregar vaga."));
    }
  }, [modoEdicao, id]);

  useEffect(() => {
    if (!message && !error) return;
    const timer = setTimeout(() => { setMessage(""); setError(""); }, 4000);
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      if (modoEdicao && id) {
        await api.put(`${API_BASE_URL}/api/admin/vagas/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Vaga editada com sucesso!");
      } else {
        await api.post(`${API_BASE_URL}/api/admin/vagas`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Vaga cadastrada com sucesso!");
      }
      onSuccess?.();
      // Optional: navigate back after a short delay so user sees success message
      setTimeout(() => navigate("/admin/vagas"), 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao salvar vaga.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-[100] w-full max-w-sm pointer-events-none flex flex-col gap-2">
         {message && <div className="animate-fade-in-up bg-emerald-500/90 border border-emerald-400 text-white px-6 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] shadow-emerald-500/20 text-sm font-medium backdrop-blur-md">{message}</div>}
         {error && <div className="animate-fade-in-up bg-rose-500/90 border border-rose-400 text-white px-6 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] shadow-rose-500/20 text-sm font-medium backdrop-blur-md">{error}</div>}
      </div>

      <main className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">

      <header className="card-default-large mb-8 border-indigo-500/20 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/5 opacity-100 pointer-events-none" />
         <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 gap-6">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-xl shadow-indigo-500/20 text-indigo-400 backdrop-blur-sm">
                 {modoEdicao ? (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                 )}
               </div>
               <div>
                  <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 uppercase tracking-tight">
                    {modoEdicao ? "Editar Vaga" : "Nova Oportunidade"}
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base mt-1 font-medium">
                    {modoEdicao ? "Refine os detalhes desta vaga no sistema" : "Publique uma nova vaga para atrair talentos"}
                  </p>
               </div>
            </div>
            <button
               type="button"
               className="home-button-card !py-2.5 !px-6 text-sm bg-white/5 border border-white/10 hover:bg-white/10 flex items-center gap-2 group transition-all duration-300 shadow-none hover:shadow-indigo-500/10"
               onClick={() => navigate("/admin/vagas")}
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
               </svg>
               Voltar ao Painel
            </button>
         </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Informações Principais *        <section className="card-default-large relative border-indigo-500/10 !p-8 overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-indigo-500 pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-700">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
             </svg>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-3 pb-5 border-b border-white/10">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-black">01</span> 
            Informações do Cargo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="form-field !mb-0 md:col-span-2">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
                Título da Vaga
              </label>
              <input name="titulo" value={formData.titulo} onChange={handleChange} required placeholder="Ex: Desenvolvedor Front-end Júnior" className="form-input focus:ring-2 ring-indigo-500/20" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                </svg>
                Área / Departamento
              </label>
              <input name="area" value={formData.area} onChange={handleChange} required placeholder="Ex: Tecnologia da Informação" className="form-input" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A57.778 57.778 0 0 1 12 8.125c1.76 0 3.511.161 5.25.475V15a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
                </svg>
                Curso Destino
              </label>
              <select name="curso" value={formData.curso} onChange={handleChange} required className="form-select">
                <option value="" disabled>Selecione o curso</option>
                <option value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento de Sistemas</option>
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Engenharia Civil">Engenharia Civil</option>
                <option value="Administração">Administração</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
              </select>
            </div>
            
            <div className="form-field !mb-0 md:col-span-2">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
                Descrição da Vaga
              </label>
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} required placeholder="Descreva as responsabilidades e o dia a dia da vaga..." className="form-textarea h-40 !leading-relaxed" />
            </div>
          </div>
        </section>

        {/* Requisitos e Benefícios */}
        <section className="card-default-large relative border-purple-500/10 !p-8 overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-purple-500 pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-700">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32">
               <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
             </svg>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-3 pb-5 border-b border-white/10">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-black">02</span> 
            Requisitos e Diferenciais
          </h3>
          <div className="grid grid-cols-1 gap-8 relative z-10">
            <div className="form-field !mb-0">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-purple-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Requisitos Necessários
              </label>
              <textarea name="requisitos" value={formData.requisitos} onChange={handleChange} required placeholder="Tecnologias, idiomas ou experiências desejadas..." className="form-textarea h-28" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label mb-2 flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-purple-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  Benefícios Oferecidos
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Sugestão: Virgulas</span>
              </label>
              <input name="beneficios" value={formData.beneficios} onChange={handleChange} placeholder="Ex: Vale Refeição, Plano de Saúde, Remote Friendly..." className="form-input" />
            </div>
          </div>
        </section>

        {/* Contratação e Local */}
        <section className="card-default-large relative border-cyan-500/10 !p-8 overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-cyan-500 pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-700">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
             </svg>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-3 pb-5 border-b border-white/10">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-black">03</span> 
            Condições & Localização
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="form-field !mb-0">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Tipo de Contratação
              </label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} required className="form-select">
                <option value="" disabled>Selecione</option>
                <option value="Estágio">Estágio</option>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Trainee">Trainee</option>
              </select>
            </div>

            <div className="form-field !mb-0">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Modalidade
              </label>
              <select name="modalidade" value={formData.modalidade} onChange={handleChange} required className="form-select">
                <option value="" disabled>Selecione</option>
                <option value="Presencial">Presencial</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Remoto">Remoto</option>
              </select>
            </div>

            <div className="form-field !mb-0">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Localização
              </label>
              <input name="localizacao" value={formData.localizacao} onChange={handleChange} required placeholder="Ex: Marília, SP ou Remoto" className="form-input" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5a.75.75 0 0 1-.75-.75V15m0 0h.75m0 0h17.25m-17.25 0V6.75M12 9.75l1.5 1.5M12 9.75l-1.5 1.5M12 9.75v4.5" />
                </svg>
                Salário / Bolsa (Opcional)
              </label>
              <input name="salario" value={formData.salario} onChange={handleChange} placeholder="Ex: R$ 1.500,00 ou A combinar" className="form-input" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                Contato da Empresa (Email ou Link)
              </label>
              <input name="contatoEmpresa" value={formData.contatoEmpresa} onChange={handleChange} placeholder="rh@empresa.com.br" className="form-input" />
            </div>
          </div>
        </section>

        {/* Submit action */}
        <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 p-5 md:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-indigo-500/20 mt-12 mb-8">
           <div className="flex items-center gap-4 hidden md:flex">
             <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
               </svg>
             </div>
             <p className="text-slate-400 text-sm max-w-xs leading-tight">
               As vagas ativas ficam visíveis <span className="text-slate-200 font-semibold">imediatamente</span> para todos os alunos cadastrados.
             </p>
           </div>
           <div className="flex gap-4 w-full sm:w-auto">
             <button 
               type="button" 
               onClick={() => navigate("/admin/vagas")} 
               className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl border border-white/10 text-slate-300 font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-wider"
             >
               Descartar
             </button>
             <button 
               type="submit" 
               disabled={isLoading} 
               className="flex-1 sm:flex-none home-button-card !py-3.5 !px-10 text-sm font-bold uppercase tracking-widest shadow-xl shadow-indigo-600/20 !from-indigo-600 !to-purple-600 hover:!from-indigo-500 hover:!to-purple-500 flex justify-center items-center gap-3 active:scale-95 transition-all"
             >
               {isLoading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               ) : (
                 <>
                   {modoEdicao ? "Atualizar Vaga" : "Publicar Vaga"}
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                   </svg>
                 </>
               )}
             </button>
           </div>
        </div>

      </form>
    </main>
    </>
  );
};

export default JobForm;