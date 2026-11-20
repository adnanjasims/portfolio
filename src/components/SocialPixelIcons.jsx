/**
 * Retro 12x12 pixel-art social brand icons (CRT palette) for GitHub and LinkedIn links.
 */
export function GitHubPixelLogo({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Ears */}
      <rect x="2" y="1" width="2" height="2" fill="#fde68a" />
      <rect x="8" y="1" width="2" height="2" fill="#fde68a" />
      {/* Head */}
      <rect x="3" y="2" width="6" height="1" fill="#fde68a" />
      <rect x="2" y="3" width="8" height="4" fill="#fde68a" />
      <rect x="3" y="7" width="6" height="1" fill="#fde68a" />
      {/* Eyes */}
      <rect x="4" y="4" width="1" height="2" fill="#060608" />
      <rect x="7" y="4" width="1" height="2" fill="#060608" />
      {/* Body & tail */}
      <rect x="4" y="8" width="4" height="2" fill="#fde68a" />
      <rect x="4" y="10" width="1" height="1" fill="#fde68a" />
      <rect x="7" y="10" width="1" height="1" fill="#fde68a" />
      <rect x="1" y="7" width="1" height="1" fill="#fbbf24" />
      <rect x="2" y="8" width="2" height="1" fill="#fbbf24" />
    </svg>
  );
}

export function LinkedInPixelLogo({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Deep navy badge with subtle retro highlight */}
      <rect x="1" y="1" width="10" height="10" fill="#172554" />
      <rect x="1" y="1" width="10" height="1" fill="#1e40af" />
      <rect x="1" y="10" width="10" height="1" fill="#0f172a" />
      {/* Pixel "i" */}
      <rect x="3" y="3" width="1" height="1" fill="#fef3c7" />
      <rect x="3" y="5" width="1" height="4" fill="#fef3c7" />
      {/* Pixel "n" */}
      <rect x="5" y="5" width="1" height="4" fill="#fef3c7" />
      <rect x="6" y="5" width="2" height="1" fill="#fef3c7" />
      <rect x="8" y="6" width="1" height="3" fill="#fef3c7" />
    </svg>
  );
}
