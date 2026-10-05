import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenRecoveryModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRecoveryModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 h-16">
      {/* frosted glass bar */}
      <div className="absolute inset-0 bg-white/75 backdrop-blur-xl border-b border-white/60 shadow-[0_1px_0_rgba(200,210,228,0.5)]" />

      {/* Logo */}
      <div className="relative flex items-center gap-2.5 z-10">
        {/* Shield icon mark — inline SVG for crispness */}
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0b0e18] shadow-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m9 12 2 2 4-4" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <span className="font-extrabold text-[1.05rem] tracking-tight text-[#0b0e18] leading-none block">
            Overturn
          </span>
          <span className="label-mono text-[9px] text-[#4b5470] leading-none">
            Claim Defense AI
          </span>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="relative z-10 hidden md:flex items-center gap-7 text-sm font-semibold text-[#4b5470]">
        <a href="#how-it-works" className="hover:text-[#0b0e18] transition-colors">How it Works</a>
        <a href="#evidence-board" className="hover:text-[#0b0e18] transition-colors">Evidence Board</a>
        <a href="#statutory-shield" className="hover:text-[#0b0e18] transition-colors">Statutory Shield</a>
        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold label-mono">
          <span className="live-dot !w-5px !h-5px" style={{width:'6px',height:'6px'}}></span>
          95% Win Rate
        </div>
      </nav>

      {/* CTA */}
      <div className="relative z-10 flex items-center gap-3">
        <button
          onClick={onOpenRecoveryModal}
          className="btn-primary text-sm px-5 py-2.5 !rounded-xl"
        >
          Recover My Claim
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
