import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRightLeft, Check, AlertCircle, Package, Wine, Shirt } from 'lucide-react';
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
    <section id="reuse" className="py-12 px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header matching 3R DMI.jpg & Screenshot */}
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#808847] leading-tight tracking-tight uppercase">
          REUSE
        </h2>
        <div className="font-display text-xl sm:text-2xl md:text-3xl font-black text-[#808847] tracking-wider uppercase mt-1">
          MASIH BISA DI PAKAI NGGAK?
        </div>
        <p className="font-body text-[#3B4219] text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
          kita mengupayakan barang yang kita punya selagi masih layak pakai.
        </p>
      </div>

      {/* 3 Cards matching Screenshot_2026_1001_021639.jpg.jpeg */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-4xl items-stretch">
        {REUSE_ITEMS.map((item) => {
          const isAfter = (cardStates[item.id] || 0) === 1;

          return (
            <div key={item.id} className="flex flex-col items-center justify-between h-full w-full">
              {/* Card Container with navigation buttons on sides */}
              <div className="relative w-full flex-1 flex flex-col items-center">
                {/* Left Arrow Button matching mockup & screenshot `<` */}
                <button
                  type="button"
                  onClick={() => toggleCardState(item.id, 0)}
                  aria-label="Lihat Sebelum"
                  className={`absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#808847] text-[#F1D2A1] flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                    !isAfter ? 'opacity-40 cursor-default' : 'hover:bg-[#686F35] active:scale-95'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 stroke-[3]" />
                </button>

                {/* Main Card with exact desktop proportions */}
                <div
                  onClick={() => toggleCardState(item.id)}
                  className={`w-full h-full min-h-[460px] rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl cursor-pointer border-2 select-none ${
                    isAfter
                      ? 'bg-[#808847] text-[#F1D2A1] border-[#686F35]'
                      : 'bg-[#925E06] text-[#F1D2A1] border-[#794E05]'
                  }`}
                >
                  {/* Top Bar inside Card */}
                  <div>
                    <div className="h-7 flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/25 text-[#F1D2A1] truncate max-w-[130px]">
                        {item.category}
                      </span>
                      {/* State Badge: Sebelum vs Sesudah */}
                      <span
                        className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap inline-flex items-center gap-1 ${
                          isAfter ? 'bg-[#F1D2A1] text-[#4E5421]' : 'bg-[#F1D2A1]/20 text-white'
                        }`}
                      >
                        {isAfter ? (
                          <>
                            <Sparkles className="w-3 h-3 text-[#4E5421] shrink-0" />
                            <span>SESUDAH</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-white shrink-0" />
                            <span>SEBELUM</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Title & Subtitle with fixed minimum height */}
                    <div className="min-h-[56px] flex flex-col justify-start">
                      <h3 className="font-display text-lg font-black text-white leading-snug line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#F1D2A1]/85 font-medium mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Visual Art Box */}
                    <div className="my-3 h-36 rounded-2xl bg-black/25 flex flex-col items-center justify-center p-3 relative overflow-hidden group border border-white/10">
                      {item.id === 'reuse-1' && (
                        !isAfter ? (
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-1 text-[#F1D2A1]">
                              <Wine className="w-7 h-7 stroke-[2]" />
                            </div>
                            <span className="text-xs font-bold text-[#F1D2A1]">Botol Kaca Bekas Kopi</span>
                            <span className="text-[10px] text-[#F1D2A1]/70">Limbah tak terurai</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                            <div className="w-12 h-12 rounded-xl bg-emerald-900/40 flex items-center justify-center mb-1 text-emerald-200">
                              <Sparkles className="w-7 h-7 stroke-[2]" />
                            </div>
                            <span className="text-xs font-bold text-white">Pot Hidroponik Meja Kos</span>
                            <span className="text-[10px] text-[#F1D2A1]">Estetik & hemat beli pot</span>
                          </div>
                        )
                      )}

                      {item.id === 'reuse-2' && (
                        !isAfter ? (
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-1 text-[#F1D2A1]">
                              <Package className="w-7 h-7 stroke-[2]" />
                            </div>
                            <span className="text-xs font-bold text-[#F1D2A1]">Kardus Paket Ekspedisi</span>
                            <span className="text-[10px] text-[#F1D2A1]/70">Menumpuk di sudut kos</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                            <div className="w-12 h-12 rounded-xl bg-emerald-900/40 flex items-center justify-center mb-1 text-emerald-200">
                              <Sparkles className="w-7 h-7 stroke-[2]" />
                            </div>
                            <span className="text-xs font-bold text-white">Organizer Modul Bersekat</span>
                            <span className="text-[10px] text-[#F1D2A1]">Rapi minimalis tanpa biaya</span>
                          </div>
                        )
                      )}

                      {item.id === 'reuse-3' && (
                        !isAfter ? (
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-1 text-[#F1D2A1]">
                              <Shirt className="w-7 h-7 stroke-[2]" />
                            </div>
                            <span className="text-xs font-bold text-[#F1D2A1]">Kaos Panitia Lama</span>
                            <span className="text-[10px] text-[#F1D2A1]/70">Hanya diam di lemari</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                            <div className="w-12 h-12 rounded-xl bg-emerald-900/40 flex items-center justify-center mb-1 text-emerald-200">
                              <Sparkles className="w-7 h-7 stroke-[2]" />
                            </div>
                            <span className="text-xs font-bold text-white">Totebag Tanpa Jahit</span>
                            <span className="text-[10px] text-[#F1D2A1]">Praktis dibawa belanja</span>
                          </div>
                        )
                      )}

                      {/* Tap to switch indicator */}
                      <div className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1 backdrop-blur-xs">
                        <ArrowRightLeft className="w-2.5 h-2.5" />
                        <span>Ganti Tampilan</span>
                      </div>
                    </div>

                    {/* Description Area */}
                    <div className="min-h-[115px] text-xs leading-relaxed flex flex-col justify-start">
                      {isAfter ? (
                        <div>
                          <p className="text-white font-medium mb-2 line-clamp-2">{item.after.description}</p>
                          <div className="p-2 rounded-xl bg-white/15 text-[11px] text-[#F1D2A1] flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#F1D2A1] shrink-0 mt-0.5" />
                            <span className="line-clamp-2"><strong>Manfaat:</strong> {item.after.benefit}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[#F1D2A1]/95 font-medium mb-2 line-clamp-2">{item.before.description}</p>
                          <div className="p-2 rounded-xl bg-black/25 text-[11px] text-amber-200 flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{item.before.drawback}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footnote inside card */}
                  <div className="pt-2 text-center text-[10px] font-bold text-[#F1D2A1]/75 border-t border-white/10">
                    {isAfter ? 'Klik untuk lihat kondisi awal' : 'Klik panah kanan untuk lihat hasil kreasi'}
                  </div>
                </div>

                {/* Right Arrow Button matching mockup & screenshot `>` */}
                <button
                  type="button"
                  onClick={() => toggleCardState(item.id, 1)}
                  aria-label="Lihat Sesudah"
                  className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#808847] text-[#F1D2A1] flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                    isAfter ? 'opacity-40 cursor-default' : 'hover:bg-[#686F35] active:scale-95'
                  }`}
                >
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Dots indicator matching mockup `..` below each card */}
              <div className="flex items-center justify-center gap-2 mt-3.5">
                <button
                  type="button"
                  onClick={() => toggleCardState(item.id, 0)}
                  aria-label="Ke Sebelum"
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    !isAfter ? 'bg-[#925E06] ring-2 ring-[#925E06]/40 scale-110' : 'bg-[#808847]/40 hover:bg-[#808847]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleCardState(item.id, 1)}
                  aria-label="Ke Sesudah"
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    isAfter ? 'bg-[#808847] ring-2 ring-[#808847]/40 scale-110' : 'bg-[#808847]/40 hover:bg-[#808847]'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Callout matching 3R DMI.jpg & Screenshot */}
      <div className="w-full text-center mt-10 mb-2 py-4 px-6 rounded-2xl bg-[#808847]/15 border border-[#808847]/30">
        <p className="font-display text-base sm:text-lg md:text-xl font-black text-[#5C6330] tracking-wide">
          "Siapa bilang barang bekas tidak bisa naik kelas?"
        </p>
      </div>
    </section>
  );
};
