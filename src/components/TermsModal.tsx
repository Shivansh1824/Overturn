import React, { useEffect } from 'react';
import { X, Scale, CheckCircle2, ShieldAlert } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
        aria-labelledby="terms-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-100 border border-teal-200 text-teal-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 id="terms-modal-title" className="text-base font-bold text-slate-900 leading-tight">
                Terms of Service & Clinical Advocacy Agreement
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard Terms & Conditions · Applicable Under Indian Law 2026
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
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800 text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Patient Advocacy & Algorithmic Assistance Notice
            </div>
            <p className="text-xs text-amber-900/80 leading-normal">
              OverTurn is an autonomous decision-support system designed to empower patients, hospitals, and legal advocates in assembling evidence-backed appeals. OverTurn organizes clinical proof and cites statutory laws but does not replace licensed judicial or medical advice.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              1. Authorized Use of Uploaded Records
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              By uploading claim documentation, you represent that you are the insured policyholder, attending physician, or an authorized representative acting on their explicit behalf. OverTurn processes these records solely to generate audit packages and does not distribute them to unapproved third parties.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              2. Evidentiary Integrity & Accuracy
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Appeal dossiers cite original diagnostic charts and insurer correspondence provided by you. While OverTurn extracts facts with high clinical fidelity, you or your attending clinician must verify the final document before formal submission to grievance cells or the Ombudsman.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              3. Regulatory Jurisdiction
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Dispute workflows reference regulations governed by the Insurance Regulatory and Development Authority of India (IRDAI), the Insurance Act 1938, and the Consumer Protection Act 2019.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            OverTurn Legal Compliance Protocol
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            I Acknowledge & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
