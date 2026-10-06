import React, { useState, useRef } from 'react';
import { RotateCw, RefreshCw, Sparkles, Leaf, Package, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { RECYCLE_PHASES } from '../data/content';
import { sounds } from '../utils/audio';
import { GrassDivider } from './GrassDivider';

export const RecycleSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showGame, setShowGame] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);
  const lastClickAngleRef = useRef(0);

  // Waste sorting mini-game state
  const [gameScore, setGameScore] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [currentWasteIndex, setCurrentWasteIndex] = useState(0);

  const wasteItems = [
    { name: 'Botol Plastik PET Air Mineral', category: 'anorganik', hint: 'Bilas & remukkan' },
    { name: 'Kulit Buah & Daun Kering', category: 'organik', hint: 'Bisa jadi kompos' },
    { name: 'Baterai Bekas Jam Dinding', category: 'b3', hint: 'Limbah berbahaya beracun' },
    { name: 'Kertas Draft Tugas & HVS', category: 'anorganik', hint: 'Bisa didaur ulang jadi kertas baru' },
    { name: 'Sisa Nasi & Tulang Ayam', category: 'organik', hint: 'Sampah sisa makanan' },
  ];

  // Sound sequence for animated turn
  const playRatchetSequence = (steps = 4) => {
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        sounds.playWheelClick();
      }, i * 65);
    }
  };

  const handleNextPhase = () => {
    playRatchetSequence(4);
    const nextIndex = (activeStepIndex + 1) % RECYCLE_PHASES.length;
    setActiveStepIndex(nextIndex);
    // Continuous rotation counter-clockwise to bring next index (i) to apex (0 deg)
    setWheelRotation(-nextIndex * 72);
  };

  const handleSelectPhase = (index: number) => {
    playRatchetSequence(3);
    setActiveStepIndex(index);
    setWheelRotation(-index * 72);
  };

  // Direct Interactive Drag-to-Rotate Semicircular Half Wheel
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    // For the half wheel container, the center of the full circle is at the bottom baseline
    const centerY = rect.top + rect.height;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    startAngleRef.current = angle;
    startRotationRef.current = wheelRotation;
    lastClickAngleRef.current = wheelRotation;
    setIsDragging(true);

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    sounds.playWheelClick();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    const deltaAngle = currentAngle - startAngleRef.current;
    const newRotation = startRotationRef.current + deltaAngle;
    setWheelRotation(newRotation);

    // Play click sound every 20 degrees of rotation
    if (Math.abs(newRotation - lastClickAngleRef.current) >= 20) {
      sounds.playWheelClick();
      lastClickAngleRef.current = newRotation;
    }

    // Determine current active phase while rotating (whichever spoke is closest to top 0 deg)
    const activeIdx = (((Math.round(-newRotation / 72) % 5) + 5) % 5);
    if (activeIdx !== activeStepIndex) {
      setActiveStepIndex(activeIdx);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap to closest 72 deg increment so the number sits precisely at the top
    const snapIndex = (((Math.round(-wheelRotation / 72) % 5) + 5) % 5);
    setActiveStepIndex(snapIndex);
    setWheelRotation(-snapIndex * 72);
    sounds.playWheelClick();

    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const currentPhase = RECYCLE_PHASES[activeStepIndex];

  const handleSortItem = (selectedCategory: string) => {
    sounds.playPop();
    const currentItem = wasteItems[currentWasteIndex];
    if (selectedCategory === currentItem.category) {
      sounds.playSuccess();
      setGameScore((prev) => prev + 10);
      setGameFeedback(`Benar! ${currentItem.name} termasuk sampah ${selectedCategory.toUpperCase()}.`);
    } else {
      setGameFeedback(`Kurang tepat. ${currentItem.name} harusnya masuk kategori ${currentItem.category.toUpperCase()}!`);
    }

    if (currentWasteIndex < wasteItems.length - 1) {
      setTimeout(() => {
        setCurrentWasteIndex((prev) => prev + 1);
        setGameFeedback(null);
      }, 1200);
    } else {
      setTimeout(() => {
        setGameFeedback(`Selesai! Skormu: ${gameScore + (selectedCategory === currentItem.category ? 10 : 0)}/50.`);
      }, 1000);
    }
  };

  return (
    <section id="recycle" className="py-12 px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header matching 3R DMI.jpg */}
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#283618] leading-tight tracking-tight uppercase">
          RECYCLE
        </h2>
        <div className="font-display text-xl sm:text-2xl md:text-3xl font-black text-[#283618] tracking-wider uppercase mt-1">
          UBAH JADI BARU
        </div>
        <p className="font-body text-[#283618]/90 text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
          sampah bukan akhir cerita, bisa jadi awal dari sesuatu yang baru.
        </p>
      </div>

      {/* Roda Siklus Interaktif Visual */}
      <div className="w-full relative flex flex-col items-center">
        {/* Dual Cards - 2 Columns side-by-side on mobile and desktop */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 w-full mb-6 items-stretch">
          {/* Left Card: Input Bahan Sampah */}
          <div className="p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#5B4436] text-[#FEFAE0] shadow-md sm:shadow-xl border-2 border-[#433126] flex flex-col justify-between min-h-[140px] sm:min-h-[170px] transform hover:-translate-y-2 hover:scale-[1.025] hover:shadow-2xl transition-all duration-300 group cursor-default">
            <div>
              <div className="h-5 sm:h-6 flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-[7.5px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 rounded-full bg-black/25 text-[#FEFAE0] truncate group-hover:scale-105 transition-transform">
                  Bahan Masuk
                </span>
                <span className="font-display text-[8px] sm:text-xs font-black text-[#FEFAE0] whitespace-nowrap group-hover:scale-110 transition-transform">
                  Tahap {currentPhase.step}/5
                </span>
              </div>
              <h4 className="font-display text-xs sm:text-lg font-black text-white leading-tight group-hover:text-amber-100 transition-colors">{currentPhase.title}</h4>
              <p className="text-[8px] sm:text-xs text-[#FEFAE0]/90 mt-1 leading-tight sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                {currentPhase.description}
              </p>
            </div>
            <div className="pt-1.5 sm:pt-2 text-[7px] sm:text-[10px] text-[#FEFAE0]/80 font-bold uppercase tracking-wider truncate">
              {currentPhase.material}
            </div>
          </div>

          {/* Right Card: Transformasi Hasil */}
          <div className="p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#283618] text-[#FEFAE0] shadow-md sm:shadow-xl border-2 border-[#1e2a12] flex flex-col justify-between min-h-[140px] sm:min-h-[170px] transform hover:-translate-y-2 hover:scale-[1.025] hover:shadow-2xl transition-all duration-300 group cursor-default">
            <div>
              <div className="h-5 sm:h-6 flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-[7.5px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 rounded-full bg-black/25 text-[#FEFAE0] truncate group-hover:scale-105 transition-transform">
                  Aksi & Hasil
                </span>
                <span className="text-[8px] sm:text-xs font-bold text-white flex items-center gap-0.5 whitespace-nowrap group-hover:scale-110 transition-transform">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FEFAE0] shrink-0 animate-spin" style={{ animationDuration: '8s' }} /> Sirkular
                </span>
              </div>
              <h4 className="font-display text-xs sm:text-lg font-black text-white leading-tight group-hover:text-amber-100 transition-colors">{currentPhase.subtitle}</h4>
              <p className="text-[8px] sm:text-xs text-white/95 mt-1 leading-tight sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                {currentPhase.campusAction}
              </p>
            </div>
            <div className="pt-1.5 sm:pt-2 text-[7px] sm:text-[10px] text-emerald-100 font-bold uppercase tracking-wider truncate">
              Output: Nilai Tambah
            </div>
          </div>
        </div>

        {/* SETIR SETENGAH LINGKARAN DENGAN KOTAK ANGKA DI ATASNYA (Sesuai Sketsa Pengguna) */}
        <div className="relative my-4 flex flex-col items-center select-none w-full max-w-lg">
          
          {/* 1. KOTAK ANGKA DI ATAS RODA (Matching the "ANGKA" rectangle in user's sketch) */}
          <div className="w-full max-w-xs sm:max-w-sm rounded-3xl bg-[#283618] text-[#FEFAE0] p-4 sm:p-5 shadow-2xl border-4 border-[#1e2a12] flex flex-col items-center text-center relative z-30 transition-all duration-300 transform hover:scale-[1.04] hover:-translate-y-1.5 hover:shadow-2xl cursor-default group">
            {/* Top tiny label */}
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FEFAE0]/80 mb-1 group-hover:text-white transition-colors">
              INDIKATOR TAHAP TERPILIH
            </span>

            {/* BIG PROMINENT NUMBER (ANGKA) */}
            <div className="font-display text-5xl sm:text-6xl font-black text-white leading-none tracking-tight my-1 tabular-nums drop-shadow-md group-hover:scale-110 group-hover:text-[#FEFAE0] transition-all">
              0{currentPhase.step}
            </div>

            {/* Title corresponding to this number */}
            <h4 className="font-display text-sm sm:text-base font-black text-[#FEFAE0] mt-1 uppercase tracking-wide group-hover:scale-105 transition-transform">
              {currentPhase.title.split('. ')[1] || currentPhase.title}
            </h4>
            <p className="text-xs text-white/90 font-medium mt-1 line-clamp-1">
              {currentPhase.subtitle}
            </p>

            {/* Downward indicator notch pointing to the top number on the half-wheel */}
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-[14px] border-t-[#1e2a12] drop-shadow" />
          </div>

          {/* 2. RODA SETENGAH LINGKARAN (Setir Lebih Besar, Poros Hijau Ringkas & Elegan) */}
          <div className="relative mt-6 flex flex-col items-center w-full">
            
            {/* Semicircular Viewport (Top half of the wheel arch - Big & Prominent) */}
            <div className="relative w-[390px] h-[200px] sm:w-[460px] sm:h-[235px] overflow-hidden flex justify-center items-start">
              {/* Full circular wheel positioned so its top half fills the viewport */}
              <div
                ref={wheelRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                title="Seret roda setengah lingkaran atau klik angka untuk memilih tahap"
                className={`relative w-[390px] h-[390px] sm:w-[460px] sm:h-[460px] rounded-full flex items-center justify-center touch-none select-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{ touchAction: 'none' }}
              >
                {/* Rotating Wheel Group (Outer Rim, Radial Spokes, and Number Badges) */}
                <div
                  className={`absolute inset-0 rounded-full flex items-center justify-center ${
                    isDragging ? 'transition-none' : 'transition-transform duration-500 ease-out'
                  }`}
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                  }}
                >
                  {/* Outer Circular Steering Rim (Setir Bulat Besar & Megah) */}
                  <div
                    className="w-full h-full rounded-full border-[22px] sm:border-[26px] border-[#5B4436] shadow-2xl relative flex items-center justify-center bg-[#FEFAE0]/20"
                    style={{
                      boxShadow: '0 14px 35px -4px rgba(0, 0, 0, 0.4), inset 0 2px 8px 0 rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    {/* Subtle inner grip groove */}
                    <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#FEFAE0]/40 pointer-events-none" />

                    {/* 5 Long Radial Spokes (Jeruji Setir Panjang Menuju Puncak) */}
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                      <div
                        key={`spoke-${i}`}
                        className="absolute w-4 sm:w-5 bg-[#433126] rounded-full shadow-inner"
                        style={{
                          height: '100%',
                          transform: `rotate(${angle}deg)`,
                        }}
                      />
                    ))}

                    {/* 5 Step Indicator Studs / Numbers on the wheel */}
                    {[0, 72, 144, 216, 288].map((angle, i) => {
                      const stepNum = i + 1;
                      const isStepActive = currentPhase.step === stepNum;
                      const rad = (angle - 90) * (Math.PI / 180);
                      const distance = 152; // distance from center in px
                      const x = Math.cos(rad) * distance;
                      const y = Math.sin(rad) * distance;

                      return (
                        <button
                          key={`notch-${stepNum}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPhase(i);
                          }}
                          className={`absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full font-display font-black text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
                            isStepActive
                              ? 'bg-[#283618] text-[#FEFAE0] ring-4 ring-[#FEFAE0] scale-125 z-20 shadow-xl'
                              : 'bg-[#433126] text-[#FEFAE0] hover:bg-[#5B4436] hover:scale-110 z-10 shadow-md'
                          }`}
                          style={{
                            transform: `translate(${x}px, ${y}px) rotate(${-wheelRotation}deg)`,
                          }}
                          title={`Pilih Tahap 0${stepNum}`}
                        >
                          {stepNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* POROS HIJAU STATIS BERUKURAN KECIL & RINGKAS (TIDAK MENGHALANGI JERUJI SETIR) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPhase();
                }}
                className="absolute bottom-0 z-30 w-20 h-10 sm:w-24 sm:h-12 rounded-t-full bg-[#283618] hover:bg-[#1e2a12] active:scale-95 text-[#FEFAE0] flex flex-col items-center justify-start pt-1 sm:pt-1.5 shadow-xl border-t-3 border-x-3 border-[#1e2a12] cursor-pointer transition-all group"
                style={{
                  boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.35)',
                }}
                title="Klik untuk memutar setir ke tahap berikutnya"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FEFAE0] group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-display text-[8px] sm:text-[9.5px] font-black uppercase tracking-widest text-[#FEFAE0] leading-none mt-0.5">
                  PUTAR
                </span>
              </button>
            </div>

            {/* 3. HORIZONTAL BASELINE BAR (Garis Dasar Sesuai Sketsa Pengguna) */}
            <div className="w-full max-w-[410px] sm:max-w-[480px] h-4 bg-[#433126] rounded-full border-t-2 border-[#5B4436] shadow-lg -mt-2 z-20 flex items-center justify-center relative">
              <div className="w-28 h-1.5 rounded-full bg-[#5B4436]/60" />
            </div>
          </div>

          {/* Quick Step Buttons (1, 2, 3, 4, 5) & Turn Button */}
          <div className="flex flex-col items-center gap-3 w-full mt-4">
            {/* Direct Step Pills */}
            <div className="flex items-center justify-center gap-2">
              {RECYCLE_PHASES.map((p, idx) => (
                <button
                  key={p.step}
                  type="button"
                  onClick={() => handleSelectPhase(idx)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-display font-black text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                    activeStepIndex === idx
                      ? 'bg-[#283618] text-[#FEFAE0] scale-110 shadow-md ring-2 ring-[#283618]/40'
                      : 'bg-[#5B4436] text-[#FEFAE0] hover:bg-[#433126]'
                  }`}
                >
                  {p.step}
                </button>
              ))}
            </div>

            {/* Main Action Spin Button */}
            <button
              type="button"
              onClick={handleNextPhase}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#5B4436] text-[#FEFAE0] font-display font-black text-sm tracking-wide shadow-lg hover:bg-[#433126] active:scale-95 transition-all transform hover:-translate-y-0.5 cursor-pointer border border-[#433126]"
            >
              <RotateCw className="w-4 h-4 stroke-[2.5]" />
              <span>Putar Setir ke Tahap Berikutnya</span>
            </button>

            <span className="text-[11px] font-semibold text-[#283618]/80 text-center max-w-sm">
              Angka di puncak atas setir adalah tahap yang dipilih. Seret roda atau klik angka untuk memutar.
            </span>
          </div>
        </div>

        {/* Mini Game Toggle Button addressing survey finding */}
        <div className="w-full mt-8 p-6 rounded-3xl bg-[#5B4436]/15 border-2 border-[#283618]/20 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-black uppercase text-[#5B4436]">
                Tantangan Interaktif Mahasiswa
              </span>
              <h4 className="font-display text-lg font-black text-[#283618]">
                Uji Kemampuan: Masih Bingung Memilah Sampah?
              </h4>
              <p className="text-xs text-[#283618]/80 font-medium mt-0.5">
                Riset DKV UNM membuktikan 18,8% mahasiswa masih bingung membedakan kategori sampah.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                setShowGame(!showGame);
              }}
              className="px-4 py-2 rounded-xl bg-[#283618] text-[#FEFAE0] font-display text-xs font-black shadow hover:bg-[#1e2a12] transition self-start sm:self-auto cursor-pointer"
            >
              {showGame ? 'Tutup Game' : 'Mulai Latihan Pilah (5 Soal)'}
            </button>
          </div>

          {showGame && (
            <div className="mt-5 pt-4 border-t border-[#283618]/20">
              {currentWasteIndex < wasteItems.length ? (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#283618]">
                    <span>Pertanyaan {currentWasteIndex + 1} dari {wasteItems.length}</span>
                    <span>Skor: {gameScore}</span>
                  </div>

                  {/* Card with waste item */}
                  <div className="p-4 rounded-2xl bg-white/80 text-center mb-4">
                    <p className="text-[11px] text-[#5B4436] font-bold uppercase tracking-wider">Sampah apa ini?</p>
                    <h5 className="font-display text-xl font-black text-[#283618] my-1">
                      {wasteItems[currentWasteIndex].name}
                    </h5>
                    <p className="text-xs text-slate-500 italic">Petunjuk: {wasteItems[currentWasteIndex].hint}</p>
                  </div>

                  {/* Feedback display */}
                  {gameFeedback && (
                    <div className="mb-4 p-2.5 rounded-xl bg-[#283618]/15 text-center font-bold text-xs text-[#283618] animate-fade-in">
                      {gameFeedback}
                    </div>
                  )}

                  {/* Bin category buttons - CLEAN NO EMOJIS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSortItem('organik')}
                      className="p-3 rounded-2xl bg-emerald-700 text-white font-display text-xs font-bold hover:bg-emerald-800 transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                    >
                      <Leaf className="w-4 h-4 text-emerald-200 shrink-0" />
                      <span>Organik (Basah)</span>
                    </button>
                    <button
                      onClick={() => handleSortItem('anorganik')}
                      className="p-3 rounded-2xl bg-amber-700 text-white font-display text-xs font-bold hover:bg-amber-800 transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                    >
                      <Package className="w-4 h-4 text-amber-200 shrink-0" />
                      <span>Anorganik (Kering)</span>
                    </button>
                    <button
                      onClick={() => handleSortItem('b3')}
                      className="p-3 rounded-2xl bg-rose-700 text-white font-display text-xs font-bold hover:bg-rose-800 transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-200 shrink-0" />
                      <span>Sampah B3 (Bahaya)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-[#283618] text-[#FEFAE0] flex items-center justify-center mx-auto mb-2 font-display text-xl font-bold">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h5 className="font-display text-xl font-black text-[#283618]">Latihan Selesai!</h5>
                  <p className="text-xs text-[#283618]/90 font-medium mt-1">
                    Kamu mendapatkan skor <strong>{gameScore} dari 50</strong>. Sekarang kamu siap memilah sampah di kampus!
                  </p>
                  <button
                    onClick={() => {
                      setCurrentWasteIndex(0);
                      setGameScore(0);
                      setGameFeedback(null);
                    }}
                    className="mt-3 px-5 py-2 rounded-full bg-[#5B4436] text-[#FEFAE0] text-xs font-bold hover:bg-[#433126] cursor-pointer"
                  >
                    Main Lagi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grass Silhouette Line Divider matching reference images */}
      <GrassDivider variant="bottom" className="w-full mt-8" />
    </section>
  );
};
