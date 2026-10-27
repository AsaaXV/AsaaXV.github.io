import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, X, Award, RotateCcw, Play, Zap, Leaf, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SecretEasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WasteItem {
  name: string;
  type: 'organik' | 'anorganik';
  desc: string;
}

const GAME_ITEMS: WasteItem[] = [
  { name: 'Botol Plastik PET', type: 'anorganik', desc: 'Kemasan minuman air mineral' },
  { name: 'Sisa Nasi Kuning Kantin', type: 'organik', desc: 'Sisa makanan sarapan' },
  { name: 'Kardus Paket Olshop', type: 'anorganik', desc: 'Kotak karton kiriman paket' },
  { name: 'Kulit Jeruk & Pisang', type: 'organik', desc: 'Sisa kulit buah segar' },
  { name: 'Cup Es Kopi Plastik', type: 'anorganik', desc: 'Gelas plastik minuman dingin' },
  { name: 'Kertas HVS Bekas Skripsi', type: 'anorganik', desc: 'Lembaran kertas print bekas' },
  { name: 'Daun Kering Halaman Pinisi', type: 'organik', desc: 'Guguran daun pohon kampus' },
  { name: 'Kaleng Minuman Bersoda', type: 'anorganik', desc: 'Kaleng aluminium kemasan' },
  { name: 'Sisa Tulang Ayam Lalapan', type: 'organik', desc: 'Sisa makanan lauk pauk' },
  { name: 'Sedotan Plastik Minuman', type: 'anorganik', desc: 'Sedotan plastik sekali pakai' },
];

export const SecretEasterEggModal: React.FC<SecretEasterEggModalProps> = ({ isOpen, onClose }) => {
  // Mini-Arcade State
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Play fanfare when opened
  useEffect(() => {
    if (isOpen) {
      sounds.playFanfare();
    }
  }, [isOpen]);

  // Mini-Arcade Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      sounds.playFanfare();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const startArcade = () => {
    sounds.playPop();
    setScore(0);
    setCombo(0);
    setTimeLeft(15);
    setGameOver(false);
    setIsPlaying(true);
    setCurrentItemIndex(Math.floor(Math.random() * GAME_ITEMS.length));
  };

  const handleAnswer = (chosenType: 'organik' | 'anorganik') => {
    if (!isPlaying) return;
    const current = GAME_ITEMS[currentItemIndex];
    if (current.type === chosenType) {
      sounds.playSuccess();
      setScore((prev) => prev + 10 + combo * 2);
      setCombo((prev) => prev + 1);
      setFeedback('correct');
    } else {
      sounds.playPop();
      setCombo(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentItemIndex((prev) => (prev + 1) % GAME_ITEMS.length);
    }, 180);
  };

  if (!isOpen) return null;

  const currentItem = GAME_ITEMS[currentItemIndex];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-[#FEFAE0] shadow-2xl border-4 border-[#283618] overflow-hidden flex flex-col max-h-[620px] text-[#283618]"
      >
        {/* Header Ruang Rahasia */}
        <div className="bg-[#283618] text-[#FEFAE0] px-4 py-3 flex items-center justify-between border-b-3 border-[#1e2a12] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FEFAE0] text-[#283618] flex items-center justify-center shadow-xs">
              <Trophy className="w-4 h-4 text-[#283618]" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#FEFAE0]/80">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>EASTER EGG DKV UNM</span>
              </div>
              <h3 className="font-display text-sm sm:text-base font-black text-white leading-tight">
                Tantangan Pilah Kilat
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#5B4436] hover:bg-[#433126] text-[#FEFAE0] transition active:scale-95 border border-[#FEFAE0]/30 cursor-pointer"
            title="Tutup Ruang Rahasia"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Flexible & Smoothly Scrollable on HP */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-center">
          <div className="flex flex-col items-center text-center my-auto">
            {!isPlaying && !gameOver && (
              <div className="py-2 max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#5B4436]/15 border-2 border-[#5B4436]/30 flex items-center justify-center mx-auto mb-2.5 shadow-xs text-[#283618]">
                  <Zap className="w-7 h-7 text-[#283618]" />
                </div>
                <h4 className="font-display text-lg sm:text-xl font-black text-[#283618]">
                  Pilah Kilat 15 Detik!
                </h4>
                <p className="text-xs text-[#5B4436] mt-1.5 mb-5 leading-relaxed font-medium">
                  Uji kecepatan refleksmu! Tentukan apakah sampah kampus ini termasuk <strong>Organik</strong> atau <strong>Anorganik</strong> secepat mungkin.
                </p>
                <button
                  type="button"
                  onClick={startArcade}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] font-display text-sm font-black shadow-md cursor-pointer transition-all hover:scale-102 active:scale-98 border-2 border-[#1e2a12] inline-flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Mulai Main Sekarang</span>
                </button>
              </div>
            )}

            {isPlaying && (
              <div className="w-full max-w-sm mx-auto flex flex-col">
                {/* Top Stats Bar */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#283618] text-[#FEFAE0] font-display text-xs font-black mb-3 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#FEFAE0]/80">WAKTU:</span>
                    <span className={`text-sm tabular-nums ${timeLeft <= 5 ? 'text-rose-300 animate-ping' : 'text-amber-200'}`}>
                      {timeLeft}s
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#FEFAE0]/80 mr-1">SKOR:</span>
                    <span className="text-amber-200 text-sm">{score}</span>
                  </div>
                  {combo > 1 && (
                    <div className="text-[10px] bg-amber-400 text-[#283618] px-2 py-0.5 rounded-full font-black animate-bounce">
                      {combo}x Combo!
                    </div>
                  )}
                </div>

                {/* Tactile Waste Item Card */}
                <div
                  className={`p-5 rounded-3xl bg-[#F7F5EB] shadow-md border-3 transition-all duration-150 flex flex-col items-center justify-center my-1 select-none ${
                    feedback === 'correct'
                      ? 'border-emerald-600 bg-emerald-50 scale-102'
                      : feedback === 'wrong'
                      ? 'border-rose-600 bg-rose-50 animate-shake'
                      : 'border-[#283618]/30'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#283618]/10 flex items-center justify-center mb-2">
                    {currentItem.type === 'organik' ? (
                      <Leaf className="w-9 h-9 text-[#283618]" />
                    ) : (
                      <RefreshCw className="w-9 h-9 text-[#5B4436]" />
                    )}
                  </div>
                  <div className="font-display text-base font-black text-[#283618]">
                    {currentItem.name}
                  </div>
                  <span className="text-[10px] text-[#5B4436] mt-0.5 font-medium">{currentItem.desc}</span>
                </div>

                {/* Dual Thumb Action Buttons (Designed for fast thumb tapping on phones) */}
                <div className="grid grid-cols-2 gap-2.5 mt-3 select-none">
                  <button
                    type="button"
                    onClick={() => handleAnswer('organik')}
                    className="p-3 sm:p-3.5 rounded-2xl bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] font-display text-xs font-black shadow-md cursor-pointer transition-all active:translate-y-1 border-b-4 border-[#16200d] flex flex-col items-center gap-1 active:bg-[#16200d]"
                  >
                    <Leaf className="w-5 h-5 text-emerald-300" />
                    <span>ORGANIK</span>
                    <span className="text-[9px] text-[#FEFAE0]/80 font-normal">Sisa Makanan & Daun</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAnswer('anorganik')}
                    className="p-3 sm:p-3.5 rounded-2xl bg-[#5B4436] hover:bg-[#433126] text-[#FEFAE0] font-display text-xs font-black shadow-md cursor-pointer transition-all active:translate-y-1 border-b-4 border-[#3c2a21] flex flex-col items-center gap-1 active:bg-[#3c2a21]"
                  >
                    <RefreshCw className="w-5 h-5 text-amber-200" />
                    <span>ANORGANIK</span>
                    <span className="text-[9px] text-[#FEFAE0]/80 font-normal">Plastik & Kertas</span>
                  </button>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="py-2 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-[#283618]/15 border-2 border-[#283618]/30 flex items-center justify-center text-2xl mx-auto mb-1.5 text-[#283618]">
                  <Award className="w-6 h-6 text-[#283618]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5B4436]">Waktu 15 Detik Habis!</span>
                <h4 className="font-display text-xl font-black text-[#283618] mt-0.5">
                  Skor Akhir: <span className="text-[#283618]">{score}</span>
                </h4>
                <p className="text-xs text-[#5B4436] mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
                  {score >= 80
                    ? 'Luar biasa! Refleks pemilahanmu setingkat Eco-Champion UNM!'
                    : 'Keren! Terus latih kebiasaan memilah sampah sehari-hari di kampus!'}
                </p>
                <button
                  type="button"
                  onClick={startArcade}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] font-display text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 border border-[#FEFAE0] inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Main Lagi</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Unified Bottom Footer */}
        <div className="p-2.5 bg-[#5B4436]/10 border-t-2 border-[#283618]/15 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#5B4436] hover:bg-[#433126] text-white font-display text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 border border-[#FEFAE0]/40 flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
