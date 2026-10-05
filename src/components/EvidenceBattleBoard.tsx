import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, CheckCircle2, Scale, Sparkles, ArrowRight } from 'lucide-react';
import { SAMPLE_CASES } from '../data/cases';

gsap.registerPlugin(ScrollTrigger);

export const EvidenceBattleBoard: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const cur = SAMPLE_CASES[idx];
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll('.battle-card');
      gsap.from(cards, {
        y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="evidence-board"
      ref={sectionRef}
      className="py-20 md:py-28 px-6 md:px-12 max-w-[1380px] mx-auto"
    >
      <hr className="section-divider mb-16" />

      <div className="flex items-center gap-2 mb-3">
        <span className="label-mono text-[#8d96b0]">[ 02 // Evidence Battle Board ]</span>
        <span className="label-mono" style={{ color: 'var(--brand)' }}>· Human-in-the-Loop Forensics</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <h2 className="display-lg text-[#0b0e18] max-w-xl">
          Insurer allegation{' '}
          <em className="not-italic" style={{ color: 'var(--rose)' }}>vs</em>{' '}
          the smoking gun proof.
        </h2>

        {/* Case switcher */}
        <div className="flex gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 self-start md:self-auto flex-shrink-0">
          {SAMPLE_CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setIdx(i)}
              className={`px-3 py-1.5 rounded-lg label-mono transition-all ${
                idx === i ? 'bg-white shadow-sm text-[#0b0e18] border border-slate-200/70' : 'text-[#8d96b0] hover:text-[#4b5470]'
              }`}
            >
              {c.patient_name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column A: Insurer Allegation */}
        <div className="battle-card glass-card rounded-2xl p-6 border-rose-200/60 flex flex-col"
          style={{ background: 'linear-gradient(135deg,rgba(255,241,242,0.6) 0%,rgba(255,255,255,0.8) 100%)' }}>
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span className="label-mono text-rose-700">What Insurer Alleged</span>
            </div>
            <span className="label-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              Repudiated
            </span>
          </div>

          <div className="space-y-3 flex-1">
            <div>
              <div className="label-mono text-[#8d96b0] mb-0.5">Insurer</div>
              <div className="font-bold text-sm text-[#0b0e18]">{cur.insurer_name}</div>
            </div>
            <div>
              <div className="label-mono text-[#8d96b0] mb-0.5">Cited Clause</div>
              <div className="font-mono text-xs font-bold text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200/60">{cur.denial_code}</div>
            </div>
            <div>
              <div className="label-mono text-[#8d96b0] mb-0.5">Their Argument</div>
              <p className="text-xs font-medium text-[#1e2535] leading-relaxed bg-white/70 p-3 rounded-xl border border-rose-100">
                "{cur.alleged_reason}"
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100 label-mono text-rose-600">
            Status: Automated opaque rejection
          </div>
        </div>

        {/* Column B: Smoking Gun — Highlighted */}
        <div className="battle-card glass-card-deep rounded-2xl p-6 flex flex-col ring-2 ring-emerald-500/10"
          style={{ background: 'linear-gradient(135deg,#f0fdf4 0%,rgba(255,255,255,0.95) 100%)', borderColor: 'rgba(16,185,129,0.3)' }}>
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="label-mono text-emerald-800">The Smoking Gun</span>
            </div>
            <span className="label-mono text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
              {cur.win_probability}% Overturn
            </span>
          </div>

          <div className="space-y-3 flex-1">
            <div>
              <div className="label-mono text-[#8d96b0] mb-0.5">Forensic Source</div>
              <div className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">{cur.smoking_gun.source}</div>
            </div>
            <div>
              <div className="label-mono text-[#8d96b0] mb-0.5">Discovered Contradiction</div>
              <p className="text-sm font-semibold text-[#0b0e18] leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm">
                "{cur.smoking_gun.summary}"
              </p>
            </div>
            <div>
              <div className="label-mono text-[#8d96b0] mb-0.5">Evidence Coding</div>
              <div className="font-mono text-[11px] text-[#4b5470] bg-slate-50 p-2.5 rounded-lg border border-slate-200">{cur.smoking_gun.clinical_citation}</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center gap-2 label-mono text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Repudiation directly contradicted by records
          </div>
        </div>

        {/* Column C: Statutory Shield */}
        <div className="battle-card rounded-2xl p-6 flex flex-col bg-[#0b0e18]">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span className="label-mono text-slate-300">Statutory Shield</span>
            </div>
            <span className="label-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
              Binding Law
            </span>
          </div>

          <div className="space-y-3 flex-1">
            <div>
              <div className="label-mono text-slate-600 mb-0.5">Legal Mandate</div>
              <div className="font-mono text-[11px] font-bold text-emerald-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">{cur.key_statute}</div>
            </div>
            <div>
              <div className="label-mono text-slate-600 mb-0.5">Why Insurer Must Comply</div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {cur.policy_shield.protection_clause}
              </p>
            </div>
            <div>
              <div className="label-mono text-slate-600 mb-0.5">IRDAI Escalation SLA</div>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                Section 14: Insurer must resolve within 15 days or face penal interest.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between label-mono">
            <span className="text-slate-500">Audit-proof legal package</span>
            <span className="text-emerald-400 font-bold">Ready to file →</span>
          </div>
        </div>
      </div>
    </section>
  );
};
