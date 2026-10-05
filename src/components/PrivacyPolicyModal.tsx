import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-100 border border-teal-200 text-teal-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="text-base font-bold text-slate-900 leading-tight">
                Privacy Policy & Patient Data Governance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                DPDP Act 2023 & HIPAA Zero-Retention Compliance · Rev 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-100 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-teal-800 text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4 text-teal-600" />
              Patient Confidentiality Guarantee
            </div>
            <p className="text-xs text-teal-900/80 leading-normal">
              OverTurn operates on a strict <strong>Zero-Retention Medical Pipeline</strong>. Clinical records, denial notices, and patient diagnostic scans are processed ephemerally in-memory. We never sell, store, or use your medical history to train foundation models.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              1. Information We Ingest & Purpose
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              When auditing a denial, you may provide insurer repudiation letters, discharge summaries, pre-authorization queries, and clinical diagnostic reports. This data is utilized solely to extract clinical evidence, detect insurer guideline contradictions, and compile an appeal dossier under your direct supervision.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-teal-600 shrink-0" />
              2. Ephemeral Processing & Cryptographic Security
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              All data transmissions are encrypted using TLS 1.3 in transit and AES-256 at rest. Once the audit evaluation is generated and downloaded, uploaded file buffers are purged from active memory.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
              3. Regulatory Alignment (DPDP Act 2023 & IRDAI)
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              In full compliance with India's Digital Personal Data Protection Act (DPDP) 2023, you retain absolute ownership and control over your medical data. Appeal letters cite official IRDAI circulars and Consumer Protection Act provisions with complete algorithmic transparency.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            OverTurn Legal & Compliance Cell
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
