import React from 'react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
  compact?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenPrivacyModal, 
  onOpenTermsModal,
  compact = false 
}) => (
  <footer className={`w-full ${compact ? 'py-4 sm:py-5 border-t border-slate-200/60' : 'py-10 md:py-14 border-t border-slate-200/80 bg-slate-50'} text-slate-900 px-6 md:px-12`}>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
      {/* Brand & Copyright */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
        <BrandLogo size={28} textSize="text-base" />
        <span className="hidden sm:inline text-slate-300">·</span>
        <span className="text-xs text-slate-500 font-medium">
          © 2026 OverTurn Inc. All rights reserved.
        </span>
      </div>

      {/* Legal & Governance Links */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
        {onOpenPrivacyModal && (
          <button
            onClick={onOpenPrivacyModal}
            className="hover:text-slate-900 transition-colors cursor-pointer bg-transparent border-0 text-slate-500 hover:underline"
          >
            Privacy Policy
          </button>
        )}

        {onOpenTermsModal && (
          <button
            onClick={onOpenTermsModal}
            className="hover:text-slate-900 transition-colors cursor-pointer bg-transparent border-0 text-slate-500 hover:underline"
          >
            Terms of Service
          </button>
        )}
      </div>
    </div>
  </footer>
);


