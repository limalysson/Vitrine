import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types";

type AuthContextType = {
  token?: string | null;
  user?: User | null;
  isAuthenticated: boolean;
  // mantém compatibilidade: antiga login pode ser chamada, mas agora preferimos verify flow
  login?: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSession: (token: string, user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
      try {
        const u = localStorage.getItem("user");
        if (u) setUser(JSON.parse(u));
      } catch {}
    }
  }, []);

  const setSession = (t: string, u: User) => {
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login: undefined, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};