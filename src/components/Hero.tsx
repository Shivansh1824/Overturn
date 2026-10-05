import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown, ShieldCheck, Scale, FileCheck } from 'lucide-react';
import { DiagonalWatermark } from './DiagonalWatermark';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenRecoveryModal: () => void;
}

const INSURERS = [
  'Star Health', 'Care Health', 'ICICI Lombard', 'HDFC ERGO',
  'Niva Bupa', 'Tata AIG', 'Max Bupa', 'New India Assurance',
  'Bajaj Allianz', 'Oriental Insurance',
];

export const Hero: React.FC<HeroProps> = ({ onOpenRecoveryModal }) => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const lines = headlineRef.current?.querySelectorAll('.hero-line') || [];

      gsap.set(lines, { y: 50, autoAlpha: 0 });
      gsap.set(subRef.current, { y: 25, autoAlpha: 0 });
      gsap.set(ctaRef.current, { y: 20, autoAlpha: 0 });
      gsap.set(metricsRef.current, { y: 16, autoAlpha: 0 });
      gsap.set(visualRef.current, { scale: 0.92, autoAlpha: 0, y: 30 });

      tl.to(lines, {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.15,
      })
        .to(
          subRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
          },
          '-=0.5'
        )
        .to(
          ctaRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
          },
          '-=0.5'
        )
        .to(
          visualRef.current,
          {
            scale: 1,
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: 'power2.out',
          },
          '-=0.7'
        )
        .to(
          metricsRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
          },
          '-=0.4'
        );

      // Subtle mouse interaction on the 3D visual container
      const handleMouseMove = (e: MouseEvent) => {
        if (!heroRef.current || !visualRef.current) return;
        const { width, height, left, top } = heroRef.current.getBoundingClientRect();
        const cx = (e.clientX - left) / width - 0.5;
        const cy = (e.clientY - top) / height - 0.5;

        gsap.to(visualRef.current, {
          rotateY: cx * 10,
          rotateX: -cy * 8,
          x: cx * 16,
          y: cy * 16,
          duration: 1.2,
          ease: 'power1.out',
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
      className="relative min-h-screen flex flex-col justify-between pt-24 pb-6 overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff]"
    >
      {/* ── Prominent Diagonal OVERTURN Background repeating across section ── */}
      <DiagonalWatermark text="OVERTURN" opacity={0.04} rotation={-14} />

      {/* Ambient color light washes */}
      <div className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-emerald-200/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none" />

      {/* ── Main Hero Content ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 my-auto py-8">
        
        {/* Left Column: Typography, Architectural Badge, and CTAs */}
        <div className="flex-1 max-w-[660px]">
          
          {/* Architectural Badge (No pulsing dots, no rounded bubble pill) */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-[11px] font-semibold tracking-wider uppercase mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Autonomous Health Insurance Appeal Strategist
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6"
          >
            <span className="hero-line block text-slate-900">
              Your insurer said <em className="not-italic text-rose-600">No.</em>
            </span>
            <span className="hero-line block mt-1.5 bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 bg-clip-text text-transparent">
              OverTurn fights back.
            </span>
            <span className="hero-line block text-slate-900 mt-1.5">
              And wins.
            </span>
          </h1>

          {/* Subtext */}
          <p
            ref={subRef}
            className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[560px] mb-8 font-medium"
          >
            Over <strong className="text-slate-900 font-bold">80% of health insurance claim repudiations are legally overturnable</strong>. OverTurn scans your rejection letter, extracts the clinical proof your insurer ignored, and generates an audit-proof statutory appeal with binding IRDAI citations.
          </p>

          {/* Action CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={onOpenRecoveryModal}
              className="btn-primary !text-sm !py-3.5 !px-7 !rounded-xl group flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-900/10 hover:shadow-teal-900/20"
            >
              <span>Audit My Denial Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-xl border border-slate-300/80 bg-white/80 hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:border-slate-400"
            >
              <span>How It Works</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* High-Impact Proof Metrics */}
          <div
            ref={metricsRef}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">₹4.8 Cr+</div>
              <div className="font-mono text-xs text-slate-500 mt-1 uppercase tracking-wider">Unlawful Denials Countered</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">91.4%</div>
              <div className="font-mono text-xs text-slate-500 mt-1 uppercase tracking-wider">Formal Appeal Win Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">15 Days</div>
              <div className="font-mono text-xs text-slate-500 mt-1 uppercase tracking-wider">Statutory IRDAI SLA</div>
            </div>
          </div>

        </div>

        {/* Right Column: High-End 3D Visual — Ultra Crisp & Uncluttered */}
        <div
          ref={visualRef}
          className="w-full max-w-[480px] lg:max-w-[520px] flex-shrink-0 flex items-center justify-center relative perspective-[1200px]"
        >
          {/* Subtle halo glow behind the 3D model */}
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/20 via-emerald-400/20 to-transparent rounded-3xl blur-3xl" />

          {/* 3D Shield Showcase Frame */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.08)] bg-white/40 backdrop-blur-md">
            <img
              src="/hero-shield-3d.jpg"
              alt="OverTurn Autonomous Claim Defense 3D Core"
              className="w-full h-full object-cover object-center select-none pointer-events-none transform transition-transform duration-700 hover:scale-105"
              loading="eager"
            />
            {/* Subtle bottom gradient tint */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white pointer-events-none">
              <div className="font-mono text-[11px] tracking-wider uppercase font-semibold text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Autonomous Precedent Engine
              </div>
              <div className="font-mono text-[10px] text-slate-300">
                IRDAI § 45 Active
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Insurer Marquee Trust Banner ── */}
      <div className="relative z-10 w-full border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-3.5 mt-4">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-6 overflow-hidden">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold shrink-0">
            Fights Denials From:
          </span>
          <div className="overflow-hidden w-full">
            <div className="marquee-track flex items-center gap-10">
              {[...INSURERS, ...INSURERS].map((ins, i) => (
                <div
                  key={`${ins}-${i}`}
                  className="flex items-center gap-2 text-xs font-bold text-slate-600 whitespace-nowrap opacity-75 hover:opacity-100 transition-opacity"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                  {ins}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
