import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AgentSim } from './components/AgentCockpit';
import { EvidenceBattleBoard } from './components/EvidenceBattleBoard';
import { WorkflowSection } from './components/WorkflowSection';
import { StatutoryShield } from './components/StatutoryShield';
import { ClaimRecoveryModal } from './components/ClaimRecoveryModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar onOpenRecoveryModal={() => setModalOpen(true)} />

      <main>
        <Hero onOpenRecoveryModal={() => setModalOpen(true)} />
        <AgentSim onOpenRecoveryModal={() => setModalOpen(true)} />
        <EvidenceBattleBoard />
        <WorkflowSection />
        <StatutoryShield />
      </main>

      <ClaimRecoveryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default App;
