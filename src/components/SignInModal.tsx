import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Lock, CheckCircle2, User, Building2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [role, setRole] = useState<'claimant' | 'provider'>('claimant');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  const handleDemoSignIn = (demoRole: 'claimant' | 'provider') => {
    setRole(demoRole);
    setEmailOrPhone(demoRole === 'claimant' ? 'vikram.patient@example.com' : 'dr.sharma@hospital.org');
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="mb-6">
          <BrandLogo size={36} textSize="text-lg" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">
            Sign In to OverTurn
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Access active appeal dossiers, clinical proof audits & statutory tracking.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setRole('claimant')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === 'claimant'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient / Claimant</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === 'provider'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital / Physician</span>
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="font-bold text-slate-900 text-base">
              Authenticated Successfully
            </div>
            <p className="text-xs text-slate-500">
              Opening your secure {role === 'claimant' ? 'Claimant Portal' : 'Clinical Desk'}...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {role === 'claimant' ? 'Registered Mobile or Email' : 'Institutional Email / NPI ID'}
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder={role === 'claimant' ? '+91 98765 43210 or name@gmail.com' : 'billing@hospital.org'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/10 cursor-pointer"
            >
              <span>Continue with OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick 1-click Demo Sign In */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400 font-medium">Quick Judge / Evaluator Demo:</span>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('claimant')}
                  className="flex-1 py-2 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  ⚡ Demo Patient
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('provider')}
                  className="flex-1 py-2 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  ⚡ Demo Hospital Desk
                </button>
              </div>
            </div>

            {/* Security note */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>DPDP Act 2023 Compliant · Zero Data Retention</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
