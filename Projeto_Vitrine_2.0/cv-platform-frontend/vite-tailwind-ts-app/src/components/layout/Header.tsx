import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center transition-transform duration-300 hover:scale-[1.02] focus:scale-[1.02] outline-none"
        >
          <img
            src="/header.png"
            alt="Vitrine Acadêmica"
            className="w-full max-w-[300px] h-auto object-contain drop-shadow-md"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;