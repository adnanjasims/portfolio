/**
 * Retro arcade screen: vertical project list, B&W, pixel font, full-row highlight on select.
 * Pixel-style logos for each project.
 */
import { useState } from "react";

const PROJECTS = [
  {
    id: "doc-intel",
    label: "DOC INTELLIGENCE",
    sublabel: "OCR + DRAWINGS",
    Logo: DocIntelPixelLogo,
  },
  {
    id: "rail-interlock",
    label: "RAIL INTERLOCK",
    sublabel: "C SAFETY SYSTEM",
    Logo: RailInterlockPixelLogo,
  },
  {
    id: "warehouse-robot",
    label: "WAREHOUSE ROBOT",
    sublabel: "AMR SIMULATOR",
    Logo: WarehouseRobotPixelLogo,
  },
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
  {
    id: "event-lottery",
    label: "EVENT LOTTERY",
    sublabel: "ANDROID APP",
    Logo: EventLotteryPixelLogo,
  },
  {
    id: "neural-network",
    label: "NEURAL NETWORK",
    sublabel: "C++ MLP ENGINE",
    Logo: NeuralNetworkPixelLogo,
  },
];

function DocIntelPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      {/* Page + scan lines */}
      <rect x="3" y="1" width="10" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="5" y="4" width="6" height="1" />
      <rect x="5" y="7" width="6" height="1" />
      <rect x="5" y="10" width="4" height="1" />
      <rect x="10" y="12" width="2" height="2" opacity="0.7" />
    </svg>
  );
}

function RailInterlockPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      {/* Track + signal lamp */}
      <rect x="1" y="11" width="14" height="1" />
      <rect x="1" y="14" width="14" height="1" />
      <rect x="3" y="11" width="1" height="4" opacity="0.45" />
      <rect x="7" y="11" width="1" height="4" opacity="0.45" />
      <rect x="11" y="11" width="1" height="4" opacity="0.45" />
      <rect x="7" y="2" width="2" height="7" />
      <rect x="6" y="2" width="4" height="3" />
    </svg>
  );
}

function WarehouseRobotPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      {/* Grid floor + robot body */}
      <rect x="1" y="1" width="2" height="2" opacity="0.3" />
      <rect x="7" y="1" width="2" height="2" opacity="0.3" />
      <rect x="13" y="1" width="2" height="2" opacity="0.3" />
      <rect x="1" y="13" width="2" height="2" opacity="0.3" />
      <rect x="13" y="13" width="2" height="2" opacity="0.3" />
      <rect x="5" y="5" width="6" height="5" />
      <rect x="6" y="4" width="4" height="1" />
      <rect x="4" y="11" width="2" height="2" />
      <rect x="10" y="11" width="2" height="2" />
    </svg>
  );
}

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

function EventLotteryPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      {/* Phone + ticket stub */}
      <rect x="3" y="1" width="6" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="4" y="3" width="4" height="8" opacity="0.85" />
      <rect x="5" y="12" width="2" height="1" />
      <rect x="10" y="5" width="5" height="6" />
      <rect x="11" y="6" width="1" height="1" opacity="0.35" />
      <rect x="13" y="6" width="1" height="1" opacity="0.35" />
      <rect x="11" y="8" width="3" height="1" opacity="0.35" />
    </svg>
  );
}

function NeuralNetworkPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      {/* 3-layer node graph */}
      <rect x="1" y="2" width="2" height="2" />
      <rect x="1" y="7" width="2" height="2" />
      <rect x="1" y="12" width="2" height="2" />
      <rect x="7" y="3" width="2" height="2" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="7" y="11" width="2" height="2" />
      <rect x="13" y="5" width="2" height="2" />
      <rect x="13" y="9" width="2" height="2" />
      <rect x="3" y="3" width="4" height="1" opacity="0.45" />
      <rect x="3" y="8" width="4" height="1" opacity="0.45" />
      <rect x="3" y="12" width="4" height="1" opacity="0.45" />
      <rect x="9" y="5" width="4" height="1" opacity="0.45" />
      <rect x="9" y="10" width="4" height="1" opacity="0.45" />
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
        <p className="text-[10px] leading-tight text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          SELECT PROJECT
        </p>
      </div>

      {/* Vertical list */}
      <div className="flex flex-1 flex-col gap-0 overflow-y-auto">
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
                <span className="text-[10px] leading-tight">
                  {proj.label}
                </span>
                <span className={`text-[7px] leading-tight ${isSelected ? "text-black/70" : "text-white/60"}`}>
                  {proj.sublabel}
                </span>
              </div>
              {isSelected && (
                <span className="flex-shrink-0 text-[10px] opacity-80">&gt;</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[7px] text-white/50" style={{ fontFamily: '"Press Start 2P", cursive' }}>
        CLICK TO OPEN
      </p>
    </div>
  );
}
