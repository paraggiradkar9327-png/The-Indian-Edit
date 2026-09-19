import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { REWARD_GIFTS } from '../../data/rewards';
import { Gift, Copy, Check, Sparkles, Trophy, CheckCircle2, RotateCcw, Share2 } from 'lucide-react';
import { sound } from '../../utils/audio';

export const ScratchCardScreen: React.FC = () => {
  const { state, setScratchRevealed, claimReward, navigateTo } = useGame();

  const [revealed, setRevealed] = useState(state.scratchRevealed);
  const [scratchedPct, setScratchedPct] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [claimed, setClaimed] = useState(state.rewardClaimed);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const gift = state.selectedGift || REWARD_GIFTS[0];
  const voucherCode = `EDIT-NGP-${(state.userPhone || '7892').slice(-4)}-ROYAL`;

  // Initialize Scratch Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Rich metallic gold gradient
    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, '#f5d77f');
    goldGrad.addColorStop(0.3, '#d4af37');
    goldGrad.addColorStop(0.6, '#b89126');
    goldGrad.addColorStop(0.8, '#f5d77f');
    goldGrad.addColorStop(1, '#aa8222');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, w, h);

    // Embossed decorative border
    ctx.strokeStyle = '#fff1b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Gold Jaali Pattern dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let x = 20; x < w - 20; x += 20) {
      for (let y = 20; y < h - 20; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Scratch instruction text
    ctx.font = 'bold 15px Montserrat, sans-serif';
    ctx.fillStyle = '#170f0a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH WITH FINGER OR CURSOR ✨', w / 2, h / 2 - 10);

    ctx.font = 'bold 11px Montserrat, sans-serif';
    ctx.fillStyle = '#3d261a';
    ctx.fillText('TO REVEAL YOUR PRIVILEGE REWARD', w / 2, h / 2 + 15);

  }, [revealed]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratched percentage roughly every few scratches
    if (Math.random() < 0.3) {
      sound.playClick();
      checkScratchPercentage();
    }
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const pct = Math.round((transparentCount / (totalPixels / 4)) * 100);
    setScratchedPct(pct);

    if (pct >= 40 && !revealed) {
      setRevealed(true);
      setScratchRevealed(true);
      sound.playSuccess();
    }
  };

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

      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#faf6f0]">
        Gold Foil Scratch Card
      </h2>

      <p className="text-xs text-[#a69383] mt-1 max-w-sm mx-auto">
        Rub the metallic foil surface to reveal your limited-edition privilege code.
      </p>

      {/* Scratch Container Card */}
      <div className="mt-6 gold-card p-6 relative overflow-hidden max-w-md mx-auto">
        
        {/* Prize Box Beneath */}
        <div className="w-full aspect-[16/10] rounded-xl bg-gradient-to-b from-[#2e1a10] to-[#1a0e07] border border-[#d4af37]/50 p-5 flex flex-col items-center justify-center text-center select-none shadow-inner relative">
          
          <div className="w-14 h-14 rounded-full bg-[#170f0a] border-2 border-[#d4af37] flex items-center justify-center text-3xl mb-2 shadow">
            {gift.icon || '🎁'}
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

          {/* Voucher Code Box */}
          <div className="mt-3 px-4 py-1.5 rounded-lg bg-[#170f0a] border border-[#d4af37]/50 font-mono text-xs font-bold text-[#fff1b8] tracking-wider shadow">
            {voucherCode}
          </div>

          {/* Scratched Canvas Overlay */}
          {!revealed && (
            <canvas
              ref={canvasRef}
              width={400}
              height={250}
              onMouseDown={() => (isDrawing.current = true)}
              onMouseUp={() => (isDrawing.current = false)}
              onMouseMove={(e) => {
                if (isDrawing.current) scratch(e.clientX, e.clientY);
              }}
              onTouchStart={() => (isDrawing.current = true)}
              onTouchEnd={() => (isDrawing.current = false)}
              onTouchMove={(e) => {
                if (isDrawing.current && e.touches[0]) {
                  scratch(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              className="absolute inset-0 w-full h-full rounded-xl cursor-crosshair touch-none select-none"
            />
          )}
        </div>

        {/* Quick reveal helper if user prefers instant click */}
        {!revealed && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[#a69383]">
              Scratched: <strong className="text-[#f5d77f]">{scratchedPct}%</strong>
            </span>
            <button
              onClick={() => {
                setRevealed(true);
                setScratchRevealed(true);
                sound.playSuccess();
              }}
              className="text-[#d4af37] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Reveal</span>
            </button>
          </div>
        )}

        {/* Claim & Copy Actions after reveal */}
        {revealed && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 rounded-full border border-[#d4af37]/40 bg-[#22160f] text-xs font-bold text-[#f5d77f] hover:bg-[#2e1e15] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#d4af37]" />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
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
              <div className="p-3 rounded-xl bg-[#170f0a] border border-[#3d261a] text-xs text-[#warm-beige]">
                Confirmation SMS sent to <strong>+91 {state.userPhone || '98765 43210'}</strong>. Present this code at designated Zero Mile tasting lounges and retail partners.
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => navigateTo('screen-welcome')}
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
