import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-sm py-10 px-6 md:px-12">
    <div className="max-w-[1380px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0b0e18]">
          <Shield className="w-4 h-4" style={{ color: '#34d399' }} />
        </div>
        <div>
          <span className="font-extrabold text-sm text-[#0b0e18]">Overturn</span>
          <span className="label-mono text-[#8d96b0] ml-2">Autonomous Claim Defense AI</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 label-mono text-[#8d96b0]">
        <span>Track 01: Agentic AI · WCC Launchpad 30</span>
        <span className="text-[#c9cedc]">·</span>
        <span className="text-emerald-600 font-bold">100% Deterministic Demo Safe</span>
        <span className="text-[#c9cedc]">·</span>
        <span>Compliant with IRDAI Master Circular 2024</span>
      </div>

      <div className="label-mono text-[#c9cedc] text-right">
        React 19 · Vite · Tailwind CSS · GSAP
      </div>
    </div>
  </footer>
);
