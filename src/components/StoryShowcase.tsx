import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { WorkflowSection } from './WorkflowSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { DiagonalWatermark } from './DiagonalWatermark';

interface StoryShowcaseProps {
  activeScene?: number;
  onSceneChange?: (index: number) => void;
  onOpenRecoveryModal: () => void;
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
}

interface StatCard {
  stat: string;
  title: string;
  sub: string;
}

interface SceneItem {
  type: 'story' | 'component';
  phase: string;
  eyebrow?: string;
  titlePrefix?: string;
  titleMid?: string;
  titleHighlight?: string;
  titleGradient?: string;
  body?: string;
  image?: string;
  accent: string;
  bloomColor: string;
  ambientGradient: string;
  primaryBtnText?: string;
  secondaryBtnText?: string;
  cards?: StatCard[];
  component?: React.FC<any>;
}

const SCENES: SceneItem[] = [
  {
    type: 'story',
    phase: 'The Denial',
    eyebrow: 'INTERACTIVE CLAIM DEFENSE & REVERSAL GUIDE',
    titlePrefix: 'Your Insurance',
    titleMid: 'Company Said No.',
    titleHighlight: 'We Make Them Pay.',
    titleGradient: 'from-purple-600 via-violet-600 to-indigo-600',
    body: 'An automated rejection letter arrives right when you need support the most. Over 80% of families abandon their claims without knowing they have a statutory legal right to dispute and recover every rupee.',
    image: '/story-scene-1.jpg',
    accent: '#0d9488',
    bloomColor: 'rgba(147, 51, 234, 0.45)',
    ambientGradient: 'radial-gradient(ellipse 90% 80% at 75% 20%, rgba(147, 51, 234, 0.32) 0%, rgba(168, 85, 247, 0.18) 45%, rgba(192, 132, 252, 0.06) 70%, transparent 85%), radial-gradient(ellipse 70% 70% at 15% 85%, rgba(20, 184, 166, 0.22) 0%, transparent 65%)',
    primaryBtnText: 'Audit My Denial Free',
    secondaryBtnText: 'See How It Works',
    cards: [
      { stat: '42%', title: 'Medical Necessity', sub: 'Algorithm overrides treating surgeon judgment' },
      { stat: '28%', title: 'Pre-Existing Bogus', sub: 'Baseless exclusion of acute hospital care' },
      { stat: '18%', title: 'Opaque Tariff Caps', sub: 'Unapproved cuts on ICU, room rent & meds' },
      { stat: '80%+', title: 'Surrendered Claims', sub: 'Families walk away unaware of legal rights' },
    ],
  },
  {
    type: 'story',
    phase: 'OverTurn Steps In',
    eyebrow: 'AUTONOMOUS CLINICAL REASONING ENGINE',
    titlePrefix: 'OverTurn Steps In.',
    titleMid: 'Every Record Audited.',
    titleHighlight: 'Zero Confusion.',
    titleGradient: 'from-teal-600 via-cyan-600 to-blue-600',
    body: 'OverTurn reads every page — discharge summaries, operative notes, and policy clauses — extracting the exact clinical proof the insurer chose to ignore.',
    image: '/story-scene-2.jpg',
    accent: '#0d9488',
    bloomColor: 'rgba(13, 148, 136, 0.48)',
    ambientGradient: 'radial-gradient(ellipse 90% 80% at 75% 20%, rgba(20, 184, 166, 0.36) 0%, rgba(6, 182, 212, 0.22) 45%, rgba(45, 212, 191, 0.08) 70%, transparent 85%), radial-gradient(ellipse 70% 70% at 15% 85%, rgba(14, 165, 233, 0.24) 0%, transparent 65%)',
    primaryBtnText: 'Start Clinical Audit',
    secondaryBtnText: 'Explore Autonomous Flow',
    cards: [
      { stat: '100% Ingest', title: 'Full Record Audit', sub: 'Scans summaries, OT notes & lab vitals' },
      { stat: 'Smoking Gun', title: 'Hidden Proof Isolated', sub: 'Extracts exact diagnostic proof skipped' },
      { stat: 'IRDAI Bound', title: 'Statutory Directives', sub: 'Cites Master Circular & Section 45 rules' },
      { stat: 'Doctor-Grade', title: 'Physician Dossier', sub: 'Airtight appeal packet ready in 15 mins' },
    ],
  },
  {
    type: 'story',
    phase: 'Claim Overturned',
    eyebrow: 'STATUTORY APPEAL & RESTORED RIGHTS',
    titlePrefix: 'Claim Overturned.',
    titleMid: 'Hospital Bills Paid.',
    titleHighlight: 'Peace Restored.',
    titleGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    body: 'Armed with statutory IRDAI mandates and clinical proof, wrongful denials are reversed and your hospital bills are paid. The financial burden is gone.',
    image: '/story-scene-3.jpg',
    accent: '#059669',
    bloomColor: 'rgba(16, 185, 129, 0.48)',
    ambientGradient: 'radial-gradient(ellipse 90% 80% at 75% 20%, rgba(16, 185, 129, 0.36) 0%, rgba(52, 211, 153, 0.22) 45%, rgba(110, 231, 183, 0.08) 70%, transparent 85%), radial-gradient(ellipse 70% 70% at 15% 85%, rgba(20, 184, 166, 0.24) 0%, transparent 65%)',
    primaryBtnText: 'Recover Withheld Funds',
    secondaryBtnText: 'View Step-by-Step Guide',
    cards: [
      { stat: '89.4%', title: 'Overturn Rate', sub: 'Legitimate rejections successfully reversed' },
      { stat: '8 Days', title: 'Average Reversal', sub: 'Mandatory 15-day statutory enforcement' },
      { stat: '₹4.8 Cr+', title: 'Claims Recovered', sub: 'Disallowed funds credited to patient accounts' },
      { stat: '100% Free', title: 'Zero Upfront Risk', sub: 'Patients never pay out-of-pocket for audits' },
    ],
  },
  {
    type: 'component',
    phase: 'How It Works',
    component: WorkflowSection,
    accent: '#0284c7',
    bloomColor: 'rgba(14, 165, 233, 0.42)',
    ambientGradient: 'radial-gradient(ellipse 90% 80% at 75% 20%, rgba(14, 165, 233, 0.34) 0%, rgba(99, 102, 241, 0.20) 45%, transparent 80%), radial-gradient(ellipse 70% 70% at 15% 85%, rgba(6, 182, 212, 0.22) 0%, transparent 65%)',
  },
  {
    type: 'component',
    phase: 'Outcomes',
    component: TestimonialsSection,
    accent: '#7c3aed',
    bloomColor: 'rgba(139, 92, 246, 0.42)',
    ambientGradient: 'radial-gradient(ellipse 90% 80% at 75% 20%, rgba(139, 92, 246, 0.34) 0%, rgba(217, 70, 239, 0.20) 45%, transparent 80%), radial-gradient(ellipse 70% 70% at 15% 85%, rgba(99, 102, 241, 0.20) 0%, transparent 65%)',
  },
  {
    type: 'component',
    phase: 'FAQ',
    component: FAQSection,
    accent: '#0d9488',
    bloomColor: 'rgba(20, 184, 166, 0.42)',
    ambientGradient: 'radial-gradient(ellipse 90% 80% at 75% 20%, rgba(20, 184, 166, 0.34) 0%, rgba(6, 182, 212, 0.20) 45%, transparent 80%), radial-gradient(ellipse 70% 70% at 15% 85%, rgba(16, 185, 129, 0.20) 0%, transparent 65%)',
  },
];

export const StoryShowcase: React.FC<StoryShowcaseProps> = ({ 
  activeScene,
  onSceneChange,
  onOpenRecoveryModal,
  onOpenPrivacyModal,
  onOpenTermsModal
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalScene, setInternalScene] = useState(0);
  const currentScene = activeScene !== undefined ? activeScene : internalScene;
  const sceneRef = useRef(currentScene);
  sceneRef.current = currentScene;
  const isAnimating = useRef(false);

  const goToScene = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= SCENES.length || isAnimating.current) return;
    isAnimating.current = true;
    sceneRef.current = targetIndex;
    if (onSceneChange) {
      onSceneChange(targetIndex);
    } else {
      setInternalScene(targetIndex);
    }

    // 650ms lock: prevents runaway multiple slide jumps from trackpad inertia
    setTimeout(() => {
      isAnimating.current = false;
    }, 650);
  };

  useEffect(() => {
    // Wheel event listener with passive: false to cancel native scroll and prevent screen shaking
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 18) return; // filter tiny trackpad micro-ticks

      if (e.deltaY > 0) {
        goToScene(sceneRef.current + 1);
      } else {
        goToScene(sceneRef.current - 1);
      }
    };

    // Touch event listeners for mobile swipe
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY - touchEndY;
      if (Math.abs(delta) < 40) return;

      if (delta > 0) {
        goToScene(sceneRef.current + 1);
      } else {
        goToScene(sceneRef.current - 1);
      }
    };

    // Keyboard navigation (ArrowDown / ArrowUp)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToScene(sceneRef.current + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToScene(sceneRef.current - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // GSAP animation on scene transition
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const activeEl = containerRef.current?.querySelector(`[data-scene-idx="${currentScene}"]`);
      if (activeEl) {
        const eyebrow = activeEl.querySelector('.gsap-eyebrow');
        const headline = activeEl.querySelector('.gsap-headline');
        const body = activeEl.querySelector('.gsap-body');
        const buttons = activeEl.querySelector('.gsap-buttons');
        const cards = activeEl.querySelectorAll('.gsap-card');
        const image = activeEl.querySelector('.gsap-image');

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (eyebrow) {
          tl.fromTo(eyebrow, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 }, 0);
        }
        if (headline) {
          tl.fromTo(headline, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, 0.04);
        }
        if (body) {
          tl.fromTo(body, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, 0.1);
        }
        if (buttons) {
          tl.fromTo(buttons, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 0.16);
        }
        if (cards && cards.length > 0) {
          tl.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.45 }, 0.22);
        }
        if (image) {
          tl.fromTo(image, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6 }, 0.08);
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [currentScene]);

  const handleDotClick = (index: number) => {
    goToScene(index);
  };

  return (
    <section
      id="unified-story"
      className="relative w-full h-screen overflow-hidden bg-[#f8fafc] text-slate-900 select-none"
    >
      {/* ── Continuous Kinetic Marquee Watermark Overlay ── */}
      <DiagonalWatermark opacity={0.035} rotation={-12} />

      {/* ── Dynamic Atmospheric Glowing Backgrounds ── */}
      {SCENES.map((s, i) => (
        <div
          key={`bg-${i}`}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out pointer-events-none ${
            currentScene === i ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: s.ambientGradient,
          }}
        >
          {/* Main radiant ambient glow bloom behind the scene */}
          <div 
            className="absolute top-1/4 right-[8%] w-[65vw] h-[65vw] rounded-full blur-[100px] opacity-85 transition-all duration-1000 animate-glow-breathe"
            style={{
              background: `radial-gradient(circle, ${s.bloomColor} 0%, ${s.bloomColor.replace(/[\d\.]+\)$/, '0.2)')} 45%, transparent 75%)`
            }}
          />

          {/* Secondary ambient glow bloom on bottom left */}
          <div 
            className="absolute -bottom-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[90px] opacity-65 transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${s.bloomColor.replace(/[\d\.]+\)$/, '0.35)')} 0%, transparent 70%)`
            }}
          />
        </div>
      ))}

      {/* ── Scene Contents Container ── */}
      <div ref={containerRef} className="relative w-full h-full">
        {SCENES.map((s, i) => {
          if (s.type === 'story') {
            return (
              <div
                key={`scene-${i}`}
                data-scene-idx={i}
                className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-500 ease-out ${
                  currentScene === i ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Aligned with Navbar: max-w-7xl mx-auto px-6 md:px-12 */}
                <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                  {/* Left Side: Direct Content */}
                  <div className="w-full lg:w-[48%] z-10 flex flex-col justify-center">
                    {/* Eyebrow */}
                    <div className="gsap-eyebrow flex items-center gap-2.5 mb-4">
                      <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-emerald-500" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                        {s.eyebrow}
                      </span>
                    </div>

                    {/* H1 Headline with purple emphasis for Story 1 */}
                    <h1 className="gsap-headline text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-slate-900 mb-5">
                      {s.titlePrefix} <br />
                      {s.titleMid} <br />
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${s.titleGradient}`}>
                        {s.titleHighlight}
                      </span>
                    </h1>

                    {/* Subtitle explanation */}
                    <p className="gsap-body text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-medium max-w-xl">
                      {s.body}
                    </p>

                    {/* Varied CTA Buttons across stories */}
                    <div className="gsap-buttons flex flex-wrap items-center gap-3.5 mb-8">
                      <button
                        onClick={onOpenRecoveryModal}
                        className="px-7 py-3.5 rounded-full text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg bg-teal-600 hover:bg-teal-700 shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <span>{s.primaryBtnText || 'Audit My Denial Free'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => goToScene(3)}
                        className="px-6 py-3.5 rounded-full border border-slate-200 bg-white/80 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all shadow-sm cursor-pointer hover:border-slate-300"
                      >
                        {s.secondaryBtnText || 'How It Works'}
                      </button>
                    </div>

                    {/* 4 Cards Grid */}
                    {s.cards && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        {s.cards.map((card, ci) => (
                          <div
                            key={ci}
                            className="gsap-card bg-white/85 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                          >
                            <div className="text-lg sm:text-xl font-black text-slate-900 mb-1 tracking-tight">
                              {card.stat}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 leading-tight mb-1">
                                {card.title}
                              </div>
                              <div className="text-[11px] text-slate-500 leading-snug font-normal">
                                {card.sub}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Full-size crisp image */}
                  <div className="gsap-image hidden lg:block w-[48%] h-[60vh] lg:h-[65vh] max-h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-300/60 border-4 border-white/90 relative group shrink-0">
                    <img 
                      src={s.image} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt="" 
                    />
                  </div>
                </div>
              </div>
            );
          } else if (s.type === 'component' && s.component) {
            const Component = s.component;
            return (
              <div
                key={`scene-${i}`}
                data-scene-idx={i}
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-out ${
                  currentScene === i ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <Component 
                  onOpenPrivacyModal={onOpenPrivacyModal}
                  onOpenTermsModal={onOpenTermsModal}
                />
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* ── Vertical Dots Navigation ── */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2.5">
        {SCENES.map((s, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            title={s.phase}
            className="group relative flex items-center justify-center p-2 cursor-pointer"
          >
            <div
              className="rounded-full transition-all duration-400 ease-out"
              style={{
                width: currentScene === i ? 6 : 4,
                height: currentScene === i ? 24 : 4,
                backgroundColor: currentScene === i ? '#0d9488' : 'rgba(0,0,0,0.18)',
                boxShadow: currentScene === i ? '0 0 12px rgba(13, 148, 136, 0.5)' : 'none',
              }}
            />
            {/* Tooltip on hover */}
            <span className="absolute right-8 px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
              {s.phase}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
