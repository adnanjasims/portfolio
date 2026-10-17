/**
 * Arcade-style footer: credits, more coming, decorative details.
 */
export default function ArcadeFooter() {
  return (
    <footer className="arcade-screen relative w-full max-w-2xl mx-auto px-4 py-10 text-center">
      {/* Top divider */}
      <div className="mx-auto mb-6 flex w-full max-w-md items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/40" />
        <span className="text-[8px] text-amber-500/50" style={{ fontFamily: '"Press Start 2P", cursive' }}> GAME OVER </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/40" />
      </div>

      <p className="text-[8px] uppercase tracking-widest text-white/50" style={{ fontFamily: '"Press Start 2P", cursive' }}>
        More projects coming soon
      </p>
      <p className="mt-2 text-[7px] text-white/40" style={{ fontFamily: '"Press Start 2P", cursive' }}>
        Built with React · Vite · Tailwind
      </p>

      <div className="mt-6 flex justify-center gap-6">
        <span className="text-[7px] text-white/30" style={{ fontFamily: '"Press Start 2P", cursive' }}>SWE</span>
        <span className="text-[7px] text-white/30" style={{ fontFamily: '"Press Start 2P", cursive' }}>DEVOPS</span>
        <span className="text-[7px] text-white/30" style={{ fontFamily: '"Press Start 2P", cursive' }}>ML</span>
        <span className="text-[7px] text-white/30" style={{ fontFamily: '"Press Start 2P", cursive' }}>WEB</span>
      </div>

      <p className="mt-4 text-[6px] text-white/25" style={{ fontFamily: '"Press Start 2P", cursive' }}>
        INSERT COIN TO CONTINUE
      </p>
    </footer>
  );
}
