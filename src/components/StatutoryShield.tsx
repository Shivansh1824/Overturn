import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scale } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATUTES = [
  {
    law: 'Insurance Act 1938 · Section 45',
    title: 'Incontestability Moratorium',
    desc: 'No policy can be repudiated on grounds of misstatement or non-disclosure after 4 continuous renewal years. Repudiations beyond this window are void ab initio — regardless of the insurer\'s clinical opinion.',
    impact: 'Instantly defeats PED (Pre-Existing Disease) allegations on mature policies.',
  },
  {
    law: 'IRDAI Master Circular 2024 · Section 14',
    title: '15-Day Binding Redressal SLA',
    desc: 'Insurers are federally mandated to resolve policyholder grievance dockets within 15 calendar days. Failure triggers automatic Ombudsman jurisdiction, penal interest, and compliance notices.',
    impact: 'Forces grievance officers to prioritise your appeal over routine rejections.',
  },
  {
    law: 'Supreme Court of India · Gurshinder Singh (2020)',
    title: 'Rider Supremacy Doctrine',
    desc: 'Contractually purchased policy riders (Zero Depreciation, Consumables Cover) strictly override general tariff reduction formulas. Surveyors cannot unilaterally apply IMT depreciation tables against active add-ons.',
    impact: 'Reverses arbitrary surveyor depreciation cuts with a single citation.',
  },
];

export const StatutoryShield: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll('.statute-card');
      gsap.from(cards, {
        y: 32, autoAlpha: 0, duration: 0.75, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="statutory-shield"
      ref={sectionRef}
      className="py-20 md:py-28 px-6 md:px-12 max-w-[1380px] mx-auto"
    >
      <hr className="section-divider mb-16" />

      <div className="flex items-center gap-2 mb-3">
        <span className="label-mono text-[#8d96b0]">[ 04 // Statutory Shield ]</span>
        <span className="label-mono text-emerald-700">· Legal Teeth Backing Your Claim</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <h2 className="display-lg text-[#0b0e18] max-w-xl">
          Backed by Indian law. Enforced with code.
        </h2>
        <p className="text-sm text-[#4b5470] max-w-xs font-medium md:text-right">
          Overturn embeds binding statutory provisions and Supreme Court precedents directly into your appeal letter — automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STATUTES.map((s) => (
          <div key={s.title} className="statute-card glass-card rounded-2xl p-6 card-hover flex flex-col justify-between">
            <div>
              <div
                className="inline-flex items-center gap-1.5 label-mono px-2.5 py-1 rounded-full border mb-4"
                style={{ background: 'var(--brand-light)', color: 'var(--brand)', borderColor: 'hsl(198,85%,80%)' }}
              >
                <Scale className="w-3.5 h-3.5" />
                {s.law}
              </div>
              <h3 className="font-bold text-[1rem] text-[#0b0e18] mb-2">{s.title}</h3>
              <p className="text-xs text-[#4b5470] leading-relaxed">{s.desc}</p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="label-mono text-[#8d96b0] block mb-1">Practical Impact</span>
              <p className="text-xs font-semibold text-[#1e2535]">{s.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
