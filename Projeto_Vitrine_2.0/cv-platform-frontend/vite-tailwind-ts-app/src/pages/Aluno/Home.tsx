import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // ADICIONADO

const AlunoHome: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ADICIONADO

  const handleLogout = () => {
    navigate("/", { replace: true });
    // limpa a sessão no próximo ciclo para evitar que ProtectedRoute cause redirect
    setTimeout(() => logout(), 0);
  };

  return (
    <main className="flex flex-col items-center px-4 py-8 bg-transparent">
      <header className="w-full max-w-4xl flex items-center mb-6 bg-[rgba(26,35,126,0.18)] backdrop-blur-md border border-white/20 rounded-xl p-4">
        <div className="flex-1 flex justify-center">
          <h1 className="text-2xl font-semibold text-white">Painel do Aluno</h1>
        </div>
        <button
          type="button"
          className="home-button-card home-button-logout"
          aria-label="Sair"
          onClick={handleLogout}
        >
          Sair
        </button>
      </header>

      <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        <article className="bg-[rgba(26,35,126,0.18)] rounded-xl p-6 shadow-md border border-white/20 flex flex-col items-center text-center">
          <header>
            <h2 className="text-xl font-semibold text-white">Currículo</h2>
          </header>

          <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true" />

          <p className="text-white/90 mb-4 whitespace-pre-line">
            Cadastre seus dados,{'\n'}
            crie seu currículo e{'\n'}
            mantenha suas informações{'\n'}
            sempre atualizadas.
          </p>

          <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true" />

          <nav className="w-full">
            <button
              className="home-button-card"
              onClick={() => navigate("/aluno/cv")}
              aria-label="Criar ou editar currículo"
            >
              Criar ou Editar Currículo
            </button>
          </nav>
        </article>

        <article className="bg-[rgba(26,35,126,0.18)] rounded-xl p-6 shadow-md border border-white/20 flex flex-col items-center text-center">
          <header>
            <h2 className="text-xl font-semibold text-white">Vagas Disponíveis</h2>
          </header>

          <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true" />

          <p className="text-white/90 mb-4 whitespace-pre-line">
            Visualize as vagas{'\n'}
            cadastradas.{'\n'}
            Candidate-se às que{'\n'}
            mais lhe interessam.
          </p>

          <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true" />

          <nav className="w-full">
            <button
              className="home-button-card"
              onClick={() => navigate("/aluno/vagas")}
              aria-label="Visualizar vagas disponíveis"
            >
              Visualizar Vagas Disponíveis
            </button>
          </nav>
        </article>
      </section>
    </main>
  );
};

export default AlunoHome;