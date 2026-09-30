import React, { useState } from 'react';
import { ShoppingBag, Coffee, UtensilsCrossed, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { REDUCE_CARDS } from '../data/content';
import { sounds } from '../utils/audio';

export const ReduceSection: React.FC = () => {
  // Track flipped status for each of the 3 cards
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({
    'reduce-1': false,
    'reduce-2': false,
    'reduce-3': false,
  });

  const toggleFlip = (id: string) => {
    sounds.playFlip();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

      {/* 3 Interactive Flip Cards - ALWAYS 3 columns side-by-side on mobile AND desktop */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 md:gap-6 w-full max-w-4xl items-stretch">
        {REDUCE_CARDS.map((card) => {
          const isFlipped = !!flippedCards[card.id];

          return (
            <div
              key={card.id}
              className="perspective-1000 h-[290px] sm:h-[380px] md:h-[440px] w-full cursor-pointer select-none group"
              onClick={() => toggleFlip(card.id)}
            >
              <div
                className={`relative w-full h-full rounded-2xl sm:rounded-3xl transition-transform duration-500 transform-style-3d shadow-md sm:shadow-xl ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT SIDE (Golden Brown matching mockup) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl bg-[#925E06] text-[#F1D2A1] p-2 sm:p-4 md:p-6 flex flex-col justify-between backface-hidden border-2 border-[#794E05]">
                  <div>
                    <div className="flex items-center justify-between mb-1 sm:mb-4">
                      <span className="font-display text-base sm:text-2xl font-black text-[#F1D2A1]/80">
                        {card.number}
                      </span>
                      <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#F1D2A1]/20 text-[#F1D2A1]">
                        {card.tagline}
                      </span>
                    </div>

                    {/* Stylized Illustrated Icon Badge */}
                    <div className="w-8 h-8 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#F1D2A1]/15 mx-auto flex items-center justify-center my-1.5 sm:my-3 md:my-4 group-hover:scale-110 transition-transform">
                      {card.iconType === 'plastic' && <ShoppingBag className="w-4 h-4 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#F1D2A1]" />}
                      {card.iconType === 'tumbler' && <Coffee className="w-4 h-4 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#F1D2A1]" />}
                      {card.iconType === 'food' && <UtensilsCrossed className="w-4 h-4 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#F1D2A1]" />}
                    </div>

                    <div className="min-h-[36px] sm:min-h-[50px] md:min-h-[56px] flex items-center justify-center">
                      <h3 className="font-display text-[10px] sm:text-base md:text-xl font-black text-center text-white leading-tight line-clamp-2">
                        {card.title}
                      </h3>
                    </div>

                    <div className="min-h-[44px] sm:min-h-[60px] md:min-h-[72px] flex items-center justify-center mt-1">
                      <p className="font-body text-[8px] sm:text-xs md:text-sm text-center text-[#F1D2A1]/90 leading-tight sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                        {card.frontDescription}
                      </p>
                    </div>
                  </div>

                  {/* Bottom hint to flip */}
                  <div className="pt-1.5 sm:pt-4 border-t border-[#F1D2A1]/20 flex items-center justify-center gap-1 text-[7px] sm:text-xs font-bold text-[#F1D2A1]/80 group-hover:text-white transition">
                    <RotateCw className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    <span>Balik Kartu</span>
                  </div>
                </div>

                {/* BACK SIDE (Rich Olive Mustard Card) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl bg-[#808847] text-[#F1D2A1] p-2 sm:p-4 md:p-6 flex flex-col justify-between backface-hidden rotate-y-180 border-2 border-[#697034]">
                  <div>
                    <div className="flex items-center justify-between pb-1 sm:pb-2 border-b border-[#F1D2A1]/25 mb-1.5 sm:mb-3">
                      <span className="font-display text-[8px] sm:text-sm font-bold text-white uppercase tracking-wider line-clamp-1">
                        Aksi Praktis
                      </span>
                      <span className="font-display text-[8px] sm:text-xs text-[#F1D2A1]/90 font-black">
                        #{card.number}
                      </span>
                    </div>

                    <ul className="space-y-1 sm:space-y-2 text-[7.5px] sm:text-xs text-white/95 font-medium min-h-[90px] sm:min-h-[140px]">
                      {card.backTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1 sm:gap-2">
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#F1D2A1] shrink-0 mt-0.5" />
                          <span className="line-clamp-2 sm:line-clamp-none">{tip}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Impact stat box */}
                    <div className="mt-1 sm:mt-2 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-[#686F35]/70 border border-[#F1D2A1]/30">
                      <div className="flex items-center gap-1 text-[7px] sm:text-[11px] font-bold text-[#F1D2A1]">
                        <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-[#F1D2A1]" />
                        <span>Dampak:</span>
                      </div>
                      <p className="text-[7.5px] sm:text-[11px] font-semibold text-white mt-0.5 line-clamp-2">
                        {card.impactMetric}
                      </p>
                    </div>
                  </div>

                  {/* Back button */}
                  <div className="pt-1.5 sm:pt-3 border-t border-[#F1D2A1]/20 flex items-center justify-center gap-1 text-[7px] sm:text-xs font-bold text-[#F1D2A1]">
                    <RotateCw className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    <span>Kembali</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Impact Simulator matching Screenshot_2026_1001_021639.jpg.jpeg */}
      <div className="w-full max-w-4xl mt-6 p-4 sm:p-6 rounded-3xl bg-[#925E06]/15 border-2 border-[#925E06]/30 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#925E06]">
              SIMULASI INTERAKTIF
            </span>
            <h3 className="font-display text-base sm:text-lg font-black text-[#3B4219]">
              Seberapa Besar Dampak Gaya Hidup Reduce-mu?
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#808847] text-white self-start sm:self-auto">
            1 Semester Kuliah
          </span>
        </div>

        {/* 3 Interactive Toggle Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
          <button
            type="button"
            onClick={() => toggleSim(setSimTumbler)}
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer border-2 text-left ${
              simTumbler
                ? 'bg-[#808847] text-[#F1D2A1] border-[#5E6430] shadow-sm'
                : 'bg-black/10 text-[#4D3A1F] border-transparent hover:bg-black/15'
            }`}
          >
            <Coffee className="w-4 h-4 shrink-0" />
            <div>
              <div className="font-black leading-tight">Bawa Tumbler</div>
              <div className="text-[10px] opacity-85">Hemat 2 cup plastik/hari</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleSim(setSimTotebag)}
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer border-2 text-left ${
              simTotebag
                ? 'bg-[#808847] text-[#F1D2A1] border-[#5E6430] shadow-sm'
                : 'bg-black/10 text-[#4D3A1F] border-transparent hover:bg-black/15'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <div>
              <div className="font-black leading-tight">Bawa Totebag</div>
              <div className="text-[10px] opacity-85">Tolak 3 kantong kresek/hari</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleSim(setSimFood)}
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer border-2 text-left ${
              simFood
                ? 'bg-[#808847] text-[#F1D2A1] border-[#5E6430] shadow-sm'
                : 'bg-black/10 text-[#4D3A1F] border-transparent hover:bg-black/15'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 shrink-0" />
            <div>
              <div className="font-black leading-tight">Habiskan Makanan</div>
              <div className="text-[10px] opacity-85">Cegah 300gr sisa makanan</div>
            </div>
          </button>
        </div>

        {/* 3 Result Stat Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#F1D2A1] border-2 border-[#925E06]/30 text-center shadow-sm">
            <div className="font-display text-xl sm:text-3xl font-black text-[#925E06] leading-none">
              {plasticCount}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-[#573907] mt-1">
              Plastik Ditiadakan
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#F1D2A1] border-2 border-[#925E06]/30 text-center shadow-sm">
            <div className="font-display text-xl sm:text-3xl font-black text-[#808847] leading-none">
              Rp {(moneySaved / 1000).toLocaleString('id-ID')}rb
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-[#444C1D] mt-1">
              Uang Jajan Hemat
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#F1D2A1] border-2 border-[#925E06]/30 text-center shadow-sm">
            <div className="font-display text-xl sm:text-3xl font-black text-[#925E06] leading-none">
              {foodSavedKg} kg
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-[#573907] mt-1">
              Sampah Makanan Dicegah
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
