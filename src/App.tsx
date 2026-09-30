import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ReduceSection } from './components/ReduceSection';
import { ReuseSection } from './components/ReuseSection';
import { RecycleSection } from './components/RecycleSection';
import { FactsSection } from './components/FactsSection';
import { ActionSection } from './components/ActionSection';
import { AcademicReportModal } from './components/AcademicReportModal';

export default function App() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const handleScrollToReduce = () => {
    const el = document.getElementById('reduce');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F1D2A1] text-[#242A16] font-body flex flex-col items-center">
      {/* Container wrapper: either fluid responsive or simulated smartphone bezel frame */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[440px] my-6 rounded-[44px] shadow-2xl border-[10px] border-[#3B2504] overflow-hidden bg-[#F1D2A1] ring-8 ring-[#808847]/30'
            : 'max-w-5xl mx-auto'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          onOpenReport={() => setIsReportOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Main Content Sections */}
        <main className="w-full">
          {/* Section 0: Hero 3R */}
          <HeroSection onStartExplore={handleScrollToReduce} />

          {/* Section 1: REDUCE */}
          <ReduceSection />

          {/* Section 2: REUSE */}
          <ReuseSection />

          {/* Section 3: RECYCLE */}
          <RecycleSection />

          {/* Section 4: FAKTA DAN DATA */}
          <FactsSection />

          {/* Section 5: AJAKAN AKSI */}
          <ActionSection />
        </main>
      </div>

      {/* Academic Project & Team Document Modal */}
      <AcademicReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
