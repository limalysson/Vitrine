import React, { useEffect, useState } from 'react';
import api from './apiConfig';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function VagasList() {
    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [curriculoStatus, setCurriculoStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVagas = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const res = await api.get('/api/vagas', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVagas(res.data.vagas || res.data || []);
            } catch (err) {
                setError('Erro ao carregar vagas.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCurriculoStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await api.get('/api/alunos/curriculo', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurriculoStatus(res.data.curriculo.status);
            } catch (err) {
                setCurriculoStatus('');
            }
        };

        fetchVagas();
        fetchCurriculoStatus();
    }, []);

    const handleCandidatar = async (vagaId) => {
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await api.post(`/api/vagas/${vagaId}/candidatar`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Candidatura enviada com sucesso!');
        } catch (err) {
            setMessage('Erro ao se candidatar à vaga.');
        }
    };

    if (loading) return <p>Carregando vagas...</p>;

    return (
        <main>
            {message && <div className="admin-popup-message">{message}</div>}

            <section className="max-w-4xl mx-auto p-6">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Vagas Disponíveis para seu Curso</h1>
                    </div>
                    <nav>
                        <button
                            type="button"
                            className="bg-inbec-blue-light hover:bg-inbec-blue-dark text-white px-4 py-2 rounded-lg"
                            onClick={() => navigate('/aluno/home')}
                        >
                            Voltar
                        </button>
                    </nav>
                </header>

                {vagas.length === 0 && !error && <p className="text-white/90">Nenhuma vaga disponível no momento.</p>}
                {error && <p className="text-inbec-red">{error}</p>}

                <section className="space-y-6 mt-4">
                    {vagas
                        .filter(vaga => vaga.status === 'ativo')
                        .map(vaga => (
                            <article
                                key={vaga._id}
                                className="rounded-lg shadow-md p-6 my-4 border border-white/20"
                                style={{ background: 'rgba(26,35,126,0.18)' }}
                            >
                                <header>
                                    <h2 className="text-2xl font-semibold text-white mb-3">{vaga.titulo}</h2>
                                </header>
                                <section className="text-white/90 space-y-1">
                                    <p><strong>Área:</strong> {vaga.area}</p>
                                    <p><strong>Descrição:</strong> {vaga.descricao}</p>
                                    <p><strong>Requisitos:</strong> {vaga.requisitos}</p>
                                    <p><strong>Tipo:</strong> {vaga.tipo}</p>
                                    <p><strong>Localização:</strong> {vaga.localizacao}</p>
                                    <p><strong>Salário:</strong> {vaga.salario}</p>
                                    <p><strong>Contato:</strong> {vaga.contatoEmpresa}</p>
                                    <div>
                                        <p><strong>Benefícios:</strong></p>
                                        <ul className="list-disc list-inside">
                                            {vaga.beneficios
                                                .split(',')
                                                .map(ben => <li key={ben.trim()} className="text-white/90">{ben.trim()}</li>)}
                                        </ul>
                                    </div>
                                </section>
                                <footer className="mt-4">
                                    <button
                                        className={`px-4 py-2 rounded-lg text-white ${curriculoStatus === 'ativo' ? 'bg-inbec-blue-light hover:bg-inbec-blue-dark' : 'bg-gray-500 cursor-not-allowed'}`}
                                        disabled={curriculoStatus !== 'ativo'}
                                        onClick={() => handleCandidatar(vaga._1)}
                                        aria-label={`Candidatar-se à vaga ${vaga.titulo}`}
                                    >
                                        Candidatar-se
                                    </button>
                                    {curriculoStatus !== 'ativo' && (
                                        <p className="text-yellow-200 mt-3 font-semibold">
                                            Procure a administração para ativar seu currículo.
                                        </p>
                                    )}
                                </footer>
                            </article>
                        ))}
                </section>
            </section>
        </main>
    );
}

export default VagasList;