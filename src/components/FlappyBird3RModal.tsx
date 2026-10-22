import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Trophy, RotateCcw, Play, Sparkles, Award } from 'lucide-react';
import { sounds } from '../utils/audio';
import bumiImg from '../assets/bumi.png';

interface FlappyBird3RModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PipePair {
  x: number;
  topHeight: number;
  gap: number;
  scored: boolean;
}

interface EcoParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export const FlappyBird3RModal: React.FC<FlappyBird3RModalProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(!sounds.enabled);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Earth sprite image
  const earthImgRef = useRef<HTMLImageElement | null>(null);

  // Game internal state references for high precision 60FPS loop
  const birdRef = useRef({
    x: 75,
    y: 220,
    vy: 0,
    radius: 16,
    rotation: 0,
  });

  const pipesRef = useRef<PipePair[]>([]);
  const particlesRef = useRef<EcoParticle[]>([]);
  const groundOffsetRef = useRef(0);
  const scoreRef = useRef(0);
  const gameStateRef = useRef<'ready' | 'playing' | 'gameover'>('ready');
  const frameCountRef = useRef(0);

  // Constants
  const V_WIDTH = 360;
  const V_HEIGHT = 500;
  const GROUND_HEIGHT = 48;
  const GRAVITY = 0.36;
  const JUMP_FORCE = -6.2;
  const PIPE_WIDTH = 54;
  const PIPE_SPACING = 195;
  const BASE_GAP = 130;

  // Load High Score on Mount
  useEffect(() => {
    try {
      const savedHigh = parseInt(localStorage.getItem('flappy_earth_3r_highscore') || '0', 10);
      setHighScore(savedHigh);
    } catch {
      // ignore
    }

    // Preload earth image
    const img = new Image();
    img.src = bumiImg;
    earthImgRef.current = img;
  }, []);

  // Sync ref with state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Jump / Flap Handler
  const handleFlap = () => {
    if (gameStateRef.current === 'ready') {
      gameStateRef.current = 'playing';
      setGameState('playing');
      birdRef.current.vy = JUMP_FORCE;
      sounds.playFlap();
      spawnEcoBurst(birdRef.current.x, birdRef.current.y + 10, '#606C38', 5);
      return;
    }

    if (gameStateRef.current === 'playing') {
      birdRef.current.vy = JUMP_FORCE;
      sounds.playFlap();
      spawnEcoBurst(birdRef.current.x, birdRef.current.y + 10, '#283618', 4);
    } else if (gameStateRef.current === 'gameover') {
      resetGame();
    }
  };

  // Reset to Ready state
  const resetGame = () => {
    birdRef.current = {
      x: 75,
      y: 220,
      vy: 0,
      radius: 16,
      rotation: 0,
    };
    pipesRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    setIsNewHighScore(false);
    gameStateRef.current = 'ready';
    setGameState('ready');
    sounds.playPop();
  };

  // Spawn visual celebration / leaf particles
  const spawnEcoBurst = (x: number, y: number, color: string, count: number = 6) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = Math.random() * 2 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 4 + 3,
        alpha: 1,
      });
    }
  };

  // Keyboard navigation listener (Space / ArrowUp / W)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        handleFlap();
      } else if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    if (!isOpen) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    resetGame();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;
      frameCountRef.current += 1;
      const state = gameStateRef.current;

      // -------------------------------------------------------------
      // 1. UPDATE PHYSICS
      // -------------------------------------------------------------
      if (state === 'ready') {
        // Gentle bobbing motion
        birdRef.current.y = 220 + Math.sin(frameCountRef.current * 0.08) * 8;
        birdRef.current.rotation = Math.sin(frameCountRef.current * 0.08) * 0.1;
        groundOffsetRef.current = (groundOffsetRef.current + 1.8) % 24;
      } else if (state === 'playing') {
        // Bird Gravity & Velocity
        const bird = birdRef.current;
        bird.vy += GRAVITY;
        bird.y += bird.vy;

        // Rotation tilts up on jump, dips down when falling
        if (bird.vy < 0) {
          bird.rotation = Math.max(-0.45, bird.rotation - 0.12);
        } else {
          bird.rotation = Math.min(1.2, bird.rotation + 0.05);
        }

        // Ceiling clamp
        if (bird.y - bird.radius < 0) {
          bird.y = bird.radius;
          bird.vy = 0;
        }

        // Floor collision -> Game Over
        const floorY = V_HEIGHT - GROUND_HEIGHT;
        if (bird.y + bird.radius >= floorY) {
          bird.y = floorY - bird.radius;
          triggerGameOver();
        }

        // Pipes Management
        groundOffsetRef.current = (groundOffsetRef.current + 2.2) % 24;
        const currentSpeed = 2.1 + Math.min(scoreRef.current * 0.03, 1.2);

        // Spawn new pipes
        const pipes = pipesRef.current;
        if (pipes.length === 0 || pipes[pipes.length - 1].x < V_WIDTH - PIPE_SPACING) {
          const playableHeight = V_HEIGHT - GROUND_HEIGHT - BASE_GAP - 80;
          const topH = Math.floor(Math.random() * playableHeight) + 40;
          pipes.push({
            x: V_WIDTH + 10,
            topHeight: topH,
            gap: Math.max(115, BASE_GAP - Math.min(scoreRef.current * 0.5, 18)),
            scored: false,
          });
        }

        // Move pipes & collision check
        for (let i = 0; i < pipes.length; i++) {
          const p = pipes[i];
          p.x -= currentSpeed;

          // Score detection
          if (!p.scored && p.x + PIPE_WIDTH < bird.x) {
            p.scored = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            sounds.playPollutionClear();
            spawnEcoBurst(bird.x + 8, bird.y, '#283618', 7);

            // Update High Score live if beaten
            if (scoreRef.current > highScore) {
              setHighScore(scoreRef.current);
              setIsNewHighScore(true);
              try {
                localStorage.setItem('flappy_earth_3r_highscore', scoreRef.current.toString());
              } catch {
                // ignore
              }
            }
          }

          // AABB Pipe Collision Check with Earth circle
          const birdLeft = bird.x - bird.radius + 3;
          const birdRight = bird.x + bird.radius - 3;
          const birdTop = bird.y - bird.radius + 3;
          const birdBottom = bird.y + bird.radius - 3;

          const pipeLeft = p.x;
          const pipeRight = p.x + PIPE_WIDTH;

          // Within pipe X span
          if (birdRight >= pipeLeft && birdLeft <= pipeRight) {
            // Hit top smokestack
            if (birdTop <= p.topHeight) {
              triggerGameOver();
            }
            // Hit bottom smokestack
            const bottomPipeY = p.topHeight + p.gap;
            if (birdBottom >= bottomPipeY) {
              triggerGameOver();
            }
          }
        }

        // Filter offscreen pipes
        pipesRef.current = pipes.filter((p) => p.x + PIPE_WIDTH > -20);
      }

      // Update particles
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          alpha: p.alpha - 0.035,
          vy: p.vy + 0.05,
        }))
        .filter((p) => p.alpha > 0.05);

      // -------------------------------------------------------------
      // 2. RENDER CANVAS SCENE
      // -------------------------------------------------------------
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, V_HEIGHT);
      skyGrad.addColorStop(0, '#FEFAE0');
      skyGrad.addColorStop(0.5, '#F3F5DC');
      skyGrad.addColorStop(1, '#D8E8C5');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

      // Background soft eco clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      drawCloud(ctx, (V_WIDTH + 40 - (frameCountRef.current * 0.3) % (V_WIDTH + 80)), 65, 38);
      drawCloud(ctx, (V_WIDTH + 140 - (frameCountRef.current * 0.45) % (V_WIDTH + 80)), 120, 28);
      drawCloud(ctx, (V_WIDTH + 90 - (frameCountRef.current * 0.2) % (V_WIDTH + 80)), 180, 32);

      // Draw Pipes (Industrial Smokestacks)
      for (const p of pipesRef.current) {
        drawSmokestackPair(ctx, p.x, p.topHeight, p.gap);
      }

      // Draw Particles
      for (const pt of particlesRef.current) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Grass Floor
      drawGrassFloor(ctx, V_WIDTH, V_HEIGHT, GROUND_HEIGHT, groundOffsetRef.current);

      // Draw Earth Character
      drawEarth(ctx, birdRef.current.x, birdRef.current.y, birdRef.current.radius, birdRef.current.rotation, earthImgRef.current);

      // Draw HUD Score during play
      if (state === 'playing') {
        ctx.save();
        ctx.font = '900 36px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#283618';
        ctx.shadowColor = 'rgba(254, 250, 224, 0.9)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.fillText(`${scoreRef.current}`, V_WIDTH / 2, 60);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen]);

  // Game Over trigger
  const triggerGameOver = () => {
    gameStateRef.current = 'gameover';
    setGameState('gameover');
    sounds.playEarthHurt();
    spawnEcoBurst(birdRef.current.x, birdRef.current.y, '#991b1b', 12);

    try {
      const currentHigh = parseInt(localStorage.getItem('flappy_earth_3r_highscore') || '0', 10);
      if (scoreRef.current > currentHigh) {
        localStorage.setItem('flappy_earth_3r_highscore', scoreRef.current.toString());
        setHighScore(scoreRef.current);
        setIsNewHighScore(true);
        sounds.playSuccess();
      }
    } catch {
      // ignore
    }
  };

  // Sound Toggle
  const toggleSound = () => {
    sounds.toggle();
    setIsAudioMuted(!sounds.enabled);
  };

  if (!isOpen) return null;

  // Medals calculation
  const getMedalInfo = (s: number) => {
    if (s >= 30) return { title: 'Legenda Pinisi 3R', rank: 'MASTER', color: 'from-amber-400 to-yellow-500', icon: '👑' };
    if (s >= 15) return { title: 'Pahlawan Daur Ulang', rank: 'EMAS', color: 'from-amber-300 to-amber-500', icon: '🥇' };
    if (s >= 5) return { title: 'Pelindung Ozon', rank: 'PERAK', color: 'from-slate-300 to-slate-400', icon: '🥈' };
    return { title: 'Bibit Hijau Pemula', rank: 'PERUNGGU', color: 'from-amber-700 to-yellow-800', icon: '🥉' };
  };

  const medal = getMedalInfo(score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Outer Cabinet Card */}
      <div className="relative w-full max-w-[400px] bg-[#FEFAE0] rounded-3xl shadow-2xl border-4 border-[#283618] overflow-hidden flex flex-col select-none text-[#283618]">
        
        {/* Header Bar */}
        <div className="bg-[#283618] text-[#FEFAE0] px-4 py-3 flex items-center justify-between border-b-3 border-[#1e2a12] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FEFAE0] p-1 flex items-center justify-center shadow-xs">
              <img src={bumiImg} alt="Earth" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-black tracking-wider uppercase px-2 py-0.2 rounded-full bg-amber-400 text-[#283618]">
                  GAME 3R TERBANG
                </span>
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-wide text-white leading-tight mt-0.5">
                Flappy Earth 3R
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FEFAE0] transition active:scale-95 cursor-pointer"
              title={isAudioMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#5B4436] hover:bg-[#433126] text-[#FEFAE0] transition active:scale-95 border border-[#FEFAE0]/30 cursor-pointer"
              title="Tutup Game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Canvas Area */}
        <div
          onClick={handleFlap}
          className="relative w-full aspect-[360/500] bg-[#FEFAE0] cursor-pointer overflow-hidden"
          style={{ touchAction: 'manipulation' }}
        >
          <canvas
            ref={canvasRef}
            width={V_WIDTH}
            height={V_HEIGHT}
            className="w-full h-full block"
          />

          {/* OVERLAY: READY STATE */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/15 backdrop-blur-[1px] text-center pointer-events-none">
              <div className="bg-[#FEFAE0]/95 border-3 border-[#283618] rounded-3xl p-5 shadow-xl max-w-xs flex flex-col items-center animate-bounce-subtle">
                <div className="w-12 h-12 rounded-full bg-[#283618] text-[#FEFAE0] flex items-center justify-center mb-2 shadow-sm font-display font-black text-lg">
                  3R
                </div>
                <h4 className="font-display font-black text-xl text-[#283618] uppercase tracking-wide">
                  Terbang Lestari
                </h4>
                <p className="font-body text-[#5B4436] text-xs font-semibold mt-1 mb-3 leading-relaxed">
                  Bantu Bumi meluncur melewati cerobong asap polusi!
                </p>

                <div className="px-4 py-2 rounded-2xl bg-[#283618] text-[#FEFAE0] font-display font-black text-xs flex items-center gap-2 shadow-md mb-2.5">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>KETUK / SPASI UNTUK TERBANG</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5B4436]">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rekor Terbaik: {highScore}</span>
                </div>
              </div>
            </div>
          )}

          {/* OVERLAY: GAME OVER STATE */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 bg-black/40 backdrop-blur-xs text-center animate-fadeIn">
              <div className="w-full max-w-[290px] bg-[#FEFAE0] border-3 border-[#283618] rounded-3xl p-4 shadow-2xl flex flex-col items-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-800 text-[10px] font-black uppercase mb-1.5">
                  MISI SELESAI
                </div>
                <h4 className="font-display font-black text-lg text-[#283618] uppercase tracking-wide">
                  Bumi Kena Polusi!
                </h4>

                {/* Scoreboard Card */}
                <div className="w-full my-3 p-3 rounded-2xl bg-[#283618]/10 border-2 border-[#283618]/25 flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-[#283618]/20 pb-2">
                    <span className="text-xs font-bold text-[#5B4436]">Skor Bersih:</span>
                    <span className="font-display font-black text-2xl text-[#283618] leading-none">
                      {score}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-[#5B4436]">
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      <span>Rekor Tertinggi:</span>
                    </div>
                    <span className="font-display font-black text-lg text-amber-800 leading-none">
                      {highScore}
                    </span>
                  </div>

                  {isNewHighScore && (
                    <div className="mt-1 py-1 rounded-xl bg-amber-400 text-[#283618] font-display font-black text-[11px] tracking-wide animate-pulse">
                      REKOR BARU TERCIPTA!
                    </div>
                  )}

                  {/* Medal Preview */}
                  <div className="mt-1 pt-2 border-t border-[#283618]/15 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#5B4436]">Apresiasi 3R:</span>
                    <span className="text-xs font-black text-[#283618] flex items-center gap-1">
                      <span>{medal.icon}</span>
                      <span>{medal.title}</span>
                    </span>
                  </div>
                </div>

                {/* Play Again Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                  }}
                  className="w-full py-2.5 px-4 bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] font-display font-black text-sm rounded-2xl border-2 border-[#1e2a12] shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                  <span>MAIN LAGI</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="bg-[#283618]/10 px-4 py-2 text-center border-t border-[#283618]/15">
          <p className="text-[10.5px] text-[#5B4436] font-medium">
            Ketuk layar di HP atau tekan <span className="font-black text-[#283618]">Spasi / Panah Atas</span> di Laptop
          </p>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// CANVAS HELPER DRAWING FUNCTIONS (HANDCRAFTED 3R VISUAL AESTHETIC)
// ===================================================================

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.arc(x + size * 0.7, y - size * 0.2, size * 0.7, 0, Math.PI * 2);
  ctx.arc(x + size * 1.3, y, size * 0.8, 0, Math.PI * 2);
  ctx.arc(x + size * 0.6, y + size * 0.2, size * 0.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawSmokestackPair(ctx: CanvasRenderingContext2D, x: number, topHeight: number, gap: number) {
  const PIPE_WIDTH = 54;
  const RIM_HEIGHT = 16;
  const RIM_OVERHANG = 4;

  // 1. TOP SMOKESTACK (Ceiling to topHeight)
  ctx.save();
  // Main chimney column
  const topGrad = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
  topGrad.addColorStop(0, '#525252');
  topGrad.addColorStop(0.3, '#737373');
  topGrad.addColorStop(0.7, '#404040');
  topGrad.addColorStop(1, '#262626');

  ctx.fillStyle = topGrad;
  ctx.fillRect(x, 0, PIPE_WIDTH, topHeight - RIM_HEIGHT);
  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, 0, PIPE_WIDTH, topHeight - RIM_HEIGHT);

  // Chimney hazard stripes near rim
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 2, topHeight - RIM_HEIGHT - 18, PIPE_WIDTH - 4, 6);
  ctx.fillStyle = '#171717';
  ctx.fillRect(x + 2, topHeight - RIM_HEIGHT - 12, PIPE_WIDTH - 4, 6);

  // Rim lip at opening
  ctx.fillStyle = '#404040';
  ctx.fillRect(x - RIM_OVERHANG, topHeight - RIM_HEIGHT, PIPE_WIDTH + RIM_OVERHANG * 2, RIM_HEIGHT);
  ctx.strokeRect(x - RIM_OVERHANG, topHeight - RIM_HEIGHT, PIPE_WIDTH + RIM_OVERHANG * 2, RIM_HEIGHT);

  // Subtle smoke puffs floating from top rim
  ctx.fillStyle = 'rgba(80, 80, 80, 0.4)';
  ctx.beginPath();
  ctx.arc(x + PIPE_WIDTH / 2, topHeight + 4, 8, 0, Math.PI * 2);
  ctx.fill();

  // 2. BOTTOM SMOKESTACK (topHeight + gap to floor)
  const bottomY = topHeight + gap;
  const bottomHeight = 500 - bottomY;

  // Rim lip at opening
  ctx.fillStyle = '#404040';
  ctx.fillRect(x - RIM_OVERHANG, bottomY, PIPE_WIDTH + RIM_OVERHANG * 2, RIM_HEIGHT);
  ctx.strokeRect(x - RIM_OVERHANG, bottomY, PIPE_WIDTH + RIM_OVERHANG * 2, RIM_HEIGHT);

  // Chimney hazard stripes below rim
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x + 2, bottomY + RIM_HEIGHT + 2, PIPE_WIDTH - 4, 6);
  ctx.fillStyle = '#171717';
  ctx.fillRect(x + 2, bottomY + RIM_HEIGHT + 8, PIPE_WIDTH - 4, 6);

  // Main column extending to floor
  ctx.fillStyle = topGrad;
  ctx.fillRect(x, bottomY + RIM_HEIGHT, PIPE_WIDTH, bottomHeight - RIM_HEIGHT);
  ctx.strokeRect(x, bottomY + RIM_HEIGHT, PIPE_WIDTH, bottomHeight - RIM_HEIGHT);

  // Subtle clean air indicator glow in the middle gap
  ctx.fillStyle = 'rgba(40, 54, 24, 0.08)';
  ctx.fillRect(x, topHeight, PIPE_WIDTH, gap);

  ctx.restore();
}

function drawGrassFloor(ctx: CanvasRenderingContext2D, width: number, height: number, groundHeight: number, offset: number) {
  const floorY = height - groundHeight;

  // Underground dirt/soil
  ctx.fillStyle = '#5B4436';
  ctx.fillRect(0, floorY + 12, width, groundHeight - 12);

  // Grass surface layer
  ctx.fillStyle = '#283618';
  ctx.fillRect(0, floorY, width, 14);

  // Top grass blades texture
  ctx.fillStyle = '#606C38';
  const bladeWidth = 12;
  const startX = -offset;
  for (let x = startX; x < width + bladeWidth; x += bladeWidth) {
    ctx.beginPath();
    ctx.moveTo(x, floorY + 10);
    ctx.lineTo(x + bladeWidth / 2, floorY - 3);
    ctx.lineTo(x + bladeWidth, floorY + 10);
    ctx.fill();
  }

  // Border separator
  ctx.strokeStyle = '#1e2a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, floorY);
  ctx.lineTo(width, floorY);
  ctx.stroke();
}

function drawEarth(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  img: HTMLImageElement | null
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  if (img && img.complete && img.naturalWidth > 0) {
    // Draw Earth with drop shadow
    ctx.shadowColor = 'rgba(40, 54, 24, 0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.drawImage(img, -radius - 2, -radius - 2, (radius + 2) * 2, (radius + 2) * 2);

    // Little eco leaf wing
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#283618';
    ctx.beginPath();
    ctx.ellipse(-radius + 2, 2, 7, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Fallback circle if image not yet loaded
    ctx.fillStyle = '#283618';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
