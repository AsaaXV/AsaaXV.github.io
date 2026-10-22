import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Shield, Heart, Trophy, RotateCcw, Play, Sparkles, AlertTriangle, ArrowLeft, ArrowRight, Award, User, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

import bumiImg from '../assets/bumi.png';
import tongsampahBawahImg from '../assets/tongsampah-bawah.png';
import tongsampahAtasImg from '../assets/tongsampah-atas.png';
import botolBekasImg from '../assets/botol-bekas.png';
import kardusBekasImg from '../assets/kardus-bekas.png';
import bajuBekasImg from '../assets/baju_bayi_bekas.png';
import sampah1Img from '../assets/sampah1.png';
import sampah2Img from '../assets/sampah2.png';

interface FallingItem {
  id: string;
  kind: 'trash' | 'hazard' | 'powerup';
  subType: string;
  name: string;
  label: string;
  image?: string;
  icon?: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-110
  speed: number;
  points: number;
  rotation: number;
  rotSpeed: number;
  size: number;
  color: string;
}

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  level: number;
  caught: number;
  date: string;
}

interface EarthRescueGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [];

const EDUCATIONAL_TIPS = [
  'Daur ulang 1 ton kertas dapat menyelamatkan 17 pohon dan menghemat 26.500 liter air bersih!',
  'Plastik sekali pakai butuh hingga 450 tahun untuk terurai. Bawa tas belanja kain sendiri!',
  'Mendaur ulang kaleng aluminium menghemat energi 95% dibandingkan memproduksi dari bahan mentah.',
  'Kompos dari sisa makanan mengurangi gas metana berbahaya di tempat pembuangan akhir sampah.',
  'Membawa tumbler minum sendiri menyelamatkan bumi dari ratusan sampah botol plastik setiap tahunnya!',
  'Memilah sampah dari rumah memudahkan petugas kebersihan dan industri daur ulang bekerja efektif.',
  'Satu botol kaca daur ulang menghemat energi cukup untuk menyalakan lampu selama 4 jam!'
];

export const EarthRescueGameModal: React.FC<EarthRescueGameModalProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [introTab, setIntroTab] = useState<'howtoplay' | 'leaderboard'>('howtoplay');
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('earth_falling_trash_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [caughtCount, setCaughtCount] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldTimeLeft, setShieldTimeLeft] = useState(0);
  const [isHurt, setIsHurt] = useState(false);
  const [binSquash, setBinSquash] = useState(false);
  const [audioMuted, setAudioMuted] = useState(!sounds.enabled);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [eduTip, setEduTip] = useState(EDUCATIONAL_TIPS[0]);

  // Leaderboard states (kosong dari awal tanpa dummy)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('earth_rescue_leaderboard');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Bersihkan entri dummy sebelumnya yang memiliki ID berawalan 'def-'
          const realEntries = parsed.filter((e) => e && e.id && !e.id.startsWith('def-'));
          localStorage.setItem('earth_rescue_leaderboard', JSON.stringify(realEntries));
          return realEntries;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [playerName, setPlayerName] = useState('');
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const hasSavedScoreRef = useRef(false);

  // Bin position in percentage (0 to 100)
  const [binX, setBinX] = useState(50);
  const targetBinX = useRef(50);
  const currentBinX = useRef(50);

  // Persistent refs for continuous 60fps game loop simulation
  const itemsRef = useRef<FallingItem[]>([]);
  const heartsRef = useRef(3);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const caughtCountRef = useRef(0);
  const shieldActiveRef = useRef(false);

  const arenaRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnTime = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const keysPressed = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  // Play opening alert / fanfare when modal opens
  useEffect(() => {
    if (isOpen) {
      sounds.playAlert();
      setGameState('intro');
      setIntroTab('howtoplay');
      setEduTip(EDUCATIONAL_TIPS[Math.floor(Math.random() * EDUCATIONAL_TIPS.length)]);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    }
  }, [isOpen]);

  // Shield countdown timer
  useEffect(() => {
    if (!shieldActive) {
      shieldActiveRef.current = false;
      return;
    }
    shieldActiveRef.current = true;
    const interval = setInterval(() => {
      setShieldTimeLeft((prev) => {
        if (prev <= 1) {
          shieldActiveRef.current = false;
          setShieldActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [shieldActive]);

  // Keyboard navigation listeners
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Handle pointer / touch movement directly over the arena
  const handlePointerMove = (clientX: number) => {
    if (!arenaRef.current || gameState !== 'playing') return;
    const rect = arenaRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const clampedPercentage = Math.max(10, Math.min(90, (relativeX / rect.width) * 100));
    targetBinX.current = clampedPercentage;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  };

  // Mobile on-screen thumb buttons
  const startMovingLeft = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    keysPressed.current.left = true;
    keysPressed.current.right = false;
    targetBinX.current = Math.max(8, targetBinX.current - 9);
  };

  const stopMovingLeft = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    keysPressed.current.left = false;
  };

  const startMovingRight = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    keysPressed.current.right = true;
    keysPressed.current.left = false;
    targetBinX.current = Math.min(92, targetBinX.current + 9);
  };

  const stopMovingRight = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    keysPressed.current.right = false;
  };

  // Trigger floating text
  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((ft) => ft.id !== id));
    }, 850);
  };

  // Spawn visual celebration particles on catch
  const spawnParticles = (x: number, y: number, color: string, count: number = 6) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = Math.random() * 2 + 1.2;
      newParticles.push({
        id: `${Date.now()}-${i}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        color,
        size: Math.random() * 5 + 3,
        alpha: 1,
      });
    }
    setParticles((prev) => [...prev.slice(-30), ...newParticles]);
  };

  // Save current run into Leaderboard
  const saveToLeaderboard = (customName?: string) => {
    if (hasSavedScoreRef.current) return;
    hasSavedScoreRef.current = true;

    const rawName = (customName !== undefined ? customName : playerName).trim();
    const finalName = rawName.length > 0 ? rawName.slice(0, 18) : 'Anonim';

    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const dateStr = `${now.getDate()} ${monthNames[now.getMonth()]}`;

    const newEntry: LeaderboardEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: finalName,
      score: scoreRef.current,
      level: levelRef.current,
      caught: caughtCountRef.current,
      date: dateStr,
    };

    setSavedEntryId(newEntry.id);
    setLeaderboard((prev) => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 25);
      try {
        localStorage.setItem('earth_rescue_leaderboard', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    sounds.playSuccess();
  };

  // Clear Leaderboard history
  const clearLeaderboard = () => {
    try {
      localStorage.removeItem('earth_rescue_leaderboard');
    } catch {
      // ignore
    }
    setLeaderboard([]);
    setSavedEntryId(null);
    sounds.playPop();
  };

  // Trigger Game Over
  const triggerGameOver = () => {
    heartsRef.current = 0;
    setHearts(0);
    setGameState('gameover');
    sounds.playGameOver();
    hasSavedScoreRef.current = false;
    setSavedEntryId(null);
    setPlayerName('');

    try {
      const currentHigh = parseInt(localStorage.getItem('earth_falling_trash_high_score') || '0', 10);
      if (scoreRef.current > currentHigh) {
        localStorage.setItem('earth_falling_trash_high_score', scoreRef.current.toString());
        setHighScore(scoreRef.current);
      }
    } catch {
      // ignore
    }
  };

  // Spawner pool for realistic 3R items
  const spawnItem = (currentLevel: number): FallingItem => {
    const rand = Math.random();
    const xPos = Math.random() * 76 + 12;

    const hazardRate = currentLevel === 1 ? 0.22 : currentLevel === 2 ? 0.28 : 0.35;
    const powerupRate = currentLevel === 1 ? 0.12 : 0.09;

    if (rand < hazardRate) {
      return {
        id: `item-${Date.now()}-${Math.random()}`,
        kind: 'hazard',
        subType: 'toxic-smoke',
        name: 'Kepulan Asap Polusi',
        label: 'BAHAYA',
        icon: 'hazard',
        x: xPos,
        y: -10,
        speed: (0.46 + currentLevel * 0.14 + Math.random() * 0.12),
        points: -1,
        rotation: (Math.random() - 0.5) * 30,
        rotSpeed: (Math.random() - 0.5) * 2,
        size: 38,
        color: '#1c1917',
      };
    }

    if (rand < hazardRate + powerupRate) {
      const isHeart = heartsRef.current < 3 && Math.random() > 0.45;
      return {
        id: `item-${Date.now()}-${Math.random()}`,
        kind: 'powerup',
        subType: isHeart ? 'heart' : 'shield',
        name: isHeart ? 'Pemulih Nyawa (+1)' : 'Perisai Ozon (6s)',
        label: isHeart ? '+1 NYAWA' : 'PERISAI 6s',
        icon: isHeart ? 'heart' : 'shield',
        x: xPos,
        y: -10,
        speed: 0.42 + Math.random() * 0.1,
        points: isHeart ? 15 : 20,
        rotation: 0,
        rotSpeed: 0,
        size: 36,
        color: isHeart ? '#15803d' : '#2563eb',
      };
    }

    const trashCatalog = [
      {
        subType: 'botol',
        name: 'Botol Plastik Bekas',
        label: 'Botol Plastik',
        image: botolBekasImg,
        points: 10,
        size: 34,
        color: '#283618',
      },
      {
        subType: 'kardus',
        name: 'Kardus Paket Bekas',
        label: 'Kardus Bekas',
        image: kardusBekasImg,
        points: 15,
        size: 36,
        color: '#5B4436',
      },
      {
        subType: 'baju',
        name: 'Baju Katun Bekas',
        label: 'Kain Baju',
        image: bajuBekasImg,
        points: 20,
        size: 34,
        color: '#BC6C25',
      },
      {
        subType: 'sampah1',
        name: 'Sampah Kertas Daur Ulang',
        label: 'Kertas HVS',
        image: sampah1Img,
        points: 10,
        size: 32,
        color: '#606C38',
      },
      {
        subType: 'sampah2',
        name: 'Kaleng Minuman Bekas',
        label: 'Kaleng Minum',
        image: sampah2Img,
        points: 25,
        size: 32,
        color: '#DDA15E',
      },
    ];

    const picked = trashCatalog[Math.floor(Math.random() * trashCatalog.length)];

    return {
      id: `item-${Date.now()}-${Math.random()}`,
      kind: 'trash',
      subType: picked.subType,
      name: picked.name,
      label: picked.label,
      image: picked.image,
      x: xPos,
      y: -10,
      speed: (0.42 + currentLevel * 0.13 + Math.random() * 0.15),
      points: picked.points,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 3,
      size: picked.size,
      color: picked.color,
    };
  };

  // Start / Restart Game
  const startGame = () => {
    sounds.playAlert();

    itemsRef.current = [];
    heartsRef.current = 3;
    scoreRef.current = 0;
    levelRef.current = 1;
    comboRef.current = 0;
    maxComboRef.current = 0;
    caughtCountRef.current = 0;
    shieldActiveRef.current = false;
    hasSavedScoreRef.current = false;
    setSavedEntryId(null);
    setPlayerName('');

    setHearts(3);
    setScore(0);
    setLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setCaughtCount(0);
    setItems([]);
    setParticles([]);
    setFloatingTexts([]);
    setShieldActive(false);
    setShieldTimeLeft(0);
    setIsHurt(false);
    targetBinX.current = 50;
    currentBinX.current = 50;
    setBinX(50);
    lastSpawnTime.current = performance.now();
    lastFrameTime.current = performance.now();
    setGameState('playing');
  };

  const handlePlayAgain = () => {
    if (!hasSavedScoreRef.current && scoreRef.current > 0) {
      saveToLeaderboard(playerName);
    }
    startGame();
  };

  const handleCloseModal = () => {
    if (gameState === 'gameover' && !hasSavedScoreRef.current && scoreRef.current > 0) {
      saveToLeaderboard(playerName);
    }
    onClose();
  };

  // Main 60 FPS Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    lastFrameTime.current = performance.now();
    lastSpawnTime.current = performance.now();

    const gameLoop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastFrameTime.current) / 16.66, 2.2);
      lastFrameTime.current = timestamp;

      // 1. Movement interpolation
      const moveSpeed = 2.5 * dt;
      if (keysPressed.current.left) {
        targetBinX.current = Math.max(8, targetBinX.current - moveSpeed);
      }
      if (keysPressed.current.right) {
        targetBinX.current = Math.min(92, targetBinX.current + moveSpeed);
      }

      currentBinX.current += (targetBinX.current - currentBinX.current) * 0.35 * dt;
      setBinX(currentBinX.current);

      // 2. Spawn items with interval scaling by level & score
      const currentLevel = levelRef.current;
      const spawnInterval = Math.max(1050 - (currentLevel - 1) * 130 - Math.min(scoreRef.current * 0.45, 260), 380);
      if (timestamp - lastSpawnTime.current > spawnInterval) {
        itemsRef.current.push(spawnItem(currentLevel));
        lastSpawnTime.current = timestamp;
      }

      // 3. Update particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.6 * dt,
            y: p.y + p.vy * 0.6 * dt,
            alpha: p.alpha - 0.035 * dt,
            vy: p.vy + 0.08 * dt,
          }))
          .filter((p) => p.alpha > 0.05)
      );

      // 4. Update falling items & collision with trash bin
      const survivingItems: FallingItem[] = [];
      const binCurrentX = currentBinX.current;

      const CATCH_HALF_WIDTH = 13.5;
      const CATCH_Y_TOP = 70;
      const CATCH_Y_BOTTOM = 88;

      for (let i = 0; i < itemsRef.current.length; i++) {
        const item = itemsRef.current[i];
        const prevY = item.y;
        const nextY = prevY + item.speed * 0.78 * dt;
        const nextRot = item.rotation + item.rotSpeed * dt;

        const sweptYOverlaps = prevY <= CATCH_Y_BOTTOM && nextY >= CATCH_Y_TOP;
        const distFromBinX = Math.abs(item.x - binCurrentX);

        if (item.kind === 'hazard') {
          if (sweptYOverlaps && distFromBinX <= CATCH_HALF_WIDTH) {
            if (shieldActiveRef.current) {
              sounds.playTrashCatch(1);
              addFloatingText('TERTANGKIS PERISAI!', item.x, 70, '#2563eb');
              spawnParticles(item.x, 74, '#3b82f6', 10);
            } else {
              heartsRef.current -= 1;
              comboRef.current = 0;
              setHearts(heartsRef.current);
              setCombo(0);

              sounds.playToxicHurt();
              setIsHurt(true);
              setTimeout(() => setIsHurt(false), 450);
              addFloatingText('-1 NYAWA (KENA POLUSI)', item.x, 70, '#b91c1c');
              spawnParticles(item.x, 74, '#7f1d1d', 14);

              if (heartsRef.current <= 0) {
                triggerGameOver();
                return;
              }
            }
            continue;
          }
        } else if (item.kind === 'trash') {
          if (sweptYOverlaps && distFromBinX <= CATCH_HALF_WIDTH) {
            caughtCountRef.current += 1;
            comboRef.current += 1;
            if (comboRef.current > maxComboRef.current) {
              maxComboRef.current = comboRef.current;
              setMaxCombo(maxComboRef.current);
            }

            const comboMultiplier = comboRef.current >= 6 ? 2.5 : comboRef.current >= 3 ? 1.5 : 1;
            const pointsGained = Math.round(item.points * comboMultiplier);
            scoreRef.current += pointsGained;

            setScore(scoreRef.current);
            setCaughtCount(caughtCountRef.current);
            setCombo(comboRef.current);

            sounds.playTrashCatch(comboRef.current);

            setBinSquash(true);
            setTimeout(() => setBinSquash(false), 140);

            const comboBonusText = comboMultiplier > 1 ? ` (${comboMultiplier}x!)` : '';
            addFloatingText(`+${pointsGained}${comboBonusText}`, item.x, 68, item.color);
            spawnParticles(item.x, 74, item.color, 8);

            // Level up progression thresholds
            let newLevel = 1;
            if (scoreRef.current >= 240) newLevel = 3;
            else if (scoreRef.current >= 90) newLevel = 2;

            if (newLevel !== levelRef.current) {
              levelRef.current = newLevel;
              setLevel(newLevel);
              sounds.playSuccess();
              addFloatingText(`LEVEL ${newLevel}! MAKIN CEPAT!`, 50, 36, '#BC6C25');
              spawnParticles(50, 40, '#BC6C25', 18);
            }

            continue;
          }
        } else if (item.kind === 'powerup') {
          if (sweptYOverlaps && distFromBinX <= CATCH_HALF_WIDTH) {
            sounds.playPowerUp();
            if (item.subType === 'heart') {
              if (heartsRef.current < 3) {
                heartsRef.current += 1;
                setHearts(heartsRef.current);
                addFloatingText('+1 NYAWA PULIH!', item.x, 68, '#283618');
                spawnParticles(item.x, 74, '#22c55e', 14);
              } else {
                scoreRef.current += 30;
                setScore(scoreRef.current);
                addFloatingText('+30 BONUS!', item.x, 68, '#283618');
                spawnParticles(item.x, 74, '#22c55e', 10);
              }
            } else if (item.subType === 'shield') {
              shieldActiveRef.current = true;
              setShieldActive(true);
              setShieldTimeLeft(6);
              addFloatingText('PERISAI AKTIF 6s!', item.x, 68, '#2563eb');
              spawnParticles(item.x, 74, '#60a5fa', 12);
            }
            continue;
          }
        }

        // Check if item reached the ground
        if (nextY > 104) {
          if (item.kind === 'trash') {
            if (shieldActiveRef.current) {
              addFloatingText('PERISAI MELINDUNGI!', item.x, 88, '#2563eb');
              spawnParticles(item.x, 92, '#3b82f6', 6);
            } else {
              heartsRef.current -= 1;
              comboRef.current = 0;
              setHearts(heartsRef.current);
              setCombo(0);

              sounds.playToxicHurt();
              setIsHurt(true);
              setTimeout(() => setIsHurt(false), 450);
              addFloatingText('-1 NYAWA (TERCECER)', item.x, 88, '#b91c1c');
              spawnParticles(item.x, 92, '#b91c1c', 8);

              if (heartsRef.current <= 0) {
                triggerGameOver();
                return;
              }
            }
          }
          continue;
        }

        survivingItems.push({
          ...item,
          y: nextY,
          rotation: nextRot,
        });
      }

      itemsRef.current = survivingItems;
      setItems([...survivingItems]);

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameState]);

  const toggleSound = () => {
    sounds.toggle();
    setAudioMuted(!sounds.enabled);
  };

  if (!isOpen) return null;

  const getRankBadge = (pts: number) => {
    if (pts >= 250) return { title: 'Eco-Champion Pinisi', desc: 'Legenda daur ulang kampus!' };
    if (pts >= 140) return { title: 'Penjaga Kampus Hijau', desc: 'Refleks memilah sangat tajam!' };
    if (pts >= 60) return { title: 'Penyelamat Bumi Muda', desc: 'Langkah awal yang hebat!' };
    return { title: 'Relawan Lingkungan', desc: 'Ayo coba lagi dan perbaiki rekor!' };
  };

  const rank = getRankBadge(score);

  // Find player's position in leaderboard if saved
  const currentPlayerRankIndex = savedEntryId
    ? leaderboard.findIndex((entry) => entry.id === savedEntryId)
    : -1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Outer Cabinet Card - Warm Crafted Aesthetic with Solid Forest Border */}
      <div className="relative w-full max-w-lg md:max-w-xl bg-[#FEFAE0] rounded-3xl shadow-2xl border-4 border-[#283618] overflow-hidden flex flex-col h-[94dvh] max-h-[720px] select-none text-[#283618]">
        
        {/* 1. Header Bar: Authentic Hand-Crafted DKV UNM Styling */}
        <div className="bg-[#283618] text-[#FEFAE0] px-4 py-3 flex items-center justify-between border-b-3 border-[#1e2a12] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FEFAE0] p-1 flex items-center justify-center shadow-xs border border-[#FEFAE0]/40">
              <img src={bumiImg} alt="Earth" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-400 text-[#283618]">
                  MISI 3R
                </span>
                <span className="text-[11px] text-[#FEFAE0]/80 font-bold">
                  DKV UNM
                </span>
              </div>
              <h2 className="font-display font-black text-sm sm:text-base tracking-wide uppercase text-white leading-tight mt-0.5">
                Penyelamat Bumi
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FEFAE0] transition active:scale-95 cursor-pointer"
              title={audioMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="p-2 rounded-xl bg-[#5B4436] hover:bg-[#433126] text-[#FEFAE0] transition active:scale-95 border border-[#FEFAE0]/30 cursor-pointer"
              title="Tutup Game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: INTRO / MENU UTAMA (BERSIH, TANPA HUD & CONTROLLER) */}
        {/* ========================================================= */}
        {gameState === 'intro' && (
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#FEFAE0] overflow-y-auto">
            {/* Header Tab Switcher */}
            <div className="w-full max-w-sm mx-auto flex items-center p-1 rounded-full bg-[#283618]/10 border border-[#283618]/20 shrink-0 mb-3">
              <button
                type="button"
                onClick={() => { sounds.playPop(); setIntroTab('howtoplay'); }}
                className={`flex-1 py-1.5 px-3 rounded-full font-display text-xs sm:text-sm font-bold transition cursor-pointer ${
                  introTab === 'howtoplay'
                    ? 'bg-[#283618] text-[#FEFAE0] shadow-sm'
                    : 'text-[#283618]/70 hover:text-[#283618]'
                }`}
              >
                Panduan Misi
              </button>
              <button
                type="button"
                onClick={() => { sounds.playPop(); setIntroTab('leaderboard'); }}
                className={`flex-1 py-1.5 px-3 rounded-full font-display text-xs sm:text-sm font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  introTab === 'leaderboard'
                    ? 'bg-[#283618] text-[#FEFAE0] shadow-sm'
                    : 'text-[#283618]/70 hover:text-[#283618]'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>Papan Skor</span>
              </button>
            </div>

            {introTab === 'howtoplay' ? (
              /* TAB PANDUAN MISI */
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
                {/* Earth illustration centerpiece */}
                <div className="relative my-1">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#283618]/10 border-3 border-[#283618] p-2 flex items-center justify-center shadow-lg">
                    <img src={bumiImg} alt="Earth" className="w-full h-full object-contain animate-planet-float" />
                  </div>
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-[#283618] uppercase tracking-wide mt-2">
                  Bumi Butuh Aksimu!
                </h3>
                <p className="font-body text-[#5B4436] text-xs sm:text-sm max-w-sm mt-1 mb-3.5 leading-relaxed font-medium">
                  Bantu bersihkan lingkungan kampus. Geser tong sampah ke kiri dan kanan untuk memilah sampah yang jatuh.
                </p>

                {/* Handcrafted Visual Guide Showcase */}
                <div className="w-full space-y-2 mb-4 text-left">
                  {/* Bahaya & Bantuan */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#5B4436]/10 border-2 border-[#5B4436]/25 p-2.5 rounded-2xl">
                      <div className="flex items-center gap-1.5 mb-1 text-rose-800 font-display font-bold text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Awas Polusi</span>
                      </div>
                      <p className="text-[10.5px] text-[#5B4436] leading-tight font-medium">
                        Hindari asap hitam agar nyawa tidak berkurang.
                      </p>
                    </div>

                    <div className="bg-[#283618]/10 border-2 border-[#283618]/25 p-2.5 rounded-2xl">
                      <div className="flex items-center gap-1.5 mb-1 text-[#283618] font-display font-bold text-xs">
                        <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                        <span>Bantuan Spesial</span>
                      </div>
                      <p className="text-[10.5px] text-[#5B4436] leading-tight font-medium">
                        Ambil hati untuk nyawa & perisai kebal 6 detik.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Play Button */}
                <button
                  type="button"
                  onClick={startGame}
                  className="w-full py-3.5 px-6 bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] font-display font-black text-base rounded-2xl border-2 border-[#1e2a12] shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>MULAI BERMAIN</span>
                </button>
              </div>
            ) : (
              /* TAB PAPAN SKOR */
              <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
                <div className="w-full">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-[#283618]/20 mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-600" />
                      <h4 className="font-display font-black text-sm sm:text-base text-[#283618] uppercase tracking-wide">
                        Papan Skor Pejuang Bumi
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {leaderboard.length > 0 && (
                        <button
                          type="button"
                          onClick={clearLeaderboard}
                          className="text-[10px] text-[#5B4436] hover:text-red-700 underline font-semibold cursor-pointer"
                          title="Kosongkan Papan Skor"
                        >
                          Kosongkan
                        </button>
                      )}
                      <span className="text-xs font-bold text-[#5B4436]">
                        {leaderboard.length > 0 ? `${leaderboard.length} Rekor` : '0 Rekor'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                    {leaderboard.length === 0 ? (
                      <div className="py-10 px-4 text-center bg-white/70 border-2 border-dashed border-[#283618]/25 rounded-2xl my-3">
                        <Award className="w-10 h-10 text-[#283618]/40 mx-auto mb-2" />
                        <span className="font-display font-black text-sm text-[#283618] block">
                          Papan Skor Masih Kosong
                        </span>
                        <p className="text-xs text-[#5B4436] font-medium max-w-xs mx-auto mt-1 leading-relaxed">
                          Belum ada rekor tersimpan. Mainkan sekarang dan jadilah pejuang bumi pertama di papan juara!
                        </p>
                      </div>
                    ) : (
                      leaderboard.slice(0, 10).map((entry, idx) => {
                        const isGold = idx === 0;
                        const isSilver = idx === 1;
                        const isBronze = idx === 2;

                        return (
                          <div
                            key={entry.id}
                            className={`p-2.5 rounded-xl flex items-center justify-between border-2 transition-all ${
                              isGold
                                ? 'bg-amber-100/90 border-amber-300 font-bold shadow-xs'
                                : isSilver
                                ? 'bg-stone-100 border-stone-300'
                                : isBronze
                                ? 'bg-[#5B4436]/10 border-[#5B4436]/25'
                                : 'bg-white/80 border-[#283618]/15'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-display font-black text-xs shrink-0 ${
                                  isGold
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : isSilver
                                    ? 'bg-stone-400 text-white'
                                    : isBronze
                                    ? 'bg-[#5B4436] text-white'
                                    : 'bg-[#283618]/20 text-[#283618]'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <div className="text-left">
                                <span className="font-display text-xs sm:text-sm font-black text-[#283618] block leading-tight truncate max-w-[170px]">
                                  {entry.name}
                                </span>
                                <span className="text-[10px] text-[#5B4436] font-medium leading-none">
                                  {entry.caught} sampah • {entry.date}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-display text-base font-black text-[#283618] block leading-none">
                                {entry.score}
                              </span>
                              <span className="text-[9px] text-[#5B4436] uppercase font-bold">PTS</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startGame}
                  className="w-full mt-4 py-3 bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] font-display font-black text-sm rounded-2xl border-2 border-[#1e2a12] shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>MULAI BERMAIN SEKARANG</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: GAMEPLAY (HUD + FULL ARENA + CONTROLLER)           */}
        {/* ========================================================= */}
        {gameState === 'playing' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Top HUD Dashboard */}
            <div className="bg-[#F4EFC9] px-4 py-2 border-b-2 border-[#283618]/15 flex items-center justify-between text-xs font-bold shrink-0">
              {/* Hearts / Health */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((heartIndex) => (
                  <Heart
                    key={heartIndex}
                    className={`w-4 h-4 transition-transform duration-200 ${
                      heartIndex <= hearts
                        ? 'text-rose-600 fill-rose-600 scale-100 drop-shadow-xs'
                        : 'text-stone-300 fill-stone-200 scale-90'
                    }`}
                  />
                ))}
                {shieldActive && (
                  <span className="ml-1 inline-flex items-center gap-0.5 text-[9px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-black border border-blue-300 animate-pulse">
                    <Shield className="w-2.5 h-2.5 fill-blue-600" /> {shieldTimeLeft}s
                  </span>
                )}
              </div>

              {/* Level & Combo Badge */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black border transition-all ${
                    level >= 3
                      ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                      : level === 2
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-[#5B4436]/10 text-[#5B4436] border-[#5B4436]/20'
                  }`}
                >
                  {level >= 3 ? `LVL ${level} TURBO` : level === 2 ? `LVL ${level} CEPAT` : `LVL ${level}`}
                </span>
                {combo > 1 && (
                  <span className="bg-[#283618] text-[#FEFAE0] px-2.5 py-0.5 rounded-full font-display font-black text-[10px] tracking-wide animate-bounce">
                    {combo}x COMBO!
                  </span>
                )}
              </div>

              {/* Score & High Score */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[9px] text-[#5B4436] block leading-none font-bold">SKOR</span>
                  <span className="font-display text-base font-black text-[#283618] leading-none">{score}</span>
                </div>
                <div className="text-right pl-2 border-l border-[#283618]/20 hidden xs:block">
                  <span className="text-[9px] text-[#5B4436] block leading-none flex items-center gap-0.5 font-bold">
                    <Trophy className="w-2.5 h-2.5 text-amber-600" /> TOP
                  </span>
                  <span className="font-display text-xs font-bold text-amber-800 leading-none">{highScore}</span>
                </div>
              </div>
            </div>

            {/* Arena Container */}
            <div
              ref={arenaRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className={`relative flex-1 w-full overflow-hidden select-none cursor-ew-resize transition-colors duration-150 ${
                isHurt ? 'bg-red-100' : 'bg-gradient-to-b from-[#F9F7EE] via-[#EFF6E7] to-[#DFEDD2]'
              }`}
              style={{ touchAction: 'none' }}
            >
              {/* Subtle eco cloud silhouettes */}
              <div className="absolute inset-0 pointer-events-none opacity-35">
                <div className="absolute top-3 left-4 w-20 h-6 bg-white/90 rounded-full blur-[1px]" />
                <div className="absolute top-10 right-8 w-24 h-7 bg-white/90 rounded-full blur-[1px]" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-8 bg-white/80 rounded-full blur-[1px]" />
              </div>

              {/* Hurt Red Flash Overlay */}
              {isHurt && (
                <div className="absolute inset-0 bg-red-600/20 pointer-events-none animate-pulse z-30" />
              )}

              {/* Floating Text Notifications */}
              {floatingTexts.map((ft) => (
                <div
                  key={ft.id}
                  className="absolute font-display font-black text-xs sm:text-sm pointer-events-none z-40 transform -translate-x-1/2 drop-shadow-sm animate-floatUp whitespace-nowrap"
                  style={{
                    left: `${ft.x}%`,
                    top: `${ft.y}%`,
                    color: ft.color,
                    textShadow: '0 1px 3px rgba(255,255,255,0.9)',
                  }}
                >
                  {ft.text}
                </div>
              ))}

              {/* Visual Burst Particles */}
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute rounded-full pointer-events-none z-30"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    opacity: p.alpha,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}

              {/* Falling Items Rendering */}
              {items.map((item) => {
                if (item.kind === 'hazard') {
                  return (
                    <div
                      key={item.id}
                      className="absolute pointer-events-none z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                      }}
                    >
                      <div className="relative w-10 h-10 rounded-2xl bg-stone-900 border-2 border-amber-500 flex items-center justify-center shadow-lg animate-pulse">
                        <AlertTriangle className="w-5 h-5 text-amber-400 stroke-[2.5]" />
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-stone-800" />
                        <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-stone-700" />
                      </div>
                      <span className="text-[8.5px] font-black text-white bg-red-700 px-1 py-0.2 rounded shadow-xs mt-0.5 border border-red-300 tracking-wider">
                        HINDARI
                      </span>
                    </div>
                  );
                }

                if (item.kind === 'powerup') {
                  return (
                    <div
                      key={item.id}
                      className="absolute pointer-events-none z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translate(-50%, -50%) scale(1.05)`,
                      }}
                    >
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-md border-2 ${
                          item.subType === 'heart'
                            ? 'bg-[#FEFAE0] border-[#283618] text-[#283618] animate-bounce'
                            : 'bg-blue-100 border-blue-600 text-blue-700 animate-pulse'
                        }`}
                      >
                        {item.subType === 'heart' ? (
                          <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                        ) : (
                          <Shield className="w-5 h-5 text-blue-600 fill-blue-600" />
                        )}
                      </div>
                      <span className="text-[8px] font-black text-[#283618] bg-[#FEFAE0] px-1 rounded shadow-xs mt-0.5 border border-[#283618]/30">
                        {item.label}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="absolute pointer-events-none z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                    }}
                  >
                    <div className="relative p-0.5 bg-white/60 rounded-xl shadow-xs backdrop-blur-xs border border-[#283618]/20">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-contain filter drop-shadow-xs"
                          style={{ width: `${item.size}px`, height: `${item.size}px` }}
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-xs text-xs"
                          style={{ backgroundColor: item.color }}
                        >
                          3R
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] font-extrabold text-[#283618] bg-[#FEFAE0]/90 px-1 py-0.2 rounded shadow-xs mt-0.5 border border-[#283618]/30 tracking-tight leading-none">
                      {item.label}
                    </span>
                  </div>
                );
              })}

              {/* Grass Floor Baseline at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#283618] to-[#3b4e23] border-t-2 border-[#1e2a12] z-10 flex items-center justify-center">
                <span className="text-[9.5px] text-[#FEFAE0]/80 font-display font-semibold tracking-wider select-none">
                  GERAKKAN TONG KE KIRI & KANAN
                </span>
              </div>

              {/* Player Trash Bin */}
              <div
                className={`absolute bottom-2 z-20 transform -translate-x-1/2 pointer-events-none transition-transform duration-75 ${
                  isHurt ? 'animate-shake' : ''
                }`}
                style={{
                  left: `${binX}%`,
                  transform: `translateX(-50%) ${binSquash ? 'scale(1.18, 0.82)' : 'scale(1, 1)'}`,
                }}
              >
                <div className="relative flex flex-col items-center">
                  {shieldActive && (
                    <div className="absolute -inset-3 rounded-full border-3 border-blue-400 bg-blue-400/20 animate-pulse pointer-events-none" />
                  )}

                  <div className="w-20 sm:w-24 relative -mb-2.5 z-10 transform -rotate-6 transition-transform">
                    <img
                      src={tongsampahAtasImg}
                      alt="Tutup Tong Sampah"
                      className="w-full object-contain drop-shadow-xs"
                    />
                  </div>

                  <div className="w-16 sm:w-20 relative">
                    <img
                      src={tongsampahBawahImg}
                      alt="Tong Sampah"
                      className="w-full object-contain drop-shadow-md"
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#283618] text-[#FEFAE0] text-[8px] font-display font-black px-1.5 py-0.2 rounded-full border border-[#FEFAE0]/50 shadow-xs whitespace-nowrap">
                      3R KEEPER
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile / Touch Controller Bar */}
            <div className="bg-[#FEFAE0] p-2 sm:p-2.5 border-t-3 border-[#283618]/20 flex flex-col gap-1.5 shrink-0 select-none">
              {/* Position Drag Track */}
              <div
                className="w-full h-3 rounded-full bg-[#283618]/15 border border-[#283618]/25 relative cursor-pointer px-1 flex items-center"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
                  targetBinX.current = pct;
                }}
                onTouchMove={(e) => {
                  if (e.touches.length > 0) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.max(10, Math.min(90, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
                    targetBinX.current = pct;
                  }
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#283618] border-2 border-[#FEFAE0] shadow-md -ml-2.5 transition-transform"
                  style={{ left: `${binX}%` }}
                />
              </div>

              {/* Chunky Dual Thumb Steering Buttons */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onMouseDown={startMovingLeft}
                  onMouseUp={stopMovingLeft}
                  onMouseLeave={stopMovingLeft}
                  onTouchStart={startMovingLeft}
                  onTouchEnd={stopMovingLeft}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#5B4436] hover:bg-[#433126] text-[#FEFAE0] font-display font-black text-xs sm:text-sm shadow-md border-b-4 border-[#3c2a21] active:border-b-0 active:translate-y-1 active:bg-[#3c2a21] transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[3]" />
                  <span>GESER KIRI</span>
                </button>

                <button
                  type="button"
                  onMouseDown={startMovingRight}
                  onMouseUp={stopMovingRight}
                  onMouseLeave={stopMovingRight}
                  onTouchStart={startMovingRight}
                  onTouchEnd={stopMovingRight}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] font-display font-black text-xs sm:text-sm shadow-md border-b-4 border-[#16200d] active:border-b-0 active:translate-y-1 active:bg-[#16200d] transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <span>GESER KANAN</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[9px] text-[#5B4436] font-semibold px-1">
                <span>Gunakan tombol atau usap layar</span>
                <span className="hidden sm:inline">Keyboard: A / D / Panah</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: GAME OVER & LEADERBOARD SUBMISSION                */}
        {/* ========================================================= */}
        {gameState === 'gameover' && (
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-[#FEFAE0] overflow-y-auto">
            <div className="w-full max-w-sm mx-auto flex flex-col items-center">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#283618] text-[#FEFAE0] text-[10px] font-display font-black tracking-wider uppercase mb-1.5 shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{rank.title}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-display font-black text-[#283618] leading-tight">
                Misi Selesai!
              </h3>
              <p className="text-xs text-[#5B4436] font-medium mt-0.5 mb-2.5">
                {rank.desc}
              </p>

              {/* Score & Stats Pill */}
              <div className="mb-3 p-3 rounded-2xl bg-white border-2 border-[#283618]/25 shadow-xs w-full grid grid-cols-3 gap-2">
                <div className="bg-[#283618]/5 p-1.5 rounded-xl text-center">
                  <span className="text-[9px] font-bold text-[#5B4436] block">SKOR AKHIR</span>
                  <span className="text-xl font-display font-black text-[#283618] leading-tight">{score}</span>
                </div>
                <div className="bg-[#283618]/5 p-1.5 rounded-xl text-center">
                  <span className="text-[9px] font-bold text-[#5B4436] block">TERPILAH</span>
                  <span className="text-xl font-display font-black text-[#5B4436] leading-tight">{caughtCount}</span>
                </div>
                <div className="bg-[#283618]/5 p-1.5 rounded-xl text-center">
                  <span className="text-[9px] font-bold text-[#5B4436] block">MAX COMBO</span>
                  <span className="text-xl font-display font-black text-amber-700 leading-tight">{maxCombo}x</span>
                </div>
              </div>

              {/* FORMULIR INPUT NAMA KE LEADERBOARD */}
              {!savedEntryId ? (
                <div className="w-full bg-[#F4EFC9] border-2 border-[#5B4436]/30 p-3 rounded-2xl mb-2.5 text-left shadow-xs">
                  <label className="block text-[11px] font-display font-black text-[#283618] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#5B4436]" />
                      <span>Catat Namamu ke Papan Skor:</span>
                    </span>
                    <span className="text-[9px] font-normal text-[#5B4436]">Opsional</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={18}
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          saveToLeaderboard(playerName);
                        }
                      }}
                      placeholder="Ketik namamu (atau 'Anonim')..."
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-[#283618]/30 bg-white font-body text-xs text-[#283618] focus:outline-none focus:border-[#283618]"
                    />
                    <button
                      type="button"
                      onClick={() => saveToLeaderboard(playerName)}
                      className="px-4 py-2 bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] font-display font-black text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
                    >
                      Simpan
                    </button>
                  </div>
                  <span className="text-[8.5px] text-[#5B4436] mt-1.5 block">
                    *Bila dikosongkan, nama otomatis tercatat sebagai "Anonim".
                  </span>
                </div>
              ) : (
                <div className="w-full bg-emerald-50 border-2 border-emerald-500/40 p-2.5 rounded-xl mb-2.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 text-left">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[11px] font-display font-black text-emerald-900 block leading-tight">
                        Skor Tercatat di Papan Juara!
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        {playerName.trim() || 'Anonim'} — Peringkat #{currentPlayerRankIndex + 1}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                    Tersimpan
                  </span>
                </div>
              )}

              {/* LEADERBOARD LISTING PREVIEW (Top 5) */}
              <div className="w-full bg-white/80 border border-[#283618]/20 rounded-2xl p-2.5 mb-2 text-left">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#283618]/15 mb-2">
                  <span className="font-display font-black text-[11px] text-[#283618] uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" /> Papan Peringkat (Top 5)
                  </span>
                  <span className="text-[10px] text-[#5B4436]">
                    {leaderboard.length > 0 ? `${leaderboard.length} Rekor` : '0 Rekor'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {leaderboard.length === 0 ? (
                    <div className="py-3 px-2 text-center bg-white/50 border border-dashed border-[#283618]/20 rounded-xl">
                      <span className="text-xs font-display font-bold text-[#283618] block">
                        Papan skor masih kosong
                      </span>
                      <span className="text-[10px] text-[#5B4436] block mt-0.5">
                        Simpan skormu di atas untuk menjadi peringkat pertama!
                      </span>
                    </div>
                  ) : (
                    leaderboard.slice(0, 5).map((entry, idx) => {
                      const isCurrent = entry.id === savedEntryId;

                      return (
                        <div
                          key={entry.id}
                          className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition ${
                            isCurrent
                              ? 'bg-amber-200/90 border border-amber-400 font-black shadow-xs'
                              : 'bg-white/70'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-display font-black text-[10px] text-[#5B4436] w-4">
                              #{idx + 1}
                            </span>
                            <span className="font-display text-xs font-bold text-[#283618] truncate max-w-[140px]">
                              {entry.name} {isCurrent && <span className="text-amber-800 text-[10px] font-black">(Kamu)</span>}
                            </span>
                          </div>
                          <span className="font-display text-xs font-black text-[#283618]">
                            {entry.score} pts
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Edu Fact Tip */}
              <div className="bg-[#5B4436]/10 p-2.5 rounded-xl text-left w-full mb-2">
                <span className="text-[9px] font-bold text-[#5B4436] block">Catatan 3R:</span>
                <p className="text-[10.5px] text-[#283618] leading-tight font-medium">
                  {eduTip}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-sm mx-auto flex items-center gap-2 pt-2 border-t border-[#283618]/15 shrink-0">
              <button
                type="button"
                onClick={handlePlayAgain}
                className="flex-1 py-3 bg-[#283618] hover:bg-[#1e2a12] text-[#FEFAE0] font-display font-black text-xs sm:text-sm rounded-xl border border-[#1e2a12] shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Lagi</span>
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-display font-bold text-xs sm:text-sm rounded-xl transition active:scale-95 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
