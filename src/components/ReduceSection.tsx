import React, { useState } from 'react';
import { Sparkles, RotateCw, CheckCircle2 } from 'lucide-react';
import { REDUCE_CARDS } from '../data/content';
import { sounds } from '../utils/audio';
import { TotebagIllustration, SedotanBesiIllustration, TumblerIllustration } from './HandDrawnIllustrations';
import reduceImg from '../assets/reduce.png';

export const ReduceSection: React.FC = () => {
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
    <section id="reduce" className="pt-4 pb-4 sm:pt-6 sm:pb-6 px-3 sm:px-4 max-w-4xl mx-auto flex flex-col items-center w-full">
      {/* Header — Heading: 32-48px Bold Ellak | Subheading: 20-24px SemiBold Ellak | Isi: 14-16px Regular Oduda */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8 animate-section-title">
        <div className="section-title-interactive group flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-1">
          <img
            src={reduceImg}
            alt="Logo Reduce"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-md group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 select-none pointer-events-none"
            draggable={false}
          />
          <h2 className="font-display text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#283618] group-hover:text-[#5B4436] transition-colors leading-tight tracking-tight uppercase">
            REDUCE
          </h2>
        </div>
        <div className="font-display text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-[#5B4436] tracking-wide mt-1">
          Kurangi Dari Awal
        </div>
        <div className="h-0.5 bg-[#283618]/20 rounded-full my-3 animate-line-grow w-24 mx-auto" />
        <p className="font-body text-[#283618]/85 text-[14px] sm:text-[15px] md:text-[16px] font-normal mt-0.5 max-w-md mx-auto leading-relaxed">
          Cara terbaik untuk mengelola sampah adalah tidak menghasilkannya sejak awal.
        </p>
      </div>

      {/* Kartu Memanjang ke Bawah di HP (1 kartu per layar saat di-scroll) & 3 Kolom di Layar Lebar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 w-full max-w-sm sm:max-w-none mx-auto items-stretch">
        {REDUCE_CARDS.map((card, idx) => {
          const isFlipped = !!flippedCards[card.id];
          const staggerClass =
            idx === 2
              ? 'animate-stagger-right-1'
              : idx === 1
              ? 'animate-stagger-right-2'
              : 'animate-stagger-right-3';

          return (
            <div
              key={card.id}
              className={`perspective-1200 w-full min-h-[380px] sm:min-h-[365px] flex flex-col ${staggerClass}`}
            >
              <div
                onClick={() => handleToggleFlip(card.id)}
                className="relative w-full flex-1 transform-style-3d flip-card-transition cursor-pointer select-none group min-h-[380px] sm:min-h-[365px]"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                title={isFlipped ? 'Klik untuk membalik kembali' : 'Klik untuk melihat fakta & tips'}
              >
                {/* SISI DEPAN */}
                <div className="absolute inset-0 backface-hidden rounded-[28px] bg-[#5B4436] text-[#FEFAE0] p-5 sm:p-4.5 flex flex-col justify-between shadow-xl overflow-hidden border border-[#5B4436]/40">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-display text-[22px] sm:text-[24px] font-bold text-white leading-none">
                      {card.number}
                    </span>
                  </div>

                  <div className="my-auto flex flex-col items-center justify-center text-center gap-2 py-2 w-full">
                    <div className="w-22 h-22 sm:w-19 sm:h-19 rounded-2xl bg-[#FEFAE0] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform p-2.5 shadow-sm">
                      {card.iconType === 'tumbler' && <TumblerIllustration className="w-full h-full drop-shadow-xs" />}
                      {card.iconType === 'plastic' && <TotebagIllustration className="w-full h-full drop-shadow-xs" />}
                      {card.iconType === 'food' && <SedotanBesiIllustration className="w-full h-full drop-shadow-xs" />}
                    </div>

                    <div className="px-1 mt-1">
                      <h3 className="font-display text-[20px] sm:text-[22px] font-semibold text-white leading-tight">
                        {card.title}
                      </h3>
                    </div>

                    <div className="px-1 mt-0.5">
                      <p className="font-body text-[14px] sm:text-[15px] text-white/95 leading-relaxed font-normal">
                        {card.frontDescription}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 mt-auto border-t border-white/20 flex items-center justify-center gap-1.5 text-[13px] sm:text-[14px] font-medium text-white/90 group-hover:text-white transition">
                    <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Ketuk kartu untuk info detail</span>
                  </div>
                </div>

                {/* SISI BELAKANG */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[28px] bg-[#283618] text-[#FEFAE0] p-5 sm:p-4.5 flex flex-col justify-between shadow-xl overflow-hidden border border-[#283618]/40">
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    <span className="font-display text-[22px] sm:text-[24px] font-bold text-[#FEFAE0] leading-none">
                      {card.number}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEFAE0] text-[#283618] shadow-xs">
                      <Sparkles className="w-3 h-3 text-[#283618] shrink-0" />
                      <span>Fakta &amp; Dampak</span>
                    </span>
                  </div>

                  <div className="my-auto flex flex-col justify-center gap-2.5 py-2 w-full">
                    <div className="py-2.5 px-3 rounded-xl bg-black/35 border border-[#FEFAE0]/25 text-center flex flex-col items-center justify-center shadow-inner">
                      <p className="font-display text-[15px] sm:text-[16px] font-semibold text-amber-200 leading-snug">
                        "{card.flipBackText}"
                      </p>
                    </div>

                    <div className="space-y-1.5 text-left">
                      {card.backTips.map((tip, tIdx) => (
                        <div
                          key={tIdx}
                          className="flex items-start gap-2 p-2 rounded-xl bg-white/10 border border-white/10"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                          <span className="font-body text-[14px] text-[#FEFAE0] font-normal leading-snug">
                            {tip}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 mt-auto border-t border-[#FEFAE0]/25 flex items-center justify-center gap-1.5 text-[13px] sm:text-[14px] font-medium text-[#FEFAE0] group-hover:text-white transition">
                    <RotateCw className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-500" />
                    <span>Ketuk kartu untuk kembali</span>
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
