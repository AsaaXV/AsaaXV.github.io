import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Check, AlertCircle, Package, Wine, Shirt } from 'lucide-react';
import { REUSE_ITEMS } from '../data/content';
import { sounds } from '../utils/audio';

export const ReuseSection: React.FC = () => {
  // Store state for each card: 0 = Before (Limbah), 1 = After (Upcycled)
  const [cardStates, setCardStates] = useState<Record<string, number>>({
    'reuse-1': 0,
    'reuse-2': 0,
    'reuse-3': 0,
  });

  const toggleCardState = (id: string, targetState?: number) => {
    sounds.playPop();
    setCardStates((prev) => {
      const current = prev[id] || 0;
      const next = targetState !== undefined ? targetState : current === 0 ? 1 : 0;
      return { ...prev, [id]: next };
    });
  };

  return (
    <section id="reuse" className="py-8 sm:py-12 px-2 sm:px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header matching 3R DMI.jpg */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-[#808847] leading-tight tracking-tight uppercase">
          REUSE
        </h2>
        <div className="font-display text-lg sm:text-2xl md:text-3xl font-black text-[#808847] tracking-wider uppercase mt-0.5 sm:mt-1">
          MASIH BISA DI PAKAI NGGAK?
        </div>
        <p className="font-body text-[#3B4219] text-xs sm:text-base font-semibold mt-1 sm:mt-2 max-w-md mx-auto">
          kita mengupayakan barang yang kita punya selagi masih layak pakai.
        </p>
      </div>

      {/* 3 Interactive Before/After Cards - ALWAYS 3 columns side-by-side on mobile AND desktop */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 md:gap-6 w-full max-w-4xl items-stretch">
        {REUSE_ITEMS.map((item) => {
          const isAfter = (cardStates[item.id] || 0) === 1;

          return (
            <div
              key={item.id}
              className="flex flex-col items-center justify-between h-full w-full"
            >
              {/* Main Card */}
              <div
                onClick={() => toggleCardState(item.id)}
                className={`w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[460px] rounded-2xl sm:rounded-3xl p-2 sm:p-4 md:p-5 flex flex-col justify-between transition-all duration-300 shadow-md sm:shadow-xl cursor-pointer border-2 select-none ${
                  isAfter
                    ? 'bg-[#808847] text-[#F1D2A1] border-[#686F35]'
                    : 'bg-[#925E06] text-[#F1D2A1] border-[#794E05]'
                }`}
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="h-5 sm:h-7 flex items-center justify-between gap-1 mb-1.5 sm:mb-3">
                    <span className="text-[7.5px] sm:text-[11px] font-black uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 rounded-full bg-black/25 text-[#F1D2A1] truncate">
                      {item.category}
                    </span>

                    {/* Interactive Switcher */}
                    <div className="inline-flex items-center p-0.5 rounded-full bg-black/30 border border-white/10 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardState(item.id, 0);
                        }}
                        className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[6.5px] sm:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          !isAfter
                            ? 'bg-[#F1D2A1] text-[#925E06] shadow-xs'
                            : 'text-[#F1D2A1]/70 hover:text-white'
                        }`}
                      >
                        SBLM
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardState(item.id, 1);
                        }}
                        className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[6.5px] sm:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-0.5 ${
                          isAfter
                            ? 'bg-[#F1D2A1] text-[#4E5421] shadow-xs'
                            : 'text-[#F1D2A1]/70 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                        SSDH
                      </button>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="min-h-[36px] sm:min-h-[48px] md:min-h-[56px] flex flex-col justify-start">
                    <h3 className="font-display text-[10px] sm:text-base md:text-lg font-black text-white leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[7.5px] sm:text-xs text-[#F1D2A1]/85 font-medium mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Visual Art Box with inner navigation chevrons */}
                  <div className="my-1.5 sm:my-3 h-20 sm:h-28 md:h-36 rounded-xl sm:rounded-2xl bg-black/25 flex flex-col items-center justify-center p-1 sm:p-3 relative overflow-hidden group border border-white/10">
                    {/* Inner Left Arrow */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardState(item.id, 0);
                      }}
                      title="Lihat Sebelum"
                      className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-black/40 hover:bg-black/70 text-[#F1D2A1] flex items-center justify-center transition-all ${
                        !isAfter ? 'opacity-25 cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
                      }`}
                    >
                      <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" />
                    </button>

                    {/* Inner Right Arrow */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardState(item.id, 1);
                      }}
                      title="Lihat Sesudah"
                      className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-black/40 hover:bg-black/70 text-[#F1D2A1] flex items-center justify-center transition-all ${
                        isAfter ? 'opacity-25 cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
                      }`}
                    >
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" />
                    </button>

                    {item.id === 'reuse-1' && (
                      !isAfter ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-0.5 sm:mb-1 text-[#F1D2A1]">
                            <Wine className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2]" />
                          </div>
                          <span className="text-[8px] sm:text-xs font-bold text-[#F1D2A1] line-clamp-1">Botol Kopi</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-900/40 flex items-center justify-center mb-0.5 sm:mb-1 text-emerald-200">
                            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2]" />
                          </div>
                          <span className="text-[8px] sm:text-xs font-bold text-white line-clamp-1">Pot Sukulen</span>
                        </div>
                      )
                    )}

                    {item.id === 'reuse-2' && (
                      !isAfter ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-0.5 sm:mb-1 text-[#F1D2A1]">
                            <Package className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2]" />
                          </div>
                          <span className="text-[8px] sm:text-xs font-bold text-[#F1D2A1] line-clamp-1">Kardus Paket</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-900/40 flex items-center justify-center mb-0.5 sm:mb-1 text-emerald-200">
                            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2]" />
                          </div>
                          <span className="text-[8px] sm:text-xs font-bold text-white line-clamp-1">Desk Storage</span>
                        </div>
                      )
                    )}

                    {item.id === 'reuse-3' && (
                      !isAfter ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center mb-0.5 sm:mb-1 text-[#F1D2A1]">
                            <Shirt className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2]" />
                          </div>
                          <span className="text-[8px] sm:text-xs font-bold text-[#F1D2A1] line-clamp-1">Kaos Usang</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-900/40 flex items-center justify-center mb-0.5 sm:mb-1 text-emerald-200">
                            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2]" />
                          </div>
                          <span className="text-[8px] sm:text-xs font-bold text-white line-clamp-1">Totebag</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Description Area */}
                  <div className="min-h-[55px] sm:min-h-[85px] md:min-h-[110px] text-[7.5px] sm:text-xs leading-tight sm:leading-relaxed flex flex-col justify-start">
                    {isAfter ? (
                      <div>
                        <p className="text-white font-medium mb-1 line-clamp-2">{item.after.description}</p>
                        <div className="p-1 sm:p-2 rounded-lg bg-white/15 text-[7px] sm:text-[11px] text-[#F1D2A1] flex items-start gap-1">
                          <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#F1D2A1] shrink-0 mt-0.5" />
                          <span className="line-clamp-2"><strong>Manfaat:</strong> {item.after.benefit}</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[#F1D2A1]/95 font-medium mb-1 line-clamp-2">{item.before.description}</p>
                        <div className="p-1 sm:p-2 rounded-lg bg-black/25 text-[7px] sm:text-[11px] text-amber-200 flex items-start gap-1">
                          <AlertCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{item.before.drawback}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footnote */}
                <div className="pt-1 sm:pt-2 text-center text-[7px] sm:text-[10px] font-bold text-[#F1D2A1]/75 border-t border-white/10">
                  {isAfter ? 'Kondisi awal' : 'Hasil kreasi'}
                </div>
              </div>

              {/* Dots indicator matching mockup `..` below each card */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                <button
                  type="button"
                  onClick={() => toggleCardState(item.id, 0)}
                  aria-label="Ke Sebelum"
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer ${
                    !isAfter ? 'bg-[#925E06] ring-2 ring-[#925E06]/40 scale-110' : 'bg-[#808847]/40 hover:bg-[#808847]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleCardState(item.id, 1)}
                  aria-label="Ke Sesudah"
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer ${
                    isAfter ? 'bg-[#808847] ring-2 ring-[#808847]/40 scale-110' : 'bg-[#808847]/40 hover:bg-[#808847]'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Callout matching 3R DMI.jpg */}
      <div className="w-full text-center mt-6 sm:mt-10 mb-2 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl bg-[#808847]/15 border border-[#808847]/30">
        <p className="font-display text-xs sm:text-lg md:text-xl font-black text-[#5C6330] tracking-wide">
          "Siapa bilang barang bekas tidak bisa naik kelas?"
        </p>
      </div>
    </section>
  );
};
