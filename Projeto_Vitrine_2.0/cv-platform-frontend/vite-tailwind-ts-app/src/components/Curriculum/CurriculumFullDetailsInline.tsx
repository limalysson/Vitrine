import React from "react";

type Experience = {
  empresa?: string;
  cargo?: string;
  inicio?: string;
  fim?: string;
  descricao?: string;
};

type Language = {
  idioma?: string;
  nivel?: string;
};

type Project = {
  nome?: string;
  descricao?: string;
  link?: string;
};

type Curriculum = {
  nomeCompleto?: string;
  dataNascimento?: string;
  telefone?: string;
  alunoEmail?: string;
  linkedin?: string;
  github?: string;
  curso?: string;
  periodoAtual?: string | number;
  status?: string;
  previsaoConclusao?: string;
  resumoProfissional?: string;
  experiencias?: Experience[];
  habilidadesTecnicas?: string;
  habilidadesComportamentais?: string;
  idiomas?: Language[];
  projetos?: Project[];
  pdfUrl?: string;
  [key: string]: any;
};

function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    // Ajuste para fuso horário local como no original
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString("pt-BR");
  } catch {
    return dateString;
  }
}

const CurriculumFullDetailsInline: React.FC<{ curriculum?: Curriculum | null }> = ({ curriculum }) => {
  if (!curriculum) return null;

  return (
    <div className="curriculum-full-details-inline">
      <p>
        <strong>Nome Completo:</strong> {curriculum.nomeCompleto}
      </p>
      <p>
        <strong>Data de Nascimento:</strong> {formatDate(curriculum.dataNascimento)}
      </p>
      <p>
        <strong>Telefone:</strong> {curriculum.telefone || "N/A"}
      </p>
      <p>
        <strong>E-mail:</strong> {curriculum.alunoEmail || "N/A"}
      </p>
      {curriculum.linkedin && (
        <p>
          <strong>LinkedIn:</strong>{" "}
          <a href={curriculum.linkedin} target="_blank" rel="noopener noreferrer">
            {curriculum.linkedin}
          </a>
        </p>
      )}
      {curriculum.github && (
        <p>
          <strong>Portfólio/GitHub:</strong>{" "}
          <a href={curriculum.github} target="_blank" rel="noopener noreferrer">
            {curriculum.github}
          </a>
        </p>
      )}

      <section>
        <h3>Dados Acadêmicos</h3>
        <p>
          <strong>Curso:</strong> {curriculum.curso || "N/A"}
        </p>
        <p>
          <strong>Período/Semestre Atual:</strong> {curriculum.periodoAtual ?? "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {curriculum.status || "N/A"}
        </p>
        <p>
          <strong>Previsão de Conclusão:</strong> {curriculum.previsaoConclusao || "N/A"}
        </p>
      </section>

      <section>
        <h3>Resumo Profissional</h3>
        <p>{curriculum.resumoProfissional || "N/A"}</p>
      </section>

      <section>
        <h3>Experiências Profissionais</h3>
        {curriculum.experiencias && curriculum.experiencias.length > 0 ? (
          <ul>
            {curriculum.experiencias.map((exp, index) => (
              <li key={index} className="experience-item">
                <h4>
                  {exp.cargo || "Cargo"} {exp.empresa ? `em ${exp.empresa}` : ""}
                </h4>
                <p>
                  {exp.inicio || "N/A"} - {exp.fim || "Atual"}
                </p>
                <p>{exp.descricao}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma experiência profissional informada.</p>
        )}
      </section>

      <section>
        <h3>Habilidades</h3>
        <p>
          <strong>Técnicas:</strong> {curriculum.habilidadesTecnicas || "N/A"}
        </p>
        <p>
          <strong>Comportamentais:</strong> {curriculum.habilidadesComportamentais || "N/A"}
        </p>
      </section>

      <section>
        <h3>Idiomas</h3>
        {curriculum.idiomas && curriculum.idiomas.length > 0 ? (
          <ul>
            {curriculum.idiomas.map((lang, index) => (
              <li key={index}>
                <strong>{lang.idioma || "Idioma"}:</strong> {lang.nivel || "Nível"}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum idioma informado.</p>
        )}
      </section>

      <section>
        <h3>Projetos</h3>
        {curriculum.projetos && curriculum.projetos.length > 0 ? (
          <ul>
            {curriculum.projetos.map((proj, index) => (
              <li key={index} className="project-item">
                <h4>{proj.nome}</h4>
                <p>{proj.descricao}</p>
                {proj.link && (
                  <p>
                    <a href={proj.link} target="_blank" rel="noopener noreferrer">
                      {proj.link}
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum projeto informado.</p>
        )}
      </section>
    </div>
  );
};

export default CurriculumFullDetailsInline;