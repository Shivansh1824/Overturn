import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UploadCloud, Cpu, ShieldCheck, Scale, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: '01', Icon: UploadCloud,
    title: 'Case Intake & OCR',
    desc: 'Upload your denial letter and hospital records (or pick a pre-loaded clinical scenario). OCR engine extracts official denial codes, ICD-10 codes, and exact insurer clause references.',
  },
  {
    n: '02', Icon: Cpu,
    title: 'Policy Guideline Cross-Audit',
    desc: 'The multi-step agent cross-references 90-page Insurer Clinical Policy Bulletins (CPBs), IRDAI Master Circulars, and medical necessity criteria in under 2 seconds.',
  },
  {
    n: '03', Icon: ShieldCheck,
    title: 'Evidence Battle Board',
    desc: 'Side-by-side contrast: what the insurer alleged vs the exact "smoking gun" proof hidden in your medical records. Human clinician sign-off required before export.',
  },
  {
    n: '04', Icon: Scale,
    title: 'Appeal Dossier & Regulator Shield',
    desc: 'Formal legal appeal packet with ICD-10/CPT codes, Section 45 moratorium shield, and 1-click Insurance Ombudsman escalation with a 15-Day IRDAI SLA countdown.',
  },
];

export const WorkflowSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const steps = sectionRef.current!.querySelectorAll('.workflow-step');
      gsap.from(steps, {
        y: 32, autoAlpha: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 md:py-28 px-6 md:px-12 max-w-[1380px] mx-auto"
    >
      <hr className="section-divider mb-16" />

      <div className="flex items-center gap-2 mb-3">
        <span className="label-mono text-[#8d96b0]">[ 03 // 4-Stage Agentic Workflow ]</span>
        <span className="label-mono" style={{ color: 'var(--brand)' }}>· From Denial to Overturn</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <h2 className="display-lg text-[#0b0e18] max-w-xl">
          How Overturn reclaims what is yours.
        </h2>
        <p className="text-sm text-[#4b5470] max-w-xs font-medium md:text-right">
          No hold music. No attorneys. A fully autonomous legal-medical pipeline designed for maximum recovery speed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((s) => {
          const Icon = s.Icon;
          return (
            <div
              key={s.n}
              className="workflow-step glass-card rounded-2xl p-6 card-hover group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-5">
                  <span className="text-[2.2rem] font-black text-slate-100 group-hover:text-sky-200 transition-colors leading-none">
                    {s.n}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-bold text-[0.95rem] text-[#0b0e18] mb-2">{s.title}</h3>
                <p className="text-xs text-[#4b5470] leading-relaxed">{s.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="label-mono text-[#c9cedc]">Phase {s.n}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c9cedc] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
