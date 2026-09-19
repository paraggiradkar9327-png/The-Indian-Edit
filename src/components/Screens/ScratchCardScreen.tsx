import React, { useState } from "react";
import { useGame } from "../../context/GameContext";
import { REWARD_GIFTS } from "../../data/rewards";
import { Gift, Copy, Check, Trophy, CheckCircle2 } from "lucide-react";
import { sound } from "../../utils/audio";
import { ScratchReveal } from "../ScratchCard/ScratchReveal";

export const ScratchCardScreen: React.FC = () => {
  const { state, setScratchRevealed, claimReward, navigateTo } = useGame();

  const [copiedCode, setCopiedCode] = useState(false);
  const [claimed, setClaimed] = useState(state.rewardClaimed);

  const gift = state.selectedGift || REWARD_GIFTS[0];

  // NOTE (PRD D5): this is still a placeholder code derived client-side from
  // the phone number, which is guessable and not single-use. Once the
  // backend exists, replace this with a code the server issued and stored
  // against this player at reward time — this component should just display
  // whatever `state.rewardCode` the server returned, not compute one.
  const voucherCode = `EDIT-NGP-${(state.userPhone || "7892").slice(-4)}-ROYAL`;

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopiedCode(true);
    sound.playClick();
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleClaim = () => {
    sound.playSuccess();
    setClaimed(true);
    claimReward();
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6 animate-fade-in text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2e1e15] border border-[#d4af37]/40 text-xs text-[#f5d77f] mb-3">
        <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
        <span>GRAND FINALE PRIVILEGE</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl font-bold gold-gradient-text">
        Gold Foil Scratch Card
      </h2>

      <p className="text-xs text-[#faf6f0] mt-1 max-w-sm mx-auto">
        Rub the metallic foil surface to reveal your limited-edition privilege
        code.
      </p>

      <div className="mt-6 gold-card p-6 relative overflow-hidden max-w-md mx-auto">
        <ScratchReveal
          revealed={state.scratchRevealed}
          onReveal={() => setScratchRevealed(true)}
          className="w-full aspect-16/10 rounded-xl"
        >
          <div className="w-full h-full rounded-xl bg-linear-to-b from-[#2e1a10] to-[#1a0e07] border border-[#d4af37]/50 p-5 flex flex-col items-center justify-center text-center shadow-inner">
            <div className="w-14 h-14 rounded-full bg-[#170f0a] border-2 border-[#d4af37] flex items-center justify-center text-3xl mb-2 shadow">
              {gift.icon || "🎁"}
            </div>

            <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase font-bold">
              OFFICIAL PRIVILEGE
            </span>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fff1b8] mt-0.5">
              {gift.name}
            </h3>

            <p className="text-xs text-[#f5d77f] mt-1 font-semibold">
              Value: {gift.value}
            </p>

            <p className="text-[11px] text-[#a69383] max-w-xs mt-1">
              {gift.description}
            </p>

            <div className="mt-3 px-4 py-1.5 rounded-lg bg-[#170f0a] border border-[#d4af37]/50 font-mono text-xs font-bold text-[#fff1b8] tracking-wider shadow">
              {voucherCode}
            </div>
          </div>
        </ScratchReveal>

        {state.scratchRevealed && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 rounded-full border border-[#d4af37]/40 bg-[#22160f] text-xs font-bold text-[#f5d77f] hover:bg-[#2e1e15] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-[#d4af37]" />
                )}
                <span>{copiedCode ? "Code Copied!" : "Copy Code"}</span>
              </button>

              {!claimed ? (
                <button
                  onClick={handleClaim}
                  className="flex-1 py-2.5 btn-gold text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Claim Privilege</span>
                </button>
              ) : (
                <div className="flex-1 py-2.5 rounded-full bg-green-950/60 border border-green-500/50 text-xs font-bold text-green-300 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Privilege Claimed!</span>
                </div>
              )}
            </div>

            {claimed && (
              <div className="p-3 rounded-xl bg-[#170f0a] border border-[#3d261a] text-xs text-(--warm-beige)">
                Confirmation SMS sent to{" "}
                <strong>+91 {state.userPhone || "98765 43210"}</strong>. Present
                this code at designated Zero Mile tasting lounges and retail
                partners.
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => navigateTo("screen-welcome")}
                className="text-xs text-[#a69383] hover:text-[#f5d77f] hover:underline"
              >
                Return to Experience Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
