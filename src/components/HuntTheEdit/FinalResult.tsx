import React, { useEffect } from "react";
import {
  Trophy,
  Share2,
  RotateCcw,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ParticleEffect } from "./ParticleEffect";
import { sound } from "../../utils/audio";

interface FinalResultProps {
  bottlesFound: number;
  totalBottles?: number;
  totalScore: number;
  bestTime: number;
  onOpenShare: () => void;
  onRestart: () => void;
  onContinueToGrandFinale?: () => void;
}

export const FinalResult: React.FC<FinalResultProps> = ({
  bottlesFound,
  totalBottles = 15,
  totalScore,
  bestTime,
  onOpenShare,
  onRestart,
  onContinueToGrandFinale,
}) => {
  useEffect(() => {
    sound.playCelebration();
  }, []);

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4  sm:py-12 text-center animate-fade-in overflow-hidden">
      <ParticleEffect count={36} />

      {/* Headline */}
      <div className="relative z-10 max-w-2xl mx-auto mb-6">
        <h1 className="font-serif text-3xl sm:text-5xl md:text-5xl font-bold tracking-[0.14em] text-[#faf5eb] uppercase leading-tight">
          YOU'RE AN <br />
          <span className="gold-gradient-text drop-shadow-[0_4px_24px_rgba(212,175,55,0.5)]">
            EDIT MASTER
          </span>
        </h1>
      </div>

      {/* Bottle Reveal Visual with Golden Ambient Halo */}
      <div className="relative z-10 my-4 sm:my-6 group flex justify-center">
        <img
          src="src\assets\images\NewBottle.png"
          alt="The Indian Edit Trophy Bottle"
          className="h-58 sm:h-64 md:h-90 w-auto object-contain rounded-xl filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Actual Calculated Stats Grid */}
      <div className="relative z-10 my-3 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mx-auto">
        {/* Bottles */}
        <div className="p-3 rounded-2xl bg-[#140a05]/90 border border-[#d4af37]/35 shadow-lg">
          <span className="text-[10px] font-mono tracking-widest text-[#ab9580] uppercase block">
            BOTTLES FOUND
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-[#faf5eb] mt-1 block">
            {bottlesFound} / {totalBottles}
          </span>
          <span className="text-[11px] text-[#d4af37] inline-flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-[#d4af37]" /> Complete Hunt
          </span>
        </div>

        {/* Best Time */}
        <div className="p-4 rounded-2xl bg-[#140a05]/90 border border-[#d4af37]/35 shadow-lg">
          <span className="text-[10px] font-mono tracking-widest text-[#ab9580] uppercase block">
            FASTEST ROUND TIME
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-[#f7e7a9] mt-1 block">
            {bestTime > 0 ? `${bestTime.toFixed(1)}s` : "--"}
          </span>
          <span className="text-[11px] text-[#ab9580] block mt-0.5">
            Master Speed
          </span>
        </div>

        {/* Total Score */}
        <div className="p-4 rounded-2xl bg-[#140a05]/90 border border-[#d4af37]/35 shadow-lg">
          <span className="text-[10px] font-mono tracking-widest text-[#ab9580] uppercase block">
            EDIT SCORE
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-[#d4af37] mt-1 block">
            {totalScore.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#f7e7a9] block mt-0.5">
            Leaderboard Ready
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md mx-auto">
        {onContinueToGrandFinale && (
          <button
            type="button"
            id="btn-continue-finale"
            onClick={() => {
              sound.playClick();
              onContinueToGrandFinale();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-[#170c07] border border-[#d4af37]/60 text-[#faf5eb] hover:text-[#fff3c4] hover:border-[#d4af37] text-xs sm:text-sm font-bold tracking-[0.16em] uppercase cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>CLAIM REWARD & CERTIFICATE</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onRestart();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-[#170c07] border border-[#d4af37]/60 text-[#faf5eb] hover:text-[#fff3c4] hover:border-[#d4af37] text-xs sm:text-sm font-bold tracking-[0.16em] uppercase cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
