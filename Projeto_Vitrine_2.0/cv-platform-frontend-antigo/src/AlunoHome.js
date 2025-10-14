import React from 'react';
import { useNavigate } from 'react-router-dom';

function AlunoHome() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/aluno');
    };

    return (
        <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-transparent">
            <header className="w-full max-w-4xl flex items-center justify-between mb-6 bg-[rgba(26,35,126,0.18)] backdrop-blur-md border border-white/20 rounded-xl p-4">
                <h1 className="text-2xl font-semibold text-white">Painel de Vagas</h1>
                <button
                    type="button"
                    className="ml-4 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
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
                    <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true"></div>
                    <p className="text-white/90 mb-4 whitespace-pre-line">
                        Cadastre seus dados,{'\n'}
                        crie seu currículo e{'\n'}
                        mantenha suas informações{'\n'}
                        sempre atualizadas.
                    </p>
                    <nav className="w-full">
                        <button
                            className="w-full bg-inbec-blue-light hover:bg-inbec-blue-dark text-white px-4 py-2 rounded-lg"
                            onClick={() => navigate('/aluno/curriculo')}
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
                    <div className="w-11/12 h-px bg-white/30 my-4" aria-hidden="true"></div>
                    <p className="text-white/90 mb-4 whitespace-pre-line">
                        Visualize as vagas{'\n'}
                        cadastradas.{'\n'}
                        Candidate-se às que{'\n'}
                        mais lhe interessam.
                    </p>
                    <nav className="w-full">
                        <button
                            className="w-full bg-inbec-blue-light hover:bg-inbec-blue-dark text-white px-4 py-2 rounded-lg"
                            onClick={() => navigate('/aluno/vagas')}
                            aria-label="Visualizar vagas disponíveis"
                        >
                            Visualizar Vagas Disponíveis
                        </button>
                    </nav>
                </article>
            </section>
        </main>
    );
}

export default AlunoHome;