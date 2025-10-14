import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './App.mobile.css';

function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <header className="w-full max-w-4xl mb-6 text-center">
        <p className="text-white/90 text-lg">Selecione uma área para começar:</p>
      </header>

      <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        <article className="bg-[rgba(26,35,126,0.18)] rounded-xl p-6 shadow-md border border-white/20 flex flex-col items-center text-center">
          <header>
            <h2 className="text-xl font-semibold text-white">Área do aluno</h2>
          </header>

          <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true"></div>

          <p className="text-white/90 mb-4 whitespace-pre-line">
            Cadastre seus dados,{'\n'}
            crie seu currículo e{'\n'}
            mantenha suas informações{'\n'}
            sempre atualizadas.{'\n'}
          </p>

          <nav className="w-full">
            <Link
              to="/aluno"
              className="inline-block w-full bg-inbec-blue-light hover:bg-inbec-blue-dark text-white px-4 py-2 rounded-lg text-center"
              aria-label="Acessar área do aluno"
            >
              Acessar
            </Link>
          </nav>
        </article>

        <article className="bg-[rgba(26,35,126,0.18)] rounded-xl p-6 shadow-md border border-white/20 flex flex-col items-center text-center">
          <header>
            <h2 className="text-xl font-semibold text-white">Área do administrador</h2>
          </header>

          <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true"></div>

          <p className="text-white/90 mb-4 whitespace-pre-line">
            Visualize os currículos{'\n'}
            cadastrados, analise os{'\n'}
            dados e gerencie a&nbsp;{'\n'}
            visibilidade para as empresas.{'\n'}
          </p>

          <nav className="w-full">
            <Link
              to="/admin"
              className="inline-block w-full bg-inbec-blue-light hover:bg-inbec-blue-dark text-white px-4 py-2 rounded-lg text-center"
              aria-label="Acessar área do administrador"
            >
              Acessar
            </Link>
          </nav>
        </article>
      </section>
    </main>
  );
}

export default Home;