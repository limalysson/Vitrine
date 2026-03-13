import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0f172a]/60 backdrop-blur-sm mt-auto relative">
      <div className="max-w-6xl mx-auto px-4 py-1 text-center text-sm text-slate-400 font-light">
        <p>Connecting Talent to Opportunity</p>
        <p>© {new Date().getFullYear()} Vitrus Talent - Powered by Vitrus Tech</p>
      </div>
      <div className="absolute right-6 bottom-5">
        <a href="#">
          <img src="/logo.jpeg" alt="Logo" className="h-10 w-10 transform transition-transform duration-200 hover:scale-120" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;