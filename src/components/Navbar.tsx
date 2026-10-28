import React, { useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  onOpenReport?: () => void;
  onOpenSecret?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReport,
  onOpenSecret,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(sounds.enabled);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    sounds.playPop();
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 3) {
      setLogoClicks(0);
      onOpenSecret?.();
    }
  };

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setIsSoundActive(sounds.enabled);
    if (sounds.enabled) sounds.playPop();
  };

  const navLinks = [
    { label: 'Beranda', href: '#hero' },
    { label: '01. Reduce', href: '#reduce' },
    { label: '02. Reuse', href: '#reuse' },
    { label: '03. Recycle', href: '#recycle' },
    { label: 'Fakta & Data', href: '#facts' },
    { label: 'Aksi Kampus', href: '#action' },
  ];

  const handleLinkClick = () => {
    sounds.playPop();
    setIsOpen(false);
  };

  return (
    <>
      {/* Sticky Top Bar on Desktop & Mobile: Memungkinkan lompat antar section kapan saja tanpa scroll manual */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FEFAE0]/95 border-b border-[#283618]/15 shadow-sm transition-all">
        <div className="w-full max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Logo with secret 3-clicks trigger */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
            title="Klik 3x untuk membuka Fitur Rahasia DKV"
          >
            <div className="w-8 h-8 rounded-full bg-[#283618] text-[#FEFAE0] flex items-center justify-center font-display font-black text-xs shadow-sm group-hover:scale-105 transition-transform">
              3R
            </div>
            <span className="font-display text-[#283618] text-base sm:text-lg font-black tracking-wider group-hover:text-[#5B4436] transition-colors">
              CRAFT4EARTH
            </span>
          </div>

          {/* Desktop Direct Navigation: Tautan langsung lompat ke section */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => sounds.playPop()}
                className="px-3 py-1.5 rounded-full font-display text-sm lg:text-[15px] font-semibold text-[#283618] hover:bg-[#283618] hover:text-[#FEFAE0] active:scale-95 transition-all cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: Sound Toggle and Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              aria-label="Toggle Suara"
              className="w-8 h-8 rounded-full bg-[#283618]/10 text-[#283618] hover:bg-[#283618]/20 flex items-center justify-center transition cursor-pointer"
              title={isSoundActive ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {isSoundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[#283618]/50" />}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsOpen(true);
              }}
              aria-label="Buka Menu Navigasi"
              className="md:hidden px-3 py-1.5 rounded-full bg-[#283618] text-[#FEFAE0] font-display text-xs font-bold shadow hover:bg-[#1e2a12] active:scale-95 transition cursor-pointer"
            >
              Menu
            </button>
          </div>
        </div>

        {/* Mobile Quick-Jump Chips Bar (Sticky di HP agar pengguna bisa langsung lompat ke section manapun tanpa scroll) */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar px-3 py-1.5 border-t border-[#283618]/10 bg-[#FEFAE0]/90">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => sounds.playPop()}
              className="shrink-0 px-2.5 py-1 rounded-full bg-[#283618]/10 text-[#283618] font-display text-[11px] font-bold hover:bg-[#283618] hover:text-[#FEFAE0] active:scale-95 transition-all"
            >
              {link.label.replace(/^\d+\.\s*/, '')}
            </a>
          ))}
        </div>
      </header>

      {/* Slide-over Drawer Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-80 max-w-[85vw] bg-[#FEFAE0] h-full shadow-2xl p-6 flex flex-col justify-between z-10 border-r-4 border-[#283618]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#283618]/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#283618] text-[#FEFAE0] flex items-center justify-center font-display font-black text-sm">
                    3R
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-black text-[#283618] leading-none">
                      Craft4Earth
                    </h3>
                    <p className="text-[11px] text-[#5B4436] font-semibold">DKV UNM</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-[#283618]/15 flex items-center justify-center text-[#283618] hover:bg-[#283618]/30 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-display text-base font-bold text-[#283618] hover:bg-[#283618] hover:text-[#FEFAE0] transition group cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <span className="text-[#283618] group-hover:text-[#FEFAE0] transition text-sm">→</span>
                  </a>
                ))}

                {onOpenReport && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setIsOpen(false);
                      onOpenReport();
                    }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-display text-base font-bold text-[#5B4436] bg-[#5B4436]/10 hover:bg-[#5B4436] hover:text-[#FEFAE0] transition group cursor-pointer text-left mt-1"
                  >
                    <span>Tim &amp; Pembagian Tugas</span>
                    <span className="text-sm">→</span>
                  </button>
                )}
              </nav>

              {/* Settings & actions inside drawer */}
              <div className="mt-6 pt-4 border-t border-[#283618]/20 flex flex-col gap-2.5">
                {/* Audio sound toggle */}
                <button
                  onClick={toggleSound}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#283618]/10 text-[#283618] font-display font-bold text-xs hover:bg-[#283618]/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {isSoundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span>Efek Suara Audio</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#283618] text-[#FEFAE0]">
                    {isSoundActive ? 'Aktif' : 'Mati'}
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="pt-4 border-t border-[#283618]/20 text-center">
              <p className="font-display text-xs text-[#283618] font-semibold">
                "Belajar 3R, Sekali Scroll"
              </p>
              <p className="text-[10px] text-[#283618]/70 mt-0.5">
                Kelompok Craft4Earth © 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
