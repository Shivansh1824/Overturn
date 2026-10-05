import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StoryShowcase } from './components/StoryShowcase';
import { ClaimRecoveryModal } from './components/ClaimRecoveryModal';
import { SignInModal } from './components/SignInModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsModal } from './components/TermsModal';

export const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [activeScene, setActiveScene] = useState(0);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 selection:bg-teal-500/30 selection:text-teal-900">
      <Navbar
        onOpenSignIn={() => setSignInOpen(true)}
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
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
      <ClaimRecoveryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
};

export default App;
