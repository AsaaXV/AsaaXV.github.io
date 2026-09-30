import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { GrassDivider } from './GrassDivider';
import { sounds } from '../utils/audio';

interface HeroSectionProps {
  onStartExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartExplore }) => {
  const handleClick = () => {
    sounds.playWheelClick();
    onStartExplore();
  };

  return (
    <section id="hero" className="relative pt-6 pb-0 flex flex-col items-center text-center overflow-hidden">
      {/* Background warm aesthetic texture */}
      <div className="max-w-xl mx-auto px-4 flex flex-col items-center">
        
        {/* Massive 3R Title matching 3R DMI.jpg exactly */}
        <div className="relative my-2 select-none group">
          <h1 className="font-display text-[96px] sm:text-[132px] md:text-[150px] font-black leading-none text-[#808847] tracking-tight drop-shadow-sm transition-transform duration-300 hover:scale-105 cursor-default">
            3R
          </h1>
          <div className="absolute -top-1 -right-3 text-[#925E06] animate-bounce">
            <Sparkles className="w-6 h-6 fill-[#925E06]" />
          </div>
        </div>

        {/* 3 Pillars Subheader: REDUCE · REUSE · RECYCLE */}
        <div className="w-full flex items-center justify-around max-w-md my-3 font-display font-extrabold text-sm sm:text-base md:text-lg text-[#808847] tracking-wider uppercase">
          <span className="hover:text-[#925E06] transition-colors cursor-pointer">REDUCE</span>
          <span className="text-[#808847]/40">•</span>
          <span className="hover:text-[#925E06] transition-colors cursor-pointer">REUSE</span>
          <span className="text-[#808847]/40">•</span>
          <span className="hover:text-[#925E06] transition-colors cursor-pointer">RECYCLE</span>
        </div>

        {/* Narrative text from the visual mockup */}
        <p className="font-body text-[#3B4219] text-sm sm:text-base font-semibold leading-relaxed max-w-md my-4">
          Bumi tidak butuh pahlawan super cukup kamu yang mau mulai. 3 langkah kecil bisa mengubah arah masa depan bumi kita. Siap ambil bagian?
        </p>

        {/* Minimalist Pill Button matching original design */}
        <div className="mt-2 mb-6">
          <button
            type="button"
            onClick={handleClick}
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#925E06] text-[#F1D2A1] font-display text-base sm:text-lg font-black tracking-wide shadow-lg hover:bg-[#784D05] active:scale-95 transition-all transform hover:-translate-y-0.5 cursor-pointer select-none"
          >
            <span>GESER KE BAWAH</span>
            <div className="w-7 h-7 rounded-full bg-[#F1D2A1] text-[#925E06] flex items-center justify-center group-hover:translate-y-1 transition-transform duration-200 shadow-xs">
              <ArrowDown className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>
      </div>

      {/* Illustrated Grass Silhouette Line matching the mockup */}
      <GrassDivider variant="bottom" className="mt-4" />
    </section>
  );
};
