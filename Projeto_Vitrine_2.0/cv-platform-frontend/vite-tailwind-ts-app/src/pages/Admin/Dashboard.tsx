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
      console.error("Erro ao carregar currículos para admin:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Não foi possível carregar os currículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterPeriodo, filterCurso]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setMessage("");
    setError("");
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      setError("Token de administrador não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await api.put(
        `${API_BASE_URL}/api/admin/curriculos/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setMessage(response.data.message);
      fetchCurriculums();
    } catch (err: any) {
      console.error("Erro ao mudar status:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Erro ao atualizar o status do currículo.");
    }
  };

  const handleSelectForCompany = async (id: string) => {
    setMessage("");
    setError("");
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setError("Token de administrador não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await api.put(
        `${API_BASE_URL}/api/admin/curriculos/${id}/select`,
        null,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setCurriculums((current) =>
        current.map((cv) => (cv._id === id ? { ...cv, selecionadoParaEmpresa: response.data.selecionadoParaEmpresa } : cv))
      );

      setMessage(response.data.selecionadoParaEmpresa ? "Currículo selecionado!" : "Currículo removido!");
    } catch (err: any) {
      console.error("Erro ao selecionar currículo para empresa:", err.response?.data?.message || err.message);
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
      navigator.clipboard
        .writeText(link)
        .then(() => setMessage("Link copiado!"))
        .catch(() => setError("Erro ao copiar o link."));
    } else {
      setError(
        <>
          Copiar para a área de transferência não é suportado neste dispositivo.
          <br />
          Copie o link manualmente: <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
        </>
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    // navegar para a tela de login do admin
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return <div className="admin-container">Carregando painel do administrador...</div>;
  }

  if (error) {
    return <div className="admin-container error-message">{error}</div>;
  }

  return (
    <main>
      {message && <div className="admin-popup-message">{message}</div>}

      <div className="admin-dashboard-container">
        <div className="admin-container">
          <header className="admin-header-group">
            <div className="admin-header-row">
              <h1>Painel Administrativo</h1>
              <button className="nav-button logout-button" onClick={handleLogout}>
                Sair
              </button>
            </div>

            <nav className="admin-actions">
              <button className="copy-link-button" onClick={copyLandingPageLink}>
                Gerar Link para Currículos Selecionados
              </button>

              <div style={{ marginTop: 8 }}>
                
                <button className="action-button glass-action-button" onClick={() => navigate("/admin/vagas")}>
                  Gerenciar Vagas
                </button>
              </div>

              <div className="filter-status-group" style={{ marginTop: 12 }}>
                <div>
                  <label htmlFor="status-select">Status:</label>
                  <select id="status-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="ativo">Ativo</option>
                    <option value="pendente">Pendente</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="periodo-select">Período:</label>
                  <select id="periodo-select" value={filterPeriodo} onChange={(e) => setFilterPeriodo(e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="1º Semestre">1º Semestre</option>
                    <option value="2º Semestre">2º Semestre</option>
                    <option value="3º Semestre">3º Semestre</option>
                    <option value="4º Semestre">4º Semestre</option>
                    <option value="5º Semestre">5º Semestre</option>
                    <option value="6º Semestre">6º Semestre</option>
                    <option value="7º Semestre">7º Semestre</option>
                    <option value="8º Semestre">8º Semestre</option>
                    <option value="9º Semestre">9º Semestre</option>
                    <option value="10º Semestre">10º Semestre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="curso-select">Curso:</label>
                  <select id="curso-select" value={filterCurso} onChange={(e) => setFilterCurso(e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento de Sistemas</option>
                    <option value="Engenharia de Software">Engenharia de Software</option>
                    <option value="Engenharia Civil">Engenharia Civil</option>
                  </select>
                </div>
              </div>
            </nav>

            <section style={{ marginBottom: 12, marginTop: 12 }}>
              <button
                type="button"
                className="action-button glass-action-button approve-button"
                onClick={() => {
                  const idsParaSelecionar = curriculums.filter((cv) => !cv.selecionadoParaEmpresa).map((cv) => cv._id);
                  Promise.all(idsParaSelecionar.map((id) => handleSelectForCompany(id))).then(() =>
                    setMessage("Todos os currículos filtrados foram selecionados!")
                  );
                }}
              >
                Selecionar Todos
              </button>

              <button
                type="button"
                className="action-button glass-action-button deactivate-button"
                onClick={() => {
                  const idsParaLimpar = curriculums.filter((cv) => cv.selecionadoParaEmpresa).map((cv) => cv._id);
                  Promise.all(idsParaLimpar.map((id) => handleSelectForCompany(id))).then(() =>
                    setMessage("Seleção limpa para todos os currículos filtrados!")
                  );
                }}
                style={{ marginLeft: 8 }}
              >
                Limpar Seleção
              </button>
            </section>

            <section style={{ marginBottom: 24 }}>
              <button
                type="button"
                className="action-button approve-button"
                onClick={async () => {
                  const idsParaAtivar = curriculums.filter((cv) => cv.status !== "ativo").map((cv) => cv._id);
                  await Promise.all(idsParaAtivar.map((id) => handleStatusChange(id, "ativo")));
                  setMessage("Todos os currículos filtrados foram aprovados/ativados!");
                }}
              >
                Aprovar/Ativar Todos
              </button>

              <button
                type="button"
                className="action-button pending-button"
                onClick={async () => {
                  const idsParaPendente = curriculums.filter((cv) => cv.status !== "pendente").map((cv) => cv._id);
                  await Promise.all(idsParaPendente.map((id) => handleStatusChange(id, "pendente")));
                  setMessage("Todos os currículos filtrados foram marcados como pendente!");
                }}
                style={{ marginLeft: 8 }}
              >
                Marcar todos como Pendente
              </button>

              <button
                type="button"
                className="action-button deactivate-button"
                onClick={async () => {
                  const idsParaDesativar = curriculums.filter((cv) => cv.status !== "inativo").map((cv) => cv._id);
                  await Promise.all(idsParaDesativar.map((id) => handleStatusChange(id, "inativo")));
                  setMessage("Todos os currículos filtrados foram desativados!");
                }}
                style={{ marginLeft: 8 }}
              >
                Desativar Todos
              </button>
            </section>
          </header>

          {curriculums.length === 0 && <p>Nenhum currículo encontrado para os filtros selecionados.</p>}

          <section className="curriculum-admin-list">
            {curriculums.map((curriculum) => (
              <article key={curriculum._id} className={`admin-curriculum-card${expandedCardId === curriculum._id ? " expanded" : ""}`}>
                <header className="admin-card-header">
                  <div className="admin-header-info">
                    <h2>
                      {curriculum.nomeCompleto} - {curriculum.curso} ({curriculum.periodoAtual})
                    </h2>
                    <span className={`status-badge status-${curriculum.status}`}>{(curriculum.status || "").toUpperCase()}</span>
                  </div>
                </header>

                <section className="admin-email-select-row">
                  <div className="admin-email-row">
                    <p className="admin-resumo-summary">
                      <strong>Habilidades:</strong> {curriculum.habilidadesTecnicas || "Sem habilidades."}
                    </p>
                  </div>
                  <div className="admin-select-row">
                    {curriculum.selecionadoParaEmpresa && <p className="selection-indicator"></p>}
                    <button
                      onClick={async () => {
                        if (!curriculum.selecionadoParaEmpresa && curriculum.status !== "ativo") {
                          const statusLabel = curriculum.status === "pendente" ? "pendente" : "inativo";
                          if (window.confirm(`Esse curriculo está '${statusLabel}'. Deseja ativar/aprovar e selecionar?`)) {
                            await handleStatusChange(curriculum._id, "ativo");
                            handleSelectForCompany(curriculum._id);
                          }
                          return;
                        }
                        handleSelectForCompany(curriculum._id);
                      }}
                      className={`action-button ${curriculum.selecionadoParaEmpresa ? "select-button" : "deselect-button"}`}
                      aria-pressed={!!curriculum.selecionadoParaEmpresa}
                    >
                      {curriculum.selecionadoParaEmpresa ? "✔" : "X"}
                    </button>
                  </div>
                </section>

                <section className="admin-resumo-pdf-row">
                  <p className="admin-resumo-summary">{curriculum.resumoProfissional || "Sem resumo."}</p>
                  <div className="admin-cv-pdf-link">
                    {curriculum.pdfUrl ? (
                      <a
                        href={`${API_BASE_URL}${curriculum.pdfUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button glass-action-button"
                        style={{ marginTop: 8, display: "inline-block" }}
                      >
                        Visualizar Currículo PDF
                      </a>
                    ) : (
                      <button
                        className="action-button glass-action-button"
                        style={{ marginTop: 8, display: "inline-block", opacity: 0.6, cursor: "not-allowed" }}
                        disabled
                      >
                        PDF não enviado
                      </button>
                    )}
                  </div>
                </section>

                <footer className="admin-card-actions">
                  <div className="admin-button-row">
                    <button onClick={() => handleStatusChange(curriculum._id, "ativo")} disabled={curriculum.status === "ativo"} className="action-button approve-button">
                      Aprovar/Ativar
                    </button>
                    <button onClick={() => handleStatusChange(curriculum._id, "pendente")} disabled={curriculum.status === "pendente"} className="action-button pending-button">
                      Marcar como Pendente
                    </button>
                    <button onClick={() => handleStatusChange(curriculum._id, "inativo")} disabled={curriculum.status === "inativo"} className="action-button deactivate-button">
                      Desativar
                    </button>
                    <button onClick={() => setExpandedCardId(expandedCardId === curriculum._id ? null : curriculum._id)} className="action-button glass-action-button" aria-expanded={expandedCardId === curriculum._id} aria-controls={`curriculo-detalhe-${curriculum._id}`}>
                      <span>Ver </span>
                      <span>Detalhes</span>
                      <span className="arrow-icon" style={expandedCardId === curriculum._id ? { transform: "rotate(90deg)" } : {}}>
                        ➔
                      </span>
                    </button>
                  </div>
                </footer>

                <section id={`curriculo-detalhe-${curriculum._id}`} className="expanded-info admin-expanded-info">
                  {expandedCardId === curriculum._id && <CurriculumFullDetailsInline curriculum={curriculum} />}
                </section>
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;