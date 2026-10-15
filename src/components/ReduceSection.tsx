import React, { useState } from 'react';
import { Sparkles, RotateCw, CheckCircle2, Leaf } from 'lucide-react';
import { REDUCE_CARDS } from '../data/content';
import { sounds } from '../utils/audio';
import { TotebagIllustration, SedotanBesiIllustration, TumblerIllustration } from './HandDrawnIllustrations';
import { GrassDivider } from './GrassDivider';
import reduceImg from '../assets/reduce.png';

export const ReduceSection: React.FC = () => {
  // Store flipped state for each card independently (false = front, true = back)
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({
    'reduce-1': false,
    'reduce-2': false,
    'reduce-3': false,
  });

  const handleToggleFlip = (cardId: string) => {
    sounds.playFlip();
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <section id="reduce" className="py-8 sm:py-12 px-3 sm:px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header with reduce.png badge positioned next to the section title */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-3 sm:gap-4.5 flex-wrap">
          <img
            src={reduceImg}
            alt="Logo Reduce - Kurangi Dari Awal"
            className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
            draggable={false}
          />
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#283618] leading-tight tracking-tight uppercase">
            REDUCE
          </h2>
        </div>
        <div className="font-display text-lg sm:text-2xl md:text-3xl font-black text-[#283618] tracking-wide mt-1">
          Kurangi Dari Awal
        </div>
        <p className="font-body text-[#283618]/90 text-xs sm:text-base font-semibold mt-1 sm:mt-2 max-w-md mx-auto leading-relaxed">
          Cara terbaik untuk mengelola sampah adalah tidak menghasilkannya sejak awal.
        </p>
      </div>

      {/* 3 Interactive Flip Cards (Tinggi seimbang, konten di-center secara vertikal, tanpa ruang kosong berlebih) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 md:gap-6 w-full max-w-4xl items-stretch">
        {REDUCE_CARDS.map((card) => {
          const isFlipped = !!flippedCards[card.id];

          return (
            <div
              key={card.id}
              className="perspective-1200 w-full min-h-[385px] sm:min-h-[405px] md:min-h-[420px] flex flex-col"
            >
              {/* Inner 3D Flip Card Container */}
              <div
                onClick={() => handleToggleFlip(card.id)}
                className="relative w-full flex-1 transform-style-3d flip-card-transition cursor-pointer select-none group"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                title={isFlipped ? 'Klik kartu untuk membalik kembali ke depan' : 'Klik kartu untuk membalik dan melihat fakta'}
              >
                {/* 1. SISI DEPAN (FRONT FACE) - Konten Center Vertikal */}
                <div className="absolute inset-0 backface-hidden rounded-3xl bg-[#5B4436] text-[#FEFAE0] p-4 sm:p-5 flex flex-col justify-between shadow-xl border-2 sm:border-4 border-[#433126] group-hover:border-[#FEFAE0]/70 transition-all">
                  {/* Top Row: Number & Full Tagline Badge */}
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    <span className="font-display text-xl sm:text-2xl font-black text-[#FEFAE0] leading-none">
                      {card.number}
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] md:text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#FEFAE0]/20 text-[#FEFAE0] whitespace-nowrap border border-[#FEFAE0]/25 shadow-xs">
                      {card.tagline}
                    </span>
                  </div>

                  {/* Middle Center Group (Icon, Title, Description terdistribusi di tengah) */}
                  <div className="my-auto flex flex-col items-center justify-center text-center gap-2.5 py-1 w-full">
                    {/* Stylized Illustrated Icon Badge */}
                    <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl bg-[#FEFAE0]/15 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner border border-[#FEFAE0]/25 p-2">
                      {card.iconType === 'tumbler' && <TumblerIllustration className="w-full h-full drop-shadow-md" />}
                      {card.iconType === 'plastic' && <TotebagIllustration className="w-full h-full drop-shadow-md" />}
                      {card.iconType === 'food' && <SedotanBesiIllustration className="w-full h-full drop-shadow-md" />}
                    </div>

                    {/* Title */}
                    <div className="px-1">
                      <h3 className="font-display text-sm sm:text-base md:text-lg font-black text-white leading-snug">
                        {card.title}
                      </h3>
                    </div>

                    {/* Front Description (Kalimat jelas dan nyaman dibaca) */}
                    <div className="px-0.5">
                      <p className="font-body text-xs sm:text-[12.5px] md:text-[13px] text-[#FEFAE0]/95 leading-relaxed font-normal">
                        {card.frontDescription}
                      </p>
                    </div>
                  </div>

                  {/* Bottom hint to Flip In-Place */}
                  <div className="pt-2 mt-auto border-t border-[#FEFAE0]/25 flex items-center justify-center gap-1.5 text-xs font-bold text-[#FEFAE0] group-hover:text-white transition">
                    <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Klik untuk membalik kartu ↺</span>
                  </div>
                </div>

                {/* 2. SISI BELAKANG (BACK FACE) - Konten Center Vertikal */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-[#283618] text-[#FEFAE0] p-4 sm:p-5 flex flex-col justify-between shadow-xl border-2 sm:border-4 border-[#1e2a12] group-hover:border-[#FEFAE0]/70 transition-all">
                  {/* Top Row: Number & Badge */}
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    <span className="font-display text-xl sm:text-2xl font-black text-[#FEFAE0] leading-none">
                      {card.number}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#FEFAE0] text-[#283618] shadow-xs">
                      <Sparkles className="w-3 h-3 text-[#283618] shrink-0" />
                      <span>Fakta & Dampak</span>
                    </span>
                  </div>

                  {/* Middle Center Group */}
                  <div className="my-auto flex flex-col justify-center gap-2 py-1 w-full">
                    {/* Primary Highlight Quote */}
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-black/35 border-2 border-[#FEFAE0]/30 text-center flex flex-col items-center justify-center shadow-inner">
                      <p className="font-display text-xs sm:text-sm font-black text-amber-200 leading-snug">
                        "{card.flipBackText}"
                      </p>
                    </div>

                    {/* Supporting Practical Action Steps */}
                    <div className="space-y-1.5 text-left">
                      {card.backTips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-1.5 sm:p-2 rounded-xl bg-white/10 border border-white/10"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                          <span className="text-[11px] sm:text-xs text-[#FEFAE0] font-normal leading-tight">
                            {tip}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Impact Metric Banner */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-emerald-400/25 text-[10.5px] sm:text-xs text-emerald-200 font-medium leading-tight">
                      <Leaf className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span className="line-clamp-1">{card.impactMetric}</span>
                    </div>
                  </div>

                  {/* Bottom hint to Flip Back */}
                  <div className="pt-2 mt-auto border-t border-[#FEFAE0]/25 flex items-center justify-center gap-1.5 text-xs font-bold text-[#FEFAE0] group-hover:text-white transition">
                    <RotateCw className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-500" />
                    <span>Klik kartu untuk kembali ↺</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
