import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import RequestAccess from "./pages/Aluno/RequestAccess";
import AuthenticateAccess from "./pages/Aluno/AuthenticateAccess";
import AlunoHome from "./pages/Aluno/Home";
import CurriculumForm from "./pages/Aluno/CurriculumForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import LoginRequest from "./pages/LoginRequest";
import LoginVerify from "./pages/LoginVerify";
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminVagasDashboard from "./pages/Admin/VagasDashboard";
import JobForm from "./pages/Admin/JobForm";
import VagasList from "./pages/Aluno/VagasList";
import CompanyLandingPage from "./pages/CompanyLandingPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import "./index.css";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />

        {/* Aluno (fluxo público) */}
        <Route path="/aluno" element={<AppLayout><RequestAccess /></AppLayout>} />
        <Route path="/aluno/autenticar" element={<AppLayout><AuthenticateAccess /></AppLayout>} />

        {/* Rotas protegidas do aluno */}
        <Route
          path="/aluno/home"
          element={
            <ProtectedRoute>
              <AppLayout><AlunoHome /></AppLayout>
            </ProtectedRoute>
          }
        />
        {/* padroniza para /aluno/cv (singular) */}
        <Route
          path="/aluno/cv"
          element={
            <ProtectedRoute>
              <AppLayout><CurriculumForm /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/aluno/vagas"
          element={
            <ProtectedRoute>
              <AppLayout><VagasList /></AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Rotas de login padrão (se usadas) */}
        <Route path="/login" element={<LoginRequest />} />
        <Route path="/login/verify" element={<LoginVerify />} />

        {/* Empresa (página pública por link com ids) */}
        <Route path="/empresa" element={<CompanyLandingPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin protegidas */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AppLayout><AdminDashboard /></AppLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/vagas"
          element={
            <AdminProtectedRoute>
              <AppLayout><AdminVagasDashboard /></AppLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/cadastrar-vaga"
          element={
            <AdminProtectedRoute>
              <AppLayout><JobForm /></AppLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/editar-vaga/:id"
          element={
            <AdminProtectedRoute>
              <AppLayout><JobForm modoEdicao /></AppLayout>
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById("root");
if (!container) throw new Error('Elemento com id "root" não encontrado');

createRoot(container).render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);