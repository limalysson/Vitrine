import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;