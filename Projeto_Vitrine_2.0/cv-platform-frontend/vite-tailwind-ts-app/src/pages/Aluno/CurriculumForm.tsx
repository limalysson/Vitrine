import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import type { AxiosResponse } from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3001";

type Experience = { empresa: string; cargo: string; inicio?: string; fim?: string; descricao?: string; };
type Language = { idioma: string; nivel: string; };
type Project = { nome: string; descricao?: string; link?: string; };

type FormShape = {
  id?: string;
  nomeCompleto: string;
  dataNascimento: string;
  telefone: string;
  linkedin: string;
  github: string;
  curso: string;
  periodoAtual: string;
  previsaoConclusao: string;
  experiencias: Experience[];
  habilidadesTecnicas: string;
  idiomas: Language[];
  habilidadesComportamentais: string;
  projetos: Project[];
  resumoProfissional: string;
  pdfUrl?: string;
  fotoUrl?: string;
};

function getResourceUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

const initialForm: FormShape = {
  nomeCompleto: "", dataNascimento: "", telefone: "", linkedin: "", github: "",
  curso: "", periodoAtual: "", previsaoConclusao: "",
  experiencias: [{ empresa: "", cargo: "", inicio: "", fim: "", descricao: "" }],
  habilidadesTecnicas: "", idiomas: [{ idioma: "", nivel: "" }], habilidadesComportamentais: "",
  projetos: [{ nome: "", descricao: "", link: "" }], resumoProfissional: "", pdfUrl: "", fotoUrl: "",
};

const CurriculumForm: React.FC = () => {
  const [formData, setFormData] = useState<FormShape>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    const fetchCurriculo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/alunos/curriculo`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (!mounted) return;
        if (data?.success && data.curriculo) {
          const curriculo = { ...data.curriculo } as any;
          if (curriculo.dataNascimento) curriculo.dataNascimento = curriculo.dataNascimento.slice(0, 10);
          setFormData((prev) => ({ ...prev, ...curriculo }));
          setPdfUrl(curriculo.pdfUrl || "");
          setCurrentPhotoUrl(curriculo.fotoUrl ? getResourceUrl(curriculo.fotoUrl) : "");
        }
      } catch (err) {
        setError("Erro ao carregar currículo.");
      }
    };
    fetchCurriculo();
    return () => {
      mounted = false;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  useEffect(() => {
    if (!message && !error) return;
    const timer = setTimeout(() => { setMessage(""); setError(""); }, 4000);
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number, type: "experiencias" | "idiomas" | "projetos") => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const list = [...(prev as any)[type]];
      list[index] = { ...(list[index] ?? {}), [name]: value };
      return { ...prev, [type]: list };
    });
  };

  const addArrayItem = (type: "experiencias" | "idiomas" | "projetos") => {
    setFormData((prev) => {
      const list = [...(prev as any)[type]];
      if (type === "experiencias") list.push({ empresa: "", cargo: "", inicio: "", fim: "", descricao: "" });
      if (type === "idiomas") list.push({ idioma: "", nivel: "" });
      if (type === "projetos") list.push({ nome: "", descricao: "", link: "" });
      return { ...prev, [type]: list };
    });
  };

  const removeArrayItem = (index: number, type: "experiencias" | "idiomas" | "projetos") => {
    setFormData((prev) => {
      const list = [...(prev as any)[type]];
      list.splice(index, 1);
      return { ...prev, [type]: list };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Por favor, selecione um arquivo PDF.");
      return;
    }
    setPdfFile(file);
  };

  const uploadPhoto = async (token?: string) => {
    if (!selectedFile) return { success: true, message: "Nenhuma foto selecionada para upload." };
    const fd = new FormData();
    fd.append("fotoPerfil", selectedFile);
    try {
      const res = await api.post(`${API_BASE}/api/alunos/upload-foto`, fd, {
        headers: { "Content-Type": "multipart/form-data", Authorization: token ? `Bearer ${token}` : "" },
      });
      const fotoUrl = res.data?.fotoUrl;
      if (fotoUrl) setCurrentPhotoUrl(getResourceUrl(fotoUrl));
      setPreviewUrl("");
      return { success: true, message: "Foto de perfil atualizada!" };
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || "Erro ao fazer upload da foto." };
    }
  };

  const handleSavePhotoNow = async () => {
    if (!selectedFile) return setError("Nenhuma foto selecionada.");
    setIsLoading(true); setMessage(""); setError("");
    try {
      const token = localStorage.getItem("token");
      const result = await uploadPhoto(token ?? undefined);
      if (!result.success) setError(result.message);
      else { setMessage(result.message); setSelectedFile(null); }
    } catch (err: any) {
      setError("Erro ao salvar a foto.");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePhoto = async () => {
    if (!currentPhotoUrl || !window.confirm("Deseja remover a foto de perfil?")) return;
    setIsLoading(true); setMessage(""); setError("");
    try {
      const token = localStorage.getItem("token");
      await api.delete(`${API_BASE}/api/alunos/foto`, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
      setCurrentPhotoUrl(""); setSelectedFile(null); setPreviewUrl("");
      if(fileInputRef.current) fileInputRef.current.value = "";
      setMessage("Foto removida com sucesso.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao remover foto.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPdf = async (token?: string) => {
    if (!pdfFile) return { success: true, message: "Nenhum arquivo PDF selecionado." };
    const fd = new FormData();
    fd.append("pdf", pdfFile);
    try {
      const res = await api.post(`${API_BASE}/api/alunos/upload-pdf`, fd, {
        headers: { "Content-Type": "multipart/form-data", Authorization: token ? `Bearer ${token}` : "" },
      });
      const u = res.data?.pdfUrl;
      if (u) setPdfUrl(getResourceUrl(u));
      return { success: true, message: "Currículo em PDF atualizado!" };
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || "Erro ao fazer upload do PDF." };
    }
  };

  async function handleSectionSave(keys: (keyof FormShape)[]) {
    setIsLoading(true); setMessage(""); setError("");
    const formatDateToISO = (value?: string) => {
      if (!value) return value;
      if (/^\d{4}-\d{2}(-\d{2})?$/.test(value)) return value;
      const d = new Date(value);
      if (isNaN(d.getTime())) return value;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    try {
      const payload: any = {};
      keys.forEach((k) => { payload[k] = (formData as any)[k]; });

      if (payload.experiencias) {
        payload.experiencias = payload.experiencias.map((exp: any) => ({
          ...exp, inicio: formatDateToISO(exp.inicio), fim: formatDateToISO(exp.fim),
        }));
      }

      if (payload.previsaoConclusao) {
        const v = formatDateToISO(payload.previsaoConclusao);
        payload.previsaoConclusao = v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v.slice(0, 7) : v;
      }

      await api.post(`${API_BASE}/api/alunos/curriculo`, payload);
      setMessage("Seção salva com sucesso!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao salvar a seção.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError(""); setIsLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Você precisa estar logado para salvar seu currículo.");
      setIsLoading(false);
      return;
    }
    
    try {
      const photoResult = await uploadPhoto(token);
      if (!photoResult.success) { setError(photoResult.message); setIsLoading(false); return; }

      const pdfResult = await uploadPdf(token);
      if (!pdfResult.success) { setError(pdfResult.message); setIsLoading(false); return; }

      if (formData.id) {
        await api.put(`${API_BASE}/api/alunos/curriculo/${formData.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        const { pdfUrl: _pdf, ...curriculumData } = formData;
        await api.post(`${API_BASE}/api/alunos/curriculo`, curriculumData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setMessage("Currículo atualizado completamente com sucesso!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao salvar currículo inteiro.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneInput = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    if (value.length > 2) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 0) return `(${value}`;
    return "";
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
    setTimeout(() => logout(), 0);
  };

  return (
    <div className="w-full text-white">
      {/* Toast Notifications */}
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md pointer-events-none flex flex-col gap-2">
         {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-lg shadow-lg text-center backdrop-blur-md animate-fade-in-up">{message}</div>}
         {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-3 rounded-lg shadow-lg text-center backdrop-blur-md animate-fade-in-up">{error}</div>}
      </div>

      <main className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
        
        {/* Header Container */}
        <header className="card-default-large mb-8 border-indigo-500/20">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100 pointer-events-none" />
           <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-4">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-indigo-400">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                 </svg>
                 Editar Currículo
              </h1>
              <div className="flex gap-3">
                 <button type="button" onClick={() => navigate("/aluno")} className="home-button-card !py-2 !px-4 text-sm bg-white/5 border border-white/10 hover:bg-white/10">
                   Voltar ao Painel
                 </button>
                 <button onClick={handleLogout} className="home-button-logout !py-2 !px-4 text-sm">
                   Sair
                 </button>
              </div>
           </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Seção de Foto */}
          <section className="card-default relative overflow-hidden group border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">1</span>
              Foto de Perfil
            </h3>
            
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
               <div className="shrink-0 flex flex-col items-center gap-4">
                 <div className="w-32 h-32 rounded-2xl overflow-hidden bg-[rgba(15,23,42,0.4)] border-2 border-slate-700 shadow-lg relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                   {previewUrl || currentPhotoUrl ? (
                     <img src={previewUrl || getResourceUrl(currentPhotoUrl)} alt="Foto Perfil" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-500 flex-col">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                       <span className="text-xs">Sem Foto</span>
                     </div>
                   )}
                   <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-xs font-semibold uppercase tracking-wider text-white">Alterar</span>
                   </div>
                 </div>
                 
                 {currentPhotoUrl && !previewUrl && (
                   <button type="button" onClick={deletePhoto} disabled={isLoading} className="text-rose-400 text-sm hover:text-rose-300 font-semibold uppercase tracking-wider transition-colors">
                     Remover Foto
                   </button>
                 )}
               </div>

               <div className="flex-1 w-full flex flex-col justify-center">
                  <div className="form-field !mb-4">
                    <label htmlFor="fotoPerfil" className="form-label text-xs uppercase tracking-wider text-slate-400">Selecionar arquivo</label>
                    <input id="fotoPerfil" type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="form-input !text-sm flex-1 cursor-pointer file:cursor-pointer file:rounded-md file:border-0 file:bg-indigo-500/20 file:text-indigo-400 file:font-semibold file:px-4 file:py-2 hover:file:bg-indigo-500/30 file:mr-4 file:transition-colors" />
                    <p className="text-xs text-slate-500 mt-2">Formatos suportados: JPG, PNG. Tamanho máximo: 5MB.</p>
                  </div>

                  {previewUrl && (
                    <div className="flex gap-3 mt-4">
                       <button type="button" onClick={handleSavePhotoNow} disabled={isLoading} className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-500/30 transition-colors">
                         Confirmar Nova Foto
                       </button>
                       <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(""); if(fileInputRef.current) fileInputRef.current.value = ""; }} className="bg-slate-800 border border-white/10 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-slate-700 transition-colors">
                         Cancelar
                       </button>
                    </div>
                  )}
               </div>
            </div>
          </section>

          {/* Dados Pessoais */}
          <section className="card-default relative overflow-hidden group border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
            <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
              <span className="text-indigo-400 text-sm">02.</span> Dados Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
               <div className="form-field !mb-0">
                  <label htmlFor="nomeCompleto" className="form-label">Nome Completo</label>
                  <input id="nomeCompleto" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} placeholder="Seu nome completo" className="form-input" required />
               </div>
               <div className="form-field !mb-0">
                  <label htmlFor="dataNascimento" className="form-label">Data de Nascimento</label>
                  <input id="dataNascimento" name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} className="form-input" required />
               </div>
               <div className="form-field !mb-0">
                  <label htmlFor="telefone" className="form-label">Telefone (WhatsApp)</label>
                  <input id="telefone" name="telefone" value={formatPhoneInput(formData.telefone)} onChange={(e) => setFormData((p) => ({ ...p, telefone: e.target.value }))} placeholder="(XX) XXXXX-XXXX" className="form-input" required />
               </div>
               <div className="form-field !mb-0">
                  <label htmlFor="linkedin" className="form-label">LinkedIn (URL)</label>
                  <input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/seuperfil" className="form-input" />
               </div>
               <div className="form-field md:col-span-2 !mb-0">
                  <label htmlFor="github" className="form-label">GitHub ou Portfólio (URL)</label>
                  <input id="github" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/seuperfil" className="form-input" />
               </div>
            </div>
            
            <div className="mt-6 flex justify-end">
               <button type="button" onClick={() => handleSectionSave(["nomeCompleto", "dataNascimento", "telefone", "linkedin", "github"])} disabled={isLoading} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                 Salvar Bloco
               </button>
            </div>
          </section>

          {/* Dados Acadêmicos */}
          <section className="card-default relative overflow-hidden group border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
            <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
              <span className="text-cyan-400 text-sm">03.</span> Informações Acadêmicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
               <div className="form-field !mb-0">
                  <label htmlFor="curso" className="form-label">Curso</label>
                  <select id="curso" name="curso" value={formData.curso} onChange={handleChange} className="form-input" required>
                    <option value="">Selecione o curso</option>
                    <option>Análise e Desenvolvimento de Sistemas</option>
                    <option>Engenharia de Software</option>
                    <option>Engenharia Civil</option>
                  </select>
               </div>
               <div className="form-field !mb-0">
                  <label htmlFor="periodoAtual" className="form-label">Período Ideal / Semestre</label>
                  <select id="periodoAtual" name="periodoAtual" value={formData.periodoAtual} onChange={handleChange} className="form-input" required>
                    <option value="">Selecione</option>
                    <option>1º Semestre</option>
                    <option>2º Semestre</option>
                    <option>3º Semestre</option>
                    <option>4º Semestre</option>
                    <option>5º Semestre</option>
                    <option>6º Semestre</option>
                    <option>7º Semestre</option>
                    <option>8º Semestre</option>
                  </select>
               </div>
               <div className="form-field !mb-0">
                  <label htmlFor="previsaoConclusao" className="form-label">Previsão de Conclusão</label>
                  <input id="previsaoConclusao" name="previsaoConclusao" type="month" value={formData.previsaoConclusao} onChange={handleChange} className="form-input" required />
               </div>
            </div>
            
            <div className="mt-6 flex justify-end">
               <button type="button" onClick={() => handleSectionSave(["curso", "periodoAtual", "previsaoConclusao"])} disabled={isLoading} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                 Salvar Bloco
               </button>
            </div>
          </section>

          {/* Experiências */}
          <section className="card-default relative border-indigo-500/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
              <span className="text-purple-400 text-sm">04.</span> Histórico Profissional
            </h3>
            
            <div className="space-y-8">
              {formData.experiencias.map((exp, i) => (
                <div key={i} className="bg-[rgba(15,23,42,0.4)] p-6 rounded-xl border border-white/5 relative group/item">
                  <div className="absolute -left-3 -top-3 w-8 h-8 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center font-bold text-slate-400 text-sm">
                    {i + 1}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-field !mb-0">
                      <label htmlFor={`empresa-${i}`} className="form-label">Empresa</label>
                      <input id={`empresa-${i}`} name="empresa" value={exp.empresa} placeholder="Nome da Empresa" onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-input" />
                    </div>
                    <div className="form-field !mb-0">
                      <label htmlFor={`cargo-${i}`} className="form-label">Cargo</label>
                      <input id={`cargo-${i}`} name="cargo" value={exp.cargo} placeholder="Estagiário, Desenvolvedor..." onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-input" />
                    </div>
                    <div className="form-field !mb-0">
                      <label htmlFor={`inicio-${i}`} className="form-label">Data Início</label>
                      <input id={`inicio-${i}`} name="inicio" type="month" value={exp.inicio} onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-input" />
                    </div>
                    <div className="form-field !mb-0">
                      <label htmlFor={`fim-${i}`} className="form-label">Data Fim <span className="text-slate-500 font-normal lowercase">(vazio p/ atual)</span></label>
                      <input id={`fim-${i}`} name="fim" type="month" value={exp.fim} onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-input" />
                    </div>
                    <div className="form-field md:col-span-2 !mb-0">
                      <label htmlFor={`descricao-${i}`} className="form-label">Resumo de Atividades</label>
                      <textarea id={`descricao-${i}`} name="descricao" value={exp.descricao} placeholder="Descreva brevemente suas principais responsabilidades..." onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-textarea h-24" />
                    </div>
                  </div>

                  {formData.experiencias.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(i, "experiencias")} className="absolute right-4 top-4 text-rose-400 hover:text-rose-300 bg-rose-500/10 p-2 rounded-lg transition-colors" title="Remover">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  )}
                </div>
              ))}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-white/5 pt-6">
                 <button type="button" onClick={() => addArrayItem("experiencias")} className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-dashed border-indigo-500/50 text-indigo-400 font-semibold hover:bg-indigo-500/10 hover:border-indigo-500 transition-all text-sm flex justify-center items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                   Adicionar Experiência
                 </button>
                 <button type="button" onClick={() => handleSectionSave(["experiencias"] as (keyof FormShape)[])} disabled={isLoading} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                   Salvar Bloco de Experiências
                 </button>
              </div>
            </div>
          </section>

          {/* Habilidades */}
          <section className="card-default relative border-indigo-500/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
              <span className="text-pink-400 text-sm">05.</span> Competências e Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-field !mb-0">
                <label className="form-label flex flex-col gap-1">
                  <span>Habilidades Técnicas</span>
                  <span className="text-xs text-slate-500 font-normal lowercase tracking-wide">Separe por vírgula. Ex: React, Node, Python</span>
                </label>
                <textarea
                  name="habilidadesTecnicas"
                  value={formData.habilidadesTecnicas}
                  onChange={handleChange}
                  placeholder="Java, Spring Boot, MySQL..."
                  className="form-textarea h-24"
                />
              </div>
              <div className="form-field !mb-0">
                <label className="form-label flex flex-col gap-1">
                  <span>Habilidades Comportamentais (Soft Skills)</span>
                  <span className="text-xs text-slate-500 font-normal lowercase tracking-wide">Comunicação, Liderança, Empatia...</span>
                </label>
                <textarea
                  name="habilidadesComportamentais"
                  value={formData.habilidadesComportamentais}
                  onChange={handleChange}
                  placeholder="Trabalho em equipe, Resolução de problemas..."
                  className="form-textarea h-24"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
               <button type="button" onClick={() => handleSectionSave(['habilidadesTecnicas','habilidadesComportamentais'])} disabled={isLoading} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                 Salvar Skills
               </button>
            </div>
          </section>

          {/* Idiomas */}
          <section className="card-default relative border-indigo-500/10">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white flex items-baseline gap-2">
                  <span className="text-teal-400 text-sm">06.</span> Idiomas
                </h3>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {formData.idiomas.map((idioma, i) => (
                  <div key={i} className="bg-[rgba(15,23,42,0.4)] p-4 rounded-xl border border-white/5 relative group">
                    <div className="form-field !mb-3">
                      <label className="form-label">Idioma</label>
                      <input name="idioma" value={idioma.idioma} placeholder="Inglês" onChange={(e) => handleArrayChange(e, i, 'idiomas')} className="form-input !py-1.5" />
                    </div>
                    <div className="form-field !mb-0">
                      <label className="form-label">Nível de Proficiência</label>
                      <select name="nivel" value={idioma.nivel} onChange={(e) => handleArrayChange(e, i, 'idiomas')} className="form-input !py-1.5">
                         <option value="">Selecione</option>
                         <option>Básico</option>
                         <option>Intermediário</option>
                         <option>Avançado</option>
                         <option>Fluente / Nativo</option>
                      </select>
                    </div>
                    {formData.idiomas.length > 1 && (
                      <button type="button" onClick={() => removeArrayItem(i, 'idiomas')} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                      </button>
                    )}
                  </div>
                ))}
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-white/5 pt-6">
                 <button type="button" onClick={() => addArrayItem("idiomas")} className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-dashed border-teal-500/50 text-teal-400 font-semibold hover:bg-teal-500/10 hover:border-teal-500 transition-all text-sm flex justify-center items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                   Adicionar Idioma
                 </button>
                 <button type="button" onClick={() => handleSectionSave(["idiomas"])} disabled={isLoading} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                   Salvar Bloco de Idiomas
                 </button>
              </div>
          </section>

          {/* Projetos */}
          <section className="card-default relative border-indigo-500/10">
             <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
               <span className="text-amber-400 text-sm">07.</span> Portfólio e Projetos
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {formData.projetos.map((p, i) => (
                  <div key={i} className="bg-[rgba(15,23,42,0.4)] p-5 rounded-xl border border-white/5 relative group/item">
                    <div className="absolute -left-2 -top-2 w-6 h-6 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center font-bold text-slate-400 text-xs">
                      {i + 1}
                    </div>
                    
                    <div className="form-field !mb-3">
                      <label className="form-label">Título do Projeto</label>
                      <input name="nome" value={p.nome} placeholder="App de Delivery" onChange={(e) => handleArrayChange(e, i, 'projetos')} className="form-input" />
                    </div>
                    <div className="form-field !mb-3">
                      <label className="form-label">Link (Repositório ou Deploy)</label>
                      <input name="link" value={p.link} placeholder="https://github.com/..." onChange={(e) => handleArrayChange(e, i, 'projetos')} className="form-input" />
                    </div>
                    <div className="form-field !mb-0">
                      <label className="form-label">Breve Descrição</label>
                      <textarea name="descricao" value={p.descricao} placeholder="O que o projeto faz? Quais tecnologias usou?" onChange={(e) => handleArrayChange(e, i, 'projetos')} className="form-textarea h-20" />
                    </div>

                    {formData.projetos.length > 1 && (
                      <button type="button" onClick={() => removeArrayItem(i, 'projetos')} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                      </button>
                    )}
                  </div>
                ))}
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-white/5 pt-6">
                 <button type="button" onClick={() => addArrayItem("projetos")} className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-dashed border-amber-500/50 text-amber-400 font-semibold hover:bg-amber-500/10 hover:border-amber-500 transition-all text-sm flex justify-center items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                   Adicionar Novo Projeto
                 </button>
                 <button type="button" onClick={() => handleSectionSave(["projetos"])} disabled={isLoading} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                   Salvar Bloco de Projetos
                 </button>
              </div>
          </section>

          {/* Resumo Profissional */}
          <section className="card-default relative border-indigo-500/10">
             <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
               <span className="text-rose-400 text-sm">08.</span> Resumo e Objetivos
             </h3>
             <div className="form-field !mb-0">
               <label className="form-label flex flex-col gap-1">
                  <span>Escreva algo sobre você</span>
                  <span className="text-xs text-slate-500 font-normal normal-case">Quem é você profissionalmente? Quais são seus objetivos de carreira nesta plataforma? (Aparecerá no topo do seu currículo)</span>
               </label>
               <textarea name="resumoProfissional" value={formData.resumoProfissional} onChange={handleChange} className="form-textarea h-32" placeholder="Apaixonado por tecnologia e desenvolvimento de software..." />
             </div>
             
             <div className="mt-6 flex justify-end">
                 <button type="button" onClick={() => handleSectionSave(["resumoProfissional"])} disabled={isLoading} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                   Salvar Resumo
                 </button>
              </div>
          </section>

          {/* Anexo PDF */}
          <section className="card-default relative border-indigo-500/10 mb-12">
             <h3 className="text-xl font-bold text-white mb-6 flex items-baseline gap-2 pb-4 border-b border-white/10">
               <span className="text-indigo-400 text-sm">09.</span> Currículo em Arquivo (PDF)
             </h3>
             <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 w-full text-center md:text-left">
                  <p className="text-white font-medium mb-1">Deseja anexar um arquivo PDF personalizado?</p>
                  <p className="text-sm text-slate-400 mb-4">Se você já possui um currículo diagramado, pode anexar aqui como complemento aos dados preenchidos.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
                     <label className="w-full sm:w-auto px-4 py-2 bg-slate-800 border-2 border-dashed border-indigo-500/30 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-slate-800/80 transition-all text-sm font-semibold text-indigo-300 text-center flex-1">
                        Selecionar Arquivo PDF
                        <input id="pdfCurriculo" type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
                     </label>
                     <span className="text-sm text-slate-400 truncate w-full sm:w-auto text-center sm:text-left">
                        {pdfFile ? pdfFile.name : (pdfUrl ? '1 Arquivo salvo' : 'Nenhum arquivo')}
                     </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col w-full md:w-auto gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                   {pdfUrl && (
                      <>
                         <button type="button" onClick={() => window.open(getResourceUrl(pdfUrl), "_blank")} className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600/40 transition-colors w-full flex justify-center items-center gap-2">
                           Visualizar PDF 
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                         </button>
                         <button type="button" disabled={isLoading} className="text-rose-400 text-sm hover:text-rose-300 py-2 transition-colors font-semibold" onClick={async () => {
                             if (!window.confirm("Deseja remover o PDF enviado?")) return;
                             setIsLoading(true);
                             try {
                               const token = localStorage.getItem("token");
                               await api.delete(`${API_BASE}/api/alunos/pdf`, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
                               setPdfUrl("");
                               setPdfFile(null);
                               setMessage("PDF removido com sucesso!");
                             } catch (err: any) {
                               setError("Erro ao remover o PDF.");
                             } finally {
                               setIsLoading(false);
                             }
                           }}>
                           Excluir Arquivo 
                         </button>
                      </>
                   )}
                </div>
             </div>
          </section>

          {/* Action Final Geral */}
          <div className="sticky bottom-6 z-40 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
             <p className="text-slate-400 text-sm hidden md:block">
               O seu currículo é a primeira impressão da empresa. Recomendamos que os botões "Salvar Bloco" sejam utilizados, <br/> mas aqui você pode confirmar todas as áreas preenchidas de uma vez.
             </p>
             <button type="submit" disabled={isLoading} className="w-full sm:w-auto home-button-card !py-3 !px-8 text-base shadow-indigo-500/25 !from-indigo-600 !to-purple-600 hover:!from-indigo-500 hover:!to-purple-500 flex justify-center items-center gap-2">
               {isLoading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               ) : (
                 <>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
                   Salvar Currículo Completo
                 </>
               )}
             </button>
          </div>

        </form>
      </main>
    </div>
  );
};

export default CurriculumForm;