import React, { useState, useEffect } from 'react';
import { ShoppingBag, Coffee, UtensilsCrossed, Sparkles, CheckCircle2, X, ChevronLeft, ChevronRight, BarChart3, TrendingUp, Maximize2 } from 'lucide-react';
import { REDUCE_CARDS } from '../data/content';
import { FlipCardItem } from '../types';
import { sounds } from '../utils/audio';

export const ReduceSection: React.FC = () => {
  // Active expanded horizontal infographic card
  const [activeCard, setActiveCard] = useState<FlipCardItem | null>(null);

  const openCard = (card: FlipCardItem) => {
    sounds.playFlip();
    setActiveCard(card);
  };

  const closeCard = () => {
    sounds.playPop();
    setActiveCard(null);
  };

  const handleNextCard = () => {
    if (!activeCard) return;
    sounds.playFlip();
    const currentIndex = REDUCE_CARDS.findIndex((c) => c.id === activeCard.id);
    const nextIndex = (currentIndex + 1) % REDUCE_CARDS.length;
    setActiveCard(REDUCE_CARDS[nextIndex]);
  };

  const handlePrevCard = () => {
    if (!activeCard) return;
    sounds.playFlip();
    const currentIndex = REDUCE_CARDS.findIndex((c) => c.id === activeCard.id);
    const prevIndex = (currentIndex - 1 + REDUCE_CARDS.length) % REDUCE_CARDS.length;
    setActiveCard(REDUCE_CARDS[prevIndex]);
  };

  // Close on Escape or switch with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeCard) {
        closeCard();
      } else if (e.key === 'ArrowRight' && activeCard) {
        handleNextCard();
      } else if (e.key === 'ArrowLeft' && activeCard) {
        handlePrevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCard]);

  // Infographic metrics tailored to each card
  const getInfographicData = (cardId: string) => {
    switch (cardId) {
      case 'reduce-1':
        return {
          barLabel: 'Tingkat Efektivitas Pengurangan Sampah',
          barPercent: 88,
          barText: '88% Sampah Kresek Bisa Ditekan dengan 1 Totebag',
          metricTitle: '500 Tahun vs Dipakai Berulang',
          metricDesc: 'Satu kantong plastik butuh hingga 5 abad untuk hancur menjadi mikroplastik beracun.',
        };
      case 'reduce-2':
        return {
          barLabel: 'Efisiensi Biaya Mahasiswa & Nol Limbah Cup',
          barPercent: 95,
          barText: 'Hemat Hingga Rp 450.000 / Bulan Uang Saku',
          metricTitle: '240 Cup Plastik Dieliminasi',
          metricDesc: 'Isi ulang tumbler di kampus menghentikan ratusan sampah botol & cup sekali pakai per semester.',
        };
      case 'reduce-3':
      default:
        return {
          barLabel: 'Penurunan Emisi Metana dari Sisa Makanan',
          barPercent: 82,
          barText: 'Mencegah 36 kg Food Waste Membusuk Tanpa Oksigen',
          metricTitle: 'Gas Metana 25x Lebih Berbahaya dari CO2',
          metricDesc: 'Menghabiskan porsi makan adalah aksi iklim nyata paling mudah yang bisa dilakukan setiap hari.',
        };
    }
  };

  // Interactive simulation state matching Screenshot_2026_1001_021639.jpg.jpeg
  const [simTumbler, setSimTumbler] = useState(true);
  const [simTotebag, setSimTotebag] = useState(true);
  const [simFood, setSimFood] = useState(true);

  // Calculation per semester (120 active campus days)
  const semesterDays = 120;
  const plasticCount = (simTumbler ? 2 * semesterDays : 0) + (simTotebag ? 3 * semesterDays : 0);
  const moneySaved = (simTumbler ? 10000 * semesterDays : 0) + (simFood ? 6000 * semesterDays : 0);
  const foodSavedKg = simFood ? Math.round(0.3 * semesterDays) : 0;

  const toggleSim = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    sounds.playPop();
    setter((prev) => !prev);
  };

  return (
    <section id="reduce" className="py-8 sm:py-12 px-2 sm:px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header matching 3R DMI.jpg */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-[#808847] leading-tight tracking-tight uppercase">
          REDUCE
        </h2>
        <div className="font-display text-lg sm:text-2xl md:text-3xl font-black text-[#808847] tracking-wider uppercase mt-0.5 sm:mt-1">
          KURANGI DARI AWAL
        </div>
        <p className="font-body text-[#3B4219] text-xs sm:text-base font-semibold mt-1 sm:mt-2 max-w-md mx-auto">
          cara terbaik untuk mengelola sampah adalah tidak menghasilkannya.
        </p>
      </div>

      {/* 3 Interactive Cards (Klik kartu -> Berputar Horizontal & Membesar Menjadi Infografis) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full max-w-4xl items-stretch">
        {REDUCE_CARDS.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => openCard(card)}
              className="h-[320px] sm:h-[400px] md:h-[440px] w-full cursor-pointer select-none group transition-all duration-300 transform hover:-translate-y-2.5 hover:rotate-1 hover:scale-[1.02]"
              title="Klik untuk memutar horizontal dan membuka infografis lengkap"
            >
              {/* Card Face */}
              <div className="relative w-full h-full rounded-2xl sm:rounded-3xl bg-[#925E06] text-[#F1D2A1] p-3 sm:p-5 md:p-6 flex flex-col justify-between shadow-xl border-2 sm:border-4 border-[#794E05] group-hover:border-[#F1D2A1]/70 transition-all">
                <div>
                  {/* Top Row */}
                  <div className="flex items-center justify-between mb-1 sm:mb-3">
                    <span className="font-display text-lg sm:text-2xl font-black text-[#F1D2A1]">
                      {card.number}
                    </span>
                    <span className="hidden sm:inline-block text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F1D2A1]/20 text-[#F1D2A1]">
                      {card.tagline}
                    </span>
                  </div>

                  {/* Stylized Illustrated Icon Badge */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-[#F1D2A1]/15 mx-auto flex items-center justify-center my-2 sm:my-3 md:my-4 group-hover:scale-110 group-hover:bg-[#F1D2A1]/25 transition-transform shadow-inner border border-[#F1D2A1]/20">
                    {card.iconType === 'plastic' && <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#F1D2A1]" />}
                    {card.iconType === 'tumbler' && <Coffee className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#F1D2A1]" />}
                    {card.iconType === 'food' && <UtensilsCrossed className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#F1D2A1]" />}
                  </div>

                  {/* Title */}
                  <div className="min-h-[40px] sm:min-h-[50px] md:min-h-[56px] flex items-center justify-center">
                    <h3 className="font-display text-xs sm:text-base md:text-xl font-black text-center text-white leading-tight line-clamp-2">
                      {card.title}
                    </h3>
                  </div>

                  {/* Front Description */}
                  <div className="min-h-[48px] sm:min-h-[64px] md:min-h-[72px] flex items-center justify-center mt-1">
                    <p className="font-body text-[8.5px] sm:text-xs md:text-sm text-center text-[#F1D2A1]/95 leading-tight sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {card.frontDescription}
                    </p>
                  </div>
                </div>

                {/* Bottom hint to rotate & expand */}
                <div className="pt-2 sm:pt-3 border-t border-[#F1D2A1]/25 flex items-center justify-center gap-1.5 text-[8.5px] sm:text-xs font-bold text-[#F1D2A1] group-hover:text-white transition">
                  <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:rotate-90 transition-transform duration-500" />
                  <span>Buka Infografis Horizontal ↗</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* KARTU BERPUTAR HORIZONTAL & MEMBESAR DENGAN ANIMASI INFOGRAFIS (Sesuai Sketsa Pengguna) */}
      {activeCard && (
        <div
          onClick={closeCard}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Main Horizontal Landscape Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl bg-[#F1D2A1] shadow-2xl border-4 border-[#925E06] overflow-hidden flex flex-col md:flex-row animate-rotate-expand"
            style={{ maxHeight: '92vh' }}
          >
            {/* SISI KIRI (Gambar / Visual Kartu Sesuai Sketsa Kotak Kiri "[ ]") */}
            <div className="w-full md:w-[38%] bg-[#925E06] text-[#F1D2A1] p-5 sm:p-8 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-[#794E05] shrink-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-4xl sm:text-5xl font-black text-[#F1D2A1] drop-shadow">
                    {activeCard.number}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F1D2A1]/20 text-[#F1D2A1] border border-[#F1D2A1]/30">
                    {activeCard.tagline}
                  </span>
                </div>

                {/* Big Illustration Badge */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-[#F1D2A1]/20 mx-auto flex items-center justify-center my-4 sm:my-6 shadow-inner border-2 border-[#F1D2A1]/30">
                  {activeCard.iconType === 'plastic' && <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-[#F1D2A1] animate-pulse" />}
                  {activeCard.iconType === 'tumbler' && <Coffee className="w-12 h-12 sm:w-16 sm:h-16 text-[#F1D2A1] animate-pulse" />}
                  {activeCard.iconType === 'food' && <UtensilsCrossed className="w-12 h-12 sm:w-16 sm:h-16 text-[#F1D2A1] animate-pulse" />}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-black text-white text-center leading-tight">
                  {activeCard.title}
                </h3>

                <p className="font-body text-xs sm:text-sm text-[#F1D2A1]/95 text-center mt-2.5 leading-relaxed">
                  {activeCard.frontDescription}
                </p>
              </div>

              {/* Prev / Next Card Navigation Switcher */}
              <div className="pt-4 border-t border-[#F1D2A1]/25 flex items-center justify-between text-xs font-bold text-[#F1D2A1]">
                <button
                  onClick={handlePrevCard}
                  className="flex items-center gap-1 hover:text-white transition cursor-pointer p-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Kartu Sebelumnya
                </button>
                <button
                  onClick={handleNextCard}
                  className="flex items-center gap-1 hover:text-white transition cursor-pointer p-1"
                >
                  Kartu Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SISI KANAN: ANIMASI INFOGRAFIS DI DALAMNYA (Sesuai Garis-Garis Sketsa "~~~") */}
            <div className="w-full md:w-[62%] bg-[#808847] text-[#F1D2A1] p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
              {(() => {
                const info = getInfographicData(activeCard.id);

                return (
                  <div>
                    {/* Header Infografis */}
                    <div className="flex items-center justify-between pb-2 border-b-2 border-[#F1D2A1]/30 mb-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-200">
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>INFOGRAFIS AKSI LINGKUNGAN</span>
                        </div>
                        <h4 className="font-display text-lg sm:text-2xl font-black text-white mt-0.5">
                          Langkah & Fakta Terukur
                        </h4>
                      </div>
                      <span className="font-display text-xs sm:text-sm font-black text-[#F1D2A1] bg-[#686F35] px-3 py-1 rounded-full border border-[#F1D2A1]/30">
                        Tahap #{activeCard.number}
                      </span>
                    </div>

                    {/* 1. ANIMASI INFOGRAFIS BAR: Stat Bar Animation with Hover Micro-interaction */}
                    <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-2xl bg-[#686F35]/70 border border-[#F1D2A1]/30 shadow-md animate-slide-up-1 transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:bg-[#686F35]/90 hover:border-[#F1D2A1]/60 hover:shadow-xl cursor-default group">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white mb-1.5">
                        <span className="flex items-center gap-1.5 text-[#F1D2A1] group-hover:text-white transition-colors">
                          <TrendingUp className="w-4 h-4 text-emerald-300 group-hover:scale-125 transition-transform" />
                          {info.barLabel}
                        </span>
                        <span className="font-display text-sm sm:text-base font-black text-amber-200 group-hover:scale-110 transition-transform">
                          {info.barPercent}%
                        </span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full h-3 sm:h-3.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-[#F1D2A1]/20">
                        <div
                          className="h-full bg-gradient-to-r from-amber-300 via-emerald-400 to-emerald-300 rounded-full animate-bar-grow shadow group-hover:brightness-110 transition-all"
                          style={{ ['--bar-width' as string]: `${info.barPercent}%` }}
                        />
                      </div>
                      <p className="text-[11px] sm:text-xs text-white/90 font-medium mt-2 leading-tight">
                        {info.barText}
                      </p>
                    </div>

                    {/* 2. ANIMASI INFOGRAFIS LANGKAH PRAKTIS: 3 Step Cards with Interactive Hover Lift */}
                    <div className="space-y-2.5 my-3 sm:my-4">
                      {activeCard.backTips.map((tip, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-3 rounded-2xl bg-[#6C7436]/70 border border-[#F1D2A1]/25 shadow-sm transform transition-all duration-300 hover:scale-[1.025] hover:-translate-y-1 hover:bg-[#6C7436] hover:border-[#F1D2A1]/60 hover:shadow-xl cursor-pointer group ${
                            idx === 0
                              ? 'animate-slide-up-2'
                              : idx === 1
                              ? 'animate-slide-up-3'
                              : 'animate-slide-up-4'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-full bg-[#808847] border border-[#F1D2A1] flex items-center justify-center font-display font-black text-xs text-[#F1D2A1] shrink-0 mt-0.5 shadow group-hover:scale-115 group-hover:bg-[#F1D2A1] group-hover:text-[#6C7436] group-hover:rotate-6 transition-all duration-300">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <span className="text-xs sm:text-sm text-white font-medium leading-relaxed group-hover:text-amber-100 transition-colors">
                              {tip}
                            </span>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5 group-hover:scale-125 group-hover:text-emerald-200 transition-transform" />
                        </div>
                      ))}
                    </div>

                    {/* 3. ANIMASI IMPACT BANNER with Hover Glow */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-[#5E6430] border-2 border-[#F1D2A1]/35 shadow-md animate-slide-up-4 transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:border-[#F1D2A1]/60 hover:shadow-2xl cursor-default group">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
                        <Sparkles className="w-4 h-4 text-amber-200 animate-spin group-hover:scale-125 transition-transform" style={{ animationDuration: '6s' }} />
                        <span className="group-hover:text-white transition-colors">Dampak Nyata Kampus UNM:</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white mt-1 leading-snug">
                        {activeCard.impactMetric}
                      </p>
                    </div>

                    {/* Konteks Kampus */}
                    <div className="mt-2.5 text-[11px] sm:text-xs text-[#F1D2A1]/90 italic">
                      💡 {activeCard.campusContext}
                    </div>
                  </div>
                );
              })()}

              {/* Bottom Action Button - Combined with "X" */}
              <div className="mt-4 pt-3 border-t border-[#F1D2A1]/20 flex justify-end">
                <button
                  onClick={closeCard}
                  className="px-6 py-2.5 rounded-full bg-[#925E06] hover:bg-[#794E05] text-white font-display text-xs sm:text-sm font-black shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 border-2 border-[#F1D2A1]/50 flex items-center gap-2.5 group"
                  title="Tutup Infografis (Esc)"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <X className="w-3.5 h-3.5 stroke-[3] text-[#F1D2A1] group-hover:text-white" />
                  </div>
                  <span>Tutup Infografis</span>
                  <span className="text-[10px] text-amber-200 font-semibold">(Esc)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Impact Simulator matching Screenshot_2026_1001_021639.jpg.jpeg */}
      <div className="w-full max-w-4xl mt-6 p-4 sm:p-6 rounded-3xl bg-[#925E06]/15 border-2 border-[#925E06]/30 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#925E06]">
              SIMULASI INTERAKTIF
            </span>
            <h3 className="font-display text-base sm:text-lg font-black text-[#3B4219]">
              Kalkulator Jejak Kampus Pribadi
            </h3>
            <p className="text-xs text-[#523002] mt-0.5">
              Simulasi pengurangan sampah Anda selama 1 semester (120 hari kuliah di UNM)
            </p>
          </div>
          <div className="text-[11px] font-bold text-[#808847] bg-white/70 px-3 py-1 rounded-full self-start sm:self-auto border border-[#808847]/30">
            Pilih kebiasaan Anda:
          </div>
        </div>

        {/* 3 Toggle Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            type="button"
            onClick={() => toggleSim(setSimTumbler)}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
              simTumbler
                ? 'bg-[#808847] text-white border-[#5E6430] shadow-md scale-[1.02]'
                : 'bg-white/60 text-[#3B4219] border-stone-300 opacity-60 hover:opacity-80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Coffee className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-display text-xs font-bold leading-tight">Bawa Tumbler Sendiri</div>
                <div className="text-[10px] opacity-80 mt-0.5">Hemat 2 cup/hari</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-black text-[10px] ${
                simTumbler ? 'bg-white text-[#808847] border-white' : 'border-[#3B4219]'
              }`}
            >
              {simTumbler ? '✓' : ''}
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleSim(setSimTotebag)}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
              simTotebag
                ? 'bg-[#808847] text-white border-[#5E6430] shadow-md scale-[1.02]'
                : 'bg-white/60 text-[#3B4219] border-stone-300 opacity-60 hover:opacity-80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-display text-xs font-bold leading-tight">Bawa Totebag Belanja</div>
                <div className="text-[10px] opacity-80 mt-0.5">Hemat 3 kresek/hari</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-black text-[10px] ${
                simTotebag ? 'bg-white text-[#808847] border-white' : 'border-[#3B4219]'
              }`}
            >
              {simTotebag ? '✓' : ''}
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleSim(setSimFood)}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
              simFood
                ? 'bg-[#808847] text-white border-[#5E6430] shadow-md scale-[1.02]'
                : 'bg-white/60 text-[#3B4219] border-stone-300 opacity-60 hover:opacity-80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UtensilsCrossed className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-display text-xs font-bold leading-tight">Habiskan Porsi Makan</div>
                <div className="text-[10px] opacity-80 mt-0.5">0.3 kg food waste/hari</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-black text-[10px] ${
                simFood ? 'bg-white text-[#808847] border-white' : 'border-[#3B4219]'
              }`}
            >
              {simFood ? '✓' : ''}
            </div>
          </button>
        </div>

        {/* Dynamic Impact Counters */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-2xl bg-[#925E06] text-[#F1D2A1] text-center border-2 border-[#7A4B04] shadow-inner">
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold text-[#F1D2A1]/80">Sampah Plastik Ditekan</span>
            <span className="font-display text-2xl sm:text-3xl font-black text-white my-0.5">
              {plasticCount.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] sm:text-[10px] text-amber-200">pcs sampah sekali pakai</span>
          </div>

          <div className="flex flex-col items-center border-x border-[#F1D2A1]/30 px-1">
            <span className="text-[10px] sm:text-xs font-bold text-[#F1D2A1]/80">Uang Saku Dihemat</span>
            <span className="font-display text-2xl sm:text-3xl font-black text-emerald-300 my-0.5">
              Rp {moneySaved.toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] sm:text-[10px] text-amber-200">selama 1 semester</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold text-[#F1D2A1]/80">Pencegahan Food Waste</span>
            <span className="font-display text-2xl sm:text-3xl font-black text-white my-0.5">
              {foodSavedKg} kg
            </span>
            <span className="text-[9px] sm:text-[10px] text-amber-200">mencegah gas metana TPA</span>
          </div>
        </div>
      </div>
    </section>
  );
};
