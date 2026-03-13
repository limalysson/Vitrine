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
    <main className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      {/* Toast Notifications */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md pointer-events-none flex flex-col gap-2">
         {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-lg shadow-lg text-center backdrop-blur-md animate-fade-in-up">{message}</div>}
         {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-3 rounded-lg shadow-lg text-center backdrop-blur-md animate-fade-in-up">{error}</div>}
      </div>

      <header className="card-default-large mb-8 border-indigo-500/20">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100 pointer-events-none" />
         <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 gap-4">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg shadow-indigo-500/10 text-indigo-400">
                 {modoEdicao ? (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                 )}
               </div>
               <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    {modoEdicao ? "Editar Vaga" : "Cadastrar Nova Vaga"}
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    {modoEdicao ? "Atualize as informações desta oportunidade" : "Preencha os dados para divulgar uma nova oportunidade"}
                  </p>
               </div>
            </div>
            <button
               type="button"
               className="home-button-card !py-2 !px-4 text-sm bg-white/5 border border-white/10 hover:bg-white/10"
               onClick={() => navigate("/admin/vagas")}
            >
               Voltar ao Painel
            </button>
         </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Informações Principais */}
        <section className="card-default relative border-indigo-500/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
            <span className="text-indigo-400 text-sm">01.</span> Informações Principais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-field !mb-0 md:col-span-2">
              <label className="form-label">Título da Vaga</label>
              <input name="titulo" value={formData.titulo} onChange={handleChange} required placeholder="Ex: Desenvolvedor Front-end Júnior" className="form-input" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label">Área / Departamento</label>
              <input name="area" value={formData.area} onChange={handleChange} required placeholder="Ex: Tecnologia da Informação" className="form-input" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label">Curso Destino</label>
              <select name="curso" value={formData.curso} onChange={handleChange} required className="form-input">
                <option value="" disabled>Selecione o curso</option>
                <option value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento de Sistemas</option>
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Engenharia Civil">Engenharia Civil</option>
              </select>
            </div>
            
            <div className="form-field !mb-0 md:col-span-2">
              <label className="form-label">Descrição da Vaga</label>
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} required placeholder="Descreva as responsabilidades e o dia a dia da vaga..." className="form-textarea h-32" />
            </div>
          </div>
        </section>

        {/* Requisitos e Benefícios */}
        <section className="card-default relative border-indigo-500/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
            <span className="text-purple-400 text-sm">02.</span> Requisitos e Benefícios
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="form-field !mb-0">
              <label className="form-label">Requisitos</label>
              <textarea name="requisitos" value={formData.requisitos} onChange={handleChange} required placeholder="O que o candidato precisa ter para essa vaga?" className="form-textarea h-24" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label flex flex-col gap-1">
                <span>Benefícios</span>
                <span className="text-xs text-slate-500 font-normal normal-case">Separe por vírgulas. Ex: Vale Transporte, Vale Refeição, Plano de Saúde</span>
              </label>
              <input name="beneficios" value={formData.beneficios} onChange={handleChange} placeholder="Benefícios oferecidos..." className="form-input" />
            </div>
          </div>
        </section>

        {/* Contratação e Local */}
        <section className="card-default relative border-indigo-500/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
            <span className="text-cyan-400 text-sm">03.</span> Detalhes da Contratação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-field !mb-0">
              <label className="form-label">Tipo de Contratação</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} required className="form-input">
                <option value="" disabled>Selecione</option>
                <option value="Estágio">Estágio</option>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="form-field !mb-0">
              <label className="form-label">Localização</label>
              <input name="localizacao" value={formData.localizacao} onChange={handleChange} required placeholder="Ex: São Paulo, SP (ou Remoto)" className="form-input" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label">Salário / Bolsa (Opcional)</label>
              <input name="salario" value={formData.salario} onChange={handleChange} placeholder="Ex: R$ 2.000,00 ou A combinar" className="form-input" />
            </div>

            <div className="form-field !mb-0">
              <label className="form-label">Contato da Empresa (Email ou Link)</label>
              <input name="contatoEmpresa" value={formData.contatoEmpresa} onChange={handleChange} placeholder="rh@empresa.com.br" className="form-input" />
            </div>
          </div>
        </section>

        {/* Submit action */}
        <div className="sticky bottom-6 z-40 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl mt-8">
           <p className="text-slate-400 text-sm hidden md:block">
             Revise os dados antes de salvar. As vagas ativas ficam visíveis imediatamente para os alunos.
           </p>
           <div className="flex gap-3 w-full sm:w-auto">
             <button type="button" onClick={() => navigate("/admin/vagas")} className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all text-sm">
               Cancelar
             </button>
             <button type="submit" disabled={isLoading} className="w-full sm:w-auto home-button-card !py-3 !px-8 text-base shadow-indigo-500/25 !from-indigo-600 !to-purple-600 hover:!from-indigo-500 hover:!to-purple-500 flex justify-center items-center gap-2">
               {isLoading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               ) : (
                 <>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
                   {modoEdicao ? "Salvar Alterações" : "Cadastrar Vaga"}
                 </>
               )}
             </button>
           </div>
        </div>

      </form>
    </main>
  );
};

export default JobForm;