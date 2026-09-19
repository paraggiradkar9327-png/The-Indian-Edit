import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { ScreenId } from "../types";
import {
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  ChevronDown,
  Trophy,
  KeyRound,
} from "lucide-react";

interface HeaderProps {
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onShowIntroSplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLeaderboard,
  onOpenSettings,
  onShowIntroSplash,
}) => {
  const { state, navigateTo, toggleSound, resetGame, loadDemoState } =
    useGame();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Compute label for level badge
  const getLevelBadgeText = (screen: ScreenId) => {
    switch (screen) {
      case "screen-login":
        return "LOGIN";
      case "screen-otp":
        return "VERIFY";
      case "screen-welcome":
        return "PROLOGUE";
      case "screen-level-1":
        return "LEVEL 01 / 05";
      case "screen-level-2":
        return "LEVEL 02 / 05";
      case "screen-level-3":
        return "LEVEL 03 / 05";
      case "screen-level-4":
        return "LEVEL 04 / 05";
      case "screen-level-5":
        return "LEVEL 05 / 05";
      case "screen-result":
        return "ARCHETYPE REVEAL";
      case "screen-social":
        return "SOCIAL POST";
      case "screen-upload":
        return "VERIFICATION";
      case "screen-scratch":
        return "ROYAL REWARD";
      default:
        return "EXPERIENCE";
    }
  };

  const navItems: { id: ScreenId; label: string; step: string }[] = [
    { id: "screen-login", label: "VIP Registration", step: "00" },
    { id: "screen-welcome", label: "Prologue & Story", step: "00" },
    { id: "screen-level-1", label: "Harvest Rush (10s)", step: "01" },
    { id: "screen-level-2", label: "Zero Mile Center", step: "02" },
    { id: "screen-level-3", label: "Decode The Bottle", step: "03" },
    { id: "screen-level-4", label: "Master The Blend", step: "04" },
    {
      id: "screen-level-5",
      label: "Hunt The Edit (Hidden Objects)",
      step: "05",
    },
    { id: "screen-result", label: "Master Score & Archetype", step: "⭐" },
    { id: "screen-social", label: "1080p Social Post", step: "📸" },
    { id: "screen-upload", label: "Share Verification", step: "🎁" },
    { id: "screen-scratch", label: "Gold Scratch Reward", step: "🏆" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070403]/85 backdrop-blur-md border-b border-[#d4af37]/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Crest & Title */}
        <button
          onClick={() => navigateTo("screen-welcome")}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          title="Return to Experience Home"
        >
          <div className="w-11 h-11 rounded-full border border-[#d4af37]/70 bg-[#1a0c06] flex items-center justify-center p-2 shadow-[0_0_18px_rgba(212,175,55,0.25)] group-hover:border-[#d4af37] group-hover:scale-105 transition-all">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-[#d4af37]">
              <path d="M19 13c.6 0 1-.4 1-1V8.5C20 5.5 17.5 3 14.5 3c-1.8 0-3.4 1-4.2 2.5C9.5 5.2 8.7 5 8 5 5.8 5 4 6.8 4 9v6h2v-3.5c0-.8.7-1.5 1.5-1.5h1.5v5h2v-5h2.5c.8 0 1.5.7 1.5 1.5V17h2v-4h2z" />
            </svg>
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold tracking-[0.18em] text-[#faf5eb] group-hover:text-[#f7e7a9] transition-colors">
              THE INDIAN EDIT
            </span>
            <span className="block text-[10px] sm:text-xs tracking-[0.25em] text-[#d4af37] font-medium uppercase">
              Super Premium Whisky
            </span>
          </div>
        </button>

        {/* Center Live Telemetry */}
        <div className="hidden md:flex items-center gap-4">
          <div className="px-3.5 py-1.5 rounded-full bg-[#1a0c06] border border-[#d4af37]/40 text-xs font-semibold tracking-wider text-[#f7e7a9] shadow-inner">
            {getLevelBadgeText(state.currentScreen)}
          </div>

          <div className="flex items-center bg-[#130a05] border border-[#d4af37]/30 rounded-lg px-3 py-1.5 gap-2">
            <span className="text-[10px] tracking-wider text-[#ab9580] uppercase font-bold">
              SCORE
            </span>
            <span className="font-serif text-lg font-bold text-[#f7e7a9] tabular-nums">
              {(
                state.scoreRush +
                state.scoreZero +
                state.decodeScore +
                state.blendScore +
                (state.huntScore || state.scoreCity || 0)
              ).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Experience Jumper Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3 py-1.5 text-xs font-medium tracking-wide flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#22160f] hover:bg-[#2e1e15] text-[#f5d77f] hover:border-[#d4af37] transition-colors shadow-sm"
              title="Quick Jump to any Experience or Level"
            >
              <span className="hidden sm:inline">Levels</span>
              <span className="sm:hidden text-xs">Jump</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 max-h-[75vh] overflow-y-auto rounded-xl bg-[#22160f] border border-[#d4af37]/40 shadow-2xl p-2 z-50 divide-y divide-[#3d261a]"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 text-[10px] font-bold tracking-widest text-[#a69383] uppercase">
                  Select Experience Screen
                </div>
                <div className="py-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        state.currentScreen === item.id
                          ? "bg-[#d4af37]/20 text-[#fff1b8] font-semibold border border-[#d4af37]/40"
                          : "text-[#e5d8cb] hover:bg-[#3d261a]/60 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] opacity-70 font-mono">
                        {item.step}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="pt-2 flex items-center justify-between gap-2 px-1">
                  <button
                    onClick={loadDemoState}
                    className="text-[11px] text-[#f5d77f] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Quick Demo
                  </button>
                  <button
                    onClick={resetGame}
                    className="text-[11px] text-[#a69383] hover:text-red-400 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Intro Showcase Replay Button */}
          {onShowIntroSplash && (
            <button
              onClick={onShowIntroSplash}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-[#d4af37]/45 bg-[#1a0c06] text-[#f7e7a9] hover:bg-[#2e160f] hover:border-[#d4af37] transition-all flex items-center gap-1.5 text-xs shadow-sm cursor-pointer"
              title="View The Indian Edit Luxury Bottle Showcase"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline font-medium">Showcase</span>
            </button>
          )}

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-[#d4af37]/35 bg-[#130a05] text-[#f7e7a9] hover:bg-[#1f1008] hover:border-[#d4af37] transition-all flex items-center gap-1.5 text-xs cursor-pointer"
            title="Hall of Fame & Leaderboard"
          >
            <Trophy className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden lg:inline font-medium">Rankings</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full border border-[#d4af37]/35 bg-[#130a05] text-[#f7e7a9] hover:bg-[#1f1008] hover:border-[#d4af37] transition-all cursor-pointer"
            title={state.soundMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label="Toggle Audio"
          >
            {state.soundMuted ? (
              <VolumeX className="w-4 h-4 text-[#ab9580]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#d4af37]" />
            )}
          </button>

          {/* Quick Login Link */}
          {state.currentScreen !== "screen-login" && !state.otpVerified && (
            <button
              onClick={() => navigateTo("screen-login")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a0c06] border border-[#d4af37]/40 text-xs text-[#faf5eb] hover:text-[#f7e7a9] hover:border-[#d4af37] transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Login</span>
            </button>
          )}

          {/* Settings / Demo Mode */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full border border-[#d4af37]/35 bg-[#130a05] text-[#f7e7a9] hover:bg-[#1f1008] hover:border-[#d4af37] transition-all cursor-pointer"
            title="Experience Controls & State Inspector"
          >
            <Sparkles className="w-4 h-4 text-[#e58325]" />
          </button>
        </div>
      </div>
    </header>
  );
};
