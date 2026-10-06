import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { FACTS_DATA } from '../data/content';
import { sounds } from '../utils/audio';
import { GrassDivider } from './GrassDivider';

export const FactsSection: React.FC = () => {
  // Fact-3 expanded by default matching Screenshot_2026_1001_021639.jpg.jpeg
  const [selectedFactId, setSelectedFactId] = useState<string | null>('fact-3');

  const toggleFact = (id: string) => {
    sounds.playPop();
    setSelectedFactId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="facts" className="py-12 px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header matching 3R DMI.jpg & Screenshot */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#283618] leading-tight tracking-tight uppercase">
          FAKTA YANG HARUS KAMU KETAHUI
        </h2>
        <p className="font-body text-[#283618]/90 text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
          klik setiap kotak untuk melihat rincian data dan animasi dampaknya.
        </p>
      </div>

      {/* 3 Interactive Stat Cards matching Screenshot_2026_1001_021639.jpg.jpeg */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-4xl items-stretch">
        {FACTS_DATA.map((fact) => {
          const isExpanded = selectedFactId === fact.id;

          return (
            <div
              key={fact.id}
              onClick={() => toggleFact(fact.id)}
              className={`rounded-3xl p-6 transition-all duration-300 shadow-xl cursor-pointer border-2 flex flex-col justify-between h-full min-h-[340px] select-none transform hover:-translate-y-2.5 hover:scale-[1.025] hover:shadow-2xl group ${
                isExpanded
                  ? 'bg-[#283618] text-[#FEFAE0] border-[#1e2a12] ring-4 ring-[#283618]/25 scale-[1.02]'
                  : 'bg-[#5B4436] text-[#FEFAE0] border-[#433126] hover:bg-[#433126] hover:border-[#FEFAE0]/50'
              }`}
            >
              <div>
                <div className="h-6 flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/25 text-[#FEFAE0] whitespace-nowrap group-hover:bg-black/40 group-hover:scale-105 transition-all">
                    {fact.badge}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-125 group-hover:bg-white/30 transition-all">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Numeric Counter with Hover Scale */}
                <div className="my-2 min-h-[72px] flex flex-col justify-center">
                  <div className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums leading-none group-hover:scale-105 group-hover:text-amber-200 transition-all origin-left drop-shadow">
                    {fact.number}
                  </div>
                  <div className="font-display text-xs sm:text-sm font-bold text-[#FEFAE0]/90 uppercase tracking-wide mt-1 group-hover:text-white transition-colors">
                    {fact.unit}
                  </div>
                </div>

                {/* Subtext description */}
                <p className="font-body text-xs sm:text-sm font-semibold text-white/95 leading-snug line-clamp-3">
                  {fact.title}
                </p>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/20 animate-fade-in text-xs leading-relaxed text-[#FEFAE0]/95">
                    <p className="mb-2">{fact.description}</p>
                    <p className="text-[11px] text-white/80">{fact.detailText}</p>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#FEFAE0]/70 group-hover:text-white transition-colors">
                <span className="truncate">{fact.source}</span>
                <span className="shrink-0 text-white group-hover:underline">{isExpanded ? 'Tutup' : 'Tap untuk melihat detail data'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decomposition Timeline Table with Hover Highlights */}
      <div className="w-full max-w-4xl mt-8 p-6 rounded-3xl bg-[#5B4436]/15 border-2 border-[#5B4436]/30 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#5B4436]" />
          <h3 className="font-display text-base font-black text-[#283618] uppercase tracking-wide">
            Waktu Dekomposisi Sampah di Alam Bebas
          </h3>
        </div>

        <div className="divide-y divide-[#5B4436]/20 text-sm">
          <div className="py-2.5 px-2.5 rounded-xl flex items-center justify-between transition-all duration-200 hover:bg-[#5B4436]/15 hover:scale-[1.01] hover:pl-4 cursor-default group">
            <span className="font-semibold text-[#283618] group-hover:text-[#5B4436] transition-colors">Kertas HVS / Catatan Kuliah</span>
            <span className="font-bold text-[#283618] bg-[#283618]/15 px-3 py-1 rounded-full text-xs group-hover:scale-105 group-hover:bg-[#283618] group-hover:text-white transition-all">2 – 6 Minggu</span>
          </div>
          <div className="py-2.5 px-2.5 rounded-xl flex items-center justify-between transition-all duration-200 hover:bg-[#5B4436]/15 hover:scale-[1.01] hover:pl-4 cursor-default group">
            <span className="font-semibold text-[#283618] group-hover:text-[#5B4436] transition-colors">Kantong Kresek Plastik</span>
            <span className="font-bold text-[#5B4436] bg-[#5B4436]/15 px-3 py-1 rounded-full text-xs group-hover:scale-105 group-hover:bg-[#5B4436] group-hover:text-white transition-all">20 – 50 Tahun</span>
          </div>
          <div className="py-2.5 px-2.5 rounded-xl flex items-center justify-between transition-all duration-200 hover:bg-[#5B4436]/15 hover:scale-[1.01] hover:pl-4 cursor-default group">
            <span className="font-semibold text-[#283618] group-hover:text-[#5B4436] transition-colors">Botol Plastik PET (Air Mineral / Es Teh)</span>
            <span className="font-bold text-[#5B4436] bg-[#5B4436]/20 px-3 py-1 rounded-full text-xs group-hover:scale-105 group-hover:bg-[#5B4436] group-hover:text-white transition-all">450 Tahun (Berbahaya)</span>
          </div>
          <div className="py-2.5 px-2.5 rounded-xl flex items-center justify-between transition-all duration-200 hover:bg-[#5B4436]/15 hover:scale-[1.01] hover:pl-4 cursor-default group">
            <span className="font-semibold text-[#283618] group-hover:text-[#5B4436] transition-colors">Botol Kaca Kopi / Minuman</span>
            <span className="font-bold text-[#5B4436] bg-[#5B4436]/25 px-3 py-1 rounded-full text-xs group-hover:scale-105 group-hover:bg-[#5B4436] group-hover:text-white transition-all">1.000.000+ Tahun</span>
          </div>
          <div className="py-2.5 px-2.5 rounded-xl flex items-center justify-between transition-all duration-200 hover:bg-[#5B4436]/15 hover:scale-[1.01] hover:pl-4 cursor-default group">
            <span className="font-semibold text-[#283618] group-hover:text-[#5B4436] transition-colors">Styrofoam Kotak Makanan</span>
            <span className="font-bold text-red-700 bg-red-700/15 px-3 py-1 rounded-full text-xs group-hover:scale-105 group-hover:bg-red-700 group-hover:text-white transition-all">Tidak Pernah Terurai Alami</span>
          </div>
        </div>
      </div>

      {/* Grass Silhouette Line Divider matching reference images */}
      <GrassDivider variant="bottom" className="w-full mt-8" />
    </section>
  );
};
