import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070403]/90 backdrop-blur-md border-t border-[#d4af37]/25 py-8 px-4 sm:px-6 mt-16 text-center text-xs text-[#ab9580]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-[#d4af37]/50 flex items-center justify-center p-1 bg-[#1a0c06]">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-[#d4af37]">
              <path d="M19 13c.6 0 1-.4 1-1V8.5C20 5.5 17.5 3 14.5 3c-1.8 0-3.4 1-4.2 2.5C9.5 5.2 8.7 5 8 5 5.8 5 4 6.8 4 9v6h2v-3.5c0-.8.7-1.5 1.5-1.5h1.5v5h2v-5h2.5c.8 0 1.5.7 1.5 1.5V17h2v-4h2z" />
            </svg>
          </div>
          <span className="font-serif tracking-[0.15em] font-semibold text-[#faf5eb]">THE INDIAN EDIT</span>
          <span className="text-[#937119]">•</span>
          <span className="text-[#ebd9c0] font-serif italic">India's Rich Heritage. A Premium Blend.</span>
        </div>

        <div className="text-[11px] text-[#ab9580]">
          Super Premium Whisky &copy; {new Date().getFullYear()} The Indian Edit. Crafted in India.
        </div>
      </div>
    </footer>
  );
};
