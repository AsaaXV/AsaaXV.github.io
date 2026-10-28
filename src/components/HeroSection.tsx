import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import bumiImg from '../assets/bumi.png';

interface HeroSectionProps {
  onStartExplore: () => void;
  onOpenGame: () => void;
  onOpenFlappy?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartExplore, onOpenGame, onOpenFlappy }) => {
  const handleClick = () => {
    sounds.playWheelClick();
    onStartExplore();
  };

  const handleEarthClick = () => {
    sounds.playAlert();
    onOpenGame();
  };

  const handleFlappyClick = () => {
    sounds.playFlap();
    onOpenFlappy?.();
  };

  return (
    <section id="hero" className="relative pt-3 pb-2 sm:pt-4 sm:pb-3 flex flex-col items-center text-center overflow-hidden">
      <div className="max-w-xl mx-auto px-4 flex flex-col items-center">

        {/* Planet + 3R — dengan animasi masuk */}
        <div className="relative my-1 sm:my-2 select-none flex items-center justify-center gap-4 sm:gap-6">

          {/* Earth dengan floating + ring pulse */}
          <button
            type="button"
            onClick={handleEarthClick}
            className="relative flex flex-col items-center cursor-pointer focus:outline-none animate-slide-left"
            aria-label="Ilustrasi Bumi Hijau Lestari"
          >
            {/* Ring pulse aura */}
            <span className="absolute inset-0 rounded-full bg-[#283618]/15 animate-ring-pulse pointer-events-none" />
            <span className="absolute inset-0 rounded-full bg-[#283618]/10 animate-ring-pulse-d1 pointer-events-none" />
            <img
              src={bumiImg}
              alt="Ilustrasi Bumi Hijau Lestari"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg select-none animate-planet-float hover:scale-110 transition-transform duration-300 pointer-events-none"
              draggable={false}
            />
          </button>

          {/* Tulisan 3R dengan slide dari kanan — Klik untuk membuka Game Flappy 3R */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleFlappyClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFlappyClick();
              }
            }}
            className="relative animate-slide-right cursor-pointer focus:outline-none active:scale-95 transition-transform duration-300 group select-none"
            aria-label="Mainkan Game 3R Terbang"
            title="Klik untuk Mainkan Game Flappy Earth 3R!"
          >
            <h1 className="font-display text-[72px] sm:text-[96px] md:text-[112px] font-black leading-none text-[#283618] tracking-tight drop-shadow-sm hover-wiggle group-hover:scale-105 transition-transform duration-300 pointer-events-none">
              3R
            </h1>
            <div className="absolute -top-1 -right-3 text-[#5B4436] animate-twinkle group-hover:scale-125 transition-transform pointer-events-none">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 fill-[#5B4436]" />
            </div>
          </div>
        </div>

        {/* 3 Pillars — Subheading: 20-24px SemiBold Ellak */}
        <div className="w-full flex items-center justify-center gap-3 sm:gap-4 max-w-md mt-2.5 mb-1.5 font-display font-semibold text-[20px] sm:text-[22px] md:text-[24px] text-[#283618] tracking-wider uppercase">
          <span className="hover:text-[#5B4436] transition-colors cursor-pointer animate-stagger-right-3">REDUCE</span>
          <span className="text-[#283618]/30 text-lg animate-stagger-right-dot-2">•</span>
          <span className="hover:text-[#5B4436] transition-colors cursor-pointer animate-stagger-right-2">REUSE</span>
          <span className="text-[#283618]/30 text-lg animate-stagger-right-dot-1">•</span>
          <span className="hover:text-[#5B4436] transition-colors cursor-pointer animate-stagger-right-1">RECYCLE</span>
        </div>

        {/* Narrative text — Body text: 14-16px Regular Oduda */}
        <p className="font-body text-[#283618]/85 text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-relaxed max-w-md mt-1 mb-3.5 animate-reveal-up-d2">
          Bumi tidak butuh pahlawan super — Cukup kamu yang mau mulai.{' '}
          3 langkah kecil bisa mengubah arah masa depan bumi kita.
        </p>

        {/* CTA Button — Label tombol: 20-24px SemiBold Ellak */}
        <div className="mt-1 mb-2 animate-reveal-up-d3">
          <button
            type="button"
            onClick={handleClick}
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#283618] text-[#FEFAE0] font-display text-[20px] sm:text-[22px] font-semibold tracking-wide shadow-lg hover:bg-[#1e2a12] active:scale-95 transition-all transform hover:-translate-y-1 cursor-pointer select-none animate-cta-ring"
          >
            <span>GESER KE BAWAH</span>
            <div className="w-7 h-7 rounded-full bg-[#FEFAE0] text-[#283618] flex items-center justify-center group-hover:translate-y-1.5 transition-transform duration-200 shadow-sm">
              <ArrowDown className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
