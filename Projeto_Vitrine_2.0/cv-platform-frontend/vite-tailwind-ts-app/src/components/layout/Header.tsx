import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-[rgba(11,18,38,0.6)] backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center">
        <Link to="/" className="inline-block">
          <img
            src="/header.png"
            alt="Vitrine Acadêmica"
            className="w-full max-w-[720px] h-auto max-h-24 object-contain"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;