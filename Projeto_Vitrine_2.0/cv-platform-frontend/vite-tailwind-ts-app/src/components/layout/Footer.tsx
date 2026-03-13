import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0f172a]/60 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-slate-400 font-light">
        <p>© {new Date().getFullYear()} Vitrine Acadêmica — Desenvolvido por Alysson Lima</p>
        <p className="mt-2 text-xs opacity-50">Conectando talentos às melhores oportunidades</p>
      </div>
    </footer>
  );
};

export default Footer;