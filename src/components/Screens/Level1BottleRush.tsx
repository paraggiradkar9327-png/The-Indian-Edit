import React, { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, Timer, Flame, Pause, Play, Trophy } from "lucide-react";
import { useGame } from "../../context/GameContext";

// ==========================================
// 1. INLINE CRISP VECTOR ASSETS (No 404s)
// ==========================================

const HERITAGE_TOKEN_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="tokenGold" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fff8d1"/>
      <stop offset="40%" stop-color="#e2ba43"/>
      <stop offset="85%" stop-color="#996e11"/>
      <stop offset="100%" stop-color="#4d3403"/>
    </radialGradient>
    <filter id="tokenGlow">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#ffd700" flood-opacity="0.6"/>
    </filter>
  </defs>
  <circle cx="50" cy="50" r="46" fill="url(#tokenGold)" stroke="#fff" stroke-width="1.5" filter="url(#tokenGlow)"/>
  <circle cx="50" cy="50" r="38" fill="#1d120a" stroke="#e2ba43" stroke-width="2"/>
  <circle cx="50" cy="50" r="34" fill="none" stroke="#f7d070" stroke-dasharray="3 3"/>
  <g stroke="#e2ba43" stroke-width="1.5" opacity="0.8">
    <line x1="50" y1="20" x2="50" y2="80"/>
    <line x1="20" y1="50" x2="80" y2="50"/>
    <line x1="28" y1="28" x2="72" y2="72"/>
    <line x1="28" y1="72" x2="72" y2="28"/>
  </g>
  <polygon points="50,34 62,50 50,66 38,50" fill="#fdf0a6" stroke="#996e11" stroke-width="1"/>
  <circle cx="50" cy="50" r="4" fill="#8c1c13"/>
</svg>
`)}`;

const LEAF_TOKEN_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#84e184"/>
      <stop offset="35%" stop-color="#2ba84a"/>
      <stop offset="85%" stop-color="#195427"/>
      <stop offset="100%" stop-color="#0b2912"/>
    </linearGradient>
    <filter id="leafGlow">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#4ade80" flood-opacity="0.5"/>
    </filter>
  </defs>
  <circle cx="50" cy="50" r="44" fill="#182319" stroke="#52b76e" stroke-width="2" filter="url(#leafGlow)"/>
  <path d="M26 68 Q24 34 56 22 Q78 40 68 72 Q46 76 26 68 Z" fill="url(#leafGrad)" stroke="#bbf7d0" stroke-width="1.5"/>
  <path d="M30 66 Q48 50 64 30" stroke="#f0fdf4" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>
`)}`;

const COLDRINK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="canGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7f1d1d"/>
      <stop offset="50%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#450a0a"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="44" fill="#241010" stroke="#ef4444" stroke-width="2"/>
  <rect x="35" y="24" width="30" height="52" rx="6" fill="url(#canGrad)" stroke="#fca5a5" stroke-width="1.2"/>
  <ellipse cx="50" cy="24" rx="15" ry="4" fill="#9ca3af"/>
  <ellipse cx="50" cy="76" rx="15" ry="4" fill="#374151"/>
  <circle cx="70" cy="30" r="14" fill="#ef4444" stroke="#fff" stroke-width="2"/>
  <text x="70" y="36" font-family="sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">✕</text>
  <text x="50" y="55" font-family="sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">COLA</text>
</svg>
`)}`;

const WASTE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="44" fill="#261a15" stroke="#f97316" stroke-width="2"/>
  <path d="M42 22 L58 22 L58 28 L64 36 L56 46 L66 60 L58 76 L40 76 L34 58 L44 44 L36 34 L42 28 Z" fill="#64748b" stroke="#cbd5e1" stroke-width="1.5"/>
  <circle cx="72" cy="32" r="14" fill="#dc2626" stroke="#fff" stroke-width="2"/>
  <path d="M68 28 L76 36 M76 28 L68 36" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  <text x="50" y="60" font-family="sans-serif" font-size="18" fill="#f87171" text-anchor="middle">🗑️</text>
</svg>
`)}`;

const BOTTLE_TIE_IMAGE = new URL(
  "../../assets/images/NewBottle.png",
  import.meta.url,
).href;

const getItemIcon = (type: string): string => {
  switch (type) {
    case "tie_bottle":
      return BOTTLE_TIE_IMAGE;
    case "heritage_token":
      return HERITAGE_TOKEN_SVG;
    case "leaf_token":
      return LEAF_TOKEN_SVG;
    case "coldrink":
      return COLDRINK_SVG;
    case "waste":
      return WASTE_SVG;
    default:
      return BOTTLE_TIE_IMAGE;
  }
};

// ==========================================
// 2. EMBEDDED SOUND SYNTHESIZER
// ==========================================
class WebSound {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (Ctx) this.ctx = new Ctx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playClick() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  playSuccess() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    try {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + i * 0.06;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch {}
  }

  playWrong() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {}
  }

  playTick() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }
}

const soundEffect = new WebSound();

// ==========================================
// 3. TYPES & INTERFACES
// ==========================================
interface Item {
  id: number;
  type: "tie_bottle" | "heritage_token" | "leaf_token" | "coldrink" | "waste";
  x: number;
  y: number;
  speed: number;
  points: number;
  size: number;
  collected: boolean;
  burstText?: string;
  icon: string;
}

interface Level1BottleRushProps {
  onNextLevel?: () => void;
  onUpdateScore?: (bottles: number, totalScore: number, bonus: number) => void;
}

// ==========================================
// 4. MAIN LEVEL 1 BOTTLE RUSH COMPONENT
// ==========================================
export const Level1BottleRush: React.FC<Level1BottleRushProps> = ({
  onNextLevel,
  onUpdateScore,
}) => {
  const { navigateTo } = useGame();
  const [gameActive, setGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15.0);
  const [score, setScore] = useState(0);
  const [bottlesCount, setBottlesCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [soundOn, setSoundOn] = useState(soundEffect.enabled);
  const [showGuide, setShowGuide] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const nextId = useRef(1);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.key === " ") && !gameActive && !gameOver) {
        e.preventDefault();
        startGame();
      } else if (e.code === "KeyP" && gameActive) {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameActive, gameOver]);

  // Main game physics & timer interval
  useEffect(() => {
    if (!gameActive || isPaused) return;

    // Countdown tick
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, +(prev - 0.1).toFixed(1));
        if (next <= 3.0 && next > 0 && Math.round(next * 10) % 10 === 0) {
          soundEffect.playTick();
        }
        if (next <= 0) {
          soundEffect.playSuccess();
          setGameActive(false);
          setGameOver(true);
          setAnnouncement(`Time up! Game finished with score ${score}`);
        }
        return next;
      });
    }, 100);

    // Spawner
    const spawnInterval = setInterval(() => {
      const rand = Math.random();
      let type: Item["type"] = "tie_bottle";
      let pts = 100;

      if (rand < 0.42) {
        type = "tie_bottle";
        pts = 100;
      } else if (rand < 0.62) {
        type = "heritage_token";
        pts = 150;
      } else if (rand < 0.78) {
        type = "leaf_token";
        pts = 80;
      } else if (rand < 0.9) {
        type = "coldrink";
        pts = -50;
      } else {
        type = "waste";
        pts = -75;
      }

      const newItem: Item = {
        id: nextId.current++,
        type,
        x: Math.floor(Math.random() * 76) + 12,
        y: -12,
        speed: Math.random() * 0.3 + 0.4,
        points: pts,
        size: type === "tie_bottle" ? 74 : 52,
        collected: false,
        icon: getItemIcon(type),
      };

      setItems((prev) => [...prev.slice(-16), newItem]);
    }, 520);

    // Physics
    const physicsInterval = setInterval(() => {
      setItems((prev) =>
        prev
          .map((item) => ({ ...item, y: item.y + item.speed }))
          .filter((item) => item.y < 112),
      );
    }, 28);

    return () => {
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
      clearInterval(physicsInterval);
    };
  }, [gameActive, isPaused, score]);

  // Sync score when game finishes
  useEffect(() => {
    if (gameOver) {
      const bonus = maxCombo > 4 ? 250 : maxCombo > 2 ? 100 : 50;
      const finalScore = Math.max(0, score + bonus);
      if (onUpdateScore) {
        onUpdateScore(bottlesCount, finalScore, bonus);
      }
    }
  }, [gameOver, bottlesCount, score, maxCombo, onUpdateScore]);

  const startGame = useCallback(() => {
    soundEffect.playClick();
    setScore(0);
    setBottlesCount(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(15.0);
    setGameOver(false);
    setIsPaused(false);
    setItems([]);
    setGameActive(true);
    setAnnouncement("Game started. Catch falling luxury bottles and tokens!");
  }, []);

  const handleCollect = (item: Item) => {
    if (item.collected || !gameActive || isPaused) return;

    if (item.points > 0) {
      soundEffect.playClick();
      setScore((prev) => prev + item.points);
      if (item.type === "tie_bottle") {
        setBottlesCount((prev) => prev + 1);
      }
      setCombo((prev) => {
        const next = prev + 1;
        setMaxCombo((curr) => Math.max(curr, next));
        return next;
      });
      setAnnouncement(
        `Collected ${item.type.replace("_", " ")}. +${item.points} points.`,
      );
    } else {
      soundEffect.playWrong();
      setScore((prev) => Math.max(0, prev + item.points));
      setCombo(0);
      setAnnouncement(`Hazard clicked. ${item.points} points.`);
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              collected: true,
              burstText: item.points > 0 ? `+${item.points}` : `${item.points}`,
            }
          : i,
      ),
    );
  };

  const isLowTime = timeLeft <= 3.0 && gameActive;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-center text-[#f7f2ea]">
      {/* Screen Reader Live Region for Accessibility */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {/* Header & Typography Section */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="space-y-1.5"></div>

        {/* Live Controls & HUD Cards */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            {gameActive && (
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="p-2 sm:p-2.5 rounded-xl bg-[#20130b] border border-[#d4af37]/30 text-[#f5d77f] hover:bg-[#2e1d12] transition-colors"
                aria-label={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? (
                  <Play className="w-4 h-4 text-green-400" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Time Metric Card */}
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border transition-all ${
              isLowTime
                ? "bg-[#2f1010] border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.35)]"
                : "bg-[#20130b] border-[#d4af37]/40 shadow-md"
            }`}
            role="timer"
            aria-live="polite"
          >
            <Timer
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isLowTime ? "text-red-400 animate-bounce" : "text-[#fce588]"
              }`}
            />
            <div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#b39b88]">
                TIME
              </div>
              <div
                className={`font-mono text-lg sm:text-xl md:text-2xl font-bold tabular-nums leading-none ${
                  isLowTime ? "text-red-400" : "text-[#fdf8f0]"
                }`}
              >
                {timeLeft.toFixed(1)}s
              </div>
            </div>
          </div>

          {/* Score Metric Card */}
          <div
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#20130b] border border-[#d4af37]/40 shadow-md"
            role="status"
            aria-label={`Current Score: ${score}`}
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#fce588]" />
            <div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#b39b88]">
                SCORE
              </div>
              <div className="font-mono text-lg sm:text-xl md:text-2xl font-bold text-[#fce588] tabular-nums leading-none">
                {score}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Combo Streak Indicator */}
      {gameActive && combo > 1 && (
        <div
          className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-lg text-xs text-[#fce588] animate-pulse"
          role="status"
        >
          <div className="flex items-center gap-1.5 font-bold">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{combo}x Combo Streak!</span>
          </div>
          <span className="font-mono text-[11px] text-[#f7e4a8]">
            {combo > 4 ? "Bonus +250 points unlocked" : "Keep catching!"}
          </span>
        </div>
      )}

      {/* Primary Interactive Game Arena */}
      <div className="relative w-full h-[58vh] min-h-95 max-h-145 sm:h-125 md:h-135 rounded-2xl overflow-hidden">
        {/* Subtle Background Pattern */}
        <div
          className="absolute inset-0 opacity-15  bg-size-[20px_20px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Ambient Top Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-36 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Paused Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-25 flex flex-col items-center justify-center p-6 bg-[#120b07]/90 backdrop-blur-md text-center">
            <h2 className="font-serif text-3xl font-bold text-[#fdf8f0]">
              Game Paused
            </h2>
            <p className="text-sm text-[#d5c3b2] mt-2 mb-6">
              Your time and score are preserved.
            </p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-8 py-3 rounded-full bg-linear-to-r from-[#fce588] to-[#d4af37] text-[#1a0f07] text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <Play className="w-4 h-4" />
              <span>Resume Challenge</span>
            </button>
          </div>
        )}

        {/* Start Overlay: High Contrast Glass Dialog */}
        {/* Start Overlay: High Contrast Glass Dialog */}
        {!gameActive && !gameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4 sm:p-6 ">
            {/* Monogram Seal */}

            <h2 className="font-serif text-[clamp(2rem,5.5vw,3.4rem)] font-bold gold-gradient-text tracking-wide mb-4">
              Catch The Edit!
            </h2>

            <p className="text-xs sm:text-sm  text-[#f2ead9] mt-2 sm:mt-3 leading-relaxed max-w-md mx-auto mb-3">
              Tap or click falling luxury The Indian Edit bottles (
              <span className="text-[#fce588] font-bold">+100</span>) and
              heritage tokens (
              <span className="text-[#4ade80] font-bold">+150</span>). Avoid
              plastic waste (
              <span className="text-[#f87171] font-bold">-75</span>) and generic
              colas (<span className="text-[#f87171] font-bold">-50</span>)!
            </p>

            {/* Accessible Legend Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5 p-2.5 sm:p-3 rounded-xl bg-[#25160d] border border-[#d4af37]/25 text-left w-full max-w-md mb-4">
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#1a0f08]/80 border border-[#d4af37]/20">
                <img
                  src={getItemIcon("tie_bottle")}
                  alt=""
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                />
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#fce588]">
                    Bottles
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-[#fce588]/80 font-mono font-bold">
                    +100 pts
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#1a0f08]/80 border border-green-500/20">
                <img
                  src={getItemIcon("heritage_token")}
                  alt=""
                  className="w-10 h-16 sm:w-8 sm:h-8 object-contain shrink-0"
                />
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#4ade80]">
                    Heritage
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-green-300/80 font-mono font-bold">
                    +150 pts
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#1a0f08]/80 border border-red-500/20">
                <img
                  src={getItemIcon("waste")}
                  alt=""
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                />
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#f87171]">
                    Waste
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-red-300/80 font-mono font-bold">
                    -75 pts
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-5 sm:mt-6 flex flex-col items-center gap-2">
              <button
                onClick={startGame}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-linear-to-r from-[#fce588] via-[#d4af37] to-[#b68b20] text-[#1a0f07] text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 group cursor-pointer shadow-lg active:scale-95 transition-transform"
                aria-label="Start 10 Second Rush Challenge"
              >
                <span className="font-serif tracking-wider uppercase">
                  Start Rush
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Falling Interactive Elements */}
        {gameActive &&
          items.map((item) => {
            if (item.collected) {
              return (
                <div
                  key={`burst-${item.id}`}
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg font-bold font-mono animate-ping z-15"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    color: item.points > 0 ? "#fce588" : "#f87171",
                    textShadow: "0 0 10px rgba(0,0,0,0.8)",
                  }}
                  aria-hidden="true"
                >
                  {item.burstText}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleCollect(item)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleCollect(item);
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 active:scale-95 transition-transform focus:outline-none flex items-center justify-center z-10 touch-manipulation"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  // Large accessible hit area for fingers (minimum 56px - 76px)
                  width: `${Math.max(56, item.size + 24)}px`,
                  height: `${Math.max(56, item.size + 24)}px`,
                }}
                aria-label={`${item.type.replace("_", " ")} item worth ${item.points} points`}
              >
                <img
                  src={item.icon}
                  alt=""
                  style={{ width: `${item.size}px`, height: `${item.size}px` }}
                  className="object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)] pointer-events-none transition-all"
                  loading="eager"
                  decoding="async"
                />
              </button>
            );
          })}

        {/* Game Over / Results Modal */}
        {gameOver && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            <span className="text-[11px] sm:text-lg font-bold tracking-widest text-[#d4af37] uppercase mb-3">
              Challenge Complete
            </span>

            <h2 className="font-serif text-[clamp(2rem,5.5vw,3.4rem)] font-bold gold-gradient-text  m-3 ">
              Edit Catch Complete!
            </h2>

            <p className="text-md sm:text-md text-[#f2ead9] mt-1">
              You successfully protected the harvest line.
            </p>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-3 my-4 sm:my-5 p-3 sm:p-4 rounded-xl border border-[#d4af37]/35 w-full max-w-md">
              <div className="text-center border-r border-[#3d261a] pr-2">
                <div className="text-[10px] sm:text-[11px] text-[#f2ead9] uppercase font-bold tracking-wider">
                  Bottles Caught
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#fce588] mt-0.5">
                  {bottlesCount}
                </div>
              </div>
              <div className="text-center pl-2">
                <div className="text-[10px] sm:text-[11px] text-[#f2ead9] uppercase font-bold tracking-wider">
                  Total Score
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#fdf8f0] mt-0.5">
                  {score}{" "}
                  <span className="text-xs font-normal text-[#d4af37]">
                    pts
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 mt-4">
              <button
                onClick={startGame}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-linear-to-r from-[#fce588] via-[#d4af37] to-[#b68b20] text-[#1a0f07] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 group cursor-pointer shadow-lg active:scale-95 transition-transform"
                aria-label="Try challenge again"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                onClick={() => {
                  soundEffect.playSuccess();
                  if (onNextLevel) onNextLevel();
                  else navigateTo("screen-level-2");
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-linear-to-r from-[#fce588] via-[#d4af37] to-[#b68b20] text-[#1a0f07] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 group cursor-pointer shadow-lg active:scale-95 transition-transform"
              >
                <span>Proceed to Level 02</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Guide Drawer */}
      {showGuide && (
        <div
          className="mt-3 p-4 rounded-xl bg-[#1b1009] border border-[#d4af37]/40 text-xs sm:text-sm text-[#d5c3b2] space-y-2 animate-fade-in"
          role="region"
          aria-label="Scoring Instructions"
        >
          <div className="flex items-center justify-between font-serif font-bold text-[#fce588] text-sm">
            <span>Guide & Scoring Matrix</span>
            <button
              onClick={() => setShowGuide(false)}
              className="text-xs text-[#a68c78] hover:text-[#fdf8f0] px-2 py-0.5 rounded border border-[#d4af37]/20"
            >
              Close
            </button>
          </div>
          <p>
            During the 10-second arcade harvest rush, tap items before they
            touch the bottom:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="p-2 rounded bg-[#25160d] border border-[#d4af37]/20">
              <strong className="text-[#fce588] block">Signature Bottle</strong>
              <span>+100 pts & bottle tally</span>
            </div>
            <div className="p-2 rounded bg-[#25160d] border border-green-500/20">
              <strong className="text-[#4ade80] block">Heritage Seal</strong>
              <span>+150 pts rare bonus</span>
            </div>
            <div className="p-2 rounded bg-[#25160d] border border-amber-500/20">
              <strong className="text-amber-300 block">Artisan Leaf</strong>
              <span>+80 pts botanic extract</span>
            </div>
            <div className="p-2 rounded bg-[#25160d] border border-red-500/20">
              <strong className="text-red-400 block">Waste & Cola</strong>
              <span>-50 to -75 pts penalty</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level1BottleRush;
