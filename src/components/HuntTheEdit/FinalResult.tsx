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
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 sm:py-12 text-center animate-fade-in overflow-hidden">
      <ParticleEffect count={36} />

      {/* Royal Garland Badge */}
      <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c0e07] border border-[#d4af37] text-xs font-semibold tracking-[0.25em] text-[#f7e7a9] uppercase mb-4 shadow-[0_0_25px_rgba(212,175,55,0.3)]">
        <Award className="w-4 h-4 text-[#d4af37]" />
        <span>HUNT THE EDIT CONQUERED</span>
      </div>

      {/* Headline */}
      <div className="relative z-10 max-w-2xl mx-auto mb-6">
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.14em] text-[#faf5eb] uppercase leading-tight">
          YOU'RE AN <br />
          <span className="gold-gradient-text drop-shadow-[0_4px_24px_rgba(212,175,55,0.5)]">
            EDIT MASTER
          </span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#ebd9c0] font-light max-w-lg mx-auto">
          Every hidden bottle has been unveiled through your keen eye and
          connoisseur instincts.
        </p>
      </div>

      {/* Bottle Reveal Visual with Golden Ambient Halo */}
      <div className="relative z-10 my-4 sm:my-6 group flex justify-center">
        <div className="relative p-3 rounded-2xl bg-linear-to-b from-[#231208]/90 via-[#140804]/95 to-[#070302] border border-[#d4af37]/60 shadow-[0_25px_60px_rgba(212,175,55,0.25)]">
          {/* Subtle Sunburst / Light Rays behind bottle */}
          <div className="absolute inset-0 rounded-2xl bg-radial from-[#d4af37]/20 via-[#d4af37]/5 to-transparent blur-2xl pointer-events-none" />

          <img
            src="/assets/indian-edit-hero.jpg"
            alt="The Indian Edit Trophy Bottle"
            className="h-52 sm:h-64 md:h-72 w-auto object-contain rounded-xl filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
            referrerPolicy="no-referrer"
          />

          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#170c07] border border-[#d4af37] text-xs font-mono font-bold tracking-widest text-[#f7e7a9] uppercase whitespace-nowrap shadow-lg">
            EDIT MASTER TROPHY
          </div>
        </div>
      </div>

      {/* Actual Calculated Stats Grid */}
      <div className="relative z-10 my-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mx-auto">
        {/* Bottles */}
        <div className="p-4 rounded-2xl bg-[#140a05]/90 border border-[#d4af37]/35 shadow-lg">
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
        <button
          type="button"
          id="btn-open-share-card"
          onClick={() => {
            sound.playClick();
            onOpenShare();
          }}
          className="w-full py-4 px-6 rounded-xl bg-linear-to-r from-[#d4af37] via-[#f7e7a9] to-[#d4af37] text-[#070403] font-bold text-sm sm:text-base tracking-[0.2em] uppercase cursor-pointer shadow-[0_10px_35px_rgba(212,175,55,0.45)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.65)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4 text-[#070403]" />
          <span>SHARE YOUR SCORE</span>
        </button>

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
            <ArrowRight className="w-4 h-4 text-[#d4af37]" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onRestart();
          }}
          className="w-full py-3 px-4 text-xs font-mono tracking-widest text-[#ab9580] hover:text-[#faf5eb] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
