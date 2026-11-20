import { useEffect, useRef } from "react";

/**
 * Computes total polyline length and segment lengths for smooth traversal.
 */
function buildPolyline(points) {
  const segments = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    segments.push({ x1, y1, x2, y2, len, start: total });
    total += len;
  }
  return { points, segments, total };
}

function samplePolyline(poly, dist) {
  const wrapped = ((dist % poly.total) + poly.total) % poly.total;
  for (const seg of poly.segments) {
    if (wrapped <= seg.start + seg.len || seg === poly.segments[poly.segments.length - 1]) {
      const localT = seg.len > 0 ? (wrapped - seg.start) / seg.len : 0;
      return [
        seg.x1 + (seg.x2 - seg.x1) * localT,
        seg.y1 + (seg.y2 - seg.y1) * localT,
      ];
    }
  }
  return poly.points[0];
}

/**
 * Builds motherboard bus routes scaled to the current viewport size.
 */
function createMotherboardCircuits(w, h) {
  const leftEdge = Math.min(w * 0.14, 150);
  const rightEdge = Math.max(w * 0.86, w - 150);
  const innerLeft = Math.min(w * 0.24, 265);
  const innerRight = Math.max(w * 0.76, w - 265);
  const topY = Math.max(76, h * 0.09);
  const bottomY = Math.min(h - 36, h * 0.91);
  const midUpperY = h * 0.34;
  const midLowerY = h * 0.68;

  // Circuit 1: Full outer perimeter loop racing all the way around the motherboard
  const perimeter = buildPolyline([
    [leftEdge, topY],
    [rightEdge, topY],
    [rightEdge + 24, topY + 24],
    [rightEdge + 24, bottomY - 24],
    [rightEdge, bottomY],
    [leftEdge, bottomY],
    [leftEdge - 24, bottomY - 24],
    [leftEdge - 24, topY + 24],
    [leftEdge, topY],
  ]);

  // Circuit 2: Left-to-right upper data bus crossing behind cards & side panels
  const upperBus = buildPolyline([
    [0, midUpperY - 40],
    [leftEdge + 40, midUpperY - 40],
    [innerLeft, midUpperY],
    [innerRight, midUpperY],
    [rightEdge - 40, midUpperY - 40],
    [w, midUpperY - 40],
  ]);

  // Circuit 3: Right-to-left lower bus wrapping around bottom-left corner
  const lowerBus = buildPolyline([
    [w, midLowerY + 40],
    [rightEdge - 40, midLowerY + 40],
    [innerRight, midLowerY],
    [innerLeft, midLowerY],
    [leftEdge + 40, midLowerY + 40],
    [0, midLowerY + 40],
  ]);

  // Circuit 4: Subtle amber vertical spine on left & right channels
  const leftSpine = buildPolyline([
    [innerLeft - 18, 0],
    [innerLeft - 18, h * 0.28],
    [innerLeft + 10, h * 0.32],
    [innerLeft + 10, h * 0.72],
    [innerLeft - 18, h * 0.76],
    [innerLeft - 18, h],
  ]);

  const rightSpine = buildPolyline([
    [innerRight + 18, h],
    [innerRight + 18, h * 0.72],
    [innerRight - 10, h * 0.68],
    [innerRight - 10, h * 0.28],
    [innerRight + 18, h * 0.24],
    [innerRight + 18, 0],
  ]);

  return {
    circuits: [
      { poly: perimeter, color: "#10b981", baseAlpha: 0.26 },
      { poly: upperBus, color: "#34d399", baseAlpha: 0.22 },
      { poly: lowerBus, color: "#34d399", baseAlpha: 0.22 },
      { poly: leftSpine, color: "#fbbf24", baseAlpha: 0.16 },
      { poly: rightSpine, color: "#fbbf24", baseAlpha: 0.16 },
    ],
    // 3 prominent emerald green pulses + 2 subtle amber pulses
    pulses: [
      { poly: perimeter, speed: 155, offset: 0, tailLen: 95, headColor: "#a7f3d0", glowColor: "#34d399" },
      { poly: perimeter, speed: 155, offset: 0.5, tailLen: 95, headColor: "#a7f3d0", glowColor: "#10b981" },
      { poly: upperBus, speed: 135, offset: 0.15, tailLen: 85, headColor: "#d1fae5", glowColor: "#34d399" },
      { poly: lowerBus, speed: 130, offset: 0.65, tailLen: 85, headColor: "#d1fae5", glowColor: "#10b981" },
      { poly: leftSpine, speed: 95, offset: 0.2, tailLen: 65, headColor: "#fef08a", glowColor: "#fbbf24" },
      { poly: rightSpine, speed: 95, offset: 0.7, tailLen: 65, headColor: "#fef08a", glowColor: "#fbbf24" },
    ],
  };
}

/**
 * Retro arcade backdrop: static grid + 8-bit pixel starfield by default,
 * with animated motherboard PCB traces & pulses unlocked in Konami Overclock mode.
 */
export default function ArcadeBackdrop({ overclock = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!overclock) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let data = createMotherboardCircuits(width, height);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      data = createMotherboardCircuits(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    let lastNow = performance.now();
    let virtualTime = 0;

    const draw = (now) => {
      const dt = Math.min(0.1, (now - lastNow) / 1000);
      lastNow = now;
      virtualTime += dt * 2.8;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Draw overclocked motherboard bus rails + solder pads
      for (const { poly, color, baseAlpha } of data.circuits) {
        const railColor = color === "#fbbf24" ? "#fde047" : "#22d3ee";
        ctx.save();
        ctx.globalAlpha = Math.min(0.45, baseAlpha * 1.7);
        ctx.strokeStyle = railColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        poly.points.forEach(([x, y], idx) => {
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Small square solder pads at vertices
        ctx.fillStyle = railColor;
        for (let i = 1; i < poly.points.length - 1; i += 1) {
          const [vx, vy] = poly.points[i];
          ctx.fillRect(Math.round(vx) - 2, Math.round(vy) - 2, 5, 5);
        }
        ctx.restore();
      }

      // Draw glowing animated pulses with fading trails
      for (const pulse of data.pulses) {
        const headDist = pulse.offset * pulse.poly.total + virtualTime * pulse.speed;
        const steps = 16;
        const headColor = pulse.glowColor === "#fbbf24" ? "#fef08a" : "#a5f3fc";
        const glowColor = pulse.glowColor === "#fbbf24" ? "#facc15" : "#22d3ee";

        ctx.save();
        for (let s = steps; s >= 0; s -= 1) {
          const t = s / steps;
          const d = headDist - t * (pulse.tailLen * 1.35);
          const [x, y] = samplePolyline(pulse.poly, d);
          const alpha = (1 - t) * (1 - t);
          const size = s === 0 ? 7 : Math.max(2, Math.round(4.5 * (1 - t * 0.6)));

          ctx.globalAlpha = alpha;
          ctx.shadowBlur = s === 0 ? 18 : 6;
          ctx.shadowColor = glowColor;
          ctx.fillStyle = s <= 2 ? headColor : glowColor;
          ctx.fillRect(
            Math.round(x - size / 2),
            Math.round(y - size / 2),
            size,
            size
          );
        }
        ctx.restore();
      }

      frameId = window.requestAnimationFrame(draw);
    };

    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
      ctx.clearRect(0, 0, width, height);
    };
  }, [overclock]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]"
    >
      {/* Subtle amber-to-emerald ambient phosphor glow */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 75% 42% at 50% 14%, rgba(251, 191, 36, 0.075), transparent 65%)",
            "radial-gradient(ellipse 70% 42% at 50% 82%, rgba(16, 185, 129, 0.075), transparent 65%)",
          ].join(", "),
        }}
      />

      {/* Fine 8px + major 32px motherboard grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(251, 191, 36, 0.07) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(251, 191, 36, 0.07) 1px, transparent 1px)",
            "linear-gradient(rgba(251, 191, 36, 0.025) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(251, 191, 36, 0.025) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "32px 32px, 32px 32px, 8px 8px, 8px 8px",
        }}
      />

      {/* Real-time canvas motherboard traces & data pulses (Konami Overclock mode only) */}
      {overclock && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}

      {/* Distant slow 8-bit pixel starfield */}
      <div className="arcade-starfield-slow absolute inset-x-0 top-0 h-[calc(100%+320px)]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="arcade-stars-slow"
              width="320"
              height="320"
              patternUnits="userSpaceOnUse"
            >
              <rect x="24" y="18" width="2" height="2" fill="#e2e8f0" opacity="0.32" />
              <rect x="92" y="44" width="1" height="1" fill="#fde68a" opacity="0.42" />
              <rect x="164" y="26" width="2" height="2" fill="#94a3b8" opacity="0.28" />
              <rect x="248" y="62" width="2" height="2" fill="#e2e8f0" opacity="0.3" />
              <rect x="298" y="20" width="1" height="1" fill="#6ee7b7" opacity="0.35" />
              <rect x="44" y="118" width="1" height="1" fill="#e2e8f0" opacity="0.32" />
              <rect x="132" y="140" width="2" height="2" fill="#fcd34d" opacity="0.3" />
              <rect x="210" y="110" width="1" height="1" fill="#e2e8f0" opacity="0.28" />
              <rect x="276" y="154" width="2" height="2" fill="#94a3b8" opacity="0.28" />
              <rect x="18" y="214" width="2" height="2" fill="#fcd34d" opacity="0.25" />
              <rect x="114" y="238" width="1" height="1" fill="#e2e8f0" opacity="0.35" />
              <rect x="192" y="202" width="2" height="2" fill="#6ee7b7" opacity="0.26" />
              <rect x="262" y="246" width="1" height="1" fill="#e2e8f0" opacity="0.3" />
              <rect x="72" y="288" width="2" height="2" fill="#e2e8f0" opacity="0.26" />
              <rect x="228" y="294" width="2" height="2" fill="#fde68a" opacity="0.28" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arcade-stars-slow)" />
        </svg>
      </div>

      {/* Closer medium 8-bit pixel starfield */}
      <div className="arcade-starfield-med absolute inset-x-0 top-0 h-[calc(100%+320px)]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="arcade-stars-med"
              width="320"
              height="320"
              patternUnits="userSpaceOnUse"
            >
              <rect x="56" y="34" width="2" height="2" fill="#fbbf24" opacity="0.4" />
              <rect x="196" y="74" width="2" height="2" fill="#f8fafc" opacity="0.36" />
              <rect x="284" y="96" width="2" height="2" fill="#34d399" opacity="0.34" />
              <rect x="148" y="176" width="2" height="2" fill="#fbbf24" opacity="0.32" />
              <rect x="34" y="258" width="2" height="2" fill="#f8fafc" opacity="0.34" />
              <rect x="234" y="220" width="2" height="2" fill="#fde68a" opacity="0.38" />
              <rect x="174" y="284" width="2" height="2" fill="#34d399" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arcade-stars-med)" />
        </svg>
      </div>

      {/* Soft edge vignette so center stage stays crisp */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(2, 4, 8, 0.55) 100%)",
        }}
      />
    </div>
  );
}
