import React, { useState } from 'react';
import { FolderOpen, Share2, CheckCircle2, ChevronRight, Sparkles, Heart, X, MousePointerClick } from 'lucide-react';
import { ACTION_FOLDERS } from '../data/content';
import { GrassDivider } from './GrassDivider';
import { ShareModal } from './ShareModal';
import { sounds } from '../utils/audio';

import tongsampahAtasImg from '../assets/tongsampah-atas.png';
import tongsampahBawahImg from '../assets/tongsampah-bawah.png';
import folder1Img from '../assets/folder1.png';
import folder2Img from '../assets/folder2.png';
import folder3Img from '../assets/folder3.png';
import sampah1Img from '../assets/sampah1.png';
import sampah2Img from '../assets/sampah2.png';

interface ActionSectionProps {
  onOpenSecret?: () => void;
}

export const ActionSection: React.FC<ActionSectionProps> = ({ onOpenSecret }) => {
  // Initially null so guide card only appears when a document/step is pressed
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [completedFolders, setCompletedFolders] = useState<Record<string, boolean>>({
    'act-1': true,
  });
  const [isLidOpen, setIsLidOpen] = useState(false); // Closed by default, opens on hover/click matching reference
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#283618] leading-tight tracking-tight uppercase">
            MULAI DARI KAMPUS,
          </h2>
          <div className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#283618] tracking-wider uppercase mt-0.5">
            MULAI DARI SEKARANG
          </div>
          <p className="font-body text-[#283618]/90 text-xs sm:text-sm font-semibold mt-2 max-w-md mx-auto">
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
                    ? 'bg-[#283618] text-[#FEFAE0] border-[#1e2a12] shadow-md scale-[1.02]'
                    : isDone
                    ? 'bg-[#FEFAE0] text-[#283618] border-[#283618] hover:bg-[#f6f0cb]'
                    : 'bg-[#5B4436] text-[#FEFAE0] border-[#433126]'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <div
                    className={`w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-display text-[9px] sm:text-xs font-black shrink-0 ${
                      isDone ? 'bg-[#283618] text-white' : 'bg-white/20 text-white'
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
          <div className="w-full max-w-2xl mb-8 p-6 rounded-3xl bg-white/90 border-2 border-[#283618]/25 shadow-lg text-[#283618] animate-fade-in">
            {(() => {
              const activeFolder = ACTION_FOLDERS.find((f) => f.id === selectedFolderId)!;
              return (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#283618]/20 mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-[#283618]" />
                      <span className="font-display text-sm font-black text-[#283618] uppercase tracking-wide">
                        Panduan Langkah #{activeFolder.stepNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#283618]/15 text-[#283618]">
                        Aksi Mahasiswa UNM
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedFolderId(null)}
                        className="w-7 h-7 rounded-full bg-[#283618]/15 hover:bg-[#283618]/30 text-[#283618] flex items-center justify-center transition cursor-pointer"
                        title="Tutup Panduan"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-black text-[#283618] mb-1">
                    {activeFolder.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#283618]/80 font-semibold mb-4">
                    {activeFolder.summary}
                  </p>

                  <div className="space-y-2 mb-4">
                    {activeFolder.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-[#283618]">
                        <CheckCircle2 className="w-4 h-4 text-[#283618] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FEFAE0] border border-[#283618]/20 text-xs italic text-[#283618]">
                    {activeFolder.quote}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* The Iconic Illustrated Trash Bin using user's real assets & reference repo interaction */}
        <div
          onMouseEnter={handleBinMouseEnter}
          onMouseLeave={handleBinMouseLeave}
          onClick={toggleLid}
          className="relative my-4 flex flex-col items-center cursor-pointer select-none group"
          title="Arahkan mouse atau klik untuk membuka tempat sampah"
        >
          {/* Action Folders sticking out of bin - absolute positioned so it takes no space between lid and body */}
          <div
            className={`absolute top-8 sm:top-10 z-15 flex items-end justify-center gap-1 sm:gap-2 transition-all duration-500 ease-out pointer-events-none ${
              isLidOpen
                ? '-translate-y-20 sm:-translate-y-28 opacity-100 scale-100 pointer-events-auto'
                : 'translate-y-4 opacity-0 scale-75'
            }`}
          >
            {/* Floating micro-hint when no document is currently open */}
            {!selectedFolderId && (
              <div className="absolute -top-7 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#283618] text-[#FEFAE0] text-[10px] font-black shadow-lg animate-bounce pointer-events-none border border-[#435728]">
                <MousePointerClick className="w-3 h-3 text-[#FEFAE0]" />
                <span>Tekan dokumen</span>
              </div>
            )}

            {/* Document 1: folder1.png */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder('act-1');
              }}
              className={`cursor-pointer transition-all duration-300 ${
                selectedFolderId === 'act-1'
                  ? '-translate-y-4 scale-110 z-20 drop-shadow-2xl'
                  : 'animate-doc-bounce-1 hover:-translate-y-3 hover:scale-105 z-10 drop-shadow-lg'
              }`}
              title="Klik untuk melihat Panduan Langkah 1: Bawa Wadah Sendiri"
            >
              <img
                src={folder1Img}
                alt="Dokumen Aksi 1"
                className="w-20 h-20 sm:w-26 sm:h-26 object-contain select-none pointer-events-none"
                draggable={false}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Document 2: folder2.png */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder('act-2');
              }}
              className={`cursor-pointer transition-all duration-300 -mx-1 sm:-mx-2 ${
                selectedFolderId === 'act-2'
                  ? '-translate-y-4 scale-110 z-20 drop-shadow-2xl'
                  : 'animate-doc-bounce-2 hover:-translate-y-3 hover:scale-105 z-15 drop-shadow-xl'
              }`}
              title="Klik untuk melihat Panduan Langkah 2: Pojok Pilah Kamar Kos"
            >
              <img
                src={folder2Img}
                alt="Dokumen Aksi 2"
                className="w-22 h-22 sm:w-28 sm:h-28 object-contain select-none pointer-events-none"
                draggable={false}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Document 3: folder3.png */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder('act-3');
              }}
              className={`cursor-pointer transition-all duration-300 ${
                selectedFolderId === 'act-3'
                  ? '-translate-y-4 scale-110 z-20 drop-shadow-2xl'
                  : 'animate-doc-bounce-3 hover:-translate-y-3 hover:scale-105 z-10 drop-shadow-lg'
              }`}
              title="Klik untuk melihat Panduan Langkah 3: Bagikan Semangat 3R"
            >
              <img
                src={folder3Img}
                alt="Dokumen Aksi 3"
                className="w-20 h-20 sm:w-26 sm:h-26 object-contain select-none pointer-events-none"
                draggable={false}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Lid of the trash bin (tilted angle on open, flush when closed, lifts high and slanted when open) */}
          <div
            className={`relative z-30 -mb-8 sm:-mb-10 transition-all duration-500 ease-out origin-bottom-left ${
              isLidOpen ? 'drop-shadow-2xl' : 'drop-shadow-md'
            }`}
            style={{
              transform: isLidOpen
                ? 'translate(28px, -86px) rotate(-26deg)'
                : 'translate(0px, 0px) rotate(0deg)',
              transformOrigin: 'bottom left',
            }}
          >
            <img
              src={tongsampahAtasImg}
              alt="Aset Asli Tutup Tong Sampah"
              className="w-56 sm:w-72 h-auto select-none pointer-events-none"
              draggable={false}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Main Trash Bin Body using tongsampah-bawah.png */}
          <div className="relative z-20 flex flex-col items-center">
            <img
              src={tongsampahBawahImg}
              alt="Aset Asli Badan Tong Sampah"
              className="w-56 sm:w-72 h-auto drop-shadow-2xl select-none pointer-events-none"
              draggable={false}
              referrerPolicy="no-referrer"
            />

            {/* The Iconic "SHARE" Button matching 3R DMI.jpg */}
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenShare();
                }}
                className="group px-7 py-2.5 sm:px-8 sm:py-3 rounded-full bg-[#283618] hover:bg-[#1e2a12] text-white font-display text-2xl sm:text-3xl font-black tracking-wider uppercase shadow-2xl active:scale-95 transition-all transform hover:scale-105 cursor-pointer border-2 border-[#FEFAE0] flex items-center gap-2"
              >
                <span>SHARE</span>
                <Share2 className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          {/* Clustered Trash around base using sampah1.png & sampah2.png */}
          <div className="relative -mt-6 sm:-mt-8 w-72 sm:w-88 flex justify-between items-center pointer-events-none z-25 px-2">
            <img
              src={sampah1Img}
              alt="Sampah Terpilah 1"
              className="w-24 sm:w-30 h-auto -ml-4 drop-shadow-md select-none"
              draggable={false}
              referrerPolicy="no-referrer"
            />
            <img
              src={sampah2Img}
              alt="Sampah Terpilah 2"
              className="w-24 sm:w-30 h-auto -mr-4 drop-shadow-md select-none -scale-x-100"
              draggable={false}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Background Grass Silhouette behind trash bin matching Image 6 */}
          <div className="w-full max-w-lg -mt-12 pointer-events-none z-10 opacity-85">
            <GrassDivider variant="bottom" className="w-full h-16 sm:h-20" />
          </div>
        </div>

        {/* Closing Quote from 3R DMI.jpg & Image 7 */}
        <div className="text-center my-10 max-w-lg mx-auto">
          <p className="font-display text-lg sm:text-xl md:text-2xl font-black text-[#283618] leading-snug tracking-wide">
            BUMI ini dipinjam dari anak cucu kita.
            <br />
            yuk jaga bareng-bareng !
          </p>
        </div>
      </div>

      {/* Illustrated Bottom Grass Silhouette Line right above rounded footer matching Image 7 */}
      <div className="w-full -mb-3 z-10 pointer-events-none">
        <GrassDivider variant="bottom" className="w-full h-20 sm:h-24" />
      </div>

      {/* Footer Banner with rounded top corners matching Image 7 */}
      <footer className="w-full bg-[#5B4436] text-[#FEFAE0] pt-6 pb-8 px-4 text-center rounded-t-[32px] sm:rounded-t-[40px] shadow-2xl relative z-20">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-1">
          <p className="font-display text-sm sm:text-base font-black tracking-wider">
            Craft 4 Earth - DKV UNM 2024
          </p>
          <p className="text-[11px] text-[#FEFAE0]/75">
            Mata Kuliah Desain Media Interaktif • Fakultas Seni dan Desain • Universitas Negeri Makassar
          </p>

          {/* Discrete Secret Easter Egg Trigger */}
          {onOpenSecret && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={onOpenSecret}
                className="text-[10px] font-bold text-[#FEFAE0]/70 hover:text-amber-200 transition-colors inline-flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-black/25 cursor-pointer border border-[#FEFAE0]/20"
                title="Ketik 'UNM' di keyboard atau klik untuk membuka Ruang Rahasia"
              >
                <span>🤫</span>
                <span>Ruang Rahasia DKV (Ketik: "UNM")</span>
                <span>✨</span>
              </button>
            </div>
          )}
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
