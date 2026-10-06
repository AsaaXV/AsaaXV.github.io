import React, { useState } from 'react';
import { X, Volume2, VolumeX, BookOpen, Smartphone, Monitor } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  onOpenReport: () => void;
  isMobileFrame?: boolean;
  onToggleFrame?: () => void;
  onOpenSecret?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReport,
  isMobileFrame,
  onToggleFrame,
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
      {/* Floating Top Bar with circular hamburger button & quick controls */}
      <header className="sticky top-0 z-40 w-full px-4 py-3 flex items-center justify-between backdrop-blur-xs bg-[#FEFAE0]/90 transition-all border-b border-[#283618]/10">
        {/* Top left clean text button without any icon */}
        <button
          onClick={() => {
            sounds.playPop();
            setIsOpen(true);
          }}
          aria-label="Buka Menu Navigasi"
          className="px-4 py-2 rounded-full bg-[#283618] text-[#FEFAE0] font-display text-xs sm:text-sm font-bold shadow-md hover:bg-[#1e2a12] active:scale-95 transition cursor-pointer"
        >
          Menu
        </button>

        {/* Center Title pill / indicator with secret 3-clicks trigger */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer select-none group"
          title="Klik 3x untuk membuka Fitur Rahasia DKV"
        >
          <span className="font-display text-[#283618] text-lg font-black tracking-wider group-hover:text-[#5B4436] transition-colors">
            CRAFT4EARTH
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#283618]/15 text-[#283618] group-hover:bg-[#283618]/25 transition-colors">
            DKV UNM
          </span>
        </div>

        {/* Right actions: clean button without icon or asset button on top bar */}
        <div className="flex items-center">
          <button
            onClick={() => {
              sounds.playPop();
              onOpenReport();
            }}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#5B4436] text-[#FEFAE0] hover:bg-[#433126] shadow-sm transition active:scale-95 cursor-pointer"
          >
            Laporan DKV
          </button>
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
                    <p className="text-[11px] text-[#5B4436] font-semibold">DKV UNM • Semester 5</p>
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

                {/* Mobile / Full view toggle */}
                {onToggleFrame && (
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onToggleFrame();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#283618]/10 text-[#283618] font-display font-bold text-xs hover:bg-[#283618]/20 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                      <span>{isMobileFrame ? 'Tampilan Layar Penuh' : 'Mode Mockup HP'}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#5B4436]">Ubah</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsOpen(false);
                    onOpenReport();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B4436] text-[#FEFAE0] font-display font-bold text-sm shadow hover:bg-[#433126] transition cursor-pointer mt-1"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Buka Data Hasil Riset DKV</span>
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
