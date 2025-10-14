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
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/curriculos/ativos");
        setCurriculums(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Não foi possível carregar os currículos no momento.");
        setCurriculums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, []);

  if (!idsParam || selectedIds.length === 0) {
    return (
      <main>
        <section className="company-landing-container error-message">
          Acesso inválido: nenhum currículo selecionado. Solicite um novo link.
        </section>
      </main>
    );
  }

  const filteredCurriculums = curriculums.filter((curriculum) => {
    const matchesId = selectedIds.includes(curriculum._id);
    const matchesPeriod = selectedPeriod
      ? String(curriculum.periodoAtual).toLowerCase() === selectedPeriod.toLowerCase()
      : true;
    return matchesId && matchesPeriod;
  });

  const handleViewDetails = (curriculum: Curriculum) => {
    setSelectedCurriculum(curriculum);
  };

  const handleCloseDetails = () => {
    setSelectedCurriculum(null);
  };

  if (loading) {
    return (
      <main>
        <section className="company-landing-container">Carregando currículos...</section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section className="company-landing-container error-message">{error}</section>
      </main>
    );
  }

  return (
    <main>
      <section className="company-landing-container">
        <header>
          <h1>Currículos Selecionados</h1>
        </header>

        {selectedCurriculum ? (
          <CurriculumDetail curriculum={selectedCurriculum} onClose={handleCloseDetails} />
        ) : (
          <section className="curriculum-cards-list">
            {filteredCurriculums.length > 0 ? (
              filteredCurriculums.map((curriculum) => (
                <article
                  key={curriculum._id}
                  className={`curriculum-card-new-layout${expandedCardId === curriculum._id ? " expanded" : ""}`}
                >
                  <div className="card-summary-section">
                    <div className="foto-area">
                      {curriculum.fotoUrl ? (
                        <img
                          src={`${API_BASE_URL}${curriculum.fotoUrl}`}
                          alt={`Foto de ${curriculum.nomeCompleto}`}
                          className="profile-photo"
                        />
                      ) : (
                        <div className="foto-placeholder-card">Sem Foto</div>
                      )}
                    </div>

                    <div className="info-area">
                      <div className="header-info">
                        <h3 className="nome-aluno">{curriculum.nomeCompleto}</h3>
                        <p className="curso-aluno">
                          <strong>Curso:</strong> {curriculum.curso}
                        </p>
                        <p className="periodo-aluno">
                          <strong>Período:</strong> {curriculum.periodoAtual}
                        </p>
                      </div>

                      <p className="descricao-aluno">{curriculum.resumoProfissional || "Nenhum resumo disponível."}</p>
                      <p className="habilidades-aluno">
                        <strong>Habilidades:</strong> {curriculum.habilidadesTecnicas || "N/A"}
                      </p>
                    </div>

                    {curriculum.pdfUrl ? (
                      <a
                        href={`${API_BASE_URL}${curriculum.pdfUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="details-button-new-layout"
                        style={{ marginRight: 12, marginTop: 8, display: "inline-block" }}
                      >
                        Visualizar PDF
                      </a>
                    ) : (
                      <button
                        className="details-button-new-layout"
                        style={{ marginRight: 12, marginTop: 8, display: "inline-block", opacity: 0.6, cursor: "not-allowed" }}
                        disabled
                      >
                        PDF não enviado
                      </button>
                    )}

                    <button
                      className="details-button-new-layout"
                      onClick={() => setExpandedCardId(expandedCardId === curriculum._id ? null : curriculum._id)}
                      aria-expanded={expandedCardId === curriculum._id}
                      aria-controls={`curriculo-detalhe-${curriculum._id}`}
                    >
                      <span>{expandedCardId === curriculum._id ? "Recolher" : "Expandir"}</span>
                      <span>Currículo</span>
                      <span
                        className="arrow-icon"
                        style={{
                          transform: expandedCardId === curriculum._id ? "rotate(180deg) translateY(5px)" : "translateY(0)",
                        }}
                      >
                        &#x25BC;
                      </span>
                    </button>
                  </div>

                  <div className="expanded-info" id={`curriculo-detalhe-${curriculum._id}`}>
                    {expandedCardId === curriculum._id && <CurriculumFullDetailsInline curriculum={curriculum} />}
                  </div>
                </article>
              ))
            ) : (
              <p>Nenhum currículo ativo encontrado com os filtros aplicados.</p>
            )}
          </section>
        )}
      </section>
    </main>
  );
};

export default CompanyLandingPage;