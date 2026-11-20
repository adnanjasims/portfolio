/**
 * Retro 12x12 pixel-art brand icons (color-shifted to fit the CRT palette)
 * for every skill chip in ArcadeIntro.
 */
function px(props) {
  return {
    viewBox: "0 0 12 12",
    "aria-hidden": "true",
    style: { imageRendering: "pixelated" },
    ...props,
  };
}

export function SkillPixelIcon({ name, className = "h-4 w-4" }) {
  switch (name) {
    case "Python":
      return (
        <svg {...px({ className })}>
          <rect x="3" y="1" width="5" height="2" fill="#38bdf8" />
          <rect x="2" y="3" width="6" height="2" fill="#38bdf8" />
          <rect x="4" y="2" width="1" height="1" fill="#060608" />
          <rect x="2" y="5" width="3" height="2" fill="#38bdf8" />
          <rect x="4" y="7" width="6" height="2" fill="#fbbf24" />
          <rect x="4" y="9" width="5" height="2" fill="#fbbf24" />
          <rect x="7" y="9" width="1" height="1" fill="#060608" />
          <rect x="7" y="5" width="3" height="2" fill="#fbbf24" />
        </svg>
      );

    case "TypeScript":
      return (
        <svg {...px({ className })}>
          <rect x="1" y="1" width="10" height="10" fill="#2563eb" />
          <rect x="2" y="5" width="4" height="1" fill="#fef3c7" />
          <rect x="3" y="6" width="2" height="4" fill="#fef3c7" />
          <rect x="7" y="5" width="3" height="1" fill="#fef3c7" />
          <rect x="7" y="6" width="1" height="2" fill="#fef3c7" />
          <rect x="7" y="7" width="3" height="1" fill="#fef3c7" />
          <rect x="9" y="8" width="1" height="2" fill="#fef3c7" />
          <rect x="7" y="9" width="3" height="1" fill="#fef3c7" />
        </svg>
      );

    case "JavaScript (Next, React, Node)":
      return (
        <svg {...px({ className })}>
          <rect x="1" y="1" width="10" height="10" fill="#facc15" />
          <rect x="4" y="5" width="2" height="4" fill="#09090b" />
          <rect x="2" y="8" width="3" height="2" fill="#09090b" />
          <rect x="7" y="5" width="3" height="1" fill="#09090b" />
          <rect x="7" y="6" width="1" height="2" fill="#09090b" />
          <rect x="7" y="7" width="3" height="1" fill="#09090b" />
          <rect x="9" y="8" width="1" height="2" fill="#09090b" />
          <rect x="7" y="9" width="3" height="1" fill="#09090b" />
        </svg>
      );

    case "SQL":
      return (
        <svg {...px({ className })}>
          <rect x="3" y="1" width="6" height="2" fill="#34d399" />
          <rect x="2" y="2" width="8" height="2" fill="#10b981" />
          <rect x="2" y="5" width="8" height="2" fill="#34d399" />
          <rect x="2" y="8" width="8" height="2" fill="#059669" />
          <rect x="3" y="10" width="6" height="1" fill="#fbbf24" />
        </svg>
      );

    case "Java":
      return (
        <svg {...px({ className })}>
          <rect x="4" y="1" width="1" height="2" fill="#fb923c" />
          <rect x="7" y="1" width="1" height="2" fill="#fbbf24" />
          <rect x="3" y="4" width="6" height="5" fill="#f97316" />
          <rect x="9" y="5" width="2" height="3" fill="#fbbf24" />
          <rect x="2" y="9" width="8" height="2" fill="#38bdf8" />
        </svg>
      );

    case "C":
      return (
        <svg {...px({ className })}>
          <rect x="3" y="1" width="6" height="10" fill="#2563eb" />
          <rect x="1" y="3" width="10" height="6" fill="#3b82f6" />
          <rect x="4" y="4" width="4" height="1" fill="#fef3c7" />
          <rect x="4" y="5" width="1" height="2" fill="#fef3c7" />
          <rect x="4" y="7" width="4" height="1" fill="#fef3c7" />
        </svg>
      );

    case "HTML/CSS":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="1" width="4" height="9" fill="#ea580c" />
          <rect x="6" y="1" width="4" height="9" fill="#0284c7" />
          <rect x="3" y="9" width="6" height="2" fill="#fbbf24" />
          <rect x="4" y="4" width="4" height="2" fill="#fef3c7" />
        </svg>
      );

    case "PostgreSQL":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="2" width="8" height="6" fill="#38bdf8" />
          <rect x="1" y="3" width="2" height="4" fill="#0284c7" />
          <rect x="9" y="3" width="2" height="4" fill="#0284c7" />
          <rect x="4" y="4" width="1" height="1" fill="#060608" />
          <rect x="7" y="4" width="1" height="1" fill="#060608" />
          <rect x="5" y="7" width="2" height="4" fill="#fbbf24" />
        </svg>
      );

    case "Pandas":
      return (
        <svg {...px({ className })}>
          <rect x="3" y="1" width="2" height="4" fill="#818cf8" />
          <rect x="3" y="6" width="2" height="1" fill="#fbbf24" />
          <rect x="3" y="8" width="2" height="3" fill="#818cf8" />
          <rect x="7" y="1" width="2" height="3" fill="#34d399" />
          <rect x="7" y="5" width="2" height="1" fill="#f472b6" />
          <rect x="7" y="7" width="2" height="4" fill="#818cf8" />
        </svg>
      );

    case "NumPy":
      return (
        <svg {...px({ className })}>
          <rect x="3" y="1" width="6" height="3" fill="#38bdf8" />
          <rect x="2" y="4" width="4" height="6" fill="#0284c7" />
          <rect x="6" y="4" width="4" height="6" fill="#60a5fa" />
          <rect x="4" y="5" width="4" height="2" fill="#fbbf24" />
        </svg>
      );

    case "Scikit-Learn":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="2" width="8" height="8" fill="#0c4a6e" />
          <rect x="2" y="4" width="5" height="4" fill="#fb923c" />
          <rect x="6" y="3" width="4" height="4" fill="#38bdf8" />
          <rect x="4" y="8" width="4" height="1" fill="#fde047" />
        </svg>
      );

    case "BigQuery":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="2" width="6" height="6" fill="#38bdf8" />
          <rect x="3" y="5" width="1" height="2" fill="#fbbf24" />
          <rect x="5" y="3" width="1" height="4" fill="#fbbf24" />
          <rect x="7" y="7" width="2" height="2" fill="#fde047" />
          <rect x="9" y="9" width="2" height="2" fill="#fbbf24" />
        </svg>
      );

    case "GraphQL":
      return (
        <svg {...px({ className })}>
          <rect x="5" y="1" width="2" height="2" fill="#f472b6" />
          <rect x="2" y="3" width="2" height="2" fill="#f472b6" />
          <rect x="8" y="3" width="2" height="2" fill="#f472b6" />
          <rect x="2" y="7" width="2" height="2" fill="#f472b6" />
          <rect x="8" y="7" width="2" height="2" fill="#f472b6" />
          <rect x="5" y="9" width="2" height="2" fill="#f472b6" />
          <rect x="4" y="4" width="4" height="4" fill="none" stroke="#fbcfe8" strokeWidth="1" />
        </svg>
      );

    case "NoSQL":
      return (
        <svg {...px({ className })}>
          <rect x="5" y="1" width="2" height="2" fill="#34d399" />
          <rect x="3" y="3" width="6" height="5" fill="#10b981" />
          <rect x="5" y="8" width="2" height="3" fill="#fbbf24" />
          <rect x="5" y="4" width="2" height="3" fill="#a7f3d0" />
        </svg>
      );

    case "SQLite":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="2" width="8" height="8" fill="#0369a1" />
          <rect x="4" y="3" width="4" height="1" fill="#fde047" />
          <rect x="3" y="5" width="6" height="2" fill="#38bdf8" />
          <rect x="4" y="8" width="4" height="1" fill="#fde047" />
        </svg>
      );

    case "R":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="2" width="8" height="8" fill="#475569" />
          <rect x="4" y="3" width="4" height="6" fill="#60a5fa" />
          <rect x="5" y="4" width="2" height="2" fill="#060608" />
          <rect x="7" y="7" width="2" height="3" fill="#fbbf24" />
        </svg>
      );

    case "PyTorch":
      return (
        <svg {...px({ className })}>
          <rect x="5" y="1" width="2" height="2" fill="#fde047" />
          <rect x="3" y="3" width="6" height="2" fill="#fb923c" />
          <rect x="2" y="5" width="8" height="4" fill="#ea580c" />
          <rect x="4" y="6" width="4" height="3" fill="#060608" />
          <rect x="3" y="9" width="6" height="2" fill="#f97316" />
        </svg>
      );

    case "TensorFlow":
      return (
        <svg {...px({ className })}>
          <rect x="1" y="2" width="5" height="2" fill="#f97316" />
          <rect x="6" y="2" width="5" height="2" fill="#fbbf24" />
          <rect x="4" y="4" width="2" height="6" fill="#ea580c" />
          <rect x="6" y="4" width="2" height="6" fill="#fbbf24" />
          <rect x="8" y="5" width="2" height="2" fill="#fde047" />
        </svg>
      );

    case "RAG":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="2" width="5" height="8" fill="#34d399" />
          <rect x="3" y="4" width="3" height="1" fill="#060608" />
          <rect x="3" y="6" width="3" height="1" fill="#060608" />
          <rect x="7" y="3" width="3" height="3" fill="#fbbf24" />
          <rect x="9" y="7" width="2" height="3" fill="#fde047" />
        </svg>
      );

    case "Reinforcement Learning":
      return (
        <svg {...px({ className })}>
          <rect x="1" y="8" width="3" height="2" fill="#38bdf8" />
          <rect x="4" y="6" width="3" height="2" fill="#fbbf24" />
          <rect x="7" y="4" width="3" height="2" fill="#34d399" />
          <rect x="8" y="1" width="2" height="2" fill="#fde047" />
        </svg>
      );

    case "MCP":
      return (
        <svg {...px({ className })}>
          <rect x="1" y="4" width="4" height="4" fill="#fbbf24" />
          <rect x="5" y="5" width="2" height="2" fill="#fef3c7" />
          <rect x="7" y="4" width="4" height="4" fill="#34d399" />
        </svg>
      );

    case "Gemini API":
      return (
        <svg {...px({ className })}>
          <rect x="5" y="1" width="2" height="10" fill="#38bdf8" />
          <rect x="1" y="5" width="10" height="2" fill="#38bdf8" />
          <rect x="4" y="4" width="4" height="4" fill="#fde047" />
          <rect x="5" y="5" width="2" height="2" fill="#fef3c7" />
        </svg>
      );

    case "Claude":
      return (
        <svg {...px({ className })}>
          <rect x="5" y="1" width="2" height="10" fill="#fb923c" />
          <rect x="1" y="5" width="10" height="2" fill="#fb923c" />
          <rect x="2" y="2" width="2" height="2" fill="#fdba74" />
          <rect x="8" y="2" width="2" height="2" fill="#fdba74" />
          <rect x="2" y="8" width="2" height="2" fill="#fdba74" />
          <rect x="8" y="8" width="2" height="2" fill="#fdba74" />
          <rect x="4" y="4" width="4" height="4" fill="#fde047" />
        </svg>
      );

    case "Cursor":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="1" width="2" height="9" fill="#f8fafc" />
          <rect x="4" y="2" width="2" height="7" fill="#f8fafc" />
          <rect x="6" y="4" width="2" height="4" fill="#fbbf24" />
          <rect x="8" y="5" width="2" height="2" fill="#fbbf24" />
          <rect x="6" y="8" width="2" height="3" fill="#38bdf8" />
        </svg>
      );

    case "Copilot":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="3" width="8" height="2" fill="#94a3b8" />
          <rect x="1" y="5" width="4" height="4" fill="#38bdf8" />
          <rect x="7" y="5" width="4" height="4" fill="#34d399" />
          <rect x="5" y="6" width="2" height="2" fill="#fbbf24" />
        </svg>
      );

    case "Ollama":
      return (
        <svg {...px({ className })}>
          <rect x="3" y="1" width="2" height="3" fill="#fef3c7" />
          <rect x="7" y="1" width="2" height="3" fill="#fef3c7" />
          <rect x="3" y="4" width="6" height="6" fill="#fef3c7" />
          <rect x="4" y="5" width="1" height="1" fill="#060608" />
          <rect x="7" y="5" width="1" height="1" fill="#060608" />
          <rect x="5" y="7" width="2" height="2" fill="#fbbf24" />
        </svg>
      );

    case "AWS":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="2" width="8" height="4" fill="#f8fafc" />
          <rect x="3" y="3" width="2" height="2" fill="#060608" />
          <rect x="7" y="3" width="2" height="2" fill="#060608" />
          <rect x="2" y="8" width="7" height="2" fill="#fbbf24" />
          <rect x="8" y="7" width="2" height="2" fill="#f97316" />
        </svg>
      );

    case "Docker":
      return (
        <svg {...px({ className })}>
          <rect x="3" y="2" width="2" height="2" fill="#fbbf24" />
          <rect x="5" y="2" width="2" height="2" fill="#34d399" />
          <rect x="5" y="4" width="2" height="2" fill="#38bdf8" />
          <rect x="7" y="4" width="2" height="2" fill="#fbbf24" />
          <rect x="1" y="6" width="9" height="4" fill="#0284c7" />
          <rect x="9" y="5" width="2" height="2" fill="#38bdf8" />
        </svg>
      );

    case "Kubernetes":
      return (
        <svg {...px({ className })}>
          <rect x="5" y="1" width="2" height="10" fill="#38bdf8" />
          <rect x="1" y="5" width="10" height="2" fill="#38bdf8" />
          <rect x="3" y="3" width="6" height="6" fill="#2563eb" />
          <rect x="5" y="5" width="2" height="2" fill="#fde047" />
        </svg>
      );

    case "Git":
      return (
        <svg {...px({ className })}>
          <rect x="5" y="1" width="2" height="10" fill="#f97316" />
          <rect x="1" y="5" width="10" height="2" fill="#f97316" />
          <rect x="3" y="3" width="6" height="6" fill="#ea580c" />
          <rect x="5" y="3" width="2" height="5" fill="#fef3c7" />
          <rect x="7" y="5" width="2" height="2" fill="#fde047" />
        </svg>
      );

    case "CI/CD":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="2" width="7" height="2" fill="#34d399" />
          <rect x="8" y="3" width="2" height="3" fill="#34d399" />
          <rect x="3" y="8" width="7" height="2" fill="#fbbf24" />
          <rect x="2" y="6" width="2" height="3" fill="#fbbf24" />
          <rect x="5" y="5" width="2" height="2" fill="#fef3c7" />
        </svg>
      );

    case "Linux":
      return (
        <svg {...px({ className })}>
          <rect x="4" y="1" width="4" height="3" fill="#334155" />
          <rect x="3" y="4" width="6" height="5" fill="#1e293b" />
          <rect x="4" y="5" width="4" height="4" fill="#f8fafc" />
          <rect x="5" y="3" width="2" height="1" fill="#fbbf24" />
          <rect x="3" y="9" width="2" height="2" fill="#fbbf24" />
          <rect x="7" y="9" width="2" height="2" fill="#fbbf24" />
        </svg>
      );

    case "Gradle":
      return (
        <svg {...px({ className })}>
          <rect x="2" y="3" width="7" height="5" fill="#10b981" />
          <rect x="8" y="2" width="2" height="3" fill="#34d399" />
          <rect x="4" y="5" width="1" height="1" fill="#fde047" />
          <rect x="3" y="8" width="2" height="2" fill="#059669" />
          <rect x="7" y="8" width="2" height="2" fill="#059669" />
        </svg>
      );

    default:
      return (
        <svg {...px({ className })}>
          <rect x="2" y="2" width="8" height="8" fill="#fbbf24" />
        </svg>
      );
  }
}
