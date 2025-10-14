import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from './apiConfig';
import { useNavigate } from 'react-router-dom';
import './App.css'; 
import './App.mobile.css';

function AdminLogin({ onAdminLogin }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook para navegação

    // NOVO: Redireciona se já estiver autenticado
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        console.log('AdminLogin handleSubmit: Função chamada!'); // <-- NOVO LOG
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // CORREÇÃO: Altere 'password' para 'senha' para corresponder ao estado.
            const response = await api.post(`${API_BASE_URL}/api/admin/login`, { email, senha });
            
            console.log('AdminLogin handleSubmit: Login bem-sucedido! Resposta:', response.data); // <-- NOVO LOG
            
            localStorage.setItem('adminToken', response.data.token); // Salva o token JWT do admin
            onAdminLogin(); // Chama a função para atualizar o estado no App.js

            console.log('AdminLogin handleSubmit: Redirecionando para /admin/dashboard...'); // <-- NOVO LOG
            // CORREÇÃO: Navega para o dashboard após o sucesso
            navigate('/admin/dashboard'); // Redireciona para o painel
        } catch (err) {
            console.error("AdminLogin handleSubmit: Erro no login do admin:", err.response?.data?.message || err.message || err); // <-- NOVO LOG
            setError(err.response?.data?.message || 'Email ou senha inválidos.');
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="auth-container">
                <h1>Login de Administrador</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="adminEmail">E-mail:</label>
                        <input
                            type="email"
                            id="adminEmail"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@inbec.edu.br"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="adminPassword">Senha:</label>
                        <input
                            type="password"
                            id="adminPassword"
                            name="senha"
                            autoComplete="current-password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="admin123"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} aria-busy={loading}>
                        {loading ? 'Entrando...' : 'Entrar como Administrador'}
                    </button>
                </form>
                {error && <p className="error-message" role="alert" aria-live="assertive">{error}</p>}
            </div>
        </main>
    );
}

export default AdminLogin;