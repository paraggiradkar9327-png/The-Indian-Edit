import React from 'react';
import { Timer as TimerIcon, RotateCcw } from 'lucide-react';
import { SoundToggle } from './SoundToggle';

interface GameHeaderProps {
  roundNumber: number;
  roundTitle: string;
  timeRemaining: number;
  score: number;
  soundMuted: boolean;
  onToggleSound: () => void;
  onOpenRestart: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  roundNumber,
  roundTitle,
  timeRemaining,
  score,
  soundMuted,
  onToggleSound,
  onOpenRestart
}) => {
  // Format MM:SS
  const formatTime = (secs: number) => {
    const safe = Math.max(0, Math.floor(secs));
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeRemaining <= 10;
  const isCritical = timeRemaining <= 5;

  return (
    <header className="w-full bg-[#0a0503]/95 backdrop-blur-md border-b border-[#d4af37]/25 px-3 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-30 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identifier */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-[#d4af37]/50 bg-[#170c07] flex items-center justify-center p-1">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-[#d4af37]">
                <path d="M19 13c.6 0 1-.4 1-1V8.5C20 5.5 17.5 3 14.5 3c-1.8 0-3.4 1-4.2 2.5C9.5 5.2 8.7 5 8 5 5.8 5 4 6.8 4 9v6h2v-3.5c0-.8.7-1.5 1.5-1.5h1.5v5h2v-5h2.5c.8 0 1.5.7 1.5 1.5V17h2v-4h2z" />
              </svg>
            </div>
            <span className="font-serif tracking-[0.2em] text-xs sm:text-sm font-bold text-[#faf5eb] uppercase">
              THE INDIAN EDIT
            </span>
          </div>

          {/* Quick controls on mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <SoundToggle muted={soundMuted} onToggle={onToggleSound} />
            <button
              type="button"
              onClick={onOpenRestart}
              className="p-2 rounded-full border border-[#ab9580]/30 bg-[#140a05] text-[#ab9580] hover:text-[#faf5eb] hover:border-[#ab9580]/60 transition-all cursor-pointer"
              title="Restart Hunt"
              aria-label="Restart Hunt"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Round info */}
        <div className="flex items-center gap-2 text-center">
          <span className="px-2 py-0.5 rounded bg-[#170c07] border border-[#d4af37]/35 text-[10px] font-mono tracking-widest text-[#f7e7a9] uppercase font-bold">
            ROUND {roundNumber}
          </span>
          <span className="text-[#937119] hidden sm:inline">•</span>
          <h2 className="font-serif text-xs sm:text-sm font-bold tracking-wider text-[#ebd9c0] uppercase">
            {roundTitle}
          </h2>
        </div>

        {/* Right: Timer & Real-time Score & Controls */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          {/* Timer Display */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all duration-300 ${
              isCritical
                ? 'bg-[#8b151b]/30 border-[#e53e3e] text-[#feb2b2] animate-pulse shadow-[0_0_15px_rgba(229,62,62,0.4)]'
                : isUrgent
                ? 'bg-[#e58325]/20 border-[#e58325]/70 text-[#fbd38d]'
                : 'bg-[#140a05] border-[#d4af37]/40 text-[#f7e7a9]'
            }`}
          >
            <TimerIcon
              className={`w-4 h-4 ${
                isCritical ? 'text-[#e53e3e] animate-bounce' : isUrgent ? 'text-[#e58325]' : 'text-[#d4af37]'
              }`}
            />
            <span className="font-mono text-sm sm:text-base font-bold tracking-widest">
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#140a05] border border-[#d4af37]/40">
            <span className="text-[10px] font-mono tracking-widest text-[#ab9580] uppercase">
              SCORE
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-[#faf5eb]">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Desktop controls */}
          <div className="hidden sm:flex items-center gap-2">
            <SoundToggle muted={soundMuted} onToggle={onToggleSound} />
            <button
              type="button"
              onClick={onOpenRestart}
              className="p-2 rounded-full border border-[#ab9580]/30 bg-[#140a05] text-[#ab9580] hover:text-[#faf5eb] hover:border-[#ab9580]/60 transition-all cursor-pointer"
              title="Restart Hunt"
              aria-label="Restart Hunt"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
