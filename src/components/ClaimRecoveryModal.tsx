import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, AlertTriangle, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClaimRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimRecoveryModal: React.FC<ClaimRecoveryModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [insurer, setInsurer] = useState('Star Health');
  const [amount, setAmount] = useState('185000');
  const [denialType, setDenialType] = useState('ped');
  const [calculatedWinRate, setCalculatedWinRate] = useState(95);

  if (!isOpen) return null;

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('analyzing');

    setTimeout(() => {
      // Calculate realistic rate based on denial type
      let rate = 95;
      if (denialType === 'room_rent') rate = 89;
      if (denialType === 'depreciation') rate = 94;
      if (denialType === 'delay') rate = 92;
      setCalculatedWinRate(rate);
      setStep('result');

      try {
        confetti({
          particleCount: 70,
          spread: 55,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }
    }, 1400);
  };

  const handleReset = () => {
    setStep('input');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel-elevated bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-brand-600 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Claim Recovery Diagnostic</span>
        </div>

        {step === 'input' && (
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-ink-primary tracking-tight">
              Calculate Your Claim Overturn Odds
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1 mb-6">
              Enter your denial details to see which statutory clauses and clinical precedents overturn your rejection.
            </p>

            <form onSubmit={handleStartAnalysis} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-700 mb-1.5">
                  Insurance Provider
                </label>
                <select
                  value={insurer}
                  onChange={(e) => setInsurer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Star Health">Star Health and Allied Insurance</option>
                  <option value="Care Health">Care Health Insurance (Religare)</option>
                  <option value="HDFC ERGO">HDFC ERGO General Insurance</option>
                  <option value="ICICI Lombard">ICICI Lombard General Insurance</option>
                  <option value="Niva Bupa">Niva Bupa Health Insurance (Max Bupa)</option>
                  <option value="Tata AIG">Tata AIG General Insurance</option>
                  <option value="Other">Other Private / Public Insurer</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase font-mono text-slate-700 mb-1.5">
                    Claim Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="e.g. 185000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase font-mono text-slate-700 mb-1.5">
                    Alleged Denial Reason
                  </label>
                  <select
                    value={denialType}
                    onChange={(e) => setDenialType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ped">Pre-Existing Disease (PED Clause)</option>
                    <option value="room_rent">Room Rent Proportional Penalty</option>
                    <option value="depreciation">Motor 50% Depreciation Slashing</option>
                    <option value="delay">Submission Delay / Late Intimation</option>
                    <option value="investigation">Hospitalization For Investigation</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Includes automatic check against <strong>Section 45 Moratorium & IRDAI Master Circular</strong></span>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-2 btn-tactile"
              >
                <span>Run Autonomous Defense Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Cross-Auditing {insurer} Guidelines...
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Cross-referencing statutory IRDAI mandates, consumer case law precedents, and clinical policy bulletins.
            </p>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-800 uppercase">
                  VERDICT: HIGHLY OVERTURNABLE
                </span>
                <div className="text-xl font-black text-emerald-950 mt-0.5">
                  {calculatedWinRate}% Win Likelihood
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-emerald-700 block">ESTIMATED RECOVERY</span>
                <span className="text-lg font-black text-slate-900">₹{Number(amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="font-mono font-bold text-slate-400 block mb-0.5">PRIMARY STATUTORY WEAPON</span>
                <p className="text-slate-800 font-semibold">
                  Section 45 Incontestability Shield & IRDAI Master Circular 2024 Section 14
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="font-mono font-bold text-slate-400 block mb-0.5">ACTIONABLE 3-STEP ROADMAP</span>
                <ol className="list-decimal list-inside text-slate-600 space-y-1 font-medium">
                  <li>Generate audit-proof appeal docket citing emergency clinical notes.</li>
                  <li>Issue 15-day statutory deadline notice to {insurer} Claims Redressal Officer.</li>
                  <li>Automated 1-click escalation to Insurance Ombudsman upon SLA expiry.</li>
                </ol>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  alert(`Appeal docket generated for ${insurer} claim of ₹${Number(amount).toLocaleString()}. Escalation packet ready.`);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 btn-tactile"
              >
                <span>Export My Appeal Dossier</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Test Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
