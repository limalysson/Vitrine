import React from "react";
import { createRoot } from "react-dom/client";
import Routes from "./routes"; // usa src/routes/index.tsx
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error('Elemento com id "root" não encontrado');

createRoot(container).render(
  <AuthProvider>
    <Routes />
  </AuthProvider>
);