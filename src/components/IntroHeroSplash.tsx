import React from "react";
import { ArrowRight, X } from "lucide-react";
import { sound } from "../utils/audio";

interface IntroHeroSplashProps {
  onEnter: () => void;
}

export const IntroHeroSplash: React.FC<IntroHeroSplashProps> = ({
  onEnter,
}) => {
  const handleStart = () => {
    sound.playSuccess();
    onEnter();
  };

  return (
    <div
      id="intro-hero-splash"
      className="fixed inset-0 z-50 overflow-hidden bg-[#070403] animate-fade-in"
    >
      {/* Full-screen image, never cropped */}
      <picture>
        <source
          media="(orientation: portrait)"
          srcSet="src/assets/images/NewCreative-portrait.png"
        />
        <img
          src="src/assets/images/NewCreative.png"
          alt="The Indian Edit Super Premium Whisky"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </picture>

      {/* Gradient overlays for readability of top bar & CTA */}
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Top Bar with Brand Identifier & Quick Skip */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-[#d4af37]/60 bg-[#1a0c06] flex items-center justify-center p-1.5 shadow-md">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-[#d4af37]">
              <path d="M19 13c.6 0 1-.4 1-1V8.5C20 5.5 17.5 3 14.5 3c-1.8 0-3.4 1-4.2 2.5C9.5 5.2 8.7 5 8 5 5.8 5 4 6.8 4 9v6h2v-3.5c0-.8.7-1.5 1.5-1.5h1.5v5h2v-5h2.5c.8 0 1.5.7 1.5 1.5V17h2v-4h2z" />
            </svg>
          </div>
          <span className="font-serif tracking-[0.2em] text-sm sm:text-base font-bold text-[#faf5eb] uppercase drop-shadow-md">
            THE INDIAN EDIT
          </span>
        </div>

        <button
          id="btn-skip-intro"
          onClick={handleStart}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1a0c06]/80 hover:bg-[#2d160b] border border-[#d4af37]/40 text-xs text-[#f7e7a9] hover:text-[#fff3c4] hover:border-[#d4af37] transition-all cursor-pointer shadow-md backdrop-blur-sm"
          title="Direct to Experience"
        >
          <span>Skip to Experience</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom CTA Action Bar */}
      <div className="absolute bottom-0 inset-x-0 flex flex-col items-center px-4 pb-6 sm:pb-8 pt-4 z-10">
        <button
          id="btn-enter-experience"
          onClick={handleStart}
          className="w-full sm:w-auto px-10 py-3.5 btn-gold text-sm sm:text-base font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-3 cursor-pointer shadow-[0_8px_30px_rgba(212,175,55,0.45)] hover:shadow-[0_10px_40px_rgba(212,175,55,0.65)] transform hover:-translate-y-0.5 transition-all"
        >
          <span>ENTER THE EXPERIENCE</span>
          <ArrowRight className="w-5 h-5 text-[#070403]" />
        </button>

        <p className="mt-2 text-[11px] font-mono text-[#ab9580] tracking-widest uppercase drop-shadow-md">
          SUPER PREMIUM WHISKY • CRAFTED IN INDIA
        </p>
      </div>
    </div>
  );
};
