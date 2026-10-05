import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FileWarning,
  SearchCheck,
  Scale,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { DiagonalWatermark } from './DiagonalWatermark';

gsap.registerPlugin(ScrollTrigger);

interface ProofScenario {
  id: string;
  category: string;
  allegation: {
    title: string;
    summary: string;
    sampleExcuse: string;
  };
  smokingGun: {
    title: string;
    summary: string;
    uncoveredFact: string;
    winProbability: string;
  };
  statute: {
    title: string;
    legalAuthority: string;
    enforcementAction: string;
  };
}

const DISPUTE_SCENARIOS: ProofScenario[] = [
  {
    id: 'necessity',
    category: 'Medical Necessity Dispute',
    allegation: {
      title: 'Automated "Not Medically Necessary" Denial',
      summary:
        'The insurer claims your surgery or inpatient hospital admission was unwarranted or could have been treated as an outpatient consultation.',
      sampleExcuse:
        'Repudiated under policy clause: Inpatient admission deemed elective and not clinically justified by claims medical officer.',
    },
    smokingGun: {
      title: 'Objective Clinical Diagnostic Proof',
      summary:
        'The attending physician’s admission orders, vitals history, and diagnostic scans that prove urgent clinical necessity.',
      uncoveredFact:
        'Emergency physician records confirm acute symptoms requiring continuous IV monitoring and surgical intervention.',
      winProbability: '94%',
    },
    statute: {
      title: 'IRDAI Master Circular on Clinical Governance',
      legalAuthority: 'IRDAI Master Circular 2024 / Regulation 24',
      enforcementAction:
        'Insurers are prohibited from overturning treating physician determinations without an independent medical board review.',
    },
  },
  {
    id: 'pre-existing',
    category: 'Pre-Existing Condition Bar',
    allegation: {
      title: 'Alleged Non-Disclosure of Pre-Existing Illness',
      summary:
        'The insurer denies coverage claiming your condition existed prior to taking the policy, often without presenting clinical proof.',
      sampleExcuse:
        'Claim rejected for non-disclosure of prior medical history under standard exclusions clause.',
    },
    smokingGun: {
      title: 'Verifiable First-Diagnosis Timeline',
      summary:
        'Hospital records and baseline test dates confirming the disease was first diagnosed well after the mandatory policy waiting window.',
      uncoveredFact:
        'Pathology logs and medical history cross-audit confirm zero prior consultation before policy inception date.',
      winProbability: '96%',
    },
    statute: {
      title: 'Section 45 Statutory Moratorium Bar',
      legalAuthority: 'Insurance Act 1938, Section 45',
      enforcementAction:
        'Once a health insurance policy has completed continuous coverage, claims cannot be questioned or repudiated on grounds of misstatement.',
    },
  },
  {
    id: 'deductions',
    category: 'Arbitrary Disallowance',
    allegation: {
      title: 'Disputed Deductions & Disallowances',
      summary:
        'The insurance company cuts 40%–60% of the approved hospital bill, claiming arbitrary consumable caps or room-rent penalties.',
      sampleExcuse:
        'Disallowance of medical equipment, nursing charges, and consumables under internal operational guidelines.',
    },
    smokingGun: {
      title: 'Itemized Schedule & Tariff Disclosure',
      summary:
        'The signed policy schedule with no explicit proportionate deduction clause communicated at purchase time.',
      uncoveredFact:
        'Audit identifies all billed consumables were clinically essential and no proportionate deduction was legally contracted.',
      winProbability: '91%',
    },
    statute: {
      title: 'Consumer Protection Act & Full-Disclosure Mandate',
      legalAuthority: 'National Consumer Commission Ruling & IRDAI Transparency Guidelines',
      enforcementAction:
        'Insurers cannot enforce uncommunicated internal deduction guidelines against policyholders.',
    },
  },
];

export const EvidenceBattleBoard: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const cur = DISPUTE_SCENARIOS[selectedScenario];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.battle-card-box');
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          y: 35,
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
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
      id="evidence-board"
      ref={sectionRef}
      className="relative py-28 px-6 md:px-12 lg:px-16 overflow-hidden bg-[#090d16] border-t border-slate-800 text-white"
    >
      {/* ── Diagonal OVERTURN repeated background watermark ── */}
      <DiagonalWatermark text="OVERTURN" opacity={0.03} rotation={-14} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-teal-400 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              The Evidentiary Core
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              What Is the Smoking Gun Proof?
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-medium leading-relaxed">
            Insurers rely on automated rejection templates. OverTurn unearths the concrete clinical facts already in your file to dismantle their excuse.
          </p>
        </div>

        {/* 3 Pillar Conceptual Explainer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-900/40">
            <div className="flex items-center gap-2.5 font-bold text-rose-300 text-sm mb-2">
              <FileWarning className="w-5 h-5 text-rose-400" />
              1. The Insurer Allegation
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              The generic excuse written on the denial letter (e.g. "lack of conservative therapy" or "not clinically required"). Generated automatically by claims filters without deep doctor chart audits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-teal-950/30 border border-teal-800/40">
            <div className="flex items-center gap-2.5 font-bold text-teal-300 text-sm mb-2">
              <SearchCheck className="w-5 h-5 text-teal-400" />
              2. The Smoking Gun Proof
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              The exact sentence, lab metric, or imaging report in your doctor’s file that directly proves the insurer’s claim is false. OverTurn indexes this proof by exact page number and physician signature.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5 font-bold text-slate-200 text-sm mb-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              3. The Statutory Mandate
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              The regulatory law (such as the Insurance Act 1938 or IRDAI Master Circular) that binds the insurer. When paired with the smoking gun, it legally obligates the insurer to reconsider or face penalties.
            </p>
          </div>
        </div>

        {/* Dispute Scenario Selector */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold mr-2">
            Explore Dispute Types:
          </span>
          {DISPUTE_SCENARIOS.map((scenario, i) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(i)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedScenario === i
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {scenario.category}
            </button>
          ))}
        </div>

        {/* Side-by-Side 3-Column Evidentiary Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card A: The Allegation */}
          <div className="battle-card-box rounded-2xl p-7 bg-slate-900/90 border border-rose-900/40 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-rose-400" />
                  Insurer’s Stated Position
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800/40">
                  Repudiated
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                {cur.allegation.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                {cur.allegation.summary}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300 leading-relaxed">
                <span className="font-bold block mb-1 uppercase tracking-wider text-[10px] text-rose-400">
                  Denial Letter Text:
                </span>
                "{cur.allegation.sampleExcuse}"
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-medium text-rose-400 flex items-center gap-1.5">
              <span>Automated repudiation without clinical depth</span>
            </div>
          </div>

          {/* Card B: The Smoking Gun Proof */}
          <div className="battle-card-box rounded-2xl p-7 bg-slate-900/90 border border-teal-500/50 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                  <SearchCheck className="w-4 h-4 text-teal-400" />
                  The Discovered Smoking Gun
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800/50">
                  {cur.smokingGun.winProbability} Win Probability
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                {cur.smokingGun.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                {cur.smokingGun.summary}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-emerald-300 shadow-2xs leading-relaxed">
                <span className="font-bold block mb-1 uppercase tracking-wider text-[10px] text-teal-400">
                  Clinical Evidence Found:
                </span>
                "{cur.smokingGun.uncoveredFact}"
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct contradiction established from original chart</span>
            </div>
          </div>

          {/* Card C: Statutory Shield */}
          <div className="battle-card-box rounded-2xl p-7 bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Legal & Regulatory Shield
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  Enforceable
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                {cur.statute.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                {cur.statute.enforcementAction}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed">
                <span className="font-bold block mb-1 uppercase tracking-wider text-[10px] text-slate-500">
                  Binding Legal Authority:
                </span>
                {cur.statute.legalAuthority}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Compels insurer reconsideration under legal penalty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
