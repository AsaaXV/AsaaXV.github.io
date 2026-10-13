import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { REUSE_ITEMS } from '../data/content';
import { sounds } from '../utils/audio';
import { GrassDivider } from './GrassDivider';

import reuseImg from '../assets/reuse.png';
import botolBekasImg from '../assets/botol bekas.png';
import potBungaImg from '../assets/Pot-Bunga-dari-Botol.png';
import kardusBekasImg from '../assets/kardus-bekas.png';
import rakBukuKardusImg from '../assets/Rak-Buku-Mini-Dari-Kardus.png';
import bajuBayiBekasImg from '../assets/baju_bayi_bekas.png';
import kainDariBajuBekasImg from '../assets/Kain_Dari_Baju_Bekas_Bayi.png';

export const ReuseSection: React.FC = () => {
  // Store state for each card: 0 = Origin/Limbah, 1 = Upcycled/Hasil Kreasi
  // Default to 1 (Hasil Kreasi) so the cards immediately focus on the creative outcomes and benefits
  const [cardStates, setCardStates] = useState<Record<string, number>>({
    'reuse-1': 1,
    'reuse-2': 1,
    'reuse-3': 1,
  });

  const toggleCardState = (id: string) => {
    sounds.playPop();
    setCardStates((prev) => {
      const current = prev[id] ?? 1;
      return { ...prev, [id]: current === 1 ? 0 : 1 };
    });
  };

  return (
    <section id="reuse" className="py-12 px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header with reuse.png badge positioned next to section title */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center justify-center gap-3 sm:gap-4.5 flex-wrap">
          <img
            src={reuseImg}
            alt="Logo Reuse - Gunakan Kembali"
            className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
            draggable={false}
          />
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#283618] leading-tight tracking-tight uppercase">
            REUSE
          </h2>
        </div>
        <div className="font-display text-xl sm:text-2xl md:text-3xl font-black text-[#283618] tracking-wider uppercase mt-1">
          MASIH BISA DI PAKAI NGGAK?
        </div>
        <p className="font-body text-[#283618]/90 text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
          kita mengupayakan barang yang kita punya selagi masih layak pakai.
        </p>
      </div>

      {/* 3 Cards: Ramping, Bersih, Berfokus pada Hasil Kreasi & Manfaat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl items-stretch">
        {REUSE_ITEMS.map((item) => {
          const isAfter = (cardStates[item.id] ?? 1) === 1;

          return (
            <div key={item.id} className="flex flex-col items-center justify-between h-full w-full">
              {/* Card Container */}
              <div className="relative w-full flex-1 flex flex-col items-center">
                {/* Main Card with exact minimalist aesthetic */}
                <div
                  onClick={() => toggleCardState(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCardState(item.id);
                    }
                  }}
                  className={`w-full h-full min-h-[460px] rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-lg cursor-pointer border select-none transform hover:-translate-y-2 hover:shadow-2xl group ${
                    isAfter
                      ? 'bg-[#283618] text-[#FEFAE0] border-[#394c25] hover:border-[#FEFAE0]/40'
                      : 'bg-[#4A3525] text-[#FEFAE0] border-[#5e4432] hover:border-[#FEFAE0]/40'
                  }`}
                >
                  {/* Top Bar inside Card: Clean and minimalist, without SEBELUM / SESUDAH badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-[#FEFAE0]">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-medium text-[#FEFAE0]/60 group-hover:text-[#FEFAE0]/90 transition-colors">
                        {isAfter ? 'Hasil Kreasi' : 'Bahan Asal'}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-3">
                      <h3 className="font-display text-xl font-black text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#FEFAE0]/80 font-medium mt-1">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Visual Art Box: Menampilkan foto asli bahan asal vs hasil kreasi (Enlarged) */}
                    <div className="my-2 h-52 rounded-2xl bg-black/25 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-white/10 transition-colors">
                      {item.id === 'reuse-1' && (
                        !isAfter ? (
                          <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                            <img
                              src={botolBekasImg}
                              alt="Bahan Asal: botol bekas.png"
                              className="h-30 sm:h-34 w-auto object-contain drop-shadow-md select-none pointer-events-none mb-1.5"
                              draggable={false}
                            />
                            <span className="text-xs font-bold text-[#FEFAE0]">Botol Plastik Bekas Minum</span>
                            <span className="text-[10px] text-[#FEFAE0]/70">Bahan Asal: botol bekas.png</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                            <img
                              src={potBungaImg}
                              alt="Hasil Kreasi: Pot-Bunga-dari-Botol.png"
                              className="h-30 sm:h-34 w-auto object-contain drop-shadow-md select-none pointer-events-none mb-1.5"
                              draggable={false}
                            />
                            <span className="text-xs font-bold text-white">Pot Bunga Meja Cantik</span>
                            <span className="text-[10px] text-[#FEFAE0]/90">Hasil Kreasi: Pot-Bunga-dari-Botol.png</span>
                          </div>
                        )
                      )}

                      {item.id === 'reuse-2' && (
                        !isAfter ? (
                          <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                            <img
                              src={kardusBekasImg}
                              alt="Bahan Asal: kardus-bekas.png"
                              className="h-30 sm:h-34 w-auto object-contain drop-shadow-md select-none pointer-events-none mb-1.5"
                              draggable={false}
                            />
                            <span className="text-xs font-bold text-[#FEFAE0]">Kardus Paket Ekspedisi</span>
                            <span className="text-[10px] text-[#FEFAE0]/70">Bahan Asal: kardus-bekas.png</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                            <img
                              src={rakBukuKardusImg}
                              alt="Hasil Kreasi: Rak-Buku-Mini-Dari-Kardus.png"
                              className="h-30 sm:h-34 w-auto object-contain drop-shadow-md select-none pointer-events-none mb-1.5"
                              draggable={false}
                            />
                            <span className="text-xs font-bold text-white">Rak Buku Mini Meja</span>
                            <span className="text-[10px] text-[#FEFAE0]/90">Hasil Kreasi: Rak-Buku-Mini-Dari-Kardus.png</span>
                          </div>
                        )
                      )}

                      {item.id === 'reuse-3' && (
                        !isAfter ? (
                          <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                            <img
                              src={bajuBayiBekasImg}
                              alt="Bahan Asal: baju_bayi_bekas.png"
                              className="h-30 sm:h-34 w-auto object-contain drop-shadow-md select-none pointer-events-none mb-1.5"
                              draggable={false}
                            />
                            <span className="text-xs font-bold text-[#FEFAE0]">Baju Bayi Katun Bekas</span>
                            <span className="text-[10px] text-[#FEFAE0]/70">Bahan Asal: baju_bayi_bekas.png</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                            <img
                              src={kainDariBajuBekasImg}
                              alt="Hasil Kreasi: Kain_Dari_Baju_Bekas_Bayi.png"
                              className="h-30 sm:h-34 w-auto object-contain drop-shadow-md select-none pointer-events-none mb-1.5"
                              draggable={false}
                            />
                            <span className="text-xs font-bold text-white">Lap Serbaguna Katun Halus</span>
                            <span className="text-[10px] text-[#FEFAE0]/90">Hasil Kreasi: Kain_Dari_Baju_Bekas_Bayi.png</span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Transformasi Caption - Bersih & Estetik */}
                    {item.captionUnderPhoto && (
                      <div className="py-2 px-3 rounded-xl bg-black/25 border border-white/10 text-center my-3">
                        <span className="font-display text-xs font-bold text-amber-200/90 tracking-wide block">
                          {item.captionUnderPhoto}
                        </span>
                      </div>
                    )}

                    {/* Deskripsi & Manfaat Kreasi */}
                    <div className="text-xs leading-relaxed mt-2 min-h-[95px]">
                      {isAfter ? (
                        <div className="space-y-2">
                          <p className="text-white/90 font-normal leading-relaxed line-clamp-2">
                            {item.after.description}
                          </p>
                          <div className="p-2.5 rounded-xl bg-white/10 text-[11px] text-[#FEFAE0] flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                            <span className="leading-snug"><strong>Manfaat:</strong> {item.after.benefit}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[#FEFAE0]/90 font-normal leading-relaxed line-clamp-2">
                            {item.before.description}
                          </p>
                          <div className="p-2.5 rounded-xl bg-black/25 text-[11px] text-amber-200 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                            <span className="leading-snug">{item.before.drawback}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Minimal subtle hint on hover */}
                  <div className="pt-3 mt-2 text-center text-[10px] text-[#FEFAE0]/50 group-hover:text-[#FEFAE0]/80 transition-colors border-t border-white/10">
                    {isAfter ? 'Ketuk kartu untuk melihat bahan asal' : 'Ketuk kartu untuk melihat hasil kreasi'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Callout matching 3R DMI.jpg & Screenshot */}
      <div className="w-full text-center mt-10 mb-2 py-4 px-6 rounded-2xl bg-[#283618]/10 border border-[#283618]/20">
        <p className="font-display text-base sm:text-lg md:text-xl font-black text-[#283618] tracking-wide">
          "Siapa bilang barang bekas tidak bisa naik kelas?"
        </p>
      </div>

      {/* Grass Silhouette Line Divider matching reference images */}
      <GrassDivider variant="bottom" className="w-full mt-6" />
    </section>
  );
};
