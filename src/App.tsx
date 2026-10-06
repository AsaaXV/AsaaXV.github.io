import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ReduceSection } from './components/ReduceSection';
import { ReuseSection } from './components/ReuseSection';
import { RecycleSection } from './components/RecycleSection';
import { FactsSection } from './components/FactsSection';
import { ActionSection } from './components/ActionSection';
import { AcademicReportModal } from './components/AcademicReportModal';
import { SecretEasterEggModal } from './components/SecretEasterEggModal';

export default function App() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Secret Easter Egg Key Listener: Mengetik "unm", "3r", atau "rahasia" membuka ruang rahasia
  useEffect(() => {
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 10) {
        keyBuffer = keyBuffer.slice(-10);
      }
      if (keyBuffer.endsWith('unm') || keyBuffer.endsWith('3r') || keyBuffer.endsWith('rahasia')) {
        setIsSecretOpen(true);
        keyBuffer = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScrollToReduce = () => {
    const el = document.getElementById('reduce');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0] text-[#283618] font-body flex flex-col items-center">
      {/* Container wrapper: either fluid responsive or simulated smartphone bezel frame */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[440px] my-6 rounded-[44px] shadow-2xl border-[10px] border-[#5B4436] overflow-hidden bg-[#FEFAE0] ring-8 ring-[#283618]/20'
            : 'max-w-5xl mx-auto'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          onOpenReport={() => setIsReportOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenSecret={() => setIsSecretOpen(true)}
        />

        {/* Main Content Sections */}
        <main className="w-full">
          {/* Section 0: Hero 3R */}
          <HeroSection
            onStartExplore={handleScrollToReduce}
          />

          {/* Section 1: REDUCE */}
          <ReduceSection />

          {/* Section 2: REUSE */}
          <ReuseSection />

          {/* Section 3: RECYCLE */}
          <RecycleSection />

          {/* Section 4: FAKTA DAN DATA */}
          <FactsSection />

          {/* Section 5: AJAKAN AKSI */}
          <ActionSection onOpenSecret={() => setIsSecretOpen(true)} />
        </main>
      </div>

      {/* Academic Project & Team Document Modal */}
      <AcademicReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* FITUR RAHASIA: Ruang Rahasia DKV UNM (Easter Egg) */}
      <SecretEasterEggModal
        isOpen={isSecretOpen}
        onClose={() => setIsSecretOpen(false)}
      />
    </div>
  );
}
