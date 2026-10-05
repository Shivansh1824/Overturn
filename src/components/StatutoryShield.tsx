import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scale, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DiagonalWatermark } from './DiagonalWatermark';

gsap.registerPlugin(ScrollTrigger);

const STATUTES = [
  {
    law: 'Insurance Act 1938 · Section 45',
    title: 'Incontestability Moratorium',
    desc: 'No health insurance policy can be repudiated on grounds of misstatement or non-disclosure after continuous coverage. Repudiations issued beyond this window are void ab initio — regardless of what the insurer claims.',
    impact: 'Instantly defeats Pre-Existing Disease allegations on mature policies.',
  },
  {
    law: 'IRDAI Master Circular 2024 · Regulation 14',
    title: '15-Day Binding Redressal SLA',
    desc: 'Insurers are legally mandated to resolve policyholder grievance dockets within 15 calendar days. Failure triggers automatic Insurance Ombudsman jurisdiction and statutory penal interest against the insurer.',
    impact: 'Forces grievance officers to prioritise your appeal over routine rejections.',
  },
  {
    law: 'Supreme Court of India Precedent',
    title: 'Strict Construction Against Insurer',
    desc: 'The Supreme Court of India holds that ambiguous exclusion clauses must always be interpreted in favour of the insured policyholder. Insurers cannot expand narrow exclusions through internal administrative guidelines.',
    impact: 'Dismantles arbitrary surveyor disallowances and room-rent penalties.',
  },
];

export const StatutoryShield: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.statute-card-box');
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          y: 35,
          opacity: 0,
          duration: 0.75,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="statutory-shield"
      ref={sectionRef}
      className="relative py-28 px-6 md:px-12 lg:px-16 overflow-hidden bg-slate-50/70 border-t border-slate-200/80"
    >
      {/* ── Diagonal OVERTURN repeated background watermark ── */}
      <DiagonalWatermark text="OVERTURN" opacity={0.035} rotation={-13} />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-800 font-mono text-xs font-semibold uppercase tracking-wider mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Statutory Enforcement Engine
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Backed by Indian Law. Enforced with Code.
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md font-medium leading-relaxed">
            OverTurn automatically embeds binding statutory provisions and Supreme Court precedents directly into your appeal dossier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUTES.map((s) => (
            <div
              key={s.title}
              className="statute-card-box group bg-white/95 backdrop-blur-sm rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-mono text-xs font-semibold mb-5">
                  <Scale className="w-3.5 h-3.5" />
                  {s.law}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-teal-900 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-start gap-2 text-xs font-medium text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                    Legal Impact
                  </span>
                  <span>{s.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
