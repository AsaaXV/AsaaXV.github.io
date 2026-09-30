import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BarChart3, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { FACTS_DATA } from '../data/content';
import { sounds } from '../utils/audio';

export const FactsSection: React.FC = () => {
  const [selectedFactId, setSelectedFactId] = useState<string | null>('fact-1');

  const toggleFact = (id: string) => {
    sounds.playPop();
    setSelectedFactId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="facts" className="py-12 px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header matching 3R DMI.jpg */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#808847] leading-tight tracking-tight uppercase">
          FAKTA YANG
        </h2>
        <div className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#808847] tracking-wider uppercase mt-0.5">
          HARUS KAMU KETAHUI
        </div>
        <p className="font-body text-[#3B4219] text-xs sm:text-sm font-semibold mt-2 max-w-md mx-auto">
          klik setiap kotak untuk melihat rincian data dan animasi dampaknya.
        </p>
      </div>

      {/* 3 Interactive Stat Cards matching 3R DMI.jpg mockup - perfectly rata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl items-stretch">
        {FACTS_DATA.map((fact) => {
          const isExpanded = selectedFactId === fact.id;

          return (
            <div
              key={fact.id}
              onClick={() => toggleFact(fact.id)}
              className={`rounded-3xl p-6 transition-all duration-300 shadow-xl cursor-pointer border-2 flex flex-col justify-between h-full min-h-[340px] select-none ${
                isExpanded
                  ? 'bg-[#808847] text-[#F1D2A1] border-[#656C30] ring-4 ring-[#808847]/30 scale-[1.02]'
                  : 'bg-[#925E06] text-[#F1D2A1] border-[#784D05] hover:bg-[#835405]'
              }`}
            >
              <div>
                <div className="h-6 flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/25 text-[#F1D2A1] whitespace-nowrap">
                    {fact.badge}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Animated Numeric Counter */}
                <div className="my-2 min-h-[72px] flex flex-col justify-center">
                  <div className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums leading-none">
                    {fact.number}
                  </div>
                  <div className="font-display text-xs sm:text-sm font-bold text-[#F1D2A1]/90 uppercase tracking-wide mt-1">
                    {fact.unit}
                  </div>
                </div>

                <div className="min-h-[48px] flex items-center">
                  <h3 className="font-display text-base font-black text-white leading-snug">
                    {fact.title}
                  </h3>
                </div>

                <p className="text-xs text-[#F1D2A1]/90 font-medium mt-2 leading-relaxed">
                  {fact.description}
                </p>
              </div>

              {/* Expandable Context Area */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white leading-relaxed animate-fade-in">
                  <p className="font-semibold mb-2">{fact.detailText}</p>
                  <p className="text-[10px] text-[#F1D2A1]/80 italic">
                    Sumber: {fact.source}
                  </p>
                </div>
              )}

              {/* Bottom hint */}
              {!isExpanded && (
                <div className="mt-4 pt-3 border-t border-[#F1D2A1]/20 text-[10px] font-bold text-center text-[#F1D2A1]/70">
                  Tap untuk melihat detail data
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Breakdown Timeline & National Waste Chart */}
      <div className="w-full mt-10 p-6 rounded-3xl bg-[#E6C38E]/70 border-2 border-[#808847]/40 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#925E06]" />
          <h4 className="font-display text-base sm:text-lg font-black text-[#242A16]">
            Waktu Dekomposisi Sampah di Alam Bebas
          </h4>
        </div>

        <div className="space-y-3 text-xs font-semibold">
          <div>
            <div className="flex justify-between mb-1 text-[#242A16]">
              <span>Kertas HVS / Catatan Kuliah</span>
              <span className="font-bold text-[#808847]">2 - 6 Minggu</span>
            </div>
            <div className="w-full bg-[#F1D2A1] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#808847] h-full w-[8%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-[#242A16]">
              <span>Kantong Kresek Plastik</span>
              <span className="font-bold text-[#925E06]">20 - 50 Tahun</span>
            </div>
            <div className="w-full bg-[#F1D2A1] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#925E06] h-full w-[45%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-[#242A16]">
              <span>Botol Plastik PET</span>
              <span className="font-bold text-rose-800">450 Tahun (Berbahaya)</span>
            </div>
            <div className="w-full bg-[#F1D2A1] h-2.5 rounded-full overflow-hidden">
              <div className="bg-rose-700 h-full w-[85%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-[#242A16]">
              <span>Styrofoam Makanan</span>
              <span className="font-bold text-red-950">Selamanya (Tidak Terurai!)</span>
            </div>
            <div className="w-full bg-[#F1D2A1] h-2.5 rounded-full overflow-hidden">
              <div className="bg-red-950 h-full w-[100%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
