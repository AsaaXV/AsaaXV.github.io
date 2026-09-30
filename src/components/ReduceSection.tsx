import React, { useState } from 'react';
import { RotateCw, CheckCircle2, Sparkles, ShoppingBag, Coffee, UtensilsCrossed } from 'lucide-react';
import { REDUCE_CARDS } from '../data/content';
import { sounds } from '../utils/audio';

export const ReduceSection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [calculatorState, setCalculatorState] = useState({
    tumbler: true,
    totebag: true,
    food: true,
  });

  const toggleFlip = (id: string) => {
    sounds.playFlip();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Daily waste savings calculation
  const cupsSaved = calculatorState.tumbler ? 2 : 0;
  const bagsSaved = calculatorState.totebag ? 3 : 0;
  const foodSavedGrams = calculatorState.food ? 300 : 0;
  const semesterDays = 120; // 1 semester aktif kuliah
  const totalPlasticItems = (cupsSaved + bagsSaved) * semesterDays;
  const totalMoneySaved = (cupsSaved * 8000) * semesterDays; // beli minum di luar vs isi tumbler

  return (
    <section id="reduce" className="py-12 px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header matching 3R DMI.jpg */}
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#808847] leading-tight tracking-tight uppercase">
          REDUCE
        </h2>
        <div className="font-display text-xl sm:text-2xl md:text-3xl font-black text-[#808847] tracking-wider uppercase mt-1">
          KURANGI DARI AWAL
        </div>
        <p className="font-body text-[#3B4219] text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
          cara terbaik untuk mengelola sampah adalah tidak menghasilkannya.
        </p>
      </div>

      {/* 3 Interactive Flip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {REDUCE_CARDS.map((card) => {
          const isFlipped = !!flippedCards[card.id];

          return (
            <div
              key={card.id}
              className="perspective-1000 h-[430px] w-full cursor-pointer select-none group"
              onClick={() => toggleFlip(card.id)}
            >
              <div
                className={`relative w-full h-full rounded-3xl transition-transform duration-500 transform-style-3d shadow-xl ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT SIDE (Golden Brown matching mockup) */}
                <div className="absolute inset-0 w-full h-full rounded-3xl bg-[#925E06] text-[#F1D2A1] p-6 flex flex-col justify-between backface-hidden border-2 border-[#794E05]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-2xl font-black text-[#F1D2A1]/80">
                        {card.number}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F1D2A1]/20 text-[#F1D2A1]">
                        {card.tagline}
                      </span>
                    </div>

                    {/* Stylized Illustrated Icon Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-[#F1D2A1]/15 mx-auto flex items-center justify-center my-4 group-hover:scale-110 transition-transform">
                      {card.iconType === 'plastic' && <ShoppingBag className="w-8 h-8 text-[#F1D2A1]" />}
                      {card.iconType === 'tumbler' && <Coffee className="w-8 h-8 text-[#F1D2A1]" />}
                      {card.iconType === 'food' && <UtensilsCrossed className="w-8 h-8 text-[#F1D2A1]" />}
                    </div>

                    <div className="min-h-[56px] flex items-center justify-center">
                      <h3 className="font-display text-xl font-black text-center text-white leading-tight">
                        {card.title}
                      </h3>
                    </div>

                    <div className="min-h-[72px] flex items-center justify-center">
                      <p className="font-body text-xs sm:text-sm text-center text-[#F1D2A1]/90 leading-relaxed">
                        {card.frontDescription}
                      </p>
                    </div>
                  </div>

                  {/* Bottom hint to flip */}
                  <div className="pt-4 border-t border-[#F1D2A1]/20 flex items-center justify-center gap-1.5 text-xs font-bold text-[#F1D2A1]/80 group-hover:text-white transition">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Klik untuk Balik Kartu</span>
                  </div>
                </div>

                {/* BACK SIDE (Rich Olive Mustard Card) */}
                <div className="absolute inset-0 w-full h-full rounded-3xl bg-[#808847] text-[#F1D2A1] p-6 flex flex-col justify-between backface-hidden rotate-y-180 border-2 border-[#697034]">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#F1D2A1]/25 mb-3">
                      <span className="font-display text-sm font-bold text-white uppercase tracking-wider">
                        Aksi Praktis Mahasiswa
                      </span>
                      <span className="font-display text-xs text-[#F1D2A1]/90 font-black">
                        #{card.number}
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-white/95 font-medium min-h-[140px]">
                      {card.backTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F1D2A1] shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Impact stat box */}
                    <div className="mt-2 p-2.5 rounded-xl bg-[#686F35]/70 border border-[#F1D2A1]/30">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F1D2A1]">
                        <Sparkles className="w-3 h-3 text-[#F1D2A1]" />
                        <span>Dampak Nyata:</span>
                      </div>
                      <p className="text-[11px] font-semibold text-white mt-0.5">
                        {card.impactMetric}
                      </p>
                    </div>
                  </div>

                  {/* Back button */}
                  <div className="pt-3 border-t border-[#F1D2A1]/20 flex items-center justify-center gap-1.5 text-xs font-bold text-[#F1D2A1]">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Kembali ke Depan</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Micro Simulation: Kalkulator Dampak Mahasiswa */}
      <div className="w-full mt-10 p-6 rounded-3xl bg-[#E6C38E]/70 border-2 border-[#808847]/40 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#808847]/30">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#925E06] block">
              Simulasi Interaktif
            </span>
            <h4 className="font-display text-lg sm:text-xl font-black text-[#242A16]">
              Seberapa Besar Dampak Gaya Hidup Reduce-mu?
            </h4>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#808847] text-[#F1D2A1] self-start sm:self-auto">
            1 Semester Kuliah
          </span>
        </div>

        {/* Action Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <button
            onClick={() => {
              sounds.playPop();
              setCalculatorState((prev) => ({ ...prev, tumbler: !prev.tumbler }));
            }}
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-left transition cursor-pointer border ${
              calculatorState.tumbler
                ? 'bg-[#808847] text-[#F1D2A1] border-[#5E6430] shadow'
                : 'bg-[#F1D2A1]/60 text-[#474F20] border-[#808847]/30 hover:bg-[#F1D2A1]'
            }`}
          >
            <Coffee className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs font-black">Bawa Tumbler</p>
              <p className="text-[10px] opacity-80">Hemat 2 cup plastik/hari</p>
            </div>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setCalculatorState((prev) => ({ ...prev, totebag: !prev.totebag }));
            }}
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-left transition cursor-pointer border ${
              calculatorState.totebag
                ? 'bg-[#808847] text-[#F1D2A1] border-[#5E6430] shadow'
                : 'bg-[#F1D2A1]/60 text-[#474F20] border-[#808847]/30 hover:bg-[#F1D2A1]'
            }`}
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs font-black">Bawa Totebag</p>
              <p className="text-[10px] opacity-80">Tolak 3 kantong kresek/hari</p>
            </div>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setCalculatorState((prev) => ({ ...prev, food: !prev.food }));
            }}
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-left transition cursor-pointer border ${
              calculatorState.food
                ? 'bg-[#808847] text-[#F1D2A1] border-[#5E6430] shadow'
                : 'bg-[#F1D2A1]/60 text-[#474F20] border-[#808847]/30 hover:bg-[#F1D2A1]'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs font-black">Habiskan Makanan</p>
              <p className="text-[10px] opacity-80">Cegah 300gr sisa makanan</p>
            </div>
          </button>
        </div>

        {/* Result Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white/70">
            <span className="block font-display text-2xl sm:text-3xl font-black text-[#925E06] tabular-nums">
              {totalPlasticItems}
            </span>
            <span className="text-[11px] font-bold text-[#3B4219]">Plastik Ditiadakan</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70">
            <span className="block font-display text-2xl sm:text-3xl font-black text-[#808847] tabular-nums">
              Rp {(totalMoneySaved / 1000).toLocaleString('id-ID')}rb
            </span>
            <span className="text-[11px] font-bold text-[#3B4219]">Uang Jajan Hemat</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 col-span-2 sm:col-span-1">
            <span className="block font-display text-2xl sm:text-3xl font-black text-[#242A16] tabular-nums">
              {((foodSavedGrams * semesterDays) / 1000).toFixed(0)} kg
            </span>
            <span className="text-[11px] font-bold text-[#3B4219]">Sampah Makanan Dicegah</span>
          </div>
        </div>
      </div>
    </section>
  );
};
