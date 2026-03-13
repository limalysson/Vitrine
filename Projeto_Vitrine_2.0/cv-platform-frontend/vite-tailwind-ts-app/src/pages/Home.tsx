import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col flex-grow items-center justify-center -mt-10 px-4">
      {/* Hero Section */}
      <section className="text-center w-full max-w-4xl mb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 drop-shadow-sm">
          A sua conexão com o futuro.
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
          Plataforma exclusiva de currículos e vagas para alunos. 
          Cadastre-se, descubra as melhores oportunidades ou encontre os grandes talentos da nossa instituição.
        </p>
      </section>

      {/* Cards de Navegação */}
      <main className="w-full max-w-5xl">
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center mx-auto"
          aria-labelledby="areas-heading"
        >
          <h2 id="areas-heading" className="sr-only">
            Áreas do sistema
          </h2>

          <article
            className="card-default group"
            aria-labelledby="student-area-title"
            role="region"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <header className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-4 shadow-lg text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 id="student-area-title" className="text-2xl font-bold text-white tracking-wide">
                Sou Aluno
              </h3>
            </header>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent my-5" aria-hidden="true" />

            <p className="text-slate-300 mb-6 text-center text-sm md:text-base leading-relaxed">
              Crie seu currículo acadêmico e profissional, anexe documentos e se candidate às melhores oportunidades do mercado exclusivas para alunos.
            </p>

            <nav className="w-full mt-auto pt-4 flex justify-center" aria-label="Navegação área do aluno">
              <Link
                to="/aluno"
                role="button"
                className="home-button-card w-[90%]"
                aria-label="Acessar área do aluno"
              >
                Acessar Portal
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </nav>
          </article>

          <article
            className="card-default group"
            aria-labelledby="admin-area-title"
            role="region"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
             
            <header className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-4 shadow-lg text-indigo-400 group-hover:scale-110 group-hover:text-indigo-300 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
              </div>
              <h3 id="admin-area-title" className="text-2xl font-bold text-white tracking-wide">
                Administração
              </h3>
            </header>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent my-5" aria-hidden="true" />

            <p className="text-slate-300 mb-6 text-center text-sm md:text-base leading-relaxed">
              Área restrita à diretoria e equipe. Gerencie cadastros, supervisione currículos, crie vagas e faça a ponte de talentos para as empresas parcerias.
            </p>

            <nav className="w-full mt-auto pt-4 flex justify-center" aria-label="Navegação área do administrador">
              <Link
                to="/admin/login"
                role="button"
                className="home-button-card w-[90%] !from-indigo-600 !to-purple-600 hover:!from-indigo-500 hover:!to-purple-500"
                style={{ boxShadow: '0 4px 14px 0 rgba(76, 29, 149, 0.39)' }}
                aria-label="Acessar área do administrador"
              >
                Acesso Restrito
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </Link>
            </nav>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Home;