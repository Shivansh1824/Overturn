import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import {
  Play, CheckCircle2, RefreshCw,
  ArrowRight, Download, Scale, Sparkles, ShieldCheck, Lock
} from 'lucide-react';
import { SAMPLE_CASES } from '../data/cases';
import { DiagonalWatermark } from './DiagonalWatermark';

gsap.registerPlugin(ScrollTrigger);

interface AgentSimProps {
  onOpenRecoveryModal: () => void;
}

export const AgentSim: React.FC<AgentSimProps> = ({ onOpenRecoveryModal }) => {
  const [caseIdx, setCaseIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(true);
  const [winRate, setWinRate] = useState(SAMPLE_CASES[0].win_probability);
  const [activeTab, setActiveTab] = useState<'stream' | 'evidence' | 'dossier'>('stream');

  const sectionRef      = useRef<HTMLDivElement>(null);
  const progressRef     = useRef<SVGCircleElement>(null);
  const containerRef    = useRef<HTMLDivElement>(null);

  const activeCase = SAMPLE_CASES[caseIdx];

  // Animate progress circle whenever winRate changes
  useEffect(() => {
    if (!progressRef.current) return;
    const c = 2 * Math.PI * 44;
    progressRef.current.style.strokeDasharray = `${c} ${c}`;
    progressRef.current.style.strokeDashoffset = String(c - (winRate / 100) * c);
  }, [winRate]);

  // Scroll-triggered entrance
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        y: 50, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  const runSimulation = () => {
    if (running) return;
    setRunning(true);
    setDone(false);
    setStepIdx(0);
    setWinRate(0);

    const c = 2 * Math.PI * 44;
    if (progressRef.current) {
      progressRef.current.style.strokeDashoffset = String(c);
    }

    const target = activeCase.win_probability;
    const tl = gsap.timeline({
      onComplete: () => {
        setRunning(false);
        setDone(true);
        setStepIdx(3);
        try {
          confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 },
            colors: ['#0284c7', '#10b981', '#f59e0b'] });
        } catch { /* noop */ }
      }
    });

    tl.to({}, { duration: 0.85, onStart: () => setStepIdx(0) })
      .to({}, { duration: 1.0,  onStart: () => setStepIdx(1) })
      .to({}, { duration: 1.1,  onStart: () => { setStepIdx(2); setActiveTab('evidence'); } })
      .to({}, { duration: 0.85, onStart: () => { setStepIdx(3); setActiveTab('dossier'); } });

    const obj = { v: 0 };
    tl.to(obj, {
      v: target, duration: 1.9, ease: 'power3.out',
      onUpdate: () => {
        const r = Math.round(obj.v);
        setWinRate(r);
      },
    }, '-=1.5');
  };

  const switchCase = (idx: number) => {
    setCaseIdx(idx);
    setStepIdx(3);
    setDone(true);
    setRunning(false);
    setActiveTab('stream');
    setWinRate(SAMPLE_CASES[idx].win_probability);
  };

  return (
    <section id="agent-sim" ref={sectionRef} className="relative py-20 md:py-28 px-6 md:px-12 max-w-[1380px] mx-auto overflow-hidden">
      {/* ── Diagonal OVERTURN background watermark ── */}
      <DiagonalWatermark text="OVERTURN" opacity={0.03} rotation={-13} />

      {/* Section overline */}
      <div className="relative z-10 flex items-center gap-3 mb-4">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="label-mono text-[#8d96b0]">Live Agent Orchestration</span>
        <span className="label-mono text-[#8d96b0]">·</span>
        <span className="label-mono" style={{ color: 'var(--brand)' }}>4-Step Autonomous Pipeline</span>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="display-lg text-[#0b0e18] max-w-xl">
            Simulate the Autonomous Appeal Engine
          </h2>
          <p className="text-slate-600 text-sm mt-2 font-medium">
            Test the multi-step verification pipeline with pre-loaded clinical scenarios or upload your custom dispute.
          </p>
        </div>
        <button
          onClick={onOpenRecoveryModal}
          className="btn-primary flex-shrink-0 self-start md:self-auto"
        >
          Upload My Denial Letter
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main cockpit card */}
      <div
        ref={containerRef}
        className="relative z-10 glass-card-deep rounded-3xl overflow-hidden border border-white/80"
        style={{ boxShadow: '0 4px 6px rgba(11,14,24,0.04), 0 24px 60px rgba(11,14,24,0.09), 0 60px 120px rgba(2,132,199,0.05)' }}
      >
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3">
            {/* Traffic light dots */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              {running ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
              <span className="label-mono text-[#4b5470]">
                {running ? 'AGENT EXECUTING PIPELINE...' : done ? 'PIPELINE COMPLETE — DOSSIER READY' : 'OVERTURN DEFENSE ENGINE · IDLE'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={runSimulation}
              disabled={running}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                running
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'btn-primary !text-sm !px-4 !py-2 !rounded-xl'
              }`}
            >
              {running ? <><RefreshCw className="w-4 h-4 animate-spin text-slate-400" /> Analysing…</> : <><Play className="w-3.5 h-3.5 fill-white" /> Run Simulation</>}
            </button>
            <button
              onClick={onOpenRecoveryModal}
              className="btn-ghost !text-sm !px-3.5 !py-2 !rounded-xl"
            >
              My Claim →
            </button>
          </div>
        </div>

        {/* Case selector tabs */}
        <div className="px-6 pt-4 pb-2">
          <span className="label-mono text-[#8d96b0] block mb-2">Select verified real-world case:</span>
          <div className="flex flex-col sm:flex-row gap-2">
            {SAMPLE_CASES.map((c, i) => (
              <button
                key={c.id}
                onClick={() => switchCase(i)}
                className={`flex-1 text-left px-4 py-3 rounded-xl border transition-all ${
                  caseIdx === i
                    ? 'bg-white border-sky-300 shadow-md ring-2 ring-sky-500/10'
                    : 'bg-slate-50/60 border-slate-200/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="label-mono text-[#8d96b0]">Case 0{i+1}</span>
                  <span className="label-mono text-emerald-700">
                    {c.win_probability}% win
                  </span>
                </div>
                <div className="font-bold text-sm text-[#0b0e18] truncate">
                  {c.patient_name} — {c.insurer_name}
                </div>
                <div className="label-mono text-[#8d96b0] mt-0.5 truncate">
                  {c.formatted_amount}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Repudiation strip */}
        <div className="mx-6 mb-4 mt-2 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: 'var(--rose-light)', border: '1px solid rgba(244,63,94,0.2)' }}>
          <div>
            <span className="label-mono text-[#be123c]">INSURER REPUDIATION · {activeCase.denial_code}</span>
            <p className="text-xs font-semibold text-[#1e2535] mt-0.5 max-w-lg">{activeCase.alleged_reason}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="label-mono text-[#8d96b0]">At stake</div>
            <div className="text-lg font-black tabular text-[#0b0e18]">{activeCase.formatted_amount}</div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 pb-6">

          {/* Left: Thought pipeline + tabs */}
          <div className="lg:col-span-7">
            {/* Tab selector */}
            <div className="flex gap-1.5 p-1 bg-slate-100/80 rounded-xl mb-4 w-fit">
              {(['stream', 'evidence', 'dossier'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg label-mono transition-all ${
                    activeTab === tab
                      ? 'bg-white shadow-sm text-[#0b0e18] border border-slate-200/70'
                      : 'text-[#8d96b0] hover:text-[#4b5470]'
                  }`}
                >
                  {tab === 'stream' ? '01 · Pipeline' : tab === 'evidence' ? '02 · Smoking Gun' : '03 · Dossier'}
                </button>
              ))}
            </div>

            {/* TAB: Pipeline */}
            {activeTab === 'stream' && (
              <div className="space-y-2.5">
                {activeCase.steps.map((step, i) => {
                  const isCurrent = stepIdx === i && running;
                  const isPast    = stepIdx > i || (done && !running);
                  return (
                    <div key={i} className={`rounded-xl border p-3.5 transition-all ${
                      isCurrent ? 'border-sky-400 bg-sky-50/60 ring-2 ring-sky-400/20'
                      : isPast  ? 'border-emerald-200/60 bg-emerald-50/30'
                      :           'border-slate-200/50 bg-white/40 opacity-50'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {isPast ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          : isCurrent ? <RefreshCw className="w-4 h-4 text-sky-600 animate-spin" />
                          : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="label-mono text-[#0b0e18]">Phase 0{i+1} · {step.title}</span>
                            {isCurrent && <span className="label-mono text-sky-700 animate-pulse">EXECUTING</span>}
                            {isPast    && <span className="label-mono text-emerald-700">VERIFIED</span>}
                          </div>
                          <p className="text-xs text-[#4b5470] mt-0.5 font-medium">{step.detail}</p>
                          <div className="mt-1.5 font-mono text-[10px] text-[#8d96b0] bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200/60 truncate">
                            &gt;&nbsp;{step.telemetry}
                          </div>
                        </div>
                        <span className="label-mono text-[#c9cedc] flex-shrink-0">{step.durationMs}ms</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB: Smoking Gun */}
            {activeTab === 'evidence' && (
              <div className="rounded-2xl p-5 space-y-3.5"
                style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="label-mono text-emerald-900">THE SMOKING GUN — CLINICAL CONTRADICTION</span>
                  </div>
                  <span className="label-mono text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                    PROVEN
                  </span>
                </div>
                <div className="bg-white/90 rounded-xl p-4 border border-emerald-100">
                  <div className="label-mono text-[#8d96b0] mb-1">SOURCE · {activeCase.smoking_gun.source}</div>
                  <p className="text-sm font-semibold text-[#0b0e18] leading-relaxed">
                    "{activeCase.smoking_gun.summary}"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/80 rounded-lg p-2.5 border border-emerald-100">
                    <div className="label-mono text-[#8d96b0] mb-0.5">Clinical Coding</div>
                    <div className="font-mono font-semibold text-[#1e2535] text-[11px]">{activeCase.smoking_gun.clinical_citation}</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2.5 border border-emerald-100">
                    <div className="label-mono text-[#8d96b0] mb-0.5">Binding Statute</div>
                    <div className="font-mono font-semibold text-emerald-700 text-[11px]">{activeCase.key_statute}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Dossier */}
            {activeTab === 'dossier' && (
              <div className="rounded-2xl p-5 space-y-3.5 bg-[#0b0e18]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="label-mono text-slate-300">STATUTORY APPEAL PACKAGE</span>
                  </div>
                  <span className="label-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">
                    15-DAY SLA ENFORCED
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed space-y-1">
                  <div className="text-slate-600">// FORMAL DEMAND — IRDAI MASTER CIRCULAR 2024</div>
                  <div>TO: Claims Redressal Officer, {activeCase.insurer_name}</div>
                  <div>RE: Unlawful Repudiation — Claim Ref #{activeCase.id.toUpperCase()}</div>
                  <div className="text-emerald-400 pt-1">
                    LEGAL MANDATE: Repudiation under {activeCase.denial_code} is void ab initio under Section 45 Insurance Act 1938.
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 label-mono text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                    HIPAA / DISHA Compliant
                  </div>
                  <button
                    onClick={() => alert(`Appeal docket ready for ${activeCase.patient_name} — ${activeCase.formatted_amount}. SLA clock started.`)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0b0e18] font-bold text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Legal Dossier
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Win Probability Gauge */}
          <div className="lg:col-span-5 rounded-2xl p-5 flex flex-col justify-between"
            style={{ background: 'linear-gradient(155deg, #fff 0%, #f6f7f9 100%)', border: '1px solid rgba(203,210,228,0.6)' }}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="label-mono text-[#8d96b0]">OVERTURN PROBABILITY</span>
                <span className="label-mono text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                  CONFIDENCE: HIGH
                </span>
              </div>

              {/* Circular SVG gauge */}
              <div className="flex items-center justify-center py-4">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" className="ring-track" strokeWidth="7" fill="transparent" stroke="currentColor" />
                    <circle
                      ref={progressRef}
                      cx="50" cy="50" r="44"
                      className="ring-fill"
                      strokeWidth="7" fill="transparent"
                      strokeLinecap="round"
                      stroke="#10b981"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[2.6rem] font-black tabular text-[#0b0e18] leading-none">{winRate}%</span>
                    <span className="label-mono text-emerald-600 mt-1">Win Rate</span>
                  </div>
                </div>
              </div>

              <p className="text-xs font-medium text-[#4b5470] text-center mb-4">
                {activeCase.expected_verdict}
              </p>

              {/* Factor breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-200/70">
                <span className="label-mono text-[#8d96b0] block">Key Reversal Drivers</span>
                {[
                  { label: 'Statutory Shield (Sec 45)', weight: '+40%' },
                  { label: 'Clinical Chart Evidence',   weight: '+35%' },
                  { label: 'IRDAI 15-Day SLA',          weight: '+20%' },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-white/80 border border-slate-100">
                    <span className="font-medium text-[#4b5470]">{f.label}</span>
                    <span className="label-mono text-emerald-700 font-bold">{f.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4">
              <button
                onClick={onOpenRecoveryModal}
                className="btn-primary w-full justify-center group"
              >
                Get This For My Claim
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <p className="label-mono text-[#8d96b0] text-center mt-2">
                Free 60-sec audit · No sign-up
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
