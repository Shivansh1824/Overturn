import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  location: string;
  caseType: string;
  verdict: string;
  quote: string;
  insurer: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Vikramaditya S.',
    role: 'Software Architect',
    location: 'Bengaluru, Karnataka',
    caseType: 'Post-Accident Trauma & ICU Surgery',
    verdict: 'Denial Overturned',
    insurer: 'National Private Insurer',
    quote:
      'Following an emergency hospitalization, the insurer sent an automated rejection alleging non-emergency care. OverTurn scanned my surgeon’s emergency triage log, cited IRDAI Section 14, and had the denial overturned in just 8 days.',
  },
  {
    name: 'Dr. Anita Roy',
    role: 'Consultant Pediatrician',
    location: 'Kolkata, West Bengal',
    caseType: 'Spinal Decompression & MRI Necessity',
    verdict: 'Medical Necessity Upheld',
    insurer: 'Health Insurance TPA',
    quote:
      'Even as a doctor, deciphering 80-page Clinical Policy Bulletins to dispute an arbitrary denial is a nightmare. OverTurn extracted the exact neurological deficit notes that proved medical necessity. The dossier was airtight.',
  },
  {
    name: 'Rajesh Mehta',
    role: 'Retired School Principal',
    location: 'Mumbai, Maharashtra',
    caseType: 'Arbitrary Consumables & Room Rent Disallowance',
    verdict: 'Deductions Reversed',
    insurer: 'Stand-alone Health Insurer',
    quote:
      'The insurer cut significant amounts under opaque internal tariff caps. OverTurn cited Supreme Court precedent barring uncommunicated deductions. The full claim balance was directly credited.',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-y-auto pt-28 pb-20 px-6 md:px-12 lg:px-16 text-slate-900 scrollbar-hide">
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200/60">
          <div>
            <div className="text-xs font-mono font-bold text-violet-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              Patient Advocacy & Outcomes
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
              Real Claims Overturned. Real Lives Restored.
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md font-medium leading-relaxed">
            Verified patient cases where arbitrary rejections and bad-faith delays were overturned through clinical evidence and statutory law.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-7 border border-slate-200/60 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/80">
                    {t.verdict}
                  </span>
                </div>

                <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500 mb-2">
                  {t.caseType}
                </div>

                <Quote className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-slate-500">{t.role} · {t.location}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Insurer</span>
                  <span className="font-mono text-[11px] text-teal-600 font-semibold">{t.insurer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

