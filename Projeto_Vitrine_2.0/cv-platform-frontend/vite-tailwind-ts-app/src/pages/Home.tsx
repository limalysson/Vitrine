import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      
      <main className="w-full flex flex-col items-center px-4 py-0">
        <header className="w-full max-w-4xl mb-4 text-center">
          <p className="text-white/90 text-lg">Selecione uma área para começar:</p>
        </header>

        <section
          className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center mx-auto"
          aria-labelledby="areas-heading"
        >
          <h2 id="areas-heading" className="sr-only">
            Áreas do sistema
          </h2>

          <article
            className="card-default"
            aria-labelledby="student-area-title"
            role="region"
          >
            <header>
              <h3 id="student-area-title" className="text-xl font-semibold text-white">
                Área do aluno
              </h3>
            </header>

            <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true" />

            <p className="text-white/90 mb-4 whitespace-pre-line">
              Cadastre seus dados,{'\n'}
              crie seu currículo e{'\n'}
              mantenha suas informações{'\n'}
              sempre atualizadas.
            </p>

            <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true" />

            <nav className="w-full" aria-label="Navegação área do aluno">
              <Link
                to="/aluno"
                role="button"
                className="home-button-card"
                aria-label="Acessar área do aluno"
              >
                Acessar
              </Link>
            </nav>
          </article>

          <article
            className="card-default"
            aria-labelledby="admin-area-title"
            role="region"
          >
            <header>
              <h3 id="admin-area-title" className="text-xl font-semibold text-white">
                Área do administrador
              </h3>
            </header>

            <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true" />

            <p className="text-white/90 mb-4 whitespace-pre-line">
              Visualize os currículos{' \n'}
              cadastrados, analise{'\n'}
              os dados e gerencie a{'\n'}
              visibilidade para as empresas.
            </p>

            <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true" />

            <nav className="w-full" aria-label="Navegação área do administrador">
              <Link
                to="/admin/login"
                role="button"
                className="home-button-card"
                aria-label="Acessar área do administrador"
              >
                Acessar
              </Link>
            </nav>
          </article>
        </section>
      </main>

      
    </div>
  );
};

export default Home;