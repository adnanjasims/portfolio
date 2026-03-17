import { useEffect, useRef } from "react";
import kaboom from "kaboom";
import { log, logError } from "./Diagnostics";

const LOG = "[GameCanvas]";

export default function GameCanvas({
  onOpenProject,
  onHoverTerminal,
  isInteractionLocked = false,
  variant = "default",
  onStatus = () => {},
  onError = () => {},
}) {
  const canvasRef = useRef(null);
  const kaboomRef = useRef(null);
  const onOpenProjectRef = useRef(onOpenProject);
  const onHoverTerminalRef = useRef(onHoverTerminal);
  const isInteractionLockedRef = useRef(isInteractionLocked);

  onOpenProjectRef.current = onOpenProject;
  onHoverTerminalRef.current = onHoverTerminal;
  isInteractionLockedRef.current = isInteractionLocked;

  useEffect(() => {
    const canvas = canvasRef.current;

    log(`${LOG} effect run: canvas=${!!canvas}, kaboomRef.current=${!!kaboomRef.current}`);

    if (!canvas || kaboomRef.current) {
      log(`${LOG} effect skip (no canvas or already initialized)`);
      return;
    }

    onStatus("initializing");
    let k;

    try {
      log(`${LOG} calling kaboom(...)`);
      k = kaboom({
      global: false,
      canvas: canvasRef.current,
      width: 320,
      height: 180,
      scale: 3,
      background: [10, 10, 20],
      });
      log(`${LOG} kaboom() returned`);

      kaboomRef.current = k;

    k.add([
      k.rect(320, 120),
      k.color(12, 18, 40),
      k.pos(0, 60),
      k.opacity(0.95),
      k.z(-2),
    ]);

    const wallColor = k.color(56, 189, 248);
    k.add([k.rect(320, 3), wallColor, k.pos(0, 40), k.z(-1)]);
    k.add([k.rect(320, 3), wallColor, k.pos(0, 177), k.z(-1)]);
    k.add([k.rect(3, 140), wallColor, k.pos(0, 40), k.z(-1)]);
    k.add([k.rect(3, 140), wallColor, k.pos(317, 40), k.z(-1)]);

    for (let x = 16; x < 320; x += 16) {
      k.add([
        k.rect(1, 120),
        k.color(30, 64, 175),
        k.opacity(0.2),
        k.pos(x, 60),
        k.z(-1),
      ]);
    }
    for (let y = 60; y < 180; y += 16) {
      k.add([
        k.rect(320, 1),
        k.color(30, 64, 175),
        k.opacity(0.2),
        k.pos(0, y),
        k.z(-1),
      ]);
    }

    const player = k.add([
      k.rect(8, 8),
      k.color(0, 255, 140),
      k.pos(160, 90),
      k.area(),
      "player",
    ]);

    const chirpTerminal = k.add([
      k.rect(10, 14),
      k.color(80, 80, 160),
      k.pos(80, 70),
      k.area(),
      "terminal-chirp",
    ]);

    k.add([
      k.text("Chirp", { size: 8 }),
      k.color(244, 244, 245),
      k.pos(chirpTerminal.pos.x - 16, chirpTerminal.pos.y + 18),
    ]);

    const smartSupplyTerminal = k.add([
      k.rect(10, 14),
      k.color(80, 160, 120),
      k.pos(240, 70),
      k.area(),
      "terminal-smart-supply",
    ]);

    k.add([
      k.text("Smart", { size: 8 }),
      k.color(244, 244, 245),
      k.pos(smartSupplyTerminal.pos.x - 18, smartSupplyTerminal.pos.y + 18),
    ]);

    let nearbyTerminal = null;

    const SPEED = 120;

    k.onUpdate(() => {
      if (isInteractionLockedRef.current) return;

      const dir = k.vec2(0);

      if (k.isKeyDown("left") || k.isKeyDown("a")) dir.x -= 1;
      if (k.isKeyDown("right") || k.isKeyDown("d")) dir.x += 1;
      if (k.isKeyDown("up") || k.isKeyDown("w")) dir.y -= 1;
      if (k.isKeyDown("down") || k.isKeyDown("s")) dir.y += 1;

      if (dir.x !== 0 || dir.y !== 0) {
        player.move(dir.unit().scale(SPEED));
      }

      const pos = player.pos;
      const padding = 8;
      const maxX = 320 - padding;
      const maxY = 180 - padding;

      if (pos.x < padding) pos.x = padding;
      if (pos.x > maxX) pos.x = maxX;
      if (pos.y < padding) pos.y = padding;
      if (pos.y > maxY) pos.y = maxY;
    });

    const setNearby = (id) => {
      nearbyTerminal = id;
      onHoverTerminalRef.current?.(id);
    };

    k.onCollide("player", "terminal-chirp", () => setNearby("chirp"));
    k.onCollideEnd("player", "terminal-chirp", () => {
      if (nearbyTerminal === "chirp") setNearby(null);
    });

    k.onCollide("player", "terminal-smart-supply", () => setNearby("smart-supply"));
    k.onCollideEnd("player", "terminal-smart-supply", () => {
      if (nearbyTerminal === "smart-supply") setNearby(null);
    });

    k.onKeyPress("e", () => {
      if (isInteractionLockedRef.current || !nearbyTerminal) return;
      onOpenProjectRef.current?.(nearbyTerminal);
    });

      onStatus("ready");
      log(`${LOG} kaboom setup complete`);
    } catch (err) {
      const msg = err?.message ?? String(err);
      logError(`${LOG} kaboom init failed`, err);
      onStatus("error");
      onError(msg);
      kaboomRef.current = null;
      return;
    }

    return () => {
      log(`${LOG} cleanup: destroying kaboom`);
      const ctx = kaboomRef.current;
      if (ctx && typeof ctx.destroy === "function") {
        try {
          ctx.destroy();
          log(`${LOG} kaboom.destroy() ok`);
        } catch (cleanupErr) {
          logError(`${LOG} kaboom.destroy() threw`, cleanupErr);
        }
      }
      kaboomRef.current = null;
      onStatus("destroyed");
    };
  }, []);

  const canvasClass =
    variant === "arcade"
      ? "bg-black"
      : "border border-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]";

  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <canvas ref={canvasRef} className={canvasClass} />
    </div>
  );
}
