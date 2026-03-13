# 🌟 Vitrine de Talentos (Vitrus Talent)

A **Vitrine de Talentos** é uma plataforma inovadora desenvolvida para conectar alunos e profissionais às melhores oportunidades do mercado. Através de um sistema centralizado, os candidatos podem cadastrar seus currículos (com suporte a anexos em PDF e foto de perfil), enquanto coordenadores e diretores possuem uma Área Administrativa exclusiva para revisar, aprovar e destacar os melhores perfis para as empresas parceiras.

## 🚀 Funcionalidades Principais

- **Portal do Aluno/Candidato:** Cadastro de currículo detalhado (dados acadêmicos, resumo profissional, habilidades técnicas, upload de foto e PDF).
- **Dashboard Administrativo:** Painel de controle seguro para análise de status dos currículos (Ativo, Pendente, Inativo).
- **Vitrine para Empresas (Company Landing Page):** Uma página pública gerada dinamicamente, enviada via link exclusivo (com IDs selecionados), onde as empresas podem visualizar os dados dos talentos e baixar seus currículos em PDF com uma interface responsiva, moderna e premium.
- **Micro-interações e Design System:** Interface aprimorada com Glassmorphism, paletas de cores escuras (Dark Mode avançado), efeitos de fade-in automáticos e responsividade total usando Tailwind CSS.

## 💻 Tecnologias Utilizadas

### Frontend (`cv-platform-frontend`)
- **React.js** + **Vite**
- **TypeScript** para maior robustez e segurança de tipagem
- **Tailwind CSS** para estilização rápida, responsiva e criação de um design system premium
- **React Router Dom** para navegação e rotas dinâmicas

### Backend (`cv-platform-backend`)
- **Node.js** com **Express**
- **MongoDB** (Banco de dados NoSQL) para armazenamento dos dados
- **Mongoose** como ODM
- Autenticação e proteção de rotas da API (usando middlewares)
- Suporte para upload e armazenamento de mídias (Fotos e PDFs)

## 📁 Estrutura do Projeto

```bash
Projeto_Vitrine_2.0/
├── cv-platform-backend/       # API Restful em Node.js
│   ├── src/                   # Controladores, Modelos, Rotas e Middlewares
│   ├── server.js              # Ponto de entrada do servidor
│   └── .env                   # Variáveis de ambiente
│
└── cv-platform-frontend/      # Aplicação Front-end SPA
    └── vite-tailwind-ts-app/
        ├── src/
        │   ├── components/    # Componentes reutilizáveis (Layout, Currículo, etc.)
        │   ├── pages/         # Páginas da aplicação (Admin, Landing Page, etc.)
        │   ├── services/      # Configuração do Axios/API
        │   ├── index.css      # Estilos globais e componentes customizados do Tailwind
        │   └── main.tsx       # Ponto de entrada do React
        ├── public/            # Assets públicos estáticos (logos, ícones)
        └── tailwind.config.js # Configuração do tema (Dark mode, fontes)
```

## ⚙️ Como Executar o Projeto Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/limalysson/Vitrine.git
cd Vitrine/Projeto_Vitrine_2.0
```

### 2. Configurar e rodar o Backend
```bash
cd cv-platform-backend
# Instale as dependências
npm install

# Certifique-se de configurar seu arquivo .env com as credenciais do banco (MongoDB URI) e segredos JWT
# Inicialize o servidor
npm run dev
# (O backend normalmente roda na porta definida no .env, ex: 5000)
```

### 3. Configurar e rodar o Frontend
Em um novo terminal:
```bash
cd cv-platform-frontend/vite-tailwind-ts-app
# Instale as dependências
npm install

# Inicialize o servidor de desenvolvimento
npm run dev
# (O frontend estará disponível em http://localhost:5173 por padrão)
```

## 🤝 Contribuições

Este projeto evolui com feedback e contribuições contínuas. Caso deseje propor melhorias ao design, adicionar novas funcionalidades na Área Administrativa ou otimizar a performance da API, sinta-se livre para abrir PRs e Issues!

---
Desenvolvido com dedicação por [Vitrus Tech].
