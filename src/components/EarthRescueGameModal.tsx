import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Volume2, VolumeX, Shield, Heart, Trophy, RotateCcw, Play, Sparkles, AlertTriangle } from 'lucide-react';
import { sounds } from '../utils/audio';
import bumiImg from '../assets/bumi.png';

interface Pollutant {
  id: string;
  type: 'smog' | 'plastic' | 'vehicle' | 'oil' | 'seed' | 'shield' | 'water';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  speed: number;
  hp: number;
  maxHp: number;
  label: string;
  icon: string;
  color: string;
  size: number;
  points: number;
  isItem?: boolean;
}

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface EarthRescueGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EDUCATIONAL_TIPS = [
  'Daur ulang 1 ton kertas dapat menyelamatkan 17 pohon dan menghemat 26.500 liter air!',
  'Plastik sekali pakai butuh hingga 450 tahun untuk terurai. Gunakan tas belanja kain!',
  'Mematikan lampu dan alat elektronik yang tidak dipakai mengurangi emisi karbon pembangkit listrik.',
  'Mendaur ulang 1 kaleng aluminium menghemat energi yang cukup untuk menyalakan TV selama 3 jam.',
  'Kompos dari sisa makanan mengurangi gas metana berbahaya di tempat pembuangan akhir sampah.',
  'Membawa botol minum sendiri (tumbler) menghindarkan bumi dari ribuan sampah plastik botol per tahun!'
];

export const EarthRescueGameModal: React.FC<EarthRescueGameModalProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('earth_rescue_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [wave, setWave] = useState(1);
  const [pollutants, setPollutants] = useState<Pollutant[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldTimeLeft, setShieldTimeLeft] = useState(0);
  const [isEarthHurt, setIsEarthHurt] = useState(false);
  const [audioMuted, setAudioMuted] = useState(!sounds.enabled);
  const [cleanedCount, setCleanedCount] = useState(0);
  const [eduTip, setEduTip] = useState(EDUCATIONAL_TIPS[0]);

  const arenaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const gameLoopRef = useRef<number>(0);

  // Play opening chime when modal opens
  useEffect(() => {
    if (isOpen) {
      sounds.playAlert();
      setEduTip(EDUCATIONAL_TIPS[Math.floor(Math.random() * EDUCATIONAL_TIPS.length)]);
    } else {
      // Reset loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isOpen]);

  // Sync audio toggle with sound manager
  const toggleAudio = () => {
    sounds.enabled = !sounds.enabled;
    setAudioMuted(!sounds.enabled);
  };

  // Add floating floating text
  const addFloatingText = (text: string, x: number, y: number, color: string = '#283618') => {
    const id = Math.random().toString(36).substring(2, 9);
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 800);
  };

  // Start new game
  const startGame = () => {
    sounds.playWheelClick();
    setGameState('playing');
    setHealth(100);
    setScore(0);
    setWave(1);
    setCleanedCount(0);
    setPollutants([]);
    setFloatingTexts([]);
    setShieldActive(false);
    setShieldTimeLeft(0);
    lastSpawnRef.current = Date.now();
  };

  // Trigger oxygen wave to clear all screen pollutants
  const triggerOxygenBlast = useCallback(() => {
    sounds.playFanfare();
    addFloatingText('🌿 GELOMBANG OKSIGEN! BUMI BERSIH!', 50, 40, '#283618');
    setPollutants((prev) => {
      const regularCount = prev.filter(p => !p.isItem).length;
      setScore((s) => s + regularCount * 120);
      setCleanedCount((c) => c + regularCount);
      return [];
    });
  }, []);

  // Handle clicking on a pollutant or eco-item
  const handleItemClick = (e: React.MouseEvent, item: Pollutant) => {
    e.stopPropagation();

    if (item.isItem) {
      // It's a friendly eco powerup
      sounds.playPowerUp();
      if (item.type === 'seed') {
        triggerOxygenBlast();
      } else if (item.type === 'shield') {
        setShieldActive(true);
        setShieldTimeLeft(5);
        addFloatingText('🛡️ PERISAI OZON AKTIF!', item.x, item.y, '#3B82F6');
      } else if (item.type === 'water') {
        setHealth((h) => Math.min(100, h + 20));
        addFloatingText('+20% ATMOSEFER SEGAR! 💧', item.x, item.y, '#10B981');
      }
      setPollutants((prev) => prev.filter((p) => p.id !== item.id));
      return;
    }

    // It's a pollutant
    sounds.playPollutionClear();
    if (item.hp > 1) {
      // Multi-hit item (e.g. oil sludge)
      setPollutants((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, hp: p.hp - 1 } : p))
      );
      addFloatingText('HANCURKAN!', item.x, item.y, '#D97706');
    } else {
      // Destroyed!
      const pts = item.points * wave;
      setScore((s) => {
        const next = s + pts;
        if (next > highScore) {
          setHighScore(next);
          try {
            localStorage.setItem('earth_rescue_high_score', next.toString());
          } catch {
            // ignore
          }
        }
        return next;
      });
      setCleanedCount((c) => c + 1);
      addFloatingText(`+${pts}`, item.x, item.y, '#16A34A');
      setPollutants((prev) => prev.filter((p) => p.id !== item.id));
    }
  };

  // Main game loop (Movement & Collision)
  useEffect(() => {
    if (gameState !== 'playing') return;

    let isRunning = true;

    // Shield countdown timer
    const shieldInterval = setInterval(() => {
      setShieldTimeLeft((prev) => {
        if (prev <= 1) {
          setShieldActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const loop = () => {
      if (!isRunning) return;
      gameLoopRef.current += 1;
      const now = Date.now();

      // Check wave progression based on score
      setScore((currScore) => {
        const newWave = Math.min(5, Math.floor(currScore / 800) + 1);
        setWave((w) => (w !== newWave ? newWave : w));
        return currScore;
      });

      // Spawn new pollutants & powerups
      const spawnInterval = Math.max(700, 2200 - wave * 300);
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;

        // Determine spawn origin on border (0-100% X/Y)
        const side = Math.floor(Math.random() * 4); // 0: Top, 1: Right, 2: Bottom, 3: Left
        let x = 50;
        let y = 50;
        if (side === 0) {
          x = Math.random() * 90 + 5;
          y = 5;
        } else if (side === 1) {
          x = 95;
          y = Math.random() * 90 + 5;
        } else if (side === 2) {
          x = Math.random() * 90 + 5;
          y = 95;
        } else {
          x = 5;
          y = Math.random() * 90 + 5;
        }

        // Randomly select pollutant or rare eco item
        const isEcoItem = Math.random() < 0.18; // 18% chance for friendly powerup

        if (isEcoItem) {
          const itemTypes: Array<'seed' | 'shield' | 'water'> = ['seed', 'shield', 'water'];
          const chosen = itemTypes[Math.floor(Math.random() * itemTypes.length)];
          const newItem: Pollutant = {
            id: Math.random().toString(36).substring(2, 9),
            type: chosen,
            x,
            y,
            speed: 0.15,
            hp: 1,
            maxHp: 1,
            label: chosen === 'seed' ? 'Bibit Pohon' : chosen === 'shield' ? 'Perisai Ozon' : 'Air Murni',
            icon: chosen === 'seed' ? '🌱' : chosen === 'shield' ? '🛡️' : '💧',
            color: chosen === 'seed' ? '#10B981' : chosen === 'shield' ? '#3B82F6' : '#06B6D4',
            size: 38,
            points: 0,
            isItem: true,
          };
          setPollutants((prev) => [...prev, newItem]);
        } else {
          // Regular Pollutants
          const pollTypes: Array<'smog' | 'plastic' | 'vehicle' | 'oil'> = ['smog', 'plastic', 'vehicle', 'oil'];
          const chosen = pollTypes[Math.floor(Math.random() * pollTypes.length)];

          let label = 'Asap Pabrik';
          let icon = '🏭';
          let color = '#4B5563';
          let speed = 0.22 + wave * 0.04;
          let hp = 1;
          let points = 100;
          let size = 42;

          if (chosen === 'plastic') {
            label = 'Limbah Plastik';
            icon = '🧴';
            color = '#E11D48';
            speed = 0.28 + wave * 0.04;
            points = 120;
          } else if (chosen === 'vehicle') {
            label = 'Emisi Karbon';
            icon = '🚗';
            color = '#6B7280';
            speed = 0.36 + wave * 0.05;
            points = 150;
            size = 38;
          } else if (chosen === 'oil') {
            label = 'Limbah Minyak';
            icon = '🛢️';
            color = '#1F2937';
            speed = 0.18 + wave * 0.03;
            hp = 2; // Needs 2 clicks
            points = 250;
            size = 46;
          }

          const newPollutant: Pollutant = {
            id: Math.random().toString(36).substring(2, 9),
            type: chosen,
            x,
            y,
            speed,
            hp,
            maxHp: hp,
            label,
            icon,
            color,
            size,
            points,
          };
          setPollutants((prev) => [...prev, newPollutant]);
        }
      }

      // Update positions moving towards center (50, 50)
      setPollutants((prev) => {
        const nextList: Pollutant[] = [];
        let damageToEarth = 0;

        prev.forEach((item) => {
          // Vector towards center (50, 50)
          const dx = 50 - item.x;
          const dy = 50 - item.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Check if reached Earth radius (dist < 10)
          if (dist < 10) {
            if (item.isItem) {
              // Automatically absorb friendly items that reach Earth!
              if (item.type === 'seed') triggerOxygenBlast();
              else if (item.type === 'shield') {
                setShieldActive(true);
                setShieldTimeLeft(5);
              } else if (item.type === 'water') {
                setHealth((h) => Math.min(100, h + 15));
              }
            } else {
              // Pollutant hit Earth!
              if (!shieldActive) {
                damageToEarth += item.type === 'oil' ? 20 : 12;
              } else {
                addFloatingText('DEFLECTED! 🛡️', 50, 50, '#3B82F6');
              }
            }
          } else {
            // Move item closer to Earth
            const moveX = (dx / dist) * item.speed;
            const moveY = (dy / dist) * item.speed;
            nextList.push({
              ...item,
              x: item.x + moveX,
              y: item.y + moveY,
            });
          }
        });

        // Apply Earth damage if hit
        if (damageToEarth > 0) {
          sounds.playEarthHurt();
          setIsEarthHurt(true);
          setTimeout(() => setIsEarthHurt(false), 300);

          setHealth((h) => {
            const newHealth = Math.max(0, h - damageToEarth);
            if (newHealth <= 0) {
              sounds.playGameOver();
              setGameState('gameover');
              setEduTip(EDUCATIONAL_TIPS[Math.floor(Math.random() * EDUCATIONAL_TIPS.length)]);
            }
            return newHealth;
          });
        }

        return nextList;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      clearInterval(shieldInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, wave, shieldActive, triggerOxygenBlast]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FEFAE0] rounded-3xl border-4 border-[#283618] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="bg-[#283618] text-[#FEFAE0] px-4 py-3 sm:px-6 flex items-center justify-between border-b-4 border-[#5B4436]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl animate-spin-slow">🌍</span>
            <div>
              <h2 className="font-display font-black text-sm sm:text-lg tracking-wide leading-tight flex items-center gap-2">
                EARTH POLLUTION DEFENSE
                <span className="text-xs bg-[#DDA15E] text-[#283618] px-2 py-0.5 rounded-full font-bold">
                  WAVE {wave}
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-[#FEFAE0]/80">
                Tangkal polutan sebelum atmosfer bumi tercemar!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-1.5 rounded-lg bg-[#606C38] hover:bg-[#DDA15E] text-[#FEFAE0] hover:text-[#283618] transition-colors"
              title={audioMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#5B4436] hover:bg-[#BC6C25] text-[#FEFAE0] transition-colors"
              title="Tutup Game"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Status Bar: Score, Health & Shields */}
        <div className="bg-[#F4ECD8] px-4 py-2 border-b-2 border-[#283618]/20 flex items-center justify-between text-xs sm:text-sm font-display font-black text-[#283618]">
          {/* Earth Health Meter */}
          <div className="flex items-center gap-2 flex-1 max-w-[200px] sm:max-w-[240px]">
            <Heart
              className={`w-4 h-4 fill-red-500 text-red-600 ${health < 30 ? 'animate-bounce' : ''}`}
            />
            <div className="flex-1 bg-black/10 rounded-full h-3.5 p-0.5 border border-[#283618]/30 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  health > 60
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                    : health > 30
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-rose-700 animate-pulse'
                }`}
                style={{ width: `${health}%` }}
              />
            </div>
            <span className="text-[11px] font-bold w-9">{health}%</span>
          </div>

          {/* Shield Status */}
          {shieldActive && (
            <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full border border-blue-400 font-bold animate-pulse">
              <Shield className="w-3.5 h-3.5 fill-blue-500 text-blue-600" />
              <span>OZON {shieldTimeLeft}s</span>
            </div>
          )}

          {/* Current Score & High Score */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#BC6C25]">
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">TOP: {highScore}</span>
            </div>
            <div className="bg-[#283618] text-[#FEFAE0] px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-mono tracking-wider">
              {score} PTS
            </div>
          </div>
        </div>

        {/* Main Interactive Game Arena */}
        <div
          ref={arenaRef}
          className="relative w-full h-[360px] sm:h-[420px] bg-gradient-to-b from-[#87CEEB]/20 via-[#FEFAE0] to-[#E9D8A6]/40 overflow-hidden select-none cursor-crosshair"
        >
          {/* Subtle grid atmosphere */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#283618 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* CENTER: The Earth Target */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-100 ${
              isEarthHurt ? 'scale-90 animate-shake' : 'animate-float'
            }`}
          >
            {/* Ozone Shield Aura if active */}
            {shieldActive && (
              <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-blue-400/80 bg-blue-400/20 animate-spin-slow pointer-events-none shadow-[0_0_25px_rgba(59,130,246,0.6)]" />
            )}

            {/* Pollution Fog Overlay on Earth if Health is low */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center pointer-events-none">
              <img
                src={bumiImg}
                alt="Earth Target"
                className={`w-full h-full object-contain drop-shadow-xl transition-all duration-300 ${
                  health < 40
                    ? 'filter contrast-125 brightness-75 sepia'
                    : health < 70
                    ? 'filter brightness-90'
                    : ''
                }`}
                draggable={false}
              />

              {/* Smog Cloud Overlay when Earth is heavily polluted */}
              {health < 50 && (
                <div className="absolute inset-0 bg-black/35 rounded-full backdrop-grayscale mix-blend-multiply flex items-center justify-center animate-pulse">
                  <span className="text-xl opacity-75">☁️</span>
                </div>
              )}

              {/* Sparkles when Earth is healthy */}
              {health >= 80 && (
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-emerald-600 animate-bounce" />
              )}
            </div>
          </div>

          {/* Pollutants & Powerups Nodes */}
          {gameState === 'playing' &&
            pollutants.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleItemClick(e, item)}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center transition-transform active:scale-75 shadow-md cursor-pointer select-none group ${
                  item.isItem
                    ? 'bg-emerald-100/90 border-2 border-emerald-500 animate-bounce'
                    : 'bg-white/90 border-2 border-[#283618] hover:scale-110'
                }`}
              >
                <span className="text-lg sm:text-xl leading-none select-none pointer-events-none">
                  {item.icon}
                </span>

                {/* HP dots if item needs multi clicks */}
                {item.hp > 1 && (
                  <span className="absolute -bottom-1 text-[9px] bg-[#1F2937] text-white px-1 rounded-full font-bold">
                    {item.hp}x
                  </span>
                )}

                {/* Pulsing warning indicator for pollutants */}
                {!item.isItem && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
            ))}

          {/* Floating Points / Feedback Texts */}
          {floatingTexts.map((f) => (
            <div
              key={f.id}
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 font-display font-black text-xs sm:text-sm tracking-wider drop-shadow-md pointer-events-none animate-floatUp z-20"
            >
              <span
                style={{ color: f.color }}
                className="bg-white/95 px-2 py-0.5 rounded-full border border-black/10 shadow-sm"
              >
                {f.text}
              </span>
            </div>
          ))}

          {/* INTRO SCREEN OVERLAY */}
          {gameState === 'intro' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-[#FEFAE0] z-30 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#606C38] flex items-center justify-center mb-3 shadow-lg border-2 border-[#DDA15E]">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-[#DDA15E] mb-2 tracking-wide">
                DARURAT POLUSI BUMI!
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#FEFAE0]/90 max-w-md mb-4 leading-relaxed">
                Gelombang asap pabrik, limbah plastik, dan gas karbon menyerang bumi dari segala penjuru.
                <strong> Klik / Tap setiap polutan</strong> secepat mungkin sebelum atmosfer bumi rusak total!
              </p>

              {/* Legend item guidance */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mb-5 w-full max-w-md">
                <div className="bg-white/10 rounded-xl p-2 flex items-center gap-1.5 border border-white/10">
                  <span className="text-base">🏭</span>
                  <span className="text-left font-semibold">Asap Toksik (1 Tap)</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2 flex items-center gap-1.5 border border-white/10">
                  <span className="text-base">🛢️</span>
                  <span className="text-left font-semibold">Limbah (2 Tap)</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2 flex items-center gap-1.5 border border-white/10">
                  <span className="text-base">🌱</span>
                  <span className="text-left font-semibold text-emerald-300">Bibit: Sapu Bersih</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2 flex items-center gap-1.5 border border-white/10">
                  <span className="text-base">🛡️</span>
                  <span className="text-left font-semibold text-blue-300">Perisai Ozon</span>
                </div>
              </div>

              <button
                type="button"
                onClick={startGame}
                className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-[#DDA15E] hover:bg-[#BC6C25] text-[#283618] font-display font-black text-sm sm:text-base tracking-wide shadow-xl active:scale-95 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>MULAI SELAMATKAN BUMI</span>
              </button>
            </div>
          )}

          {/* GAME OVER SCREEN OVERLAY */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-[#283618]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-[#FEFAE0] z-30 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-red-900/60 flex items-center justify-center mb-2 border-2 border-red-400">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-red-400 mb-1 tracking-wide">
                ATMOSFER BUMI TERCEMAR!
              </h3>
              <p className="font-body text-xs text-[#FEFAE0]/80 mb-3">
                Polutan berhasil menembus lapisan pelindung bumi. Namun kamu telah berjuang gigih!
              </p>

              {/* Final Score Card */}
              <div className="bg-[#FEFAE0] text-[#283618] rounded-2xl p-4 w-full max-w-xs shadow-xl mb-4 border-2 border-[#5B4436]">
                <div className="flex justify-between items-center mb-1 text-xs font-semibold text-[#5B4436]">
                  <span>Skor Akhir:</span>
                  <span className="text-xl font-mono font-black text-[#283618]">{score} PTS</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-[#5B4436] mb-2">
                  <span>Polutan Dinetralisir:</span>
                  <span className="font-bold text-[#606C38]">{cleanedCount} Polutan</span>
                </div>
                <div className="pt-2 border-t border-[#283618]/20 flex justify-between items-center text-xs font-bold text-[#BC6C25]">
                  <span>Rekor Tertinggi:</span>
                  <span>{highScore} PTS</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#DDA15E] hover:bg-[#BC6C25] text-[#283618] font-display font-black text-xs sm:text-sm tracking-wide shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 stroke-[3]" />
                  <span>MAIN LAGI</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-[#FEFAE0] font-display font-bold text-xs sm:text-sm tracking-wide active:scale-95 transition-all cursor-pointer"
                >
                  <span>KEMBALI KE WEB</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3R Educational Tip Footer */}
        <div className="bg-[#606C38] text-[#FEFAE0] p-3 px-4 sm:px-6 flex items-start gap-2.5 text-xs border-t-2 border-[#283618]">
          <span className="text-base select-none">💡</span>
          <p className="font-body leading-relaxed flex-1">
            <strong className="text-[#DDA15E] font-display">Aksi Nyata 3R: </strong>
            {eduTip}
          </p>
        </div>
      </div>
    </div>
  );
};
