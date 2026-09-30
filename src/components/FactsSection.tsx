import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Clock } from 'lucide-react';
import { FACTS_DATA } from '../data/content';
import { sounds } from '../utils/audio';

export const FactsSection: React.FC = () => {
  const [selectedFactId, setSelectedFactId] = useState<string | null>(null);

  const toggleFact = (id: string) => {
    sounds.playPop();
    setSelectedFactId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="facts" className="py-8 sm:py-12 px-2 sm:px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header matching 3R DMI.jpg */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-[#808847] leading-tight tracking-tight uppercase">
          FAKTA YANG HARUS KAMU KETAHUI
        </h2>
        <p className="font-body text-[#3B4219] text-xs sm:text-base font-semibold mt-1 sm:mt-2 max-w-md mx-auto">
          klik setiap kotak untuk melihat rincian data dan animasi dampaknya.
        </p>
      </div>

      {/* 3 Interactive Stat Cards - ALWAYS 3 columns side-by-side on mobile AND desktop */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 md:gap-6 w-full max-w-4xl items-stretch">
        {FACTS_DATA.map((fact) => {
          const isExpanded = selectedFactId === fact.id;

          return (
            <div
              key={fact.id}
              onClick={() => toggleFact(fact.id)}
              className={`rounded-2xl sm:rounded-3xl p-2 sm:p-4 md:p-6 transition-all duration-300 shadow-md sm:shadow-xl cursor-pointer border-2 flex flex-col justify-between h-full min-h-[220px] sm:min-h-[280px] md:min-h-[340px] select-none ${
                isExpanded
                  ? 'bg-[#808847] text-[#F1D2A1] border-[#656C30] ring-2 sm:ring-4 ring-[#808847]/30 scale-[1.01] sm:scale-[1.02]'
                  : 'bg-[#925E06] text-[#F1D2A1] border-[#784D05] hover:bg-[#835405]'
              }`}
            >
              <div>
                <div className="h-5 sm:h-6 flex items-center justify-between mb-1 sm:mb-3">
                  <span className="text-[6.5px] sm:text-[10px] font-black uppercase tracking-wider px-1 sm:px-2.5 py-0.5 rounded-full bg-black/25 text-[#F1D2A1] truncate">
                    {fact.badge}
                  </span>
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                    {isExpanded ? <ChevronUp className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> : <ChevronDown className="w-2.5 h-2.5 sm:w-4 sm:h-4" />}
                  </div>
                </div>

                {/* Numeric Counter */}
                <div className="my-1 sm:my-2 min-h-[44px] sm:min-h-[60px] md:min-h-[72px] flex flex-col justify-center">
                  <div className="font-display text-xl sm:text-3xl md:text-5xl font-black text-white tracking-tight tabular-nums leading-none">
                    {fact.number}
                  </div>
                  <div className="font-display text-[7.5px] sm:text-xs md:text-sm font-bold text-[#F1D2A1]/90 uppercase tracking-wide mt-0.5 sm:mt-1 truncate">
                    {fact.unit}
                  </div>
                </div>

                {/* Subtext description */}
                <p className="font-body text-[7.5px] sm:text-xs md:text-sm font-semibold text-white/95 leading-tight sm:leading-snug line-clamp-3 sm:line-clamp-none">
                  {fact.description}
                </p>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-white/20 animate-fade-in">
                    <p className="text-[7.5px] sm:text-xs text-[#F1D2A1] leading-tight">
                      {fact.detailText}
                    </p>
                    <div className="mt-1.5 p-1 sm:p-2 rounded-lg bg-black/25 flex items-start gap-1 text-[7px] sm:text-[11px] text-amber-200">
                      <Info className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{fact.title}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[6.5px] sm:text-[11px] font-bold text-[#F1D2A1]/70">
                <span className="truncate max-w-[70px] sm:max-w-none">{fact.source}</span>
                <span className="shrink-0 text-white font-black">{isExpanded ? 'Tutup' : 'Buka'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decomposition Timeline Table matching Screenshot_2026_1001_021639.jpg.jpeg */}
      <div className="w-full max-w-4xl mt-6 p-4 sm:p-6 rounded-3xl bg-[#925E06]/15 border-2 border-[#925E06]/30 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#925E06]" />
          <h3 className="font-display text-sm sm:text-base font-black text-[#3B4219] uppercase tracking-wide">
            Waktu Dekomposisi Sampah di Alam Bebas
          </h3>
        </div>

        <div className="divide-y divide-[#925E06]/20 text-xs sm:text-sm">
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold text-[#3B4219]">Kertas HVS / Catatan Kuliah</span>
            <span className="font-bold text-[#808847] bg-[#808847]/15 px-2.5 py-0.5 rounded-full text-xs">2 – 6 Minggu</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold text-[#3B4219]">Kantong Kresek Plastik</span>
            <span className="font-bold text-[#925E06] bg-[#925E06]/15 px-2.5 py-0.5 rounded-full text-xs">20 – 50 Tahun</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold text-[#3B4219]">Botol Plastik PET (Air Mineral / Es Teh)</span>
            <span className="font-bold text-[#925E06] bg-[#925E06]/20 px-2.5 py-0.5 rounded-full text-xs">450 Tahun (Berbahaya)</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold text-[#3B4219]">Botol Kaca Kopi / Minuman</span>
            <span className="font-bold text-amber-900 bg-amber-900/15 px-2.5 py-0.5 rounded-full text-xs">1.000.000+ Tahun</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold text-[#3B4219]">Styrofoam Kotak Makanan</span>
            <span className="font-bold text-red-700 bg-red-700/15 px-2.5 py-0.5 rounded-full text-xs">Tidak Pernah Terurai Alami</span>
          </div>
        </div>
      </div>
    </section>
  );
};
