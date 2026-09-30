import React, { useState } from 'react';
import { Menu, X, Volume2, VolumeX, BookOpen, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  onOpenReport: () => void;
  isMobileFrame?: boolean;
  onToggleFrame?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReport,
  isMobileFrame,
  onToggleFrame,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(sounds.enabled);

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
      <header className="sticky top-0 z-40 w-full px-4 py-3 flex items-center justify-between backdrop-blur-xs bg-[#F1D2A1]/85 transition-all">
        {/* Top left circular hamburger matching 3R DMI.jpg */}
        <button
          onClick={() => {
            sounds.playPop();
            setIsOpen(true);
          }}
          aria-label="Buka Menu Navigasi"
          className="w-11 h-11 rounded-full bg-[#808847] text-[#F1D2A1] flex items-center justify-center shadow-md hover:bg-[#6A7137] active:scale-95 transition cursor-pointer"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center Title pill / indicator */}
        <div className="flex items-center gap-2">
          <span className="font-display text-[#808847] text-lg font-black tracking-wider">
            CRAFT4EARTH
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#808847]/15 text-[#5F6630]">
            DKV UNM
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Toggle Mobile Mockup view / Desktop view (optional) */}
          {onToggleFrame && (
            <button
              onClick={() => {
                sounds.playPop();
                onToggleFrame();
              }}
              title={isMobileFrame ? 'Tampilan Layar Penuh' : 'Tampilan Mode Mockup HP'}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-[#808847]/20 text-[#3B4219] hover:bg-[#808847]/30 transition cursor-pointer"
            >
              {isMobileFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Full</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile View</span>
                </>
              )}
            </button>
          )}

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            aria-label="Suara"
            className="w-9 h-9 rounded-full bg-[#808847]/20 text-[#3B4219] flex items-center justify-center hover:bg-[#808847]/30 transition cursor-pointer"
          >
            {isSoundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Academic Report Modal trigger */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenReport();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#925E06] text-[#F1D2A1] hover:bg-[#784D05] shadow-sm transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Laporan DKV</span>
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
          <div className="relative w-80 max-w-[85vw] bg-[#F1D2A1] h-full shadow-2xl p-6 flex flex-col justify-between z-10 border-r-4 border-[#808847]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#808847]/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#808847] text-[#F1D2A1] flex items-center justify-center font-display font-black text-sm">
                    3R
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-black text-[#808847] leading-none">
                      Craft4Earth
                    </h3>
                    <p className="text-[11px] text-[#697135] font-semibold">DKV UNM • Semester 5</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-[#808847]/20 flex items-center justify-center text-[#242A16] hover:bg-[#808847]/40 cursor-pointer"
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
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-display text-base font-bold text-[#242A16] hover:bg-[#808847] hover:text-[#F1D2A1] transition group cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <span className="text-[#808847] group-hover:text-[#F1D2A1] transition text-sm">→</span>
                  </a>
                ))}
              </nav>

              {/* Special action button inside drawer */}
              <div className="mt-6 pt-4 border-t border-[#808847]/30 flex flex-col gap-2">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsOpen(false);
                    onOpenReport();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#925E06] text-[#F1D2A1] font-display font-bold text-sm shadow hover:bg-[#784D05] transition cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Buka Lembar Asistensi & Riset</span>
                </button>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="pt-4 border-t border-[#808847]/20 text-center">
              <p className="font-display text-xs text-[#808847] font-semibold">
                "Belajar 3R, Sekali Scroll"
              </p>
              <p className="text-[10px] text-[#242A16]/70 mt-0.5">
                Kelompok Craft4Earth © 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
