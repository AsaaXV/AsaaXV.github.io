import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ReduceSection } from './components/ReduceSection';
import { ReuseSection } from './components/ReuseSection';
import { RecycleSection } from './components/RecycleSection';
import { FactsSection } from './components/FactsSection';
import { ActionSection } from './components/ActionSection';
import { AcademicReportModal } from './components/AcademicReportModal';
import { SecretEasterEggModal } from './components/SecretEasterEggModal';
import { EarthRescueGameModal } from './components/EarthRescueGameModal';
import { FlappyBird3RModal } from './components/FlappyBird3RModal';
import { GrassDivider } from './components/GrassDivider';
import { sounds } from './utils/audio';

export default function App() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isFlappyOpen, setIsFlappyOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll listener untuk tombol Back to Top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    sounds.playPop();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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
    <div className="min-h-screen w-full overflow-x-clip bg-[#FEFAE0] text-[#283618] font-body flex flex-col items-center">
      {/* Top Navbar — Sticky di Desktop maupun HP */}
      <Navbar
        onOpenReport={() => setIsReportOpen(true)}
        onOpenSecret={() => setIsSecretOpen(true)}
      />

      {/* Main Content Sections: Hero hingga Facts */}
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4">
        <main className="w-full pb-0">
          {/* Section 0: Hero 3R */}
          <HeroSection
            onStartExplore={handleScrollToReduce}
            onOpenGame={() => setIsGameOpen(true)}
            onOpenFlappy={() => setIsFlappyOpen(true)}
          />

          {/* Section 1: REDUCE */}
          <ReduceSection />

          {/* Section 2: REUSE */}
          <ReuseSection />

          {/* Section 3: RECYCLE */}
          <RecycleSection />

          {/* Section 4: FAKTA DAN DATA */}
          <FactsSection />
        </main>
      </div>

      {/* Section 5: AJAKAN AKSI, RUMPUT & FOOTER — Memanjang Penuh 100% Layar Desktop (Edge-to-Edge) */}
      <div className="w-full mt-2">
        <ActionSection onOpenSecret={() => setIsSecretOpen(true)} />
      </div>

      {/* 1 Navigasi Rumput Fixed/Sticky di Bagian Paling Bawah yang Mengikuti saat Scroll — Dipendekkan khusus Desktop */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-30 pointer-events-none select-none overflow-hidden leading-none">
        <GrassDivider
          variant="bottom"
          className="w-full text-[#283618] opacity-95 drop-shadow-md"
        />
      </div>

      {/* Tombol Mengambang: Kembali ke Atas (Back to Top) */}
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label="Kembali ke Bagian Atas Halaman"
        className={`fixed bottom-7 sm:bottom-9 right-4 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] border-2 border-[#FEFAE0] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform active:scale-90 cursor-pointer ${
          showBackToTop
            ? 'opacity-100 translate-y-0 pointer-events-auto hover:-translate-y-1'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
        title="Kembali ke Atas"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>

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

      {/* Game Penyelamatan Bumi: Earth Pollution Defense Arcade */}
      <EarthRescueGameModal
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />

      {/* Game 3R Terbang (Flappy Earth 3R: Penjaga Ozon) */}
      <FlappyBird3RModal
        isOpen={isFlappyOpen}
        onClose={() => setIsFlappyOpen(false)}
      />
    </div>
  );
}
