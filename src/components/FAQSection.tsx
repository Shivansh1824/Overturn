import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Footer } from './Footer';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'Why are over 80% of health insurance rejections legally overturnable?',
    a: 'Insurers process claims using automated algorithmic filters and third-party administrators (TPAs). These systems frequently issue boilerplate rejections (such as "not medically necessary" or "unproved condition") without reading attending surgeon notes or lab values. When held to statutory standards and objective clinical records, the majority of these denials collapse.',
  },
  {
    q: 'How does OverTurn uncover the clinical "smoking gun" proof?',
    a: 'OverTurn cross-audits the rejection notice directly against your diagnostic charts, hospital discharge summaries, and operative notes. It isolates the exact medical finding (such as emergency vitals logs or pathology markers) that contradicts the insurer’s excuse, indexing it by exact page and timestamp.',
  },
  {
    q: 'Is the appeal dossier legally recognized by insurers and regulators?',
    a: 'Yes. OverTurn embeds official provisions from the IRDAI Master Circular 2024, Section 45 of the Insurance Act 1938, and landmark Supreme Court consumer precedents. This formal legal format compels the insurer’s Grievance Redressal Officer to review the claim under statutory timelines.',
  },
  {
    q: 'What is the statutory 15-day timeline under IRDAI regulations?',
    a: 'Under IRDAI Regulation 14, insurance companies have a mandatory statutory SLA of 15 calendar days to resolve written grievances. If they fail to comply or uphold an arbitrary denial, OverTurn prepares a 1-click formal escalation packet for the Insurance Ombudsman.',
  },
  {
    q: 'How is my private medical data secured?',
    a: 'OverTurn operates on a strict zero-retention architecture complying with India’s Digital Personal Data Protection (DPDP) Act 2023. Records are parsed ephemerally in-memory and encrypted using TLS 1.3 in transit and AES-256 at rest. We never sell, store, or train models on your private diagnostic charts.',
  },
];

interface FAQSectionProps {
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenPrivacyModal,
  onOpenTermsModal
}) => {
  // Keep all FAQs closed by default as requested
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between pt-20 sm:pt-24 pb-2 px-6 md:px-12 lg:px-16 text-slate-900 overflow-y-auto scrollbar-hide">
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center py-4">
        {/* Section Header */}
        <div className="mb-6 pb-4 border-b border-slate-200/60">
          <div className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-slate-900">
            Everything You Need to Know
          </h2>
        </div>

        {/* Accordion List (Compact, Closed by default) */}
        <div className="space-y-2.5">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-slate-200/70 bg-white/75 backdrop-blur-md overflow-hidden transition-all hover:border-slate-300"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-slate-800 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer seamlessly anchored at bottom of this slide */}
      <div className="w-full max-w-5xl mx-auto shrink-0">
        <Footer 
          compact={true}
          onOpenPrivacyModal={onOpenPrivacyModal}
          onOpenTermsModal={onOpenTermsModal}
        />
      </div>
    </div>
  );
};

