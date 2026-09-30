import React, { useState, useRef } from 'react';
import { RotateCw, RefreshCw, Sparkles, Leaf, Package, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { RECYCLE_PHASES } from '../data/content';
import { sounds } from '../utils/audio';

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
    setWheelRotation((prev) => prev + 72); // 360 / 5 phases = 72 deg
  };

  const handleSelectPhase = (index: number) => {
    playRatchetSequence(3);
    setActiveStepIndex(index);
    setWheelRotation(index * 72);
  };

  // Direct Interactive Drag-to-Rotate Round Steering Wheel
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
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
    const centerY = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    const deltaAngle = currentAngle - startAngleRef.current;
    const newRotation = startRotationRef.current + deltaAngle;
    setWheelRotation(newRotation);

    // Play click sound every 20 degrees of rotation like a steering ratchet
    if (Math.abs(newRotation - lastClickAngleRef.current) >= 20) {
      sounds.playWheelClick();
      lastClickAngleRef.current = newRotation;
    }

    // Determine current active phase while rotating
    const normalized = (((newRotation % 360) + 360) % 360);
    const stepIdx = Math.round(normalized / 72) % 5;
    if (stepIdx !== activeStepIndex) {
      setActiveStepIndex(stepIdx);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap to closest notch (72 deg increments)
    const normalized = Math.round(wheelRotation / 72) * 72;
    setWheelRotation(normalized);

    const stepIdx = (((Math.round(normalized / 72) % 5) + 5) % 5);
    setActiveStepIndex(stepIdx);
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
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#808847] leading-tight tracking-tight uppercase">
          RECYCLE
        </h2>
        <div className="font-display text-xl sm:text-2xl md:text-3xl font-black text-[#808847] tracking-wider uppercase mt-1">
          UBAH JADI BARU
        </div>
        <p className="font-body text-[#3B4219] text-sm sm:text-base font-semibold mt-2 max-w-md mx-auto">
          sampah bukan akhir cerita, bisa jadi awal dari sesuatu yang baru.
        </p>
      </div>

      {/* Roda Siklus Interaktif Visual */}
      <div className="w-full relative flex flex-col items-center">
        {/* Dual Cards with equal heights - strictly rata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6 items-stretch">
          {/* Left Card: Input Bahan Sampah */}
          <div className="p-5 rounded-3xl bg-[#925E06] text-[#F1D2A1] shadow-xl border-2 border-[#794E05] flex flex-col justify-between min-h-[170px]">
            <div>
              <div className="h-6 flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/25 text-[#F1D2A1] whitespace-nowrap">
                  Bahan Mentah Masuk
                </span>
                <span className="font-display text-xs font-black text-amber-300 whitespace-nowrap">
                  Langkah {currentPhase.step} dari 5
                </span>
              </div>
              <h4 className="font-display text-lg font-black text-white">{currentPhase.title}</h4>
              <p className="text-xs text-[#F1D2A1]/90 mt-1 leading-relaxed">
                {currentPhase.description}
              </p>
            </div>
            <div className="pt-2 text-[10px] text-amber-200/80 font-bold uppercase tracking-wider">
              Material: {currentPhase.material}
            </div>
          </div>

          {/* Right Card: Transformasi Hasil */}
          <div className="p-5 rounded-3xl bg-[#808847] text-[#F1D2A1] shadow-xl border-2 border-[#697034] flex flex-col justify-between min-h-[170px]">
            <div>
              <div className="h-6 flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/25 text-[#F1D2A1] whitespace-nowrap">
                  Aksi & Hasil Sirkular
                </span>
                <span className="text-xs font-bold text-white flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-[#F1D2A1] shrink-0" /> Siklus Sirkular
                </span>
              </div>
              <h4 className="font-display text-lg font-black text-white">{currentPhase.subtitle}</h4>
              <p className="text-xs text-white/95 mt-1 leading-relaxed">
                {currentPhase.campusAction}
              </p>
            </div>
            <div className="pt-2 text-[10px] text-emerald-100 font-bold uppercase tracking-wider">
              Output: Nilai Tambah DKV
            </div>
          </div>
        </div>

        {/* SETIR BULAT DENGAN KOTAK ANGKA DI ATASNYA (Sesuai Sketsa Pengguna) */}
        <div className="relative my-4 flex flex-col items-center select-none w-full max-w-md">
          
          {/* 1. KOTAK ANGKA DI ATAS SETIR (Matching the "ANGKA" rectangle in user's sketch) */}
          <div className="w-full max-w-xs sm:max-w-sm rounded-3xl bg-[#808847] text-[#F1D2A1] p-4 sm:p-5 shadow-2xl border-4 border-[#5E6430] flex flex-col items-center text-center relative z-20 transition-all duration-300 transform hover:scale-[1.02]">
            {/* Top tiny label */}
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F1D2A1]/80 mb-1">
              INDIKATOR TAHAP
            </span>

            {/* BIG PROMINENT NUMBER (ANGKA) */}
            <div className="font-display text-5xl sm:text-6xl font-black text-white leading-none tracking-tight my-1 tabular-nums drop-shadow-md">
              0{currentPhase.step}
            </div>

            {/* Title corresponding to this number */}
            <h4 className="font-display text-sm sm:text-base font-black text-amber-200 mt-1 uppercase tracking-wide">
              {currentPhase.title.split('. ')[1] || currentPhase.title}
            </h4>
            <p className="text-xs text-white/90 font-medium mt-1 line-clamp-1">
              {currentPhase.subtitle}
            </p>

            {/* Downward indicator notch pointing to the top of the wheel */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-[12px] border-t-[#5E6430]" />
          </div>

          {/* 2. SETIR BULAT (Clean Circular Steering Wheel with Radial Spokes) */}
          <div className="relative mt-7 mb-4 flex items-center justify-center">
            {/* Interactive draggable steering wheel */}
            <div
              ref={wheelRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              title="Seret / putar setir bulat ini untuk mengganti angka"
              className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center touch-none select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ touchAction: 'none' }}
            >
              {/* Rotating Wheel Group */}
              <div
                className={`absolute inset-0 rounded-full flex items-center justify-center ${
                  isDragging ? 'transition-none' : 'transition-transform duration-500 ease-out'
                }`}
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                }}
              >
                {/* Outer Circular Steering Rim (Setir Bulat) */}
                <div
                  className="w-full h-full rounded-full border-[18px] sm:border-[22px] border-[#925E06] shadow-2xl relative flex items-center justify-center bg-[#F1D2A1]/20"
                  style={{
                    boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.35), inset 0 2px 6px 0 rgba(255, 255, 255, 0.25)',
                  }}
                >
                  {/* Subtle inner grip groove */}
                  <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#F1D2A1]/40 pointer-events-none" />

                  {/* 5 Radial Spokes (Jeruji Setir Bulat sesuai gambar sketsa) */}
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                    <div
                      key={`spoke-${i}`}
                      className="absolute w-3.5 sm:w-4 bg-[#7A4B04] rounded-full shadow-inner"
                      style={{
                        height: '100%',
                        transform: `rotate(${angle}deg)`,
                      }}
                    />
                  ))}

                  {/* 5 Step Indicator Studs along the rim */}
                  {[0, 72, 144, 216, 288].map((angle, i) => {
                    const stepNum = i + 1;
                    const isStepActive = currentPhase.step === stepNum;
                    const rad = (angle - 90) * (Math.PI / 180);
                    const distance = 98; // distance from center in px
                    const x = Math.cos(rad) * distance;
                    const y = Math.sin(rad) * distance;

                    return (
                      <div
                        key={`notch-${stepNum}`}
                        className={`absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full font-display font-black text-xs flex items-center justify-center shadow-md transition-all pointer-events-none ${
                          isStepActive
                            ? 'bg-[#808847] text-white ring-2 ring-white scale-110 z-20'
                            : 'bg-[#5C3202] text-[#F1D2A1] z-10'
                        }`}
                        style={{
                          transform: `translate(${x}px, ${y}px) rotate(${-wheelRotation}deg)`,
                        }}
                      >
                        {stepNum}
                      </div>
                    );
                  })}

                  {/* Center Horn / Steering Wheel Hub */}
                  <div
                    className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#808847] text-[#F1D2A1] flex flex-col items-center justify-center shadow-xl border-4 border-[#5E6430]"
                    style={{
                      boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.3), inset 0 2px 4px 0 rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <RefreshCw className="w-6 h-6 text-[#F1D2A1] animate-spin" style={{ animationDuration: '14s' }} />
                    <span className="font-display text-[10px] font-black uppercase tracking-wider text-white mt-1">
                      PUTAR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Step Buttons (1, 2, 3, 4, 5) & Turn Button */}
          <div className="flex flex-col items-center gap-3 w-full mt-2">
            {/* Direct Step Pills */}
            <div className="flex items-center justify-center gap-2">
              {RECYCLE_PHASES.map((p, idx) => (
                <button
                  key={p.step}
                  type="button"
                  onClick={() => handleSelectPhase(idx)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-display font-black text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                    activeStepIndex === idx
                      ? 'bg-[#808847] text-white scale-110 shadow-md ring-2 ring-[#808847]/40'
                      : 'bg-[#925E06] text-[#F1D2A1] hover:bg-[#784D05]'
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
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#925E06] text-[#F1D2A1] font-display font-black text-sm tracking-wide shadow-lg hover:bg-[#784D05] active:scale-95 transition-all transform hover:-translate-y-0.5 cursor-pointer border border-[#B07715]/40"
            >
              <RotateCw className="w-4 h-4 stroke-[2.5]" />
              <span>Putar Setir ke Tahap Berikutnya</span>
            </button>

            <span className="text-[11px] font-semibold text-[#5F6732] text-center">
              Pegang & seret setir bulat langsung untuk memutar angka (bersuara klik otomatis)
            </span>
          </div>
        </div>

        {/* Mini Game Toggle Button addressing survey finding */}
        <div className="w-full mt-8 p-6 rounded-3xl bg-[#E6C38E]/70 border-2 border-[#808847]/40 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-black uppercase text-[#925E06]">
                Tantangan Interaktif Mahasiswa
              </span>
              <h4 className="font-display text-lg font-black text-[#242A16]">
                Uji Kemampuan: Masih Bingung Memilah Sampah?
              </h4>
              <p className="text-xs text-[#3B4219] font-medium mt-0.5">
                Riset DKV UNM membuktikan 18,8% mahasiswa masih bingung membedakan kategori sampah.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                setShowGame(!showGame);
              }}
              className="px-4 py-2 rounded-xl bg-[#808847] text-[#F1D2A1] font-display text-xs font-black shadow hover:bg-[#686F35] transition self-start sm:self-auto cursor-pointer"
            >
              {showGame ? 'Tutup Game' : 'Mulai Latihan Pilah (5 Soal)'}
            </button>
          </div>

          {showGame && (
            <div className="mt-5 pt-4 border-t border-[#808847]/30">
              {currentWasteIndex < wasteItems.length ? (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#4B5222]">
                    <span>Pertanyaan {currentWasteIndex + 1} dari {wasteItems.length}</span>
                    <span>Skor: {gameScore}</span>
                  </div>

                  {/* Card with waste item */}
                  <div className="p-4 rounded-2xl bg-white/80 text-center mb-4">
                    <p className="text-[11px] text-[#925E06] font-bold uppercase tracking-wider">Sampah apa ini?</p>
                    <h5 className="font-display text-xl font-black text-[#242A16] my-1">
                      {wasteItems[currentWasteIndex].name}
                    </h5>
                    <p className="text-xs text-slate-500 italic">Petunjuk: {wasteItems[currentWasteIndex].hint}</p>
                  </div>

                  {/* Feedback display */}
                  {gameFeedback && (
                    <div className="mb-4 p-2.5 rounded-xl bg-[#808847]/20 text-center font-bold text-xs text-[#2F3617] animate-fade-in">
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
                  <div className="w-12 h-12 rounded-full bg-[#808847] text-[#F1D2A1] flex items-center justify-center mx-auto mb-2 font-display text-xl font-bold">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h5 className="font-display text-xl font-black text-[#242A16]">Latihan Selesai!</h5>
                  <p className="text-xs text-[#3B4219] font-medium mt-1">
                    Kamu mendapatkan skor <strong>{gameScore} dari 50</strong>. Sekarang kamu siap memilah sampah di kampus!
                  </p>
                  <button
                    onClick={() => {
                      setCurrentWasteIndex(0);
                      setGameScore(0);
                      setGameFeedback(null);
                    }}
                    className="mt-3 px-5 py-2 rounded-full bg-[#925E06] text-[#F1D2A1] text-xs font-bold hover:bg-[#784D05] cursor-pointer"
                  >
                    Main Lagi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
