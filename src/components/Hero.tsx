import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play, TrendingUp, ShieldCheck, Zap, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenRecoveryModal: () => void;
}

/* ─── Floating live agent activity cards data ─── */
const FLOAT_CARDS = [
  {
    id: 'card-a',
    position: 'top-[14%] right-[2%] md:right-[4%]',
    floatClass: 'float-b',
    delay: 0,
    content: {
      label: 'AUDIT COMPLETE',
      labelColor: 'text-emerald-700',
      labelBg: 'bg-emerald-50 border-emerald-200',
      title: 'Section 45 Moratorium Active',
      sub: 'Star Health · Policy 4Y+',
      progress: 95,
      progressColor: 'bg-emerald-500',
      badge: '₹1,85,000 Defended',
      badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    },
  },
  {
    id: 'card-b',
    position: 'top-[48%] right-[0%] md:right-[2%]',
    floatClass: 'float-a',
    delay: 0.15,
    content: {
      label: 'AGENT RUNNING',
      labelColor: 'text-amber-700',
      labelBg: 'bg-amber-50 border-amber-200',
      title: 'Clinical Chart Cross-Audit',
      sub: 'Scanning Kokilaben MRI · Phase 3/4',
      progress: 72,
      progressColor: 'bg-amber-500',
      badge: 'ICD-10 M51.26 · CPT 63030',
      badgeColor: 'text-slate-700 bg-slate-50 border-slate-200',
    },
  },
  {
    id: 'card-c',
    position: 'bottom-[14%] right-[2%] md:right-[5%]',
    floatClass: 'float-c',
    delay: 0.3,
    content: {
      label: 'DOSSIER READY',
      labelColor: 'text-brand-700',
      labelBg: 'bg-sky-50 border-sky-200',
      title: 'Appeal Package Generated',
      sub: 'IRDAI 15-Day SLA watchdog ON',
      progress: 100,
      progressColor: 'bg-sky-500',
      badge: '1-Click Ombudsman Escalation',
      badgeColor: 'text-sky-800 bg-sky-50 border-sky-200',
    },
  },
] as const;

/* ─── Insurer trust strip ─── */
const INSURERS = [
  'Star Health', 'ICICI Lombard', 'Care Health',
  'HDFC ERGO',  'Niva Bupa',    'Tata AIG',
  'Max Bupa',   'New India',    'Oriental',
  'Religare',
];

/* ─── Agent Step mini indicators ─── */
const STEPS = [
  { n: '01', label: 'Denial Ingestion & OCR' },
  { n: '02', label: 'Policy Guideline Mapping' },
  { n: '03', label: 'Clinical Chart Smoking Gun' },
  { n: '04', label: 'Statutory Appeal Dossier' },
];

export const Hero: React.FC<HeroProps> = ({ onOpenRecoveryModal }) => {
  const heroRef       = useRef<HTMLElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const subRef        = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const metricsRef    = useRef<HTMLDivElement>(null);
  const cardsRef      = useRef<(HTMLDivElement | null)[]>([]);
  const watermarkRef  = useRef<HTMLDivElement>(null);
  const stepsRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard: SSR safety
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      /* ── Master entrance timeline ── */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Headline lines stagger up
      // Manually split headline into two spans (no SplitText needed)
      const lines = headlineRef.current
        ? headlineRef.current.querySelectorAll('.hero-line')
        : [];

      gsap.set(lines, { y: 60, autoAlpha: 0 });
      gsap.set(subRef.current, { y: 24, autoAlpha: 0 });
      gsap.set(ctaRef.current, { y: 20, autoAlpha: 0 });
      gsap.set(metricsRef.current, { y: 16, autoAlpha: 0 });
      gsap.set(stepsRef.current, { y: 16, autoAlpha: 0 });
      gsap.set(cardsRef.current, { x: 40, autoAlpha: 0, scale: 0.95 });
      gsap.set(watermarkRef.current, { autoAlpha: 0, y: 20 });

      tl
        .to(lines, {
          y: 0, autoAlpha: 1,
          duration: 1.05,
          stagger: 0.18,
        })
        .to(subRef.current, {
          y: 0, autoAlpha: 1,
          duration: 0.85,
        }, '-=0.6')
        .to(ctaRef.current, {
          y: 0, autoAlpha: 1,
          duration: 0.7,
        }, '-=0.55')
        .to(metricsRef.current, {
          y: 0, autoAlpha: 1,
          duration: 0.7,
        }, '-=0.5')
        .to(stepsRef.current, {
          y: 0, autoAlpha: 1,
          duration: 0.7,
        }, '-=0.45')
        .to(cardsRef.current, {
          x: 0, autoAlpha: 1, scale: 1,
          duration: 0.9,
          stagger: 0.14,
          ease: 'back.out(1.4)',
        }, '-=0.7')
        .to(watermarkRef.current, {
          autoAlpha: 1, y: 0,
          duration: 1.6,
          ease: 'power2.out',
        }, '-=0.8');

      /* ── Mouse parallax on floating cards ── */
      const handleMouseMove = (e: MouseEvent) => {
        if (!heroRef.current) return;
        const { width, height, left, top } =
          heroRef.current.getBoundingClientRect();
        const cx = (e.clientX - left) / width - 0.5;  // -0.5 to +0.5
        const cy = (e.clientY - top)  / height - 0.5;

        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const depth = [12, 18, 10][i] ?? 12;
          gsap.to(card, {
            x: cx * depth,
            y: cy * depth,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });

        // subtle watermark drift
        gsap.to(watermarkRef.current, {
          x: cx * -6,
          y: cy * -4,
          duration: 2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      if (heroRef.current) {
        heroRef.current.addEventListener('mousemove', handleMouseMove);
      }
      return () => {
        heroRef.current?.removeEventListener('mousemove', handleMouseMove);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero-canvas noise-overlay relative min-h-screen flex flex-col pt-16 overflow-hidden"
    >
      {/* ── Kinetic background watermark ── */}
      <div
        ref={watermarkRef}
        className="hero-watermark select-none pointer-events-none"
        aria-hidden="true"
      >
        OVERTURN
      </div>

      {/* ── Main Content Grid ── */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-6 md:px-12 lg:px-16 pt-20 pb-12 max-w-[1380px] mx-auto w-full flex-1">

        {/* ── LEFT: Headline + CTA ── */}
        <div className="flex-1 max-w-[640px] lg:pr-10">

          {/* Status pill — editorial, no bubble badge */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="live-dot"></div>
            <span className="label-mono text-[#4b5470]">
              Autonomous AI Defense Engine · Track 01 — Agentic AI
            </span>
          </div>

          {/* Headline — 2 lines, massive type */}
          <h1
            ref={headlineRef}
            className="display-xl text-[#0b0e18] mb-6"
          >
            <span className="hero-line block">
              Your insurer said <em className="not-italic" style={{ color: 'var(--rose)' }}>No.</em>
            </span>
            <span className="hero-line block mt-1" style={{ color: 'var(--brand)' }}>
              We fight back.
            </span>
            <span className="hero-line block text-[#0b0e18] mt-1">
              And win.
            </span>
          </h1>

          {/* Sub-headline — concise, punchy */}
          <p
            ref={subRef}
            className="text-[1.05rem] leading-[1.7] text-[#4b5470] max-w-[520px] mb-8"
          >
            <strong className="text-[#1e2535]">80% of claim denials are legally overturnable.</strong> Overturn is an autonomous agent that scans your denial letter, finds the clinical proof your insurer ignored, and generates an airtight statutory appeal — in seconds, not weeks.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-start gap-3 mb-10">
            <button
              onClick={onOpenRecoveryModal}
              className="btn-primary !text-[0.95rem] !px-7 !py-3.5 group"
            >
              Audit My Claim Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="btn-ghost !text-[0.95rem] !px-5 !py-3.5 group"
              onClick={() => {
                document.getElementById('agent-sim')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Live Defence
              <span
                className="label-mono px-2 py-0.5 rounded-full"
                style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}
              >
                95% Win Rate
              </span>
            </button>
          </div>

          {/* Key metrics row */}
          <div
            ref={metricsRef}
            className="grid grid-cols-3 gap-4 pt-7 border-t border-slate-200/80"
          >
            {[
              { value: '₹4.8Cr', label: 'Wrongful Denials Countered' },
              { value: '91.4%',  label: 'Successful Overturn Rate' },
              { value: '15 Day', label: 'IRDAI Statutory SLA Enforced' },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-[1.6rem] font-black tracking-tight text-[#0b0e18] tabular">
                  {m.value}
                </div>
                <div className="label-mono text-[#8d96b0] mt-0.5 leading-snug">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Floating Agent Cards stack ── */}
        <div className="relative w-full max-w-[340px] lg:max-w-[380px] flex-shrink-0 min-h-[520px] lg:min-h-[620px]">
          {FLOAT_CARDS.map((card, idx) => (
            <div
              key={card.id}
              ref={el => { cardsRef.current[idx] = el; }}
              className={`absolute ${card.position} w-[280px] sm:w-[300px] ${card.floatClass} glass-card rounded-2xl p-4`}
            >
              {/* Card label */}
              <div className={`label-mono flex items-center gap-1.5 px-2 py-1 rounded-full border w-fit mb-3 ${card.content.labelBg} ${card.content.labelColor}`}>
                {card.content.label === 'AGENT RUNNING' ? (
                  <span className="amber-dot" style={{ width: 6, height: 6 }} />
                ) : (
                  <span className="live-dot" style={{ width: 6, height: 6 }} />
                )}
                {card.content.label}
              </div>

              {/* Card headline */}
              <div className="font-bold text-[0.88rem] text-[#0b0e18] leading-snug mb-1">
                {card.content.title}
              </div>
              <div className="label-mono text-[#8d96b0] mb-3">
                {card.content.sub}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full ${card.content.progressColor} rounded-full transition-all`}
                  style={{ width: `${card.content.progress}%` }}
                />
              </div>

              {/* Badge */}
              <span
                className={`label-mono px-2 py-0.5 rounded-full border text-[10px] ${card.content.badgeColor}`}
              >
                {card.content.badge}
              </span>
            </div>
          ))}

          {/* Centre anchor: static agent status card */}
          <div
            className="absolute top-[33%] left-[-5%] sm:left-[-8%] w-[230px] glass-card-deep rounded-2xl p-4 shadow-lg"
            style={{ zIndex: 5 }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              {/* Mini animated shield */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--ink-900)' }}
              >
                <ShieldCheck className="w-5 h-5" style={{ color: '#34d399' }} />
              </div>
              <div>
                <div className="font-bold text-[0.82rem] text-[#0b0e18]">Autonomous Agent</div>
                <div className="label-mono text-[#8d96b0]">Phase 4 · Dossier Synthesis</div>
              </div>
            </div>
            {/* Steps mini ladder */}
            <div
              ref={stepsRef}
              className="space-y-2"
            >
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      i < 3 ? 'bg-emerald-500' : 'bg-[#0b0e18]'
                    }`}
                  >
                    {i < 3 ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <Zap className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span
                    className="label-mono leading-none"
                    style={{ color: i < 3 ? '#4b5470' : '#0b0e18', fontWeight: i === 3 ? 700 : 600 }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust bar: scrolling insurer strip ── */}
      <div className="relative z-10 w-full border-t border-slate-200/80 bg-white/60 backdrop-blur-sm py-4 mt-auto overflow-hidden">
        <div className="flex items-center gap-4 mb-2 px-8">
          <span className="label-mono text-[#8d96b0] flex-shrink-0">Covers disputes with</span>
          <hr className="flex-1 section-divider" />
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...INSURERS, ...INSURERS].map((ins, i) => (
              <div
                key={`${ins}-${i}`}
                className="flex items-center gap-2 mx-8 text-sm font-bold text-[#4b5470] whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'var(--brand)' }}
                />
                {ins}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
