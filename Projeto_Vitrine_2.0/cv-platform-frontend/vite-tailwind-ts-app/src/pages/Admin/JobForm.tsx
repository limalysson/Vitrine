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
          // assume res.data.vaga contém os campos compatíveis com formData
          setFormData((prev) => ({ ...prev, ...(res.data.vaga || res.data) }));
        })
        .catch(() => setError("Erro ao carregar vaga."));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modoEdicao, id]);

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
      navigate("/admin/vagas");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao salvar vaga.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">{modoEdicao ? "Editar Vaga" : "Cadastrar Nova Vaga"}</h2>

      {message && <div className="admin-popup-message mb-4">{message}</div>}
      {error && <div className="error-message mb-4 text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-white/80 mb-1">Título da Vaga:</label>
          <input name="titulo" value={formData.titulo} onChange={handleChange} required className="w-full p-2 rounded bg-white/6 text-white" />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">Área/Departamento:</label>
          <input name="area" value={formData.area} onChange={handleChange} required className="w-full p-2 rounded bg-white/6 text-white" />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">Descrição:</label>
          <textarea name="descricao" value={formData.descricao} onChange={handleChange} required className="w-full p-2 rounded bg-white/6 text-white" />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">Requisitos:</label>
          <textarea name="requisitos" value={formData.requisitos} onChange={handleChange} required className="w-full p-2 rounded bg-white/6 text-white" />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">Benefícios:</label>
          <input name="beneficios" value={formData.beneficios} onChange={handleChange} className="w-full p-2 rounded bg-white/6 text-white" />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">Tipo:</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange} required className="w-full p-2 rounded bg-white/6 text-white">
            <option value="" disabled>Selecione</option>
            <option value="Estágio">Estágio</option>
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">Localização:</label>
          <input name="localizacao" value={formData.localizacao} onChange={handleChange} required className="w-full p-2 rounded bg-white/6 text-white" />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">Curso:</label>
          <select name="curso" value={formData.curso} onChange={handleChange} required className="w-full p-2 rounded bg-white/6 text-white">
            <option value="" disabled>Selecione o curso</option>
            <option value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento de Sistemas</option>
            <option value="Engenharia de Software">Engenharia de Software</option>
            <option value="Engenharia Civil">Engenharia Civil</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">Salário:</label>
          <input name="salario" value={formData.salario} onChange={handleChange} className="w-full p-2 rounded bg-white/6 text-white" />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">Contato da Empresa:</label>
          <input name="contatoEmpresa" value={formData.contatoEmpresa} onChange={handleChange} className="w-full p-2 rounded bg-white/6 text-white" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="px-4 py-2 rounded bg-inbec-blue-light text-white">
            {isLoading ? (modoEdicao ? "Salvando..." : "Cadastrando...") : modoEdicao ? "Salvar Alterações" : "Cadastrar Vaga"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default JobForm;