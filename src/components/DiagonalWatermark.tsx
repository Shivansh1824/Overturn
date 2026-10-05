import React from 'react';

interface DiagonalWatermarkProps {
  text?: string;
  opacity?: number;
  rotation?: number;
  className?: string;
  color?: string;
}

export const DiagonalWatermark: React.FC<DiagonalWatermarkProps> = ({
  text,
  opacity = 0.045,
  rotation = -12,
  className = '',
  color,
}) => {
  const baseText = text || 'OVERTURN';
  const textStream1 = `${baseText} · CLINICAL CLAIM DEFENSE · ${baseText} · PATIENT ADVOCACY · ${baseText} · STATUTORY REVERSAL · `;
  const textStream2 = `RECLAIM WITHHELD PAYOUTS · ${baseText} · ZERO RETENTION AUDIT · ${baseText} · DISMANTLE DENIALS · `;


  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex flex-col justify-center gap-12 sm:gap-20 ${className}`}
      aria-hidden="true"
    >
      <div 
        className="w-[200vw] -ml-[50vw] flex flex-col gap-10 transform origin-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Track 1 - drifts left */}
        <div className="flex whitespace-nowrap animate-marquee-drift">
          <span 
            className="font-black text-6xl sm:text-8xl md:text-[130px] tracking-tight uppercase select-none"
            style={{
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(15, 23, 42, 0.04)',
              opacity: opacity,
            }}
          >
            {textStream1.repeat(4)}
          </span>
        </div>

        {/* Track 2 - drifts right */}
        <div className="flex whitespace-nowrap animate-marquee-drift-reverse">
          <span 
            className="font-black text-6xl sm:text-8xl md:text-[130px] tracking-tight uppercase select-none"
            style={{
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(15, 23, 42, 0.035)',
              opacity: opacity,
            }}
          >
            {textStream2.repeat(4)}
          </span>
        </div>
      </div>
    </div>
  );
};

