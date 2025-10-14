import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import type { AxiosResponse } from "axios";
import { useAuth } from "../../contexts/AuthContext"; // ADICIONADO

const API_BASE = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3001";

type Experience = {
  empresa: string;
  cargo: string;
  inicio?: string;
  fim?: string;
  descricao?: string;
};

type Language = {
  idioma: string;
  nivel: string;
};

type Project = {
  nome: string;
  descricao?: string;
  link?: string;
};

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
  nomeCompleto: "",
  dataNascimento: "",
  telefone: "",
  linkedin: "",
  github: "",
  curso: "",
  periodoAtual: "",
  previsaoConclusao: "",
  experiencias: [{ empresa: "", cargo: "", inicio: "", fim: "", descricao: "" }],
  habilidadesTecnicas: "",
  idiomas: [{ idioma: "", nivel: "" }],
  habilidadesComportamentais: "",
  projetos: [{ nome: "", descricao: "", link: "" }],
  resumoProfissional: "",
  pdfUrl: "",
  fotoUrl: "",
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
  const { logout } = useAuth(); // ADICIONADO

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    type: "experiencias" | "idiomas" | "projetos"
  ) => {
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
      setMessage("");
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
      return { success: true, message: "Foto de perfil atualizada com sucesso!" };
    } catch (err: any) {
      console.error("Erro upload foto:", err?.response || err);
      return { success: false, message: err?.response?.data?.message || "Erro ao fazer upload da foto." };
    }
  };

  const uploadPdf = async (token?: string) => {
    if (!pdfFile) return { success: true, message: "Nenhum arquivo PDF selecionado para upload." };
    const fd = new FormData();
    fd.append("pdf", pdfFile);
    try {
      const res = await api.post(`${API_BASE}/api/alunos/upload-pdf`, fd, {
        headers: { "Content-Type": "multipart/form-data", Authorization: token ? `Bearer ${token}` : "" },
      });
      const u = res.data?.pdfUrl;
      if (u) setPdfUrl(getResourceUrl(u));
      return { success: true, message: "Currículo em PDF atualizado com sucesso!" };
    } catch (err: any) {
      console.error("Erro upload pdf:", err?.response || err);
      return { success: false, message: err?.response?.data?.message || "Erro ao fazer upload do PDF." };
    }
  };

  const handleSectionSave = async (sectionFields: (keyof FormShape)[]) => {
    setMessage("");
    setError("");
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado para salvar seu currículo.");
      setIsLoading(false);
      return;
    }
    try {
      const sectionData: Partial<FormShape> = {};
      sectionFields.forEach((f) => {
        sectionData[f] = (formData as any)[f];
      });
      await api.patch(`${API_BASE}/api/alunos/curriculo`, sectionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Seção salva com sucesso!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao salvar a seção.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado para salvar seu currículo.");
      setIsLoading(false);
      return;
    }
    try {
      const photoResult = await uploadPhoto(token);
      if (!photoResult.success) {
        setError(photoResult.message);
        setIsLoading(false);
        return;
      }
      if (photoResult.message && photoResult.message !== "Nenhuma foto selecionada para upload.") {
        setMessage(photoResult.message);
      }

      const pdfResult = await uploadPdf(token);
      if (!pdfResult.success) {
        setError(pdfResult.message);
        setIsLoading(false);
        return;
      }
      if (pdfResult.message && pdfResult.message !== "Nenhum arquivo PDF selecionado para upload.") {
        setMessage((prev) => (prev ? prev + " " : "") + pdfResult.message);
      }

      let response: AxiosResponse<any> | null = null;
      if (formData.id) {
        response = await api.put(`${API_BASE}/api/alunos/curriculo/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const { pdfUrl: _pdf, ...curriculumData } = formData;
        response = await api.post(`${API_BASE}/api/alunos/curriculo`, curriculumData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMessage((prev) => (prev ? prev + " " : "") + (response?.data?.message ?? "Salvo com sucesso"));
    } catch (err: any) {
      console.error("Erro ao salvar currículo:", err?.response || err);
      setError(err?.response?.data?.message || "Erro ao salvar currículo. Verifique os dados.");
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
    // limpa a sessão no próximo ciclo para evitar que ProtectedRoute cause redirect
    setTimeout(() => logout(), 0);
  };

  return (
    <>
      {(message || error) && (
        <div className={`fixed top-6 right-6 z-50 p-3 rounded-md ${error ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {message || error}
        </div>
      )}

      <main className="p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => navigate("/aluno")} className="home-button-card">
              Voltar
            </button>
            <h1 className="text-xl font-semibold text-white">Meu Currículo</h1>
            <button onClick={handleLogout} className="home-button-card home-button-logout">
              Sair
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto */}
            <section className="bg-white/5 p-4 rounded">
              <h3 className="font-semibold text-white">Foto de Perfil</h3>
              <div className="form-field mt-2">
                <label htmlFor="fotoPerfil" className="form-label">Selecionar foto:</label>
                <input id="fotoPerfil" type="file" accept="image/*" onChange={handleFileChange} className="form-input" />
                {previewUrl ? (
                  <div className="mt-2">
                    <img src={previewUrl} alt="Pré-visualização" className="w-32 h-32 object-cover rounded" />
                    <p className="text-sm text-white/80">Pré-visualização da nova foto</p>
                  </div>
                ) : currentPhotoUrl ? (
                  <div className="mt-2">
                    <img src={getResourceUrl(currentPhotoUrl)} alt="Foto Atual" className="w-32 h-32 object-cover rounded" />
                    <p className="text-sm text-white/80">Foto de perfil atual</p>
                  </div>
                ) : (
                  <p className="text-sm text-white/70">Nenhuma foto selecionada.</p>
                )}
              </div>
            </section>

            {/* Dados Pessoais */}
            <section className="bg-white/5 p-4 rounded">
              <h3 className="font-semibold text-white">Dados Pessoais</h3>
              <div className="form-row sm-2 mt-3">
                <div className="form-field">
                  <label htmlFor="nomeCompleto" className="form-label">Nome completo:</label>
                  <input id="nomeCompleto" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} placeholder="Nome completo" className="form-input" />
                </div>

                <div className="form-field">
                  <label htmlFor="dataNascimento" className="form-label">Data de nascimento:</label>
                  <input id="dataNascimento" name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-field">
                  <label htmlFor="telefone" className="form-label">Telefone (WhatsApp):</label>
                  <input id="telefone" name="telefone" value={formatPhoneInput(formData.telefone)} onChange={(e) => setFormData((p) => ({ ...p, telefone: e.target.value }))} placeholder="Telefone" className="form-input" />
                </div>

                <div className="form-field">
                  <label htmlFor="linkedin" className="form-label">LinkedIn (opcional):</label>
                  <input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn" className="form-input" />
                </div>

                <div className="form-field">
                  <label htmlFor="github" className="form-label">GitHub / Portfólio (opcional):</label>
                  <input id="github" name="github" value={formData.github} onChange={handleChange} placeholder="GitHub / Portfólio" className="form-input" />
                </div>
              </div>
              <div className="form-actions mt-3">
                <button type="button" onClick={() => handleSectionSave(["nomeCompleto", "dataNascimento", "telefone", "linkedin", "github"])} disabled={isLoading} className="home-button-card">
                  {isLoading ? "Salvando..." : "Salvar Dados Pessoais"}
                </button>
              </div>
            </section>

            {/* Dados Acadêmicos */}
            <section className="bg-white/5 p-4 rounded">
              <h3 className="font-semibold text-white">Dados Acadêmicos</h3>
              <div className="form-row sm-2 mt-3">
                <div className="form-field">
                  <label htmlFor="curso" className="form-label">Curso:</label>
                  <select id="curso" name="curso" value={formData.curso} onChange={handleChange} className="form-select">
                    <option value="">Selecione o curso</option>
                    <option>Análise e Desenvolvimento de Sistemas</option>
                    <option>Engenharia de Software</option>
                    <option>Engenharia Civil</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="periodoAtual" className="form-label">Período atual:</label>
                  <select id="periodoAtual" name="periodoAtual" value={formData.periodoAtual} onChange={handleChange} className="form-select">
                    <option value="">Período atual</option>
                    <option>1º Semestre</option>
                    <option>2º Semestre</option>
                    <option>3º Semestre</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="previsaoConclusao" className="form-label">Previsão de conclusão (Mês/Ano):</label>
                  <input id="previsaoConclusao" name="previsaoConclusao" type="month" value={formData.previsaoConclusao} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="form-actions mt-3">
                <button type="button" onClick={() => handleSectionSave(["curso", "periodoAtual", "previsaoConclusao"])} disabled={isLoading} className="home-button-card">
                  {isLoading ? "Salvando..." : "Salvar Dados Acadêmicos"}
                </button>
              </div>
            </section>

            {/* Experiências (exemplo: render first few) */}
            <section className="bg-white/5 p-4 rounded">
              <h3 className="font-semibold text-white">Experiências Profissionais</h3>
              <div className="mt-3 space-y-3">
                {formData.experiencias.map((exp, i) => (
                  <div key={i} className="space-y-2">
                    <div className="form-field">
                      <label htmlFor={`empresa-${i}`} className="form-label">Empresa:</label>
                      <input id={`empresa-${i}`} name="empresa" value={exp.empresa} placeholder="Empresa" onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-input" />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`cargo-${i}`} className="form-label">Cargo:</label>
                      <input id={`cargo-${i}`} name="cargo" value={exp.cargo} placeholder="Cargo" onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-input" />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`inicio-${i}`} className="form-label">Início (Mês/Ano):</label>
                      <input id={`inicio-${i}`} name="inicio" type="month" value={exp.inicio} onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-input" />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`fim-${i}`} className="form-label">Fim (Mês/Ano, deixe em branco se atual):</label>
                      <input id={`fim-${i}`} name="fim" type="month" value={exp.fim} onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-input" />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`descricao-${i}`} className="form-label">Descrição das Responsabilidades:</label>
                      <textarea id={`descricao-${i}`} name="descricao" value={exp.descricao} placeholder="Descrição" onChange={(e) => handleArrayChange(e, i, "experiencias")} className="form-textarea" />
                    </div>

                    {formData.experiencias.length > 1 && (
                      <div className="form-actions">
                        <button type="button" onClick={() => removeArrayItem(i, "experiencias")} className="home-button-card home-button-logout">
                          Remover Experiência
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="w-full justify-between flex">
                  <button type="button" onClick={() => addArrayItem("experiencias")} className="home-button-card">
                    Adicionar Experiência
                  </button>
                    <button type="button" onClick={() => handleSectionSave(["experiencias"] as (keyof FormShape)[])} disabled={isLoading} className="home-button-card">
                      {isLoading ? "Salvando..." : "Salvar Experiências"}
                    </button>
                  
                </div>
              </div>
            </section>

            {/* HABILIDADES */}
            <section className="bg-white/5 p-4 rounded">
              <h3 className="font-semibold text-white">Habilidades</h3>
              <div className="form-row mt-3">
                <div className="form-field">
                  <label className="form-label">Habilidades Técnicas (Separe-as por vírgula)</label>
                  <input
                    name="habilidadesTecnicas"
                    value={formData.habilidadesTecnicas}
                    onChange={handleChange}
                    placeholder="Ex: JavaScript, React, Node.js"
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Habilidades Comportamentais</label>
                  <input
                    name="habilidadesComportamentais"
                    value={formData.habilidadesComportamentais}
                    onChange={handleChange}
                    placeholder="Ex: Comunicação, Proatividade"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-actions mt-3">
                <button type="button" onClick={() => handleSectionSave(['habilidadesTecnicas','habilidadesComportamentais'])} className="home-button-card" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Habilidades"}
                </button>
              </div>
            </section>

            {/* IDIOMAS */}
            <section className="bg-white/5 p-4 rounded">
              <h3 className="font-semibold text-white">Idiomas</h3>
              <div className="mt-3 space-y-3">
                {formData.idiomas.map((idioma, i) => (
                  <div key={i} className="space-y-2">
                    <div className="form-field">
                      <label className="form-label">Idioma</label>
                      <input name="idioma" value={idioma.idioma} onChange={(e) => handleArrayChange(e, i, 'idiomas')} className="form-input" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Nível</label>
                      <input name="nivel" value={idioma.nivel} onChange={(e) => handleArrayChange(e, i, 'idiomas')} className="form-input" />
                    </div>
                    {formData.idiomas.length > 1 && (
                      <div className="form-actions">
                        <button type="button" onClick={() => removeArrayItem(i, 'idiomas')} className="home-button-card home-button-logout">
                          Remover Idioma
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="w-full justify-between flex">
                  <button type="button" onClick={() => addArrayItem('idiomas')} className="home-button-card">Adicionar Idioma</button>
                  <button type="button" onClick={() => handleSectionSave(['idiomas'])} className="home-button-card" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Idiomas'}</button>
                </div>
              </div>
            </section>

            {/* PROJETOS */}
            <section className="bg-white/5 p-4 rounded">
              <h3 className="font-semibold text-white">Projetos</h3>
              <div className="mt-3 space-y-3">
                {formData.projetos.map((p, i) => (
                  <div key={i} className="space-y-2">
                    <div className="form-field">
                      <label className="form-label">Nome do Projeto</label>
                      <input name="nome" value={p.nome} onChange={(e) => handleArrayChange(e, i, 'projetos')} className="form-input" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Descrição</label>
                      <textarea name="descricao" value={p.descricao} onChange={(e) => handleArrayChange(e, i, 'projetos')} className="form-textarea" />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Link (opcional)</label>
                      <input name="link" value={p.link} onChange={(e) => handleArrayChange(e, i, 'projetos')} className="form-input" />
                    </div>
                    {formData.projetos.length > 1 && (
                      <div className="form-actions">
                        <button type="button" onClick={() => removeArrayItem(i, 'projetos')} className="home-button-card home-button-logout">Remover Projeto</button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="w-full justify-between flex">
                  <button type="button" onClick={() => addArrayItem('projetos')} className="home-button-card">Adicionar Projeto</button>
                  <button type="button" onClick={() => handleSectionSave(['projetos'])} className="home-button-card" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Projetos'}</button>
                </div>
              </div>
            </section>

            {/* RESUMO PROFISSIONAL */}
            <section className="bg-white/5 p-4 rounded">
              <h3 className="font-semibold text-white">Resumo Profissional</h3>
              <div className="mt-3 form-field">
                <label className="form-label">Resumo</label>
                <textarea name="resumoProfissional" value={formData.resumoProfissional} onChange={handleChange} className="form-textarea" rows={5} />
              </div>
              <div className="form-actions mt-3">
                <button type="button" onClick={() => handleSectionSave(['resumoProfissional'])} className="home-button-card" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Resumo'}</button>
              </div>
            </section>

            {/* PDF */}
            <section className="bg-white/5 p-4 rounded">
              <h3 className="font-semibold text-white">PDF</h3>
              <div className="form-field">
                <label htmlFor="pdfCurriculo" className="form-label">Currículo em PDF (opcional):</label>
                <input id="pdfCurriculo" type="file" accept="application/pdf" onChange={handlePdfChange} className="form-input" />
                {pdfFile && <span className="text-sm text-white/80">{pdfFile.name}</span>}
                <div className="form-actions mt-2">
                  <button type="button" onClick={() => pdfUrl && window.open(getResourceUrl(pdfUrl), "_blank")} disabled={!pdfUrl} className="home-button-card">
                    {pdfUrl ? "Visualizar PDF enviado" : "Nenhum arquivo enviado"}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm("Deseja remover o PDF enviado?")) return;
                      setIsLoading(true);
                      try {
                        const token = localStorage.getItem("token");
                        await api.delete(`${API_BASE}/api/alunos/pdf`, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
                        setPdfUrl("");
                        setMessage("PDF removido com sucesso!");
                      } catch (err: any) {
                        setError(err?.response?.data?.message || "Erro ao remover PDF.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="home-button-card"
                  >
                    Remover PDF enviado
                  </button>
                </div>
              </div>
            </section>

            <div className="form-actions">
              <button type="submit" disabled={isLoading} className="home-button-card">
                {isLoading ? "Salvando..." : "Salvar Meu Currículo"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CurriculumForm;