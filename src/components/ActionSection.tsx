import React, { useState } from 'react';
import { Share2, CheckCircle2, ChevronRight, Sparkles, FolderOpen, Heart, X } from 'lucide-react';
import { ACTION_FOLDERS } from '../data/content';
import { GrassDivider } from './GrassDivider';
import { ShareModal } from './ShareModal';
import { sounds } from '../utils/audio';

export const ActionSection: React.FC = () => {
  // Initially null so guide card only appears when a document/step is pressed
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [completedFolders, setCompletedFolders] = useState<Record<string, boolean>>({
    'act-1': true,
  });
  const [isLidOpen, setIsLidOpen] = useState(true); // Open by default matching 3R DMI.jpg
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const toggleFolder = (id: string) => {
    sounds.playFlip();
    setSelectedFolderId((prev) => (prev === id ? null : id));
    setCompletedFolders((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleOpenShare = () => {
    sounds.playPop();
    setIsShareModalOpen(true);
  };

  const toggleLid = () => {
    sounds.playPop();
    setIsLidOpen(!isLidOpen);
  };

  const handleBinMouseEnter = () => {
    if (!isLidOpen) {
      sounds.playPop();
      setIsLidOpen(true);
    }
  };

  const handleBinMouseLeave = () => {
    setIsLidOpen(false);
  };

  const completedCount = Object.values(completedFolders).filter(Boolean).length;

  return (
    <section id="action" className="pt-12 pb-0 flex flex-col items-center overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 w-full flex flex-col items-center">
        {/* Header matching 3R DMI.jpg */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#808847] leading-tight tracking-tight uppercase">
            MULAI DARI KAMPUS,
          </h2>
          <div className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#808847] tracking-wider uppercase mt-0.5">
            MULAI DARI SEKARANG
          </div>
          <p className="font-body text-[#3B4219] text-xs sm:text-sm font-semibold mt-2 max-w-md mx-auto">
            kamu nggak perlu jadi aktivis buat mulai peduli. cukup 3 langkah kecil ini.
          </p>
        </div>

        {/* 3 Step Action Pill Bar - 3 Columns on mobile & desktop */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full max-w-2xl mb-6 sm:mb-8 items-stretch">
          {ACTION_FOLDERS.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            const isDone = !!completedFolders[folder.id];

            return (
              <button
                key={folder.id}
                onClick={() => toggleFolder(folder.id)}
                className={`p-1.5 sm:p-3 h-11 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-between transition-all cursor-pointer border-2 text-left ${
                  isSelected
                    ? 'bg-[#808847] text-[#F1D2A1] border-[#5E6430] shadow-md scale-[1.02]'
                    : isDone
                    ? 'bg-[#F1D2A1] text-[#242A16] border-[#808847] hover:bg-[#E7C693]'
                    : 'bg-[#925E06] text-[#F1D2A1] border-[#794E05]'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <div
                    className={`w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-display text-[9px] sm:text-xs font-black shrink-0 ${
                      isDone ? 'bg-[#808847] text-white' : 'bg-white/20 text-white'
                    }`}
                  >
                    {folder.stepNumber}
                  </div>
                  <span className="font-display text-[8.5px] sm:text-xs font-bold truncate">
                    Tahap {folder.stepNumber}
                  </span>
                </div>
                {isDone && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Detailed Folder Drawer/Card when selected */}
        {selectedFolderId && (
          <div className="w-full max-w-2xl mb-8 p-6 rounded-3xl bg-white/80 border-2 border-[#808847]/40 shadow-lg text-[#242A16] animate-fade-in">
            {(() => {
              const activeFolder = ACTION_FOLDERS.find((f) => f.id === selectedFolderId)!;
              return (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#808847]/30 mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-[#808847]" />
                      <span className="font-display text-sm font-black text-[#808847] uppercase tracking-wide">
                        Panduan Langkah #{activeFolder.stepNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#808847]/15 text-[#5C642F]">
                        Aksi Mahasiswa UNM
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedFolderId(null)}
                        className="w-7 h-7 rounded-full bg-[#808847]/20 hover:bg-[#808847]/40 text-[#242A16] flex items-center justify-center transition cursor-pointer"
                        title="Tutup Panduan"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-black text-[#242A16] mb-1">
                    {activeFolder.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#464D23] font-semibold mb-4">
                    {activeFolder.summary}
                  </p>

                  <div className="space-y-2 mb-4">
                    {activeFolder.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-[#242A16]">
                        <CheckCircle2 className="w-4 h-4 text-[#808847] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F1D2A1]/70 border border-[#808847]/20 text-xs italic text-[#555C2A]">
                    {activeFolder.quote}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* The Iconic Illustrated Trash Bin matching 3R DMI.jpg (Hover to Open on Desktop) */}
        <div
          onMouseEnter={handleBinMouseEnter}
          onMouseLeave={handleBinMouseLeave}
          onClick={toggleLid}
          className="relative my-4 flex flex-col items-center cursor-pointer select-none group"
          title="Arahkan mouse atau klik untuk membuka tempat sampah"
        >
          {/* Lid of the trash bin (tilted angle on open, closed by default) */}
          <div
            className={`relative z-30 transition-all duration-500 ease-out origin-bottom-left ${
              isLidOpen
                ? 'rotate-[-26deg] -translate-y-3 translate-x-12 sm:translate-x-16 drop-shadow-xl'
                : 'rotate-0 translate-y-3 translate-x-0'
            }`}
          >
            {/* Trash bin lid */}
            <div className="w-52 h-9 sm:w-68 sm:h-11 rounded-t-2xl bg-[#734303] border-b-4 border-[#523002] flex items-center justify-center shadow-lg">
              <div className="w-20 h-2.5 rounded-full bg-[#925E06] border border-[#523002]/40" />
            </div>
          </div>

          {/* Action Folders sticking out of bin - reveals when bin opens */}
          <div
            className={`relative z-10 -mb-4 flex items-end justify-center gap-2 transition-all duration-500 ease-out ${
              isLidOpen
                ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
                : 'translate-y-8 opacity-0 scale-90 pointer-events-none'
            }`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder('act-1');
              }}
              className="w-16 h-14 sm:w-20 sm:h-16 rounded-t-lg bg-[#3C4A21] text-white p-1 text-[10px] font-bold text-center shadow cursor-pointer transform -rotate-6 hover:-translate-y-2 transition-transform"
            >
              #01 BYO
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder('act-2');
              }}
              className="w-18 h-16 sm:w-24 sm:h-18 rounded-t-lg bg-[#4E5E2C] text-white p-1 text-[10px] font-bold text-center shadow cursor-pointer transform hover:-translate-y-2 transition-transform z-10"
            >
              #02 Kost
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder('act-3');
              }}
              className="w-16 h-14 sm:w-20 sm:h-16 rounded-t-lg bg-[#687C3C] text-white p-1 text-[10px] font-bold text-center shadow cursor-pointer transform rotate-6 hover:-translate-y-2 transition-transform"
            >
              #03 Share
            </div>
          </div>

          {/* Main Trapezoid Trash Bin Body */}
          <div className="relative z-20 w-56 sm:w-72 h-44 sm:h-52 bg-[#925E06] rounded-b-2xl shadow-2xl flex flex-col items-center justify-center p-4 border-t-4 border-[#7A4B04] text-center">
            {/* Decorative texture lines */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#B07715]/40" />

            {/* The Iconic "SHARE" Button matching 3R DMI.jpg */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenShare();
              }}
              className="group px-8 py-3 rounded-full bg-[#808847] hover:bg-[#686F35] text-white font-display text-2xl sm:text-3xl font-black tracking-wider uppercase shadow-xl active:scale-95 transition-all transform hover:scale-105 cursor-pointer border-2 border-[#A0A95A] flex items-center gap-2"
            >
              <span>SHARE</span>
              <Share2 className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
            </button>

            <span className="text-[11px] font-bold text-[#F1D2A1]/90 mt-2 block">
              Klik salah satu dokumen di atas untuk melihat panduan langkah
            </span>
          </div>
        </div>

        {/* Closing Quote from 3R DMI.jpg */}
        <div className="text-center my-10 max-w-lg mx-auto">
          <p className="font-display text-lg sm:text-xl md:text-2xl font-black text-[#5C6330] leading-snug tracking-wide">
            BUMI ini dipinjam dari anak cucu kita.
            <br />
            yuk jaga bareng-bareng !
          </p>
        </div>
      </div>

      {/* Illustrated Bottom Grass Silhouette Line from mockup */}
      <GrassDivider variant="bottom" className="w-full mt-4" />

      {/* Footer Banner matching "Craft 4 Earth - DKV UNM 2024" */}
      <footer className="w-full bg-[#6C3E04] text-[#F1D2A1] py-5 px-4 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-1">
          <p className="font-display text-sm sm:text-base font-black tracking-wider">
            Craft 4 Earth - DKV UNM 2024
          </p>
          <p className="text-[11px] text-[#F1D2A1]/75">
            Mata Kuliah Desain Media Interaktif • Fakultas Seni dan Desain • Universitas Negeri Makassar
          </p>
        </div>
      </footer>

      {/* Share & Pledge Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </section>
  );
};
