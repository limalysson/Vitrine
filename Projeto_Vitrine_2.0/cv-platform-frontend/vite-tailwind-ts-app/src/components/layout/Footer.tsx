import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/6 bg-[rgba(11,18,38,0.6)]">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-white/60">
        © {new Date().getFullYear()} Vitrine Academica — Desenvolvido por Alysson Lima
      </div>
    </footer>
  );
};

export default Footer;