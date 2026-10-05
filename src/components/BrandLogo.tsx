import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textSize?: string;
  variant?: 'vector' | '3d';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 38,
  className = '',
  showText = true,
  textSize = 'text-xl',
  variant = 'vector',
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* ── OT Monogram with Dynamic Reversal Sign ── */}
      {variant === '3d' ? (
        <div
          className="relative flex items-center justify-center rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-200 border border-slate-200"
          style={{ width: size, height: size }}
        >
          <img
            src="/logo-ot-mark.jpg"
            alt="OT Logo Mark"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0b0e18] via-[#161c2e] to-[#0f172a] shadow-md border border-slate-800/80 group-hover:scale-105 transition-transform duration-200 p-1"
          style={{ width: size, height: size }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ot-teal-grad" x1="12" y1="12" x2="38" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2dd4bf" />
                <stop offset="0.5" stopColor="#10b981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="ot-steel-grad" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f8fafc" />
                <stop offset="1" stopColor="#94a3b8" />
              </linearGradient>
            </defs>

            {/* Outer "O" ring with dynamic opening */}
            <path
              d="M22 6C13.163 6 6 13.163 6 22C6 30.837 13.163 38 22 38C26.5 38 30.5 36.1 33.3 33"
              stroke="url(#ot-steel-grad)"
              strokeWidth="3.6"
              strokeLinecap="round"
            />

            {/* Inner "T" letterform: Left arm + Stem */}
            <path
              d="M13 16.5H22V31"
              stroke="url(#ot-steel-grad)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right arm of "T" looping into the Reversal / Overturn sign */}
            <path
              d="M22 16.5H28C32.5 16.5 35.5 19.5 35.5 24C35.5 28.5 32 31.5 27.5 31.5H23"
              stroke="url(#ot-teal-grad)"
              strokeWidth="3.6"
              strokeLinecap="round"
            />

            {/* Reversal Arrow Tip */}
            <path
              d="M26 27.5L22 31.5L26 35.5"
              stroke="url(#ot-teal-grad)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Brand Typography: OverTurn (Capital O, Capital T) */}
      {showText && (
        <span className={`font-black tracking-tight leading-none ${textSize}`}>
          <span className="text-slate-900">Over</span>
          <span className="text-teal-600">Turn</span>
        </span>
      )}
    </div>
  );
};
