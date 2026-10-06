import React, { useState } from 'react';
import { ArrowRight, Menu, X, LayoutDashboard, Gavel } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AuthUser } from '../lib/supabase';

interface NavbarProps {
  onOpenSignIn: () => void;
  onOpenDashboard?: () => void;
  user?: AuthUser | null;
  onOpenRecoveryModal?: () => void;
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
  onNavigateToScene?: (sceneIndex: number) => void;
  currentScene?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSignIn,
  onOpenDashboard,
  user,
  onOpenPrivacyModal,
  onOpenTermsModal,
  onNavigateToScene,
  currentScene = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sceneIndex: number) => {
    setMobileMenuOpen(false);
    if (onNavigateToScene) {
      onNavigateToScene(sceneIndex);
    }
  };

  const isStoryActive = currentScene >= 0 && currentScene <= 2;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-transparent transition-all duration-300">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-20 sm:h-22 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick(0)}
          className="flex items-center group cursor-pointer no-underline bg-transparent border-0 p-0 text-left"
        >
          <BrandLogo size={38} textSize="text-xl" />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-9 text-[0.875rem] font-bold">
          <button
            onClick={() => handleNavClick(0)}
            className={`transition-colors cursor-pointer bg-transparent border-0 py-1 tracking-tight ${
              isStoryActive
                ? 'text-teal-700 font-extrabold'
                : 'text-slate-800 hover:text-teal-700'
            }`}
          >
            The Story
          </button>
          <button
            onClick={() => handleNavClick(3)}
            className={`transition-colors cursor-pointer bg-transparent border-0 py-1 tracking-tight ${
              currentScene === 3
                ? 'text-teal-700 font-extrabold'
                : 'text-slate-800 hover:text-teal-700'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick(4)}
            className={`transition-colors cursor-pointer bg-transparent border-0 py-1 tracking-tight ${
              currentScene === 4
                ? 'text-teal-700 font-extrabold'
                : 'text-slate-800 hover:text-teal-700'
            }`}
          >
            Outcomes
          </button>
          <button
            onClick={() => handleNavClick(5)}
            className={`transition-colors cursor-pointer bg-transparent border-0 py-1 tracking-tight ${
              currentScene === 5
                ? 'text-teal-700 font-extrabold'
                : 'text-slate-800 hover:text-teal-700'
            }`}
          >
            FAQ
          </button>
        </nav>

        {/* Right CTA: Sign In / Dashboard Button */}
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={onOpenDashboard}
              className="px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-teal-500/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              {user.role === 'judge' ? <Gavel className="w-4 h-4 text-teal-200" /> : <LayoutDashboard className="w-4 h-4" />}
              <span>Dashboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            </button>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-slate-900/10 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-800 hover:text-slate-950 hover:bg-white/60 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-6 shadow-2xl space-y-4 relative z-20">
          <button
            onClick={() => handleNavClick(0)}
            className="block w-full text-left font-bold text-slate-900 text-sm py-2 cursor-pointer"
          >
            The Story
          </button>
          <button
            onClick={() => handleNavClick(3)}
            className="block w-full text-left font-bold text-slate-900 text-sm py-2 cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick(4)}
            className="block w-full text-left font-bold text-slate-900 text-sm py-2 cursor-pointer"
          >
            Patient Outcomes
          </button>
          <button
            onClick={() => handleNavClick(5)}
            className="block w-full text-left font-bold text-slate-900 text-sm py-2 cursor-pointer"
          >
            FAQ
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard?.();
                }}
                className="w-full py-2.5 rounded-full bg-teal-600 text-white font-bold text-sm text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard ({user.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="w-full py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm text-center cursor-pointer"
              >
                Sign In
              </button>
            )}

            {onOpenPrivacyModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPrivacyModal();
                }}
                className="block w-full text-left font-semibold text-slate-500 text-xs py-1"
              >
                Privacy & DPDP Policy
              </button>
            )}
            {onOpenTermsModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTermsModal();
                }}
                className="block w-full text-left font-semibold text-slate-500 text-xs py-1"
              >
                Terms & Conditions
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
