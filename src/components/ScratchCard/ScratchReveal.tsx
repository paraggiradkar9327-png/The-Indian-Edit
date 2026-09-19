import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { sound } from "../../utils/audio";

interface ScratchRevealProps {
  /** The content underneath the foil — rendered once, always in the DOM,
   *  the canvas just sits on top of it until scratched away. */
  children: React.ReactNode;
  /** 0–100. Reveal fires once scratched percentage crosses this. */
  threshold?: number;
  /** Called once, the moment the threshold is crossed. */
  onReveal?: () => void;
  /** Controlled reveal state — lets the parent persist "already revealed"
   *  (e.g. from GameContext) instead of this component owning it alone. */
  revealed?: boolean;
  className?: string;
}

/**
 * Generic gold-foil scratch card. Pulled out of ScratchCardScreen.tsx so the
 * scratch *mechanic* (canvas, pointer tracking, percentage math) is reusable
 * and testable on its own, separate from what's underneath it (prize copy,
 * claim button, etc. stay in the screen component).
 */
export const ScratchReveal: React.FC<ScratchRevealProps> = ({
  children,
  threshold = 40,
  onReveal,
  revealed: revealedProp,
  className = "",
}) => {
  const [internalRevealed, setInternalRevealed] = useState(false);
  const revealed = revealedProp ?? internalRevealed;

  const [scratchedPct, setScratchedPct] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawing = useRef(false);
  const lastCheck = useRef(0);

  const fireReveal = useCallback(() => {
    setInternalRevealed(true);
    sound.playSuccess();
    onReveal?.();
  }, [onReveal]);

  // Paint the foil. Re-runs if the canvas gets resized.
  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: w, height: h } = canvas;

    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, "var(--gold-shimmer)");
    goldGrad.addColorStop(0.3, "var(--gold-primary)");
    goldGrad.addColorStop(0.6, "var(--gold-dark)");
    goldGrad.addColorStop(0.8, "var(--gold-shimmer)");
    goldGrad.addColorStop(1, "var(--gold-dark)");
    // Canvas gradients can't resolve CSS vars directly — resolve them from
    // the computed style of the container instead of hard-coding hex here.
    const style = getComputedStyle(containerRef.current || canvas);
    const resolve = (name: string, fallback: string) =>
      style.getPropertyValue(name)?.trim() || fallback;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, resolve("--gold-shimmer", "#fff3c4"));
    grad.addColorStop(0.3, resolve("--gold-primary", "#d4af37"));
    grad.addColorStop(0.6, resolve("--gold-dark", "#937119"));
    grad.addColorStop(0.8, resolve("--gold-shimmer", "#fff3c4"));
    grad.addColorStop(1, resolve("--gold-dark", "#937119"));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = resolve("--gold-light", "#f7e7a9");
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    for (let x = 20; x < w - 20; x += 20) {
      for (let y = 20; y < h - 20; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.font = "bold 15px Montserrat, sans-serif";
    ctx.fillStyle = "#170f0a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH TO REVEAL ✨", w / 2, h / 2 - 10);
    ctx.font = "bold 11px Montserrat, sans-serif";
    ctx.fillStyle = "#3d261a";
    ctx.fillText("YOUR PRIVILEGE REWARD", w / 2, h / 2 + 15);
  }, []);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Match canvas pixel size to its rendered size so scratching lines up
    // with the pointer regardless of the container's actual width.
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      paintFoil();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [revealed, paintFoil]);

  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    let sampled = 0;
    for (let i = 3; i < data.length; i += 16) {
      sampled++;
      if (data[i] === 0) transparent++;
    }
    const pct = sampled ? Math.round((transparent / sampled) * 100) : 0;
    setScratchedPct(pct);
    if (pct >= threshold) fireReveal();
  }, [revealed, threshold, fireReveal]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    const now = performance.now();
    if (now - lastCheck.current > 120) {
      lastCheck.current = now;
      sound.playClick();
      checkScratchPercentage();
    }
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {children}
      {!revealed && (
        <canvas
          ref={canvasRef}
          onMouseDown={() => (isDrawing.current = true)}
          onMouseUp={() => (isDrawing.current = false)}
          onMouseLeave={() => (isDrawing.current = false)}
          onMouseMove={(e) =>
            isDrawing.current && scratchAt(e.clientX, e.clientY)
          }
          onTouchStart={() => (isDrawing.current = true)}
          onTouchEnd={() => (isDrawing.current = false)}
          onTouchMove={(e) => {
            if (isDrawing.current && e.touches[0]) {
              scratchAt(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none rounded-xl"
        />
      )}
      {!revealed && (
        <button
          onClick={fireReveal}
          className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-[#170f0a]/80 px-2.5 py-1 text-[10px] text-(--gold-light) hover:underline"
        >
          <Sparkles className="h-3 w-3" />
          Instant reveal ({scratchedPct}%)
        </button>
      )}
    </div>
  );
};
