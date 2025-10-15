import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/Home";
import RequestAccess from "../pages/Aluno/RequestAccess";
import AuthenticateAccess from "../pages/Aluno/AuthenticateAccess";
import AlunoHome from "../pages/Aluno/Home";
import CurriculumForm from "../pages/Aluno/CurriculumForm";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginRequest from "../pages/LoginRequest";
import LoginVerify from "../pages/LoginVerify";
import AdminLogin from "../pages/Admin/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminVagasDashboard from "../pages/Admin/VagasDashboard";
import JobForm from "../pages/Admin/JobForm";
import VagasList from "../pages/Aluno/VagasList";
import CompanyLandingPage from "../pages/CompanyLandingPage";
import AdminProtectedRoute from "../components/AdminProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout><Home /></AppLayout>,
  },

  /* Aluno (fluxo público) */
  {
    path: "/aluno",
    element: <AppLayout><RequestAccess /></AppLayout>,
  },
  {
    path: "/aluno/autenticar",
    element: <AppLayout><AuthenticateAccess /></AppLayout>,
  },

  /* Rotas protegidas do aluno */
  {
    path: "/aluno/home",
    element: (
      <ProtectedRoute>
        <AppLayout><AlunoHome /></AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/aluno/cv",
    element: (
      <ProtectedRoute>
        <AppLayout><CurriculumForm /></AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/aluno/vagas",
    element: (
      <ProtectedRoute>
        <AppLayout><VagasList /></AppLayout>
      </ProtectedRoute>
    ),
  },

  /* Rotas de login padrão (se usadas) */
  {
    path: "/login",
    element: <LoginRequest />,
  },
  {
    path: "/login/verify",
    element: <LoginVerify />,
  },

  /* Empresa (página pública por link com ids) */
  {
    path: "/empresa",
    element: <CompanyLandingPage />,
  },

  /* Admin (public) */
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  /* Admin protegidas */
  {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AppLayout><AdminDashboard /></AppLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/vagas",
    element: (
      <AdminProtectedRoute>
        <AppLayout><AdminVagasDashboard /></AppLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/cadastrar-vaga",
    element: (
      <AdminProtectedRoute>
        <AppLayout><JobForm /></AppLayout>
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/editar-vaga/:id",
    element: (
      <AdminProtectedRoute>
        <AppLayout><JobForm modoEdicao /></AppLayout>
      </AdminProtectedRoute>
    ),
  },

  /* fallback */
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const Routes: React.FC = () => <RouterProvider router={router} />;

export default Routes;