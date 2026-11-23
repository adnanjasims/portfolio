/**
 * Retro arcade screen: vertical project list, B&W, pixel font, full-row highlight on select.
 * Pixel-style logos for each project + keyboard navigation (Up/Down/Enter).
 */
import { useEffect, useRef } from "react";
import { PROJECTS } from "../data/projects";
import { playMove, playSelect } from "../utils/arcadeSfx";

function TrueCursorPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      {/* Target / boundary stabilization corners */}
      <rect x="1" y="1" width="3" height="1" opacity="0.55" />
      <rect x="1" y="2" width="1" height="2" opacity="0.55" />
      <rect x="12" y="1" width="3" height="1" opacity="0.55" />
      <rect x="14" y="2" width="1" height="2" opacity="0.55" />
      <rect x="1" y="14" width="3" height="1" opacity="0.55" />
      <rect x="1" y="12" width="1" height="2" opacity="0.55" />
      {/* Pixel pointer cursor */}
      <rect x="4" y="3" width="2" height="9" />
      <rect x="6" y="4" width="2" height="7" />
      <rect x="8" y="6" width="2" height="4" />
      <rect x="10" y="7" width="2" height="2" />
      <rect x="8" y="11" width="2" height="3" />
      <rect x="9" y="12" width="2" height="2" opacity="0.8" />
    </svg>
  );
}

function LegacyLiftPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="10" width="5" height="4" />
      <rect x="3" y="7" width="3" height="2" opacity="0.7" />
      <rect x="9" y="3" width="5" height="3" />
      <rect x="9" y="7" width="5" height="3" />
      <rect x="9" y="11" width="5" height="3" />
      <rect x="7" y="5" width="2" height="1" opacity="0.45" />
      <rect x="7" y="9" width="2" height="1" opacity="0.45" />
    </svg>
  );
}

function DocIntelPixelLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
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

const LOGO_MAP = {
  "true-cursor": TrueCursorPixelLogo,
  "legacy-lift": LegacyLiftPixelLogo,
  "doc-intel": DocIntelPixelLogo,
  "rail-interlock": RailInterlockPixelLogo,
  "warehouse-robot": WarehouseRobotPixelLogo,
  chirp: ChirpPixelLogo,
  "smart-supply": SmartSupplyPixelLogo,
  "chess-engine": ChessEnginePixelLogo,
  "event-lottery": EventLotteryPixelLogo,
  "neural-network": NeuralNetworkPixelLogo,
};

export default function ArcadeMenu({
  onSelectProject,
  selectedProjectId = PROJECTS[0].id,
  onChangeSelection,
  onMoveSelection,
}) {
  const listRef = useRef(null);
  const rowRefs = useRef({});
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const list = listRef.current;
    const el = rowRefs.current[selectedProjectId];
    if (list && el) {
      const elTop = el.offsetTop - list.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      if (elTop < list.scrollTop) {
        list.scrollTo({ top: elTop, behavior: "smooth" });
      } else if (elBottom > list.scrollTop + list.clientHeight) {
        list.scrollTo({ top: elBottom - list.clientHeight, behavior: "smooth" });
      }
    }
  }, [selectedProjectId]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      onMoveSelection?.(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onMoveSelection?.(1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playSelect();
      onSelectProject?.(selectedProjectId);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Project selector menu. Use Up and Down arrows to move and Enter to open."
      className="arcade-screen flex h-full w-full flex-col bg-black p-2 focus:outline-none"
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between border-b border-white/40 pb-1">
        <p className="text-[10px] leading-tight text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          SELECT PROJECT
        </p>
        <p className="text-[7px] text-amber-400/75" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          ↑/↓ + ENTER
        </p>
      </div>

      {/* Vertical list */}
      <div ref={listRef} className="flex flex-1 flex-col gap-0 overflow-y-auto">
        {PROJECTS.map((proj) => {
          const isSelected = selectedProjectId === proj.id;
          const Logo = LOGO_MAP[proj.id] || LegacyLiftPixelLogo;
          return (
            <button
              key={proj.id}
              ref={(node) => {
                rowRefs.current[proj.id] = node;
              }}
              type="button"
              onClick={() => {
                onChangeSelection?.(proj.id);
                playSelect();
                onSelectProject?.(proj.id);
              }}
              onMouseEnter={() => {
                if (selectedProjectId !== proj.id) {
                  playMove();
                  onChangeSelection?.(proj.id);
                }
              }}
              onFocus={() => onChangeSelection?.(proj.id)}
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
    </div>
  );
}
