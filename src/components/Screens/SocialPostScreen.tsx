import React, { useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Download, Copy, Check, ArrowRight, Share2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { sound } from '../../utils/audio';

export const SocialPostScreen: React.FC = () => {
  const { state, navigateTo } = useGame();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const personalityName = state.personality?.name || 'THE LUXURY EDITOR';
  const totalScore = state.totalScore > 0 ? state.totalScore : (state.scoreRush + state.scoreZero + state.decodeScore + state.blendScore + state.scoreCity);

  const captionText = `Just discovered my Nagpur Brand Archetype with The Indian Edit: ${personalityName} (Score: ${totalScore.toLocaleString()})! 🍊✨\n\nRooted in heritage. Designed for tomorrow.\nZero Mile Center of India.\n\n#TheIndianEdit #NagpurEdit #ZeroMile #LuxuryHeritage #IndianMalt`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCard = () => {
    sound.playSuccess();
    // Render a high resolution 1080x1080 canvas for real image download
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Luxury Gradient
    const bg = ctx.createLinearGradient(0, 0, 1080, 1080);
    bg.addColorStop(0, '#1c1008');
    bg.addColorStop(0.5, '#2e180d');
    bg.addColorStop(1, '#140c06');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1080);

    // Gold Double Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1000, 1000);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(55, 55, 970, 970);

    // Corner Ornaments
    const corners = [
      [65, 65],
      [1015, 65],
      [65, 1015],
      [1015, 1015]
    ];
    ctx.fillStyle = '#d4af37';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top Header: THE INDIAN EDIT
    ctx.font = 'bold 36px Montserrat, sans-serif';
    ctx.fillStyle = '#faf6f0';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '10px';
    ctx.fillText('THE INDIAN EDIT', 540, 140);

    ctx.font = 'bold 18px Montserrat, sans-serif';
    ctx.fillStyle = '#d4af37';
    ctx.letterSpacing = '6px';
    ctx.fillText('NAGPUR BRAND EXPERIENCE • ZERO MILE', 540, 180);

    // Player Name & City
    ctx.font = '24px Montserrat, sans-serif';
    ctx.fillStyle = '#warm-beige';
    ctx.fillText(`${state.userName || 'VIP Guest'} • ${state.userCity || 'Nagpur'}`, 540, 240);

    // Archetype Title
    ctx.font = 'bold 56px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#fff1b8';
    ctx.fillText(personalityName, 540, 460);

    // Tagline
    ctx.font = 'italic 26px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#f5d77f';
    ctx.fillText(`"${state.personality?.tagline || 'Rooted in Heritage. Designed for Tomorrow.'}"`, 540, 520);

    // Score Circle
    ctx.beginPath();
    ctx.arc(540, 680, 90, 0, Math.PI * 2);
    ctx.fillStyle = '#22160f';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = 'bold 16px Montserrat, sans-serif';
    ctx.fillStyle = '#a69383';
    ctx.fillText('TOTAL SCORE', 540, 650);

    ctx.font = 'bold 48px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#fff1b8';
    ctx.fillText(totalScore.toLocaleString(), 540, 705);

    // Coordinates Footer
    ctx.font = '18px monospace';
    ctx.fillStyle = '#d4af37';
    ctx.fillText('21.1458° N, 79.0882° E  •  NAGPUR EPICENTER', 540, 960);

    // Download file
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `The-Indian-Edit-${(state.userName || 'Nagpur').replace(/\s+/g, '-')}-Archetype.png`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2e1e15] border border-[#d4af37]/40 text-xs text-[#f5d77f]">
          <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>1080p SOCIAL EDIT</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#faf6f0] mt-1">
          Share Your Archetype
        </h2>
        <p className="text-xs text-[#a69383] mt-1">
          Download your official square card or copy the caption to post on Instagram, LinkedIn, or Twitter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left: 1080p Square Card Preview */}
        <div className="md:col-span-6 flex justify-center">
          <div 
            ref={cardRef}
            className="w-full max-w-[360px] aspect-square rounded-2xl bg-gradient-to-b from-[#24130a] via-[#331c0e] to-[#1a0e07] border-2 border-[#d4af37] p-6 flex flex-col items-center justify-between text-center relative shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Ornamental Corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />

            {/* Top Brand */}
            <div>
              <span className="block text-[9px] font-mono tracking-[0.3em] text-[#d4af37] uppercase">
                THE INDIAN EDIT
              </span>
              <span className="block text-[8px] text-[#a69383] tracking-widest uppercase">
                NAGPUR EXPERIENCE
              </span>
            </div>

            {/* Center Content */}
            <div className="my-auto space-y-2">
              <div className="w-12 h-12 rounded-full border border-[#d4af37]/60 bg-[#170f0a] flex items-center justify-center mx-auto text-xl shadow">
                🍊
              </div>

              <div className="text-[11px] text-[#faf6f0] font-semibold">
                {state.userName || 'VIP Guest'} • {state.userCity || 'Nagpur'}
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fff1b8] leading-tight">
                {personalityName}
              </h3>

              <p className="text-[10px] text-[#f5d77f] italic max-w-xs mx-auto">
                "{state.personality?.tagline || 'Rooted in heritage. Designed for tomorrow.'}"
              </p>

              <div className="inline-block px-3 py-1 rounded-full bg-[#170f0a] border border-[#d4af37]/40 text-xs font-mono font-bold text-[#d4af37]">
                {totalScore.toLocaleString()} PTS
              </div>
            </div>

            {/* Coordinates */}
            <div className="text-[8px] font-mono text-[#a69383] tracking-wider">
              21.1458° N, 79.0882° E • ZERO MILE
            </div>
          </div>
        </div>

        {/* Right: Actions & Caption Box */}
        <div className="md:col-span-6 space-y-4">
          <div className="gold-card p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2">
              Social Media Caption
            </h4>
            <div className="p-3.5 rounded-xl bg-[#170f0a] border border-[#3d261a] text-xs text-[#warm-beige] font-mono whitespace-pre-line leading-relaxed">
              {captionText}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleCopyCaption}
                className="px-4 py-2.5 rounded-full border border-[#d4af37]/40 bg-[#22160f] text-xs font-semibold text-[#f5d77f] hover:bg-[#2e1e15] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#d4af37]" />}
                <span>{copied ? 'Caption Copied!' : 'Copy Caption'}</span>
              </button>

              <button
                onClick={handleDownloadCard}
                className="px-5 py-2.5 btn-gold text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download Card (.png)</span>
              </button>
            </div>
          </div>

          {/* Next Step Incentive Card */}
          <div className="p-4 rounded-xl bg-[#22160f] border border-[#d4af37]/40 space-y-2">
            <div className="text-xs font-bold text-[#faf6f0]">
              Upload Share Proof to Unlock Royal Scratch Card
            </div>
            <p className="text-[11px] text-[#a69383]">
              Post your card or story, upload a screenshot, and claim your gold foil privilege prize!
            </p>

            <button
              onClick={() => {
                sound.playClick();
                navigateTo('screen-upload');
              }}
              className="w-full py-3 btn-gold text-xs font-bold flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Verify Share & Unlock Scratch Reward</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
