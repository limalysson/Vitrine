import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AlunoHome: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    navigate("/", { replace: true });
    setTimeout(() => logout(), 0);
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
      <header className="card-default-large mb-8 border-indigo-500/20 w-full">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-100 pointer-events-none" />
         <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-indigo-400">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
               </svg>
               Portal do Aluno
            </h1>
            <button
               type="button"
               className="home-button-logout !py-2 !px-6"
               onClick={handleLogout}
            >
               Sair
            </button>
         </div>
      </header>

      <section className="flex flex-col md:flex-row gap-8 w-full justify-center items-stretch">
        
        {/* Card Currículo */}
        <article className="card-default-large flex-1 w-full !p-8 group relative overflow-hidden transition-all hover:border-indigo-500/40 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center h-full">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">Meu Currículo</h2>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
            
            <p className="text-slate-400 mb-8 leading-relaxed flex-1">
               Cadastre seus dados acadêmicos, crie seu currículo digital e mantenha suas informações profissionais sempre atualizadas para impressionar as empresas parceiras.
            </p>
            
            <button
               className="home-button-card w-full py-4 text-base"
               onClick={() => navigate("/aluno/cv")}
            >
               Acessar Meu Currículo
            </button>
          </div>
        </article>

        {/* Card Vagas */}
        <article className="card-default-large flex-1 w-full !p-8 group relative overflow-hidden transition-all hover:border-cyan-500/40 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center h-full">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
               </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">Mural de Vagas</h2>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
            
            <p className="text-slate-400 mb-8 leading-relaxed flex-1">
               Explore e visualize as oportunidades e vagas cadastradas pelas empresas. Candidate-se diretamente às posições que mais se alinham ao seu perfil profissional.
            </p>
            
            <button
               className="home-button-card w-full py-4 text-base !from-cyan-600 !to-blue-600 hover:!from-cyan-500 hover:!to-blue-500"
               style={{ boxShadow: '0 4px 14px 0 rgba(8, 145, 178, 0.39)' }}
               onClick={() => navigate("/aluno/vagas")}
            >
               Explorar Vagas
            </button>
          </div>
        </article>

      </section>
    </main>
  );
};

export default AlunoHome;