/**
 * Retro arcade screen: vertical project list, B&W, pixel font, full-row highlight on select.
 * Pixel-style logos for Chirp, Smart Supply, Chess Engine.
 */
import { useState } from "react";

const PROJECTS = [
  {
    id: "chirp",
    label: "CHIRP",
    sublabel: "FULL-STACK SOCIAL",
    Logo: ChirpPixelLogo,
  },
  {
    id: "smart-supply",
    label: "SMART SUPPLY",
    sublabel: "ML & STREAMLIT",
    Logo: SmartSupplyPixelLogo,
  },
  {
    id: "chess-engine",
    label: "CHESS ENGINE",
    sublabel: "UCI ENGINE + WEB",
    Logo: ChessEnginePixelLogo,
  },
];

function ChirpPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      {/* Pixel bird (top-down / icon style) */}
      <rect x="5" y="2" width="2" height="2" />
      <rect x="7" y="4" width="2" height="2" />
      <rect x="5" y="6" width="6" height="4" />
      <rect x="3" y="8" width="2" height="4" />
      <rect x="11" y="8" width="2" height="4" />
      <rect x="7" y="10" width="2" height="4" />
    </svg>
  );
}

function SmartSupplyPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      {/* Crate/box + bars (inventory/chart) */}
      <rect x="2" y="9" width="4" height="4" stroke="currentColor" fill="none" strokeWidth="1" />
      <rect x="7" y="6" width="2" height="7" />
      <rect x="10" y="4" width="2" height="9" />
      <rect x="13" y="8" width="2" height="5" />
    </svg>
  );
}

function ChessEnginePixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      {/* Mini chess board + king silhouette */}
      <rect x="2" y="2" width="2" height="2" fill="currentColor" opacity="0.3" />
      <rect x="6" y="2" width="2" height="2" fill="currentColor" opacity="0.3" />
      <rect x="10" y="2" width="2" height="2" fill="currentColor" opacity="0.3" />
      <rect x="14" y="2" width="2" height="2" fill="currentColor" opacity="0.3" />
      <rect x="4" y="4" width="2" height="2" fill="currentColor" opacity="0.3" />
      <rect x="8" y="4" width="2" height="2" fill="currentColor" opacity="0.3" />
      <rect x="12" y="4" width="2" height="2" fill="currentColor" opacity="0.3" />
      <rect x="6" y="8" width="4" height="2" />
      <rect x="7" y="6" width="2" height="4" />
      <rect x="6" y="12" width="4" height="2" />
    </svg>
  );
}

export default function ArcadeMenu({ onSelectProject, selectedProjectId = null }) {
  const [hoveredId, setHoveredId] = useState(null);
  const selected = hoveredId ?? selectedProjectId;

  return (
    <div className="arcade-screen flex h-full w-full flex-col bg-black p-2">
      {/* Header */}
      <div className="mb-2 border-b border-white/40 pb-1">
        <p className="text-[8px] leading-tight text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          SELECT PROJECT
        </p>
      </div>

      {/* Vertical list */}
      <div className="flex flex-1 flex-col gap-0 overflow-hidden">
        {PROJECTS.map((proj) => {
          const isSelected = selected === proj.id;
          const Logo = proj.Logo;
          return (
            <button
              key={proj.id}
              type="button"
              onClick={() => onSelectProject(proj.id)}
              onMouseEnter={() => setHoveredId(proj.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(proj.id)}
              onBlur={() => setHoveredId(null)}
              className={`flex w-full flex-shrink-0 items-center gap-2 border-b border-white/20 px-2 py-3 text-left transition-none focus:outline-none ${
                isSelected ? "bg-white text-black" : "bg-black text-white hover:bg-white/10"
              }`}
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              <span className={`flex-shrink-0 opacity-90 ${isSelected ? "text-black" : "text-white"}`}>
                <Logo className="h-8 w-8" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0">
                <span className="text-[8px] leading-tight">
                  {proj.label}
                </span>
                <span className={`text-[5px] leading-tight ${isSelected ? "text-black/70" : "text-white/60"}`}>
                  {proj.sublabel}
                </span>
              </div>
              {isSelected && (
                <span className="flex-shrink-0 text-[8px] opacity-80">&gt;</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[5px] text-white/50" style={{ fontFamily: '"Press Start 2P", cursive' }}>
        CLICK TO OPEN
      </p>
    </div>
  );
}
