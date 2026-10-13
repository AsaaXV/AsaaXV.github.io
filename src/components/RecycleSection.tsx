import React, { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { RECYCLE_PHASES } from '../data/content';
import { sounds } from '../utils/audio';
import { GrassDivider } from './GrassDivider';

export const RecycleSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);
  const lastClickAngleRef = useRef(0);

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
    // Smooth forward progression by 90 degrees clockwise (never rewind backwards from 4 to 1)
    setWheelRotation((prev) => prev - 90);
  };

  const handleSelectPhase = (index: number) => {
    playRatchetSequence(3);
    setActiveStepIndex(index);
    // Calculate shortest angular distance to target phase so it rotates smoothly without jarring rewinds
    setWheelRotation((prev) => {
      const baseTarget = -index * 90;
      const diff = ((((baseTarget - prev) % 360) + 540) % 360) - 180;
      return prev + diff;
    });
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

    // Play click sound every 22.5 degrees of rotation
    if (Math.abs(newRotation - lastClickAngleRef.current) >= 22.5) {
      sounds.playWheelClick();
      lastClickAngleRef.current = newRotation;
    }

    // Determine current active phase while rotating (whichever spoke is closest to top 0 deg, 90 deg step)
    const activeIdx = (((Math.round(-newRotation / 90) % 4) + 4) % 4);
    if (activeIdx !== activeStepIndex) {
      setActiveStepIndex(activeIdx);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap to closest 90 deg increment relative to current rotation so it never jerks or rewinds
    const snappedRotation = Math.round(wheelRotation / 90) * 90;
    const snapIndex = (((Math.round(-snappedRotation / 90) % 4) + 4) % 4);
    setActiveStepIndex(snapIndex);
    setWheelRotation(snappedRotation);
    sounds.playWheelClick();

    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const currentPhase = RECYCLE_PHASES[activeStepIndex];

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
          alur pemrosesan sampah daur ulang menjadi produk baru bernilai guna.
        </p>
      </div>

      {/* Roda Siklus Interaktif Visual (4 Tahap Kuadran 90 Derajat) */}
      <div className="w-full relative flex flex-col items-center">
        {/* SETIR SETENGAH LINGKARAN DENGAN KOTAK ANGKA DI ATASNYA */}
        <div className="relative my-2 flex flex-col items-center select-none w-full max-w-lg">
          
          {/* 1. KOTAK INDIKATOR TAHAP: BAHAN & AKSI DIGABUNGKAN */}
          <div className="w-full max-w-sm sm:max-w-md rounded-3xl bg-[#283618] text-[#FEFAE0] p-4 sm:p-5 shadow-2xl border-4 border-[#1e2a12] flex flex-col items-center relative z-30 transition-all duration-300">
            {/* Header: Indikator Nomor Tahap */}
            <div className="flex items-center justify-between w-full border-b border-white/15 pb-2.5 mb-2.5">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#FEFAE0]/80">
                INDIKATOR TAHAP
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-[#283618] font-display font-black text-xs sm:text-sm shadow-sm">
                0{currentPhase.step} / 04
              </span>
            </div>

            {/* Gabungan Aksi & Bahan */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
              {/* Kolom Aksi */}
              <div className="bg-black/25 rounded-2xl p-3 border border-white/10 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                  Aksi
                </span>
                <span className="font-display text-sm sm:text-base font-black text-white leading-snug">
                  {currentPhase.action || currentPhase.title}
                </span>
              </div>

              {/* Kolom Bahan */}
              <div className="bg-black/25 rounded-2xl p-3 border border-white/10 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#DDA15E] mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DDA15E]" />
                  Bahan
                </span>
                <span className="font-display text-xs sm:text-sm font-bold text-[#FEFAE0]/95 leading-snug">
                  {currentPhase.material}
                </span>
              </div>
            </div>

            {/* Downward indicator notch pointing to the top number on the half-wheel */}
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-[14px] border-t-[#1e2a12] drop-shadow" />
          </div>

          {/* 2. RODA SETENGAH LINGKARAN (4 Kuadran: 0, 90, 180, 270) */}
          <div className="relative mt-6 flex flex-col items-center w-full">
            
            {/* Semicircular Viewport */}
            <div className="relative w-[390px] h-[200px] sm:w-[460px] sm:h-[235px] overflow-hidden flex justify-center items-start">
              {/* Full circular wheel positioned so its top half fills the viewport */}
              <div
                ref={wheelRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                title="Seret roda atau klik angka untuk memilih tahap"
                className={`relative w-[390px] h-[390px] sm:w-[460px] sm:h-[460px] rounded-full flex items-center justify-center touch-none select-none ${
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
                  {/* Outer Circular Steering Rim */}
                  <div
                    className="w-full h-full rounded-full border-[22px] sm:border-[26px] border-[#5B4436] shadow-2xl relative flex items-center justify-center bg-[#FEFAE0]/20"
                    style={{
                      boxShadow: '0 14px 35px -4px rgba(0, 0, 0, 0.4), inset 0 2px 8px 0 rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    {/* 8 Gagang Kemudi Luar (Handles / Pegs di Luar Lingkar Setir) */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                      const isCardinal = angle % 90 === 0;
                      return (
                        <div
                          key={`handle-${i}`}
                          className="absolute pointer-events-none flex items-center justify-center"
                          style={{
                            height: '100%',
                            width: '100%',
                            transform: `rotate(${angle}deg)`,
                          }}
                        >
                          {/* Gagang kayu atas */}
                          <div
                            className={`absolute -top-4 sm:-top-5 rounded-t-lg bg-gradient-to-b from-[#6f5342] to-[#433126] border border-[#2e2119] shadow-md ${
                              isCardinal ? 'w-3.5 sm:w-4 h-6 sm:h-7' : 'w-2.5 sm:w-3 h-5 sm:h-6 opacity-85'
                            }`}
                          >
                            {/* Knob bulat di ujung gagang */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-3 sm:w-5 sm:h-3.5 rounded-full bg-[#5B4436] border border-[#2e2119] shadow-sm" />
                          </div>
                        </div>
                      );
                    })}

                    {/* Subtle inner grip groove */}
                    <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#FEFAE0]/40 pointer-events-none" />

                    {/* Jeruji / Spokes Padat (8 Jeruji: 4 Utama Tebal + 4 Diagonal) */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                      const isCardinal = angle % 90 === 0;
                      return (
                        <div
                          key={`spoke-${i}`}
                          className={`absolute rounded-full shadow-inner ${
                            isCardinal
                              ? 'w-4 sm:w-5 bg-gradient-to-r from-[#38281e] via-[#4d392c] to-[#38281e] border-x border-[#2b1f17]/60'
                              : 'w-2.5 sm:w-3 bg-[#3d2b20] opacity-90'
                          }`}
                          style={{
                            height: '100%',
                            transform: `rotate(${angle}deg)`,
                          }}
                        >
                          {/* Aksen Rivet Kuningan di jeruji */}
                          {isCardinal && (
                            <>
                              <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-sm" />
                              <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-sm" />
                            </>
                          )}
                        </div>
                      );
                    })}

                    {/* Cincin Lingkar Dalam (Golden/Brass Inner Concentric Ring persis seperti di referensi) */}
                    <div className="absolute w-[60%] h-[60%] rounded-full border-2 sm:border-[2.5px] border-amber-400/90 pointer-events-none flex items-center justify-center shadow-sm">
                      <div className="w-full h-full rounded-full border border-dashed border-amber-200/40" />
                    </div>

                    {/* 4 Step Indicator Studs / Numbers on the wheel */}
                    {[0, 90, 180, 270].map((angle, i) => {
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
                              : 'bg-[#433126] text-[#FEFAE0] hover:bg-[#5B4436] hover:scale-110 z-10 shadow-md border-2 border-[#5B4436]'
                          }`}
                          style={{
                            transform: `translate(${x}px, ${y}px) rotate(${-wheelRotation}deg)`,
                          }}
                          title={`Pilih Tahap 0${stepNum}: ${RECYCLE_PHASES[i]?.title}`}
                        >
                          {stepNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* POROS HIJAU STATIS */}
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

            {/* 3. HORIZONTAL BASELINE BAR */}
            <div className="w-full max-w-[410px] sm:max-w-[480px] h-4 bg-[#433126] rounded-full border-t-2 border-[#5B4436] shadow-lg -mt-2 z-20 flex items-center justify-center relative">
              <div className="w-28 h-1.5 rounded-full bg-[#5B4436]/60" />
            </div>

            {/* 4. PENANDA POSISI SETIR (KECIL & NON-INTERAKTIF, MURNI PENANDA POSISI) */}
            <div className="mt-4 flex flex-col items-center select-none pointer-events-none">
              <div className="flex items-center gap-2.5 sm:gap-3">
                {RECYCLE_PHASES.map((phase, idx) => {
                  const isActive = activeStepIndex === idx;
                  return (
                    <div
                      key={`step-mark-${phase.step}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-display font-black text-xs transition-all duration-300 ${
                        isActive
                          ? 'bg-[#283618] text-[#FEFAE0] ring-3 ring-amber-300 scale-110 shadow-md'
                          : 'bg-[#5B4436]/35 text-[#283618]/70 border border-[#5B4436]/40'
                      }`}
                    >
                      {phase.step}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grass Silhouette Line Divider matching reference images */}
      <GrassDivider variant="bottom" className="w-full mt-10" />
    </section>
  );
};
