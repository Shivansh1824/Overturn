import React from 'react';
import {
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Sparkles,
  Gavel,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Building2,
  UserCheck
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AuthUser } from '../lib/supabase';
import { AgentSim } from './AgentCockpit';
import { DiagonalWatermark } from './DiagonalWatermark';

interface DashboardViewProps {
  user: AuthUser;
  onSignOut: () => void;
  onBackToHome: () => void;
  onOpenRecoveryModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onSignOut,
  onBackToHome,
  onOpenRecoveryModal,
}) => {
  return (
    <div className="h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col overflow-y-auto selection:bg-teal-500/30 selection:text-teal-900">
      {/* ── Background Subtle Watermark ── */}
      <DiagonalWatermark text="OVERTURN COCKPIT" opacity={0.02} rotation={-10} />

      {/* ── Top Dashboard Navbar ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBackToHome} className="cursor-pointer bg-transparent border-0 p-0">
              <BrandLogo size={34} textSize="text-lg" />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Clinical Appeal Workspace
              </span>
              {user.role === 'judge' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100/80 border border-teal-300 text-[11px] font-mono font-bold text-teal-800">
                  <Gavel className="w-3 h-3 text-teal-700" />
                  Judge Evaluator Mode
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs">
              <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 leading-tight">{user.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{user.email}</span>
              </div>
            </div>

            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Story</span>
            </button>

            <button
              onClick={onSignOut}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-8 relative z-10">
        
        {/* Judge Fast-Pass Banner */}
        {user.role === 'judge' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>WCC Launchpad 30 Live Evaluation Active</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Pre-verified test cases loaded with 100% deterministic reliability. Test the 4-step autonomous reasoning engine below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenRecoveryModal}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Upload Custom Letter
              </button>
            </div>
          </div>
        )}

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Active Dossiers</span>
              <FileText className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">3 Claims</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Cross-audited against insurer CPBs</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Disallowed Amount</span>
              <TrendingUp className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">₹8,45,000</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Wrongfully denied by TPAs</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Statutory Recovery</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">89.4%</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Estimated win probability</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Statutory SLA</span>
              <Clock className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-sky-600 font-mono">8.2 Days</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Mandatory 15-day IRDAI limit</div>
          </div>
        </div>

        {/* Live Autonomous Simulator / Cockpit */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <AgentSim onOpenRecoveryModal={onOpenRecoveryModal} />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
        <div>OverTurn Clinical Reasoning Engine v1.0.0</div>
        <div>Encrypted TLS 1.3 · Zero Retention Architecture</div>
      </footer>
    </div>
  );
};
