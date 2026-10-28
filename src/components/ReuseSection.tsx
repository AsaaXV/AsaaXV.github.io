import React, { useState } from 'react';
import { REUSE_ITEMS } from '../data/content';
import { sounds } from '../utils/audio';

import reuseImg from '../assets/reuse.png';
import botolBekasImg from '../assets/botol bekas.png';
import potBungaImg from '../assets/Pot-Bunga-dari-Botol.png';
import kardusBekasImg from '../assets/kardus-bekas.png';
import rakBukuKardusImg from '../assets/Rak-Buku-Mini-Dari-Kardus.png';
import bajuBayiBekasImg from '../assets/baju_bayi_bekas.png';
import kainDariBajuBekasImg from '../assets/Kain_Dari_Baju_Bekas_Bayi.png';

export const ReuseSection: React.FC = () => {
  // Store state for each card: 0 = Origin/Limbah, 1 = Upcycled/Hasil Kreasi
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
    <section id="reuse" className="pt-4 pb-4 sm:pt-6 sm:pb-6 px-3 sm:px-4 max-w-4xl mx-auto flex flex-col items-center w-full">
      {/* Header — Heading: 32-48px Bold Ellak | Subheading: 20-24px SemiBold Ellak | Isi: 14-16px Regular Oduda */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8 animate-section-title">
        <div className="section-title-interactive group flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-1">
          <img
            src={reuseImg}
            alt="Logo Reuse - Gunakan Kembali"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-md group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 select-none pointer-events-none"
            draggable={false}
          />
          <h2 className="font-display text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#283618] group-hover:text-[#5B4436] transition-colors leading-tight tracking-tight uppercase">
            REUSE
          </h2>
        </div>
        <div className="font-display text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-[#5B4436] tracking-wide mt-1">
          Masih Bisa Dipakai Nggak?
        </div>
        <div className="h-0.5 bg-[#283618]/20 rounded-full my-3 animate-line-grow w-24 mx-auto" />
        <p className="font-body text-[#283618]/85 text-[14px] sm:text-[15px] md:text-[16px] font-normal mt-0.5 max-w-md mx-auto leading-relaxed">
          Kita mengupayakan barang yang kita miliki selagi masih layak dan aman digunakan.
        </p>
      </div>

      {/* Kartu Memanjang ke Bawah di HP & Tablet & 3 Kolom di Layar Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 w-full max-w-md lg:max-w-none mx-auto items-stretch">
        {REUSE_ITEMS.map((item, idx) => {
          const isAfter = (cardStates[item.id] ?? 1) === 1;
          const staggerClass =
            idx === 2
              ? 'animate-stagger-right-1'
              : idx === 1
              ? 'animate-stagger-right-2'
              : 'animate-stagger-right-3';

          return (
            <div key={item.id} className={`flex flex-col items-center justify-between h-full w-full ${staggerClass}`}>
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
                className={`w-full h-full min-h-[410px] sm:min-h-[395px] rounded-[36px] p-6 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xl cursor-pointer select-none transform hover:-translate-y-2 hover:shadow-2xl group border ${
                  isAfter
                    ? 'bg-[#283618] text-[#FEFAE0] border-[#283618]/50'
                    : 'bg-[#4A3525] text-[#FEFAE0] border-[#4A3525]/50'
                }`}
              >
                {/* Top Bar inside Card: Pill Kategori di kiri & Teks status bersih di kanan */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-black/40 text-white shadow-xs">
                      {item.category}
                    </span>
                    <span className="text-xs font-medium text-white/85">
                      {isAfter ? 'Hasil Kreasi' : 'Bahan Asal'}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-3">
                    <h3 className="font-display text-[24px] sm:text-[26px] font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-white/80 font-medium mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Visual Art Box */}
                  <div className="my-2.5 min-h-[170px] sm:min-h-[155px] rounded-2xl bg-black/35 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-white/10 transition-colors">
                    {item.id === 'reuse-1' && (
                      !isAfter ? (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                          <div className="h-28 sm:h-24 w-full flex items-center justify-center mb-1.5">
                            <img
                              src={botolBekasImg}
                              alt="Bahan Asal: botol bekas.png"
                              className="max-h-28 sm:max-h-24 max-w-[90%] w-auto h-auto object-contain drop-shadow-md select-none pointer-events-none rounded-lg"
                              draggable={false}
                            />
                          </div>
                          <span className="font-display text-sm font-bold text-[#FEFAE0] leading-none">Botol Plastik Bekas</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                          <div className="h-28 sm:h-24 w-full flex items-center justify-center mb-1.5">
                            <img
                              src={potBungaImg}
                              alt="Hasil Kreasi: Pot-Bunga-dari-Botol.png"
                              className="max-h-28 sm:max-h-24 max-w-[90%] w-auto h-auto object-contain drop-shadow-md select-none pointer-events-none rounded-lg"
                              draggable={false}
                            />
                          </div>
                          <span className="font-display text-sm font-bold text-white leading-none">Pot Bunga Meja Cantik</span>
                        </div>
                      )
                    )}

                    {item.id === 'reuse-2' && (
                      !isAfter ? (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                          <div className="h-28 sm:h-24 w-full flex items-center justify-center mb-1.5">
                            <img
                              src={kardusBekasImg}
                              alt="Bahan Asal: kardus-bekas.png"
                              className="max-h-28 sm:max-h-24 max-w-[90%] w-auto h-auto object-contain drop-shadow-md select-none pointer-events-none rounded-lg"
                              draggable={false}
                            />
                          </div>
                          <span className="font-display text-sm font-bold text-[#FEFAE0] leading-none">Kardus Paket Belanja</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                          <div className="h-28 sm:h-24 w-full flex items-center justify-center mb-1.5">
                            <img
                              src={rakBukuKardusImg}
                              alt="Hasil Kreasi: Rak-Buku-Mini-Dari-Kardus.png"
                              className="max-h-28 sm:max-h-24 max-w-[90%] w-auto h-auto object-contain drop-shadow-md select-none pointer-events-none rounded-lg"
                              draggable={false}
                            />
                          </div>
                          <span className="font-display text-sm font-bold text-white leading-none">Rak Buku Mini Meja</span>
                        </div>
                      )
                    )}

                    {item.id === 'reuse-3' && (
                      !isAfter ? (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                          <div className="h-28 sm:h-24 w-full flex items-center justify-center mb-1.5">
                            <img
                              src={bajuBayiBekasImg}
                              alt="Bahan Asal: baju_bayi_bekas.png"
                              className="max-h-28 sm:max-h-24 max-w-[90%] w-auto h-auto object-contain drop-shadow-md select-none pointer-events-none rounded-lg"
                              draggable={false}
                            />
                          </div>
                          <span className="font-display text-sm font-bold text-[#FEFAE0] leading-none">Baju Bayi Bekas</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                          <div className="h-28 sm:h-24 w-full flex items-center justify-center mb-1.5">
                            <img
                              src={kainDariBajuBekasImg}
                              alt="Hasil Kreasi: Kain_Dari_Baju_Bekas_Bayi.png"
                              className="max-h-28 sm:max-h-24 max-w-[90%] w-auto h-auto object-contain drop-shadow-md select-none pointer-events-none rounded-lg"
                              draggable={false}
                            />
                          </div>
                          <span className="font-display text-sm font-bold text-white leading-none">Lap Serbaguna Katun Halus</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Paragraf Deskripsi */}
                  <p className="font-body text-[14px] sm:text-[15px] text-white/90 leading-relaxed font-normal my-3">
                    {isAfter ? item.after.description : item.before.description}
                  </p>

                  {/* Kotak Manfaat / Dampak */}
                  <div className="p-3.5 rounded-2xl bg-white/10 text-[14px] text-white/95 leading-relaxed font-body">
                    {isAfter ? (
                      <span>
                        <strong className="font-bold text-white">Manfaat: </strong>
                        {item.after.benefit}
                      </span>
                    ) : (
                      <div className="flex items-start gap-1.5 text-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                        <span>{item.before.drawback}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Garis pembatas & teks ketuk di bawah */}
                <div className="pt-3 mt-3.5 text-center text-xs text-white/80 font-body border-t border-white/15">
                  <span>{isAfter ? 'Ketuk kartu untuk melihat bahan asal' : 'Ketuk kartu untuk melihat hasil kreasi'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Callout — Subheading: 20-24px SemiBold Ellak */}
      <div className="w-full text-center mt-6 sm:mt-8 mb-1 py-3 px-4 rounded-2xl bg-[#283618]/10 border border-[#283618]/20 max-w-lg">
        <p className="font-display text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-[#283618] tracking-wide leading-snug">
          "Siapa bilang barang bekas tidak bisa naik kelas?"
        </p>
      </div>
    </section>
  );
};
