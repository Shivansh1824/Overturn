import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StoryShowcase } from './components/StoryShowcase';
import { LoginPage } from './components/LoginPage';
import { DashboardView } from './components/DashboardView';
import { ClaimRecoveryModal } from './components/ClaimRecoveryModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsModal } from './components/TermsModal';
import { supabase, AuthUser, DEMO_PROFILES } from './lib/supabase';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'dashboard'>('home');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [activeScene, setActiveScene] = useState(0);

  // Sync Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          role: 'claimant',
          badge: 'Supabase Active',
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          role: 'claimant',
          badge: 'Supabase Active',
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    setCurrentView('dashboard');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    setCurrentView('home');
  };

  // Render Full Login Page
  if (currentView === 'login') {
    return (
      <LoginPage
        onBackToHome={() => setCurrentView('home')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Render Live Agent Dashboard
  if (currentView === 'dashboard') {
    return (
      <>
        <DashboardView
          user={user || DEMO_PROFILES.judge}
          onSignOut={handleSignOut}
          onBackToHome={() => setCurrentView('home')}
          onOpenRecoveryModal={() => setModalOpen(true)}
        />
        <ClaimRecoveryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  // Render Landing Page Presentation Deck
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 selection:bg-teal-500/30 selection:text-teal-900">
      <Navbar
        onOpenSignIn={() => setCurrentView('login')}
        onOpenDashboard={() => setCurrentView('dashboard')}
        user={user}
        onOpenRecoveryModal={() => setModalOpen(true)}
        onOpenPrivacyModal={() => setPrivacyOpen(true)}
        onOpenTermsModal={() => setTermsOpen(true)}
        onNavigateToScene={(idx) => setActiveScene(idx)}
        currentScene={activeScene}
      />

      <main className="h-full w-full overflow-hidden">
        <StoryShowcase
          activeScene={activeScene}
          onSceneChange={(idx) => setActiveScene(idx)}
          onOpenRecoveryModal={() => setModalOpen(true)}
          onOpenPrivacyModal={() => setPrivacyOpen(true)}
          onOpenTermsModal={() => setTermsOpen(true)}
        />
      </main>

      {/* Interactive Modals */}
      <ClaimRecoveryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
};

export default App;
