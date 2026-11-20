import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "../data/projects";
import { playClose, playCoin, playMove, playSelect } from "../utils/arcadeSfx";
import TinyOsBrowserApp from "./TinyOsBrowserApp";
import {
  cloneDefaultVfs,
  formatCwd,
  getNode,
  isSafeEntryName,
  loadVfs,
  MAX_VFS_TEXT_LENGTH,
  resolvePath,
  saveVfs,
} from "../utils/portfolioVfs";

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

const SKILL_GROUPS = [
  {
    name: "Languages & Frameworks",
    items: ["Python", "TypeScript", "JavaScript (Next, React, Node)", "SQL", "Java", "C", "HTML/CSS"],
  },
  {
    name: "Data",
    items: ["PostgreSQL", "Pandas", "NumPy", "Scikit-Learn", "BigQuery", "GraphQL", "NoSQL", "SQLite", "R"],
  },
  {
    name: "AI & ML",
    items: ["PyTorch", "TensorFlow", "RAG", "Reinforcement Learning", "MCP", "Gemini API", "Claude", "Cursor", "Copilot", "Ollama"],
  },
  {
    name: "Cloud, DevOps, & Tools",
    items: ["AWS", "Docker", "Kubernetes", "Git", "CI/CD", "Linux", "Gradle"],
  },
];

const ALL_COMMANDS = [
  "help",
  "skills",
  "projects",
  "open",
  "goto",
  "notebad",
  "notepad",
  "paint",
  "snake",
  "browser",
  "web",
  "www",
  "files",
  "coin",
  "overclock",
  "ls",
  "cd",
  "pwd",
  "cat",
  "mkdir",
  "touch",
  "write",
  "echo",
  "rm",
  "whoami",
  "date",
  "clear",
  "resetfs",
];

const PAINT_COLORS = [
  { name: "Amber", hex: "#fbbf24" },
  { name: "Emerald", hex: "#34d399" },
  { name: "Cyan", hex: "#22d3ee" },
  { name: "White", hex: "#f8fafc" },
  { name: "Coral", hex: "#fb7185" },
  { name: "Pine", hex: "#275D38" },
  { name: "Eraser", hex: "#040a07" },
];

const PAINT_COLS = 20;
const PAINT_ROWS = 12;

const SNAKE_COLS = 16;
const SNAKE_ROWS = 10;
const SNAKE_BEST_KEY = "portfolio_os_snake_best";
const INITIAL_SNAKE = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 },
];

function createBlankGrid() {
  return Array.from({ length: PAINT_ROWS }, () =>
    Array.from({ length: PAINT_COLS }, () => "#040a07")
  );
}

function loadSnakeBest() {
  try {
    const raw = window.localStorage.getItem(SNAKE_BEST_KEY);
    return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
  } catch {
    return 0;
  }
}

function saveSnakeBest(score) {
  try {
    window.localStorage.setItem(SNAKE_BEST_KEY, String(score));
  } catch {
    // ignore storage errors
  }
}

function randomFood(occupied) {
  const open = [];
  for (let y = 0; y < SNAKE_ROWS; y += 1) {
    for (let x = 0; x < SNAKE_COLS; x += 1) {
      if (!occupied.some((seg) => seg.x === x && seg.y === y)) {
        open.push({ x, y });
      }
    }
  }
  if (open.length === 0) return { x: 0, y: 0 };
  return open[Math.floor(Math.random() * open.length)];
}

function TinyOsLogo({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="2" width="12" height="9" fill="#1e293b" stroke="#fbbf24" strokeWidth="1" />
      <rect x="3" y="3" width="10" height="7" fill="#062819" />
      <rect x="4" y="4" width="3" height="2" fill="#34d399" />
      <rect x="8" y="4" width="4" height="1" fill="#fbbf24" />
      <rect x="8" y="6" width="3" height="1" fill="#22d3ee" />
      <rect x="4" y="7" width="2" height="2" fill="#fbbf24" />
      <rect x="6" y="11" width="4" height="2" fill="#94a3b8" />
      <rect x="4" y="13" width="8" height="1" fill="#fbbf24" />
    </svg>
  );
}

function PixelFolderIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="3" width="6" height="2" />
      <rect x="1" y="5" width="14" height="9" />
      <rect x="2" y="6" width="12" height="2" opacity="0.25" fill="#000" />
    </svg>
  );
}

function PixelFileIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      <rect x="3" y="1" width="8" height="14" />
      <rect x="11" y="3" width="2" height="12" />
      <rect x="5" y="5" width="6" height="1" fill="#000" opacity="0.55" />
      <rect x="5" y="8" width="6" height="1" fill="#000" opacity="0.55" />
      <rect x="5" y="11" width="4" height="1" fill="#000" opacity="0.55" />
    </svg>
  );
}

function PixelTerminalIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="2" width="14" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="5" width="2" height="2" />
      <rect x="5" y="7" width="2" height="2" />
      <rect x="3" y="9" width="2" height="2" />
      <rect x="8" y="9" width="4" height="2" />
    </svg>
  );
}

function PixelPaintIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="2" width="11" height="10" fill="#1e293b" stroke="#f472b6" strokeWidth="1" />
      <rect x="4" y="4" width="3" height="3" fill="#fbbf24" />
      <rect x="8" y="4" width="3" height="3" fill="#34d399" />
      <rect x="4" y="8" width="3" height="2" fill="#22d3ee" />
      <rect x="9" y="9" width="5" height="5" fill="#fb7185" />
    </svg>
  );
}

function PixelNoteBadIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="2" width="10" height="12" fill="#fef3c7" />
      <rect x="2" y="2" width="10" height="2" fill="#fbbf24" />
      <rect x="4" y="6" width="6" height="1" fill="#060608" />
      <rect x="4" y="8" width="5" height="1" fill="#060608" />
      <rect x="4" y="10" width="4" height="1" fill="#060608" />
      <rect x="10" y="9" width="4" height="5" fill="#fb7185" />
    </svg>
  );
}

function PixelSnakeIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="3" width="6" height="2" fill="#10b981" />
      <rect x="6" y="5" width="2" height="5" fill="#34d399" />
      <rect x="6" y="8" width="6" height="2" fill="#34d399" />
      <rect x="10" y="6" width="3" height="3" fill="#a7f3d0" />
      <rect x="12" y="7" width="1" height="1" fill="#060608" />
      <rect x="3" y="11" width="2" height="2" fill="#fbbf24" />
    </svg>
  );
}

function PixelChipIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" style={{ imageRendering: "pixelated" }}>
      <rect x="4" y="4" width="8" height="8" />
      <rect x="6" y="1" width="1" height="3" />
      <rect x="9" y="1" width="1" height="3" />
      <rect x="6" y="12" width="1" height="3" />
      <rect x="9" y="12" width="1" height="3" />
      <rect x="1" y="6" width="3" height="1" />
      <rect x="1" y="9" width="3" height="1" />
      <rect x="12" y="6" width="3" height="1" />
      <rect x="12" y="9" width="3" height="1" />
      <rect x="6" y="6" width="4" height="4" fill="#000" opacity="0.5" />
    </svg>
  );
}

function PixelBrowserIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="2" width="14" height="12" fill="#082f49" stroke="#22d3ee" strokeWidth="1" />
      <rect x="2" y="3" width="12" height="2" fill="#22d3ee" />
      <rect x="3" y="3" width="1" height="1" fill="#060608" />
      <rect x="5" y="3" width="1" height="1" fill="#060608" />
      <rect x="3" y="7" width="4" height="5" fill="#fbbf24" />
      <rect x="8" y="7" width="5" height="2" fill="#34d399" />
      <rect x="8" y="10" width="4" height="2" fill="#e2e8f0" />
    </svg>
  );
}

function collectFiles(node, basePath = []) {
  if (!node) return [];
  if (node.type === "file") {
    return [{ name: basePath[basePath.length - 1], path: basePath }];
  }
  const results = [];
  for (const [key, child] of Object.entries(node.children || {})) {
    results.push(...collectFiles(child, [...basePath, key]));
  }
  return results;
}

const INITIAL_WINDOWS = {
  terminal: { id: "terminal", title: "TERMINAL", open: true, minimized: false, x: 145, y: 18, w: 500, h: 330, z: 3 },
  files: { id: "files", title: "FILES", open: true, minimized: false, x: 660, y: 24, w: 235, h: 255, z: 2 },
  notepad: { id: "notepad", title: "NOTEBAD", open: false, minimized: false, x: 210, y: 48, w: 430, h: 300, z: 4 },
  paint: { id: "paint", title: "PAINT", open: false, minimized: false, x: 240, y: 42, w: 430, h: 325, z: 4 },
  snake: { id: "snake", title: "SNAKE.EXE", open: false, minimized: false, x: 260, y: 36, w: 390, h: 330, z: 4 },
  browser: { id: "browser", title: "BROWSER", open: false, minimized: false, x: 170, y: 24, w: 530, h: 365, z: 4 },
  sysinfo: { id: "sysinfo", title: "SYSINFO", open: false, minimized: false, x: 290, y: 74, w: 360, h: 240, z: 4 },
};

const INITIAL_ICON_POSITIONS = {
  terminal: { x: 14, y: 14 },
  files: { x: 14, y: 80 },
  readme: { x: 14, y: 146 },
  notebad: { x: 14, y: 212 },
  paint: { x: 14, y: 278 },
  snake: { x: 14, y: 344 },
  projects: { x: 76, y: 14 },
  sysinfo: { x: 76, y: 80 },
  browser: { x: 76, y: 146 },
};

const WINDOW_STYLES = {
  terminal: {
    border: "border-emerald-500/75",
    bg: "bg-[#040a08]/95",
    bar: "border-emerald-500/40 bg-[#0a1c14]",
    title: "text-emerald-300",
    btn: "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20",
  },
  files: {
    border: "border-amber-500/70",
    bg: "bg-[#0b0a08]/95",
    bar: "border-amber-500/40 bg-[#1a1509]",
    title: "text-amber-300",
    btn: "border-amber-500/40 text-amber-300 hover:bg-amber-500/20",
  },
  notepad: {
    border: "border-amber-400/75",
    bg: "bg-[#08090c]/95",
    bar: "border-amber-400/40 bg-[#18160c]",
    title: "text-amber-300",
    btn: "border-amber-400/40 text-amber-300 hover:bg-amber-500/20",
  },
  paint: {
    border: "border-pink-400/80",
    bg: "bg-[#0b070e]/95",
    bar: "border-pink-400/40 bg-[#1b1022]",
    title: "text-pink-300",
    btn: "border-pink-400/40 text-pink-300 hover:bg-pink-500/20",
  },
  snake: {
    border: "border-emerald-400/85",
    bg: "bg-[#040b07]/95",
    bar: "border-emerald-400/40 bg-[#082015]",
    title: "text-emerald-300",
    btn: "border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/20",
  },
  browser: {
    border: "border-cyan-400/80",
    bg: "bg-[#030709]/95",
    bar: "border-cyan-400/45 bg-[#071922]",
    title: "text-cyan-300",
    btn: "border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/20",
  },
  sysinfo: {
    border: "border-cyan-400/75",
    bg: "bg-[#040a0e]/95",
    bar: "border-cyan-400/40 bg-[#081720]",
    title: "text-cyan-300",
    btn: "border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/20",
  },
};

export default function PortfolioOsSection({
  focusRequestId = 0,
  onOpenProject,
  onJumpSection,
  onInsertCoin,
  onToggleOverclock,
  overclock = false,
  credits = 0,
}) {
  const [vfs, setVfs] = useState(() => loadVfs());
  const [cwd, setCwd] = useState(["home", "adnan"]);
  const [explorerPath, setExplorerPath] = useState(["home", "adnan"]);
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [iconPositions, setIconPositions] = useState(INITIAL_ICON_POSITIONS);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [osSearch, setOsSearch] = useState("");

  // Terminal state
  const [termInput, setTermInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [lines, setLines] = useState([
    { type: "accent", text: "TINY OS v1.0 · Type `help` or drag Desktop icons." },
    { type: "muted", text: "Files created here persist in localStorage." },
  ]);

  // NoteBad state
  const [notePath, setNotePath] = useState(["home", "adnan", "README.txt"]);
  const [noteText, setNoteText] = useState(() => {
    const init = loadVfs();
    return getNode(init, ["home", "adnan", "README.txt"])?.content || "";
  });
  const [noteStatus, setNoteStatus] = useState("100% Bug-Free*");
  const [newEntryName, setNewEntryName] = useState("");

  // Pixel Paint state
  const [paintGrid, setPaintGrid] = useState(() => createBlankGrid());
  const [paintColor, setPaintColor] = useState("#fbbf24");
  const [paintDrawing, setPaintDrawing] = useState(false);
  const [paintStatus, setPaintStatus] = useState("Ready");

  // Snake state
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [snakeFood, setSnakeFood] = useState({ x: 11, y: 5 });
  const [snakeRunning, setSnakeRunning] = useState(false);
  const [snakeOver, setSnakeOver] = useState(false);
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeBest, setSnakeBest] = useState(() => loadSnakeBest());
  const snakeDirRef = useRef({ x: 1, y: 0 });
  const snakeNextDirRef = useRef({ x: 1, y: 0 });
  const snakeFoodRef = useRef(snakeFood);

  const [clockText, setClockText] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const desktopRef = useRef(null);
  const termInputRef = useRef(null);
  const termLogRef = useRef(null);
  const dragRef = useRef(null);
  const iconDragRef = useRef(null);

  useEffect(() => {
    snakeFoodRef.current = snakeFood;
  }, [snakeFood]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClockText(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (focusRequestId <= 0) return undefined;
    const timer = window.setTimeout(() => {
      setWindows((prev) => {
        const highestZ = Object.values(prev).reduce((max, w) => Math.max(max, w.z), 4);
        return {
          ...prev,
          terminal: { ...prev.terminal, open: true, minimized: false, z: highestZ + 1 },
        };
      });
      termInputRef.current?.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [focusRequestId]);

  useEffect(() => {
    if (termLogRef.current) {
      termLogRef.current.scrollTop = termLogRef.current.scrollHeight;
    }
  }, [lines]);

  // Snake game tick
  useEffect(() => {
    if (!snakeRunning || snakeOver || !windows.snake.open || windows.snake.minimized) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      const nextDir = snakeNextDirRef.current;
      snakeDirRef.current = nextDir;

      setSnake((prev) => {
        const head = prev[0];
        const nextHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };

        if (
          nextHead.x < 0 ||
          nextHead.x >= SNAKE_COLS ||
          nextHead.y < 0 ||
          nextHead.y >= SNAKE_ROWS
        ) {
          playClose();
          setSnakeOver(true);
          setSnakeRunning(false);
          return prev;
        }

        const food = snakeFoodRef.current;
        const ateFood = nextHead.x === food.x && nextHead.y === food.y;
        const bodyToCheck = ateFood ? prev : prev.slice(0, -1);

        if (bodyToCheck.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y)) {
          playClose();
          setSnakeOver(true);
          setSnakeRunning(false);
          return prev;
        }

        const nextSnake = ateFood
          ? [nextHead, ...prev]
          : [nextHead, ...prev.slice(0, -1)];

        if (ateFood) {
          playCoin();
          setSnakeScore((s) => {
            const updated = s + 10;
            setSnakeBest((best) => {
              if (updated > best) {
                saveSnakeBest(updated);
                return updated;
              }
              return best;
            });
            return updated;
          });
          setSnakeFood(randomFood(nextSnake));
        }

        return nextSnake;
      });
    }, 150);

    return () => window.clearInterval(interval);
  }, [snakeRunning, snakeOver, windows.snake.open, windows.snake.minimized]);

  const queueSnakeDir = useCallback((dx, dy) => {
    const curr = snakeDirRef.current;
    if (curr.x === -dx && curr.y === -dy) return;
    snakeNextDirRef.current = { x: dx, y: dy };
  }, []);

  const startOrResetSnake = useCallback((shouldRun = true) => {
    snakeDirRef.current = { x: 1, y: 0 };
    snakeNextDirRef.current = { x: 1, y: 0 };
    setSnake(INITIAL_SNAKE);
    setSnakeFood({ x: 11, y: 5 });
    setSnakeScore(0);
    setSnakeOver(false);
    setSnakeRunning(shouldRun);
    playSelect();
  }, []);

  // Keyboard controls for Snake when Snake window is open & active
  useEffect(() => {
    if (!windows.snake.open || windows.snake.minimized) return undefined;

    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") {
        e.preventDefault();
        queueSnakeDir(0, -1);
      } else if (key === "arrowdown" || key === "s") {
        e.preventDefault();
        queueSnakeDir(0, 1);
      } else if (key === "arrowleft" || key === "a") {
        e.preventDefault();
        queueSnakeDir(-1, 0);
      } else if (key === "arrowright" || key === "d") {
        e.preventDefault();
        queueSnakeDir(1, 0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [windows.snake.open, windows.snake.minimized, queueSnakeDir]);

  // Window + desktop-icon pointer dragging
  useEffect(() => {
    const onPointerMove = (e) => {
      const box = desktopRef.current?.getBoundingClientRect();

      const winDrag = dragRef.current;
      if (winDrag) {
        const maxX = box
          ? Math.max(4, box.width - Math.min(winDrag.w, Math.max(120, box.width - 16)))
          : 650;
        const maxY = box
          ? Math.max(4, box.height - Math.min(winDrag.h, Math.max(80, box.height - 80)) - 42)
          : 340;
        const nextX = Math.max(4, Math.min(maxX, winDrag.origX + (e.clientX - winDrag.startX)));
        const nextY = Math.max(4, Math.min(maxY, winDrag.origY + (e.clientY - winDrag.startY)));
        setWindows((prev) => ({
          ...prev,
          [winDrag.id]: { ...prev[winDrag.id], x: nextX, y: nextY },
        }));
      }

      const iconDrag = iconDragRef.current;
      if (iconDrag) {
        const dx = e.clientX - iconDrag.startX;
        const dy = e.clientY - iconDrag.startY;
        if (Math.hypot(dx, dy) >= 5) {
          iconDrag.moved = true;
        }
        const maxX = box ? Math.max(60, box.width - 68) : 780;
        const maxY = box ? Math.max(60, box.height - 96) : 360;
        const nextX = Math.max(4, Math.min(maxX, iconDrag.origX + dx));
        const nextY = Math.max(4, Math.min(maxY, iconDrag.origY + dy));
        setIconPositions((prev) => ({
          ...prev,
          [iconDrag.id]: { x: nextX, y: nextY },
        }));
      }
    };

    const onPointerUp = () => {
      dragRef.current = null;
      if (iconDragRef.current) {
        const finished = iconDragRef.current;
        iconDragRef.current = null;
        if (!finished.moved) {
          finished.onClick?.();
        }
      }
      setPaintDrawing(false);
    };

    const onCancelDrag = () => {
      dragRef.current = null;
      iconDragRef.current = null;
      setPaintDrawing(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onCancelDrag);
    window.addEventListener("blur", onCancelDrag);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onCancelDrag);
      window.removeEventListener("blur", onCancelDrag);
    };
  }, []);

  const focusWindow = useCallback((id) => {
    setWindows((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const highestZ = Object.values(prev).reduce((max, w) => Math.max(max, w.z), 4);
      if (current.open && !current.minimized && current.z === highestZ && highestZ > 4) {
        return prev;
      }
      return {
        ...prev,
        [id]: { ...current, open: true, minimized: false, z: highestZ + 1 },
      };
    });
  }, []);

  const closeWindow = (id) => {
    playClose();
    if (id === "snake") setSnakeRunning(false);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], open: false },
    }));
  };

  const minimizeWindow = (id) => {
    playMove();
    if (id === "snake") setSnakeRunning(false);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: true },
    }));
  };

  const startDragWindow = (e, id) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow(id);
    const win = windows[id];
    if (!win) return;
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
      w: win.w,
      h: win.h,
    };
  };

  const startDragIcon = (e, id, onClick) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const pos = iconPositions[id];
    if (!pos) return;
    iconDragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
      onClick,
    };
  };

  const openFileInNoteBad = (parts) => {
    const node = getNode(vfs, parts);
    if (!node || node.type !== "file") return;
    setNotePath(parts);
    setNoteText(node.content);
    setNoteStatus("100% Bug-Free*");
    playSelect();
    focusWindow("notepad");
  };

  const handleSaveNote = () => {
    if (notePath.length < 1) return;
    const parentParts = notePath.slice(0, -1);
    const fileName = notePath[notePath.length - 1];
    if (!isSafeEntryName(fileName)) return;
    const nextVfs = JSON.parse(JSON.stringify(vfs));
    const parent = getNode(nextVfs, parentParts);
    if (!parent || parent.type !== "dir") return;
    parent.children[fileName] = {
      type: "file",
      content: noteText.slice(0, MAX_VFS_TEXT_LENGTH),
    };
    setVfs(nextVfs);
    saveVfs(nextVfs);
    playSelect();
    setNoteStatus(`Saved ${fileName}`);
  };

  const handleSavePaintToVfs = () => {
    const nextVfs = JSON.parse(JSON.stringify(vfs));
    const home = getNode(nextVfs, ["home", "adnan"]);
    if (!home || home.type !== "dir") return;
    const ascii = paintGrid
      .map((row) => row.map((c) => (c === "#040a07" ? "." : "#")).join(""))
      .join("\n");
    home.children["sketch.art"] = {
      type: "file",
      content: `Pixel Paint Sketch (${PAINT_COLS}x${PAINT_ROWS}):\n\n${ascii}`,
    };
    setVfs(nextVfs);
    saveVfs(nextVfs);
    playSelect();
    setPaintStatus("Saved ~/sketch.art");
  };

  const paintCell = (r, c) => {
    setPaintGrid((prev) =>
      prev.map((row, rIdx) =>
        rIdx === r ? row.map((cell, cIdx) => (cIdx === c ? paintColor : cell)) : row
      )
    );
  };

  const createEntryInExplorer = (kind) => {
    const clean = newEntryName.trim().replace(/[/\\]/g, "");
    if (!isSafeEntryName(clean)) return;
    const nextVfs = JSON.parse(JSON.stringify(vfs));
    const dir = getNode(nextVfs, explorerPath);
    if (!dir || dir.type !== "dir" || Object.prototype.hasOwnProperty.call(dir.children, clean)) {
      return;
    }

    dir.children[clean] =
      kind === "dir"
        ? { type: "dir", children: {} }
        : { type: "file", content: "" };

    setVfs(nextVfs);
    saveVfs(nextVfs);
    setNewEntryName("");
    playSelect();

    if (kind === "file") {
      setNotePath([...explorerPath, clean]);
      setNoteText("");
      setNoteStatus("Fresh file, zero typos yet");
      focusWindow("notepad");
    }
  };

  const deleteEntryInExplorer = (name) => {
    if (!isSafeEntryName(name)) return;
    if (explorerPath.length <= 2 && ["README.txt", "projects"].includes(name)) return;
    const nextVfs = JSON.parse(JSON.stringify(vfs));
    const dir = getNode(nextVfs, explorerPath);
    if (!dir || dir.type !== "dir" || !Object.prototype.hasOwnProperty.call(dir.children, name)) {
      return;
    }
    delete dir.children[name];
    setVfs(nextVfs);
    saveVfs(nextVfs);
    playClose();
  };

  const appendLines = (entries) => {
    setLines((prev) => [...prev, ...entries].slice(-250));
  };

  const runCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    const promptStr = `adnan@os:${formatCwd(cwd)}$ ${rawInput}`;
    if (!trimmed) {
      appendLines([{ type: "prompt", text: promptStr }]);
      return;
    }

    setHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);

    const echoRedirect = trimmed.match(/^echo\s+(.+?)\s*>\s*(\S+)$/i);
    if (echoRedirect) {
      let text = echoRedirect[1].trim();
      if (
        (text.startsWith('"') && text.endsWith('"')) ||
        (text.startsWith("'") && text.endsWith("'"))
      ) {
        text = text.slice(1, -1);
      }
      const targetParts = resolvePath(cwd, echoRedirect[2]);
      if (targetParts.length === 0) {
        appendLines([
          { type: "prompt", text: promptStr },
          { type: "error", text: "Cannot overwrite root directory." },
        ]);
        return;
      }
      const parentParts = targetParts.slice(0, -1);
      const fileName = targetParts[targetParts.length - 1];
      if (!isSafeEntryName(fileName)) {
        appendLines([
          { type: "prompt", text: promptStr },
          { type: "error", text: `Invalid filename: ${fileName}` },
        ]);
        return;
      }
      const nextVfs = JSON.parse(JSON.stringify(vfs));
      const parent = getNode(nextVfs, parentParts);
      if (!parent || parent.type !== "dir") {
        appendLines([
          { type: "prompt", text: promptStr },
          { type: "error", text: `Directory not found: /${parentParts.join("/")}` },
        ]);
        return;
      }
      if (
        Object.prototype.hasOwnProperty.call(parent.children, fileName) &&
        parent.children[fileName]?.type === "dir"
      ) {
        appendLines([
          { type: "prompt", text: promptStr },
          { type: "error", text: `${fileName} is a directory.` },
        ]);
        return;
      }
      const bounded = text.slice(0, MAX_VFS_TEXT_LENGTH);
      parent.children[fileName] = { type: "file", content: bounded };
      setVfs(nextVfs);
      saveVfs(nextVfs);
      playSelect();
      appendLines([
        { type: "prompt", text: promptStr },
        { type: "accent", text: `Wrote ${bounded.length} bytes to ${fileName}.` },
      ]);
      return;
    }

    const [cmdRaw, ...args] = trimmed.split(/\s+/);
    const cmd = cmdRaw.toLowerCase();
    const out = [{ type: "prompt", text: promptStr }];

    switch (cmd) {
      case "help": {
        out.push(
          { type: "accent", text: "PORTFOLIO COMMANDS:" },
          { type: "text", text: "  skills [q] | projects | open <proj> | goto <sec> | coin | overclock" },
          { type: "accent", text: "OS, APPS & FILE COMMANDS:" },
          { type: "text", text: "  ls | cd | pwd | cat <file> | notebad [file] | paint | snake | browser | files | clear" },
          { type: "text", text: "  mkdir <dir> | touch <file> | write <file> <text> | echo \"hi\" > f | rm <name> | resetfs" }
        );
        break;
      }
      case "clear": {
        setLines([]);
        return;
      }
      case "whoami": {
        out.push({ type: "text", text: "adnan (CS @ University of Alberta · Tiny OS)" });
        break;
      }
      case "date": {
        out.push({ type: "text", text: new Date().toString() });
        break;
      }
      case "pwd": {
        out.push({ type: "text", text: `/${cwd.join("/")}` });
        break;
      }
      case "coin": {
        onInsertCoin?.();
        out.push({ type: "accent", text: "INSERTED 1 COIN (+1 CREDITS)" });
        break;
      }
      case "overclock": {
        onToggleOverclock?.();
        out.push({
          type: "accent",
          text: overclock ? "OVERCLOCK DISABLED" : "OVERCLOCK ENGAGED",
        });
        break;
      }
      case "files": {
        focusWindow("files");
        out.push({ type: "accent", text: "Focused File Explorer." });
        break;
      }
      case "paint": {
        focusWindow("paint");
        out.push({ type: "accent", text: "Opened Pixel Paint." });
        break;
      }
      case "snake": {
        focusWindow("snake");
        startOrResetSnake(true);
        out.push({ type: "accent", text: "Launched SNAKE.EXE." });
        break;
      }
      case "browser":
      case "web":
      case "www": {
        focusWindow("browser");
        out.push({ type: "accent", text: "Launched Pixel Browser (http://adnan.local)." });
        break;
      }
      case "notebad":
      case "notepad": {
        if (args[0]) {
          const targetParts = resolvePath(cwd, args[0]);
          const node = getNode(vfs, targetParts);
          if (node?.type === "file") {
            openFileInNoteBad(targetParts);
            out.push({ type: "accent", text: `Opened ${args[0]} in NoteBad.` });
          } else {
            out.push({ type: "error", text: `notebad: ${args[0]}: No such file` });
          }
        } else {
          focusWindow("notepad");
          out.push({ type: "accent", text: "Opened NoteBad." });
        }
        break;
      }
      case "skills": {
        const q = args.join(" ").toLowerCase();
        if (!q) {
          for (const g of SKILL_GROUPS) {
            out.push({ type: "accent", text: `[${g.name}]` });
            out.push({ type: "text", text: `  ${g.items.join(", ")}` });
          }
        } else {
          let found = 0;
          for (const g of SKILL_GROUPS) {
            const matches = g.items.filter((s) => s.toLowerCase().includes(q));
            if (matches.length > 0) {
              found += matches.length;
              out.push({ type: "accent", text: `${g.name}: ${matches.join(", ")}` });
            }
          }
          if (found === 0) {
            out.push({ type: "muted", text: `No skills matching "${args.join(" ")}".` });
          }
        }
        break;
      }
      case "projects": {
        for (const p of PROJECTS) {
          out.push({ type: "text", text: `• ${p.id.padEnd(17, " ")} ${p.title}` });
        }
        out.push({ type: "muted", text: "Run `open <id>` (e.g. `open truecursor`)." });
        break;
      }
      case "open": {
        const query = args.join(" ").toLowerCase();
        if (!query) {
          out.push({ type: "error", text: "Usage: open <project> (e.g. `open truecursor`)" });
          break;
        }
        const match = PROJECTS.find(
          (p) =>
            p.id.toLowerCase() === query ||
            p.id.toLowerCase().includes(query) ||
            p.label.toLowerCase().includes(query) ||
            p.title.toLowerCase().includes(query)
        );
        if (!match) {
          out.push({ type: "error", text: `Project not found: ${query}` });
          break;
        }
        playSelect();
        onOpenProject?.(match.id);
        out.push({ type: "accent", text: `Launched ${match.label}.` });
        break;
      }
      case "goto": {
        const target = (args[0] || "").toLowerCase();
        const valid = ["intro", "skills", "education", "os", "experience", "projects", "chess"];
        if (!valid.includes(target)) {
          out.push({ type: "error", text: `Choose one of: ${valid.join(", ")}` });
          break;
        }
        onJumpSection?.(target);
        out.push({ type: "accent", text: `Jumped to #${target}.` });
        break;
      }
      case "ls": {
        const targetParts = args[0] ? resolvePath(cwd, args[0]) : cwd;
        const node = getNode(vfs, targetParts);
        if (!node) {
          out.push({ type: "error", text: `ls: cannot access '${args[0]}': No such file or directory` });
        } else if (node.type === "file") {
          out.push({ type: "text", text: targetParts[targetParts.length - 1] });
        } else {
          const names = Object.keys(node.children).sort();
          if (names.length === 0) {
            out.push({ type: "muted", text: "(empty directory)" });
          } else {
            out.push({
              type: "text",
              text: names
                .map((n) => (node.children[n].type === "dir" ? `${n}/` : n))
                .join("   "),
            });
          }
        }
        break;
      }
      case "cd": {
        const targetParts = resolvePath(cwd, args[0] || "~");
        const node = getNode(vfs, targetParts);
        if (!node) out.push({ type: "error", text: `cd: ${args[0]}: No such directory` });
        else if (node.type !== "dir") out.push({ type: "error", text: `cd: ${args[0]}: Not a directory` });
        else setCwd(targetParts);
        break;
      }
      case "cat": {
        if (!args[0]) {
          out.push({ type: "error", text: "Usage: cat <file>" });
          break;
        }
        const targetParts = resolvePath(cwd, args[0]);
        const node = getNode(vfs, targetParts);
        if (!node) out.push({ type: "error", text: `cat: ${args[0]}: No such file` });
        else if (node.type === "dir") out.push({ type: "error", text: `cat: ${args[0]}: Is a directory` });
        else {
          for (const line of node.content.split("\n")) {
            out.push({ type: "text", text: line || " " });
          }
        }
        break;
      }
      case "mkdir": {
        if (!args[0]) {
          out.push({ type: "error", text: "Usage: mkdir <name>" });
          break;
        }
        const targetParts = resolvePath(cwd, args[0]);
        const parentParts = targetParts.slice(0, -1);
        const dirName = targetParts[targetParts.length - 1];
        if (!isSafeEntryName(dirName)) {
          out.push({ type: "error", text: `mkdir: invalid directory name '${dirName || ""}'` });
          break;
        }
        const nextVfs = JSON.parse(JSON.stringify(vfs));
        const parent = getNode(nextVfs, parentParts);
        if (!parent || parent.type !== "dir") out.push({ type: "error", text: "Parent directory not found." });
        else if (Object.prototype.hasOwnProperty.call(parent.children, dirName)) out.push({ type: "error", text: `mkdir: ${dirName}: Already exists` });
        else {
          parent.children[dirName] = { type: "dir", children: {} };
          setVfs(nextVfs);
          saveVfs(nextVfs);
          out.push({ type: "accent", text: `Created directory ${dirName}/` });
        }
        break;
      }
      case "touch": {
        if (!args[0]) {
          out.push({ type: "error", text: "Usage: touch <filename>" });
          break;
        }
        const targetParts = resolvePath(cwd, args[0]);
        const parentParts = targetParts.slice(0, -1);
        const fileName = targetParts[targetParts.length - 1];
        if (!isSafeEntryName(fileName)) {
          out.push({ type: "error", text: `touch: invalid filename '${fileName || ""}'` });
          break;
        }
        const nextVfs = JSON.parse(JSON.stringify(vfs));
        const parent = getNode(nextVfs, parentParts);
        if (!parent || parent.type !== "dir") out.push({ type: "error", text: "Parent directory not found." });
        else if (!Object.prototype.hasOwnProperty.call(parent.children, fileName)) {
          parent.children[fileName] = { type: "file", content: "" };
          setVfs(nextVfs);
          saveVfs(nextVfs);
          out.push({ type: "accent", text: `Created file ${fileName}` });
        } else {
          out.push({ type: "muted", text: `${fileName} already exists.` });
        }
        break;
      }
      case "write": {
        if (args.length < 2) {
          out.push({ type: "error", text: "Usage: write <file> <text>" });
          break;
        }
        const targetParts = resolvePath(cwd, args[0]);
        const parentParts = targetParts.slice(0, -1);
        const fileName = targetParts[targetParts.length - 1];
        if (!isSafeEntryName(fileName)) {
          out.push({ type: "error", text: `write: invalid filename '${fileName || ""}'` });
          break;
        }
        const content = args.slice(1).join(" ").slice(0, MAX_VFS_TEXT_LENGTH);
        const nextVfs = JSON.parse(JSON.stringify(vfs));
        const parent = getNode(nextVfs, parentParts);
        if (!parent || parent.type !== "dir") out.push({ type: "error", text: "Parent directory not found." });
        else if (
          Object.prototype.hasOwnProperty.call(parent.children, fileName) &&
          parent.children[fileName]?.type === "dir"
        ) out.push({ type: "error", text: `${fileName} is a directory.` });
        else {
          parent.children[fileName] = { type: "file", content };
          setVfs(nextVfs);
          saveVfs(nextVfs);
          out.push({ type: "accent", text: `Saved ${fileName}.` });
        }
        break;
      }
      case "echo": {
        out.push({ type: "text", text: args.join(" ") });
        break;
      }
      case "rm": {
        if (!args[0]) {
          out.push({ type: "error", text: "Usage: rm <name>" });
          break;
        }
        const targetParts = resolvePath(cwd, args[0]);
        if (targetParts.length <= 2) {
          out.push({ type: "error", text: "Cannot remove system/home directory." });
          break;
        }
        const parentParts = targetParts.slice(0, -1);
        const targetName = targetParts[targetParts.length - 1];
        if (!isSafeEntryName(targetName)) {
          out.push({ type: "error", text: `rm: ${args[0]}: Invalid target` });
          break;
        }
        const nextVfs = JSON.parse(JSON.stringify(vfs));
        const parent = getNode(nextVfs, parentParts);
        if (!parent || !Object.prototype.hasOwnProperty.call(parent.children, targetName)) out.push({ type: "error", text: `rm: ${args[0]}: Not found` });
        else {
          delete parent.children[targetName];
          setVfs(nextVfs);
          saveVfs(nextVfs);
          out.push({ type: "muted", text: `Removed ${targetName}.` });
        }
        break;
      }
      case "resetfs": {
        const fresh = cloneDefaultVfs();
        setVfs(fresh);
        saveVfs(fresh);
        setCwd(["home", "adnan"]);
        setExplorerPath(["home", "adnan"]);
        out.push({ type: "accent", text: "Filesystem reset to default." });
        break;
      }
      default: {
        out.push({ type: "error", text: `Command not found: ${cmd}. Type \`help\`.` });
      }
    }

    playMove();
    appendLines(out);
  };

  const handleTermKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = termInput;
      setTermInput("");
      runCommand(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = Math.min(history.length - 1, historyIdx + 1);
      setHistoryIdx(nextIdx);
      setTermInput(history[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setTermInput("");
      } else {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setTermInput(history[nextIdx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = termInput.split(" ");
      if (parts.length === 1) {
        const match = ALL_COMMANDS.find((c) => c.startsWith(parts[0].toLowerCase()));
        if (match) setTermInput(`${match} `);
      } else if (parts.length === 2 && parts[0].toLowerCase() === "open") {
        const match = PROJECTS.find((p) => p.id.startsWith(parts[1].toLowerCase()));
        if (match) setTermInput(`open ${match.id}`);
      } else {
        const node = getNode(vfs, cwd);
        if (node?.type === "dir") {
          const partial = parts[parts.length - 1];
          const match = Object.keys(node.children).find((k) => k.startsWith(partial));
          if (match) {
            parts[parts.length - 1] = match;
            setTermInput(parts.join(" "));
          }
        }
      }
    }
  };

  const searchResults = useMemo(() => {
    const q = osSearch.trim().toLowerCase();
    if (!q) return [];
    const results = [];

    const apps = [
      { kind: "app", label: "Terminal", id: "terminal" },
      { kind: "app", label: "Files", id: "files" },
      { kind: "app", label: "NoteBad", id: "notepad" },
      { kind: "app", label: "Pixel Paint", id: "paint" },
      { kind: "app", label: "Snake.exe", id: "snake" },
      { kind: "app", label: "Pixel Browser", id: "browser" },
      { kind: "app", label: "SysInfo", id: "sysinfo" },
    ];
    for (const a of apps) {
      if (a.label.toLowerCase().includes(q)) results.push(a);
    }

    for (const file of collectFiles(vfs)) {
      if (file.name.toLowerCase().includes(q)) {
        results.push({ kind: "file", label: file.name, path: file.path });
      }
    }

    for (const proj of PROJECTS) {
      if (
        proj.label.toLowerCase().includes(q) ||
        proj.title.toLowerCase().includes(q)
      ) {
        results.push({ kind: "project", label: proj.label, id: proj.id });
      }
    }

    return results.slice(0, 7);
  }, [osSearch, vfs]);

  const desktopIcons = [
    {
      id: "terminal",
      label: "TERM",
      color: "text-emerald-300 hover:bg-emerald-500/15",
      Icon: PixelTerminalIcon,
      onOpen: () => {
        playSelect();
        focusWindow("terminal");
      },
    },
    {
      id: "files",
      label: "FILES",
      color: "text-amber-300 hover:bg-amber-500/15",
      Icon: PixelFolderIcon,
      onOpen: () => {
        playSelect();
        focusWindow("files");
      },
    },
    {
      id: "readme",
      label: "README",
      color: "text-white/85 hover:bg-white/10",
      Icon: PixelFileIcon,
      onOpen: () => openFileInNoteBad(["home", "adnan", "README.txt"]),
    },
    {
      id: "notebad",
      label: "NOTEBAD",
      color: "text-amber-200 hover:bg-amber-500/15",
      Icon: PixelNoteBadIcon,
      onOpen: () => {
        playSelect();
        focusWindow("notepad");
      },
    },
    {
      id: "paint",
      label: "PAINT",
      color: "text-pink-300 hover:bg-pink-500/15",
      Icon: PixelPaintIcon,
      onOpen: () => {
        playSelect();
        focusWindow("paint");
      },
    },
    {
      id: "snake",
      label: "SNAKE",
      color: "text-emerald-300 hover:bg-emerald-500/15",
      Icon: PixelSnakeIcon,
      onOpen: () => {
        playSelect();
        focusWindow("snake");
      },
    },
    {
      id: "projects",
      label: "PROJECTS",
      color: "text-amber-300 hover:bg-amber-500/15",
      Icon: PixelFolderIcon,
      onOpen: () => {
        playSelect();
        setExplorerPath(["home", "adnan", "projects"]);
        focusWindow("files");
      },
    },
    {
      id: "browser",
      label: "BROWSER",
      color: "text-cyan-300 hover:bg-cyan-500/15",
      Icon: PixelBrowserIcon,
      onOpen: () => {
        playSelect();
        focusWindow("browser");
      },
    },
    {
      id: "sysinfo",
      label: "SYSINFO",
      color: "text-cyan-300 hover:bg-cyan-500/15",
      Icon: PixelChipIcon,
      onOpen: () => {
        playSelect();
        focusWindow("sysinfo");
      },
    },
  ];

  const explorerDir = getNode(vfs, explorerPath);
  const explorerItems =
    explorerDir?.type === "dir"
      ? Object.entries(explorerDir.children).sort(([aName, aNode], [bName, bNode]) => {
          if (aNode.type !== bNode.type) return aNode.type === "dir" ? -1 : 1;
          return aName.localeCompare(bName);
        })
      : [];

  const noteWordCount = noteText.trim() ? noteText.trim().split(/\s+/).length : 0;

  // Shared app content renderers for both desktop windows and mobile stacked windows
  const renderAppBody = (id) => {
    if (id === "terminal") {
      return (
        <>
          <div
            ref={termLogRef}
            onClick={() => termInputRef.current?.focus()}
            className="arcade-body flex-1 space-y-1 overflow-y-auto p-3 text-[12px] leading-relaxed"
          >
            {lines.map((entry, idx) => (
              <pre
                key={idx}
                className={`whitespace-pre-wrap break-words ${
                  entry.type === "prompt"
                    ? "text-amber-300"
                    : entry.type === "accent"
                      ? "text-emerald-300"
                      : entry.type === "error"
                        ? "text-rose-400"
                        : entry.type === "muted"
                          ? "text-white/50"
                          : "text-white/85"
                }`}
              >
                {entry.text}
              </pre>
            ))}
          </div>
          <div className="arcade-body flex items-center gap-2 border-t border-emerald-500/30 bg-black/80 px-3 py-2 text-[12px]">
            <span className="shrink-0 font-semibold text-emerald-400">
              {formatCwd(cwd)}$
            </span>
            <input
              ref={termInputRef}
              type="text"
              value={termInput}
              onChange={(e) => setTermInput(e.target.value)}
              onKeyDown={handleTermKeyDown}
              placeholder="type `help` or `ls`..."
              aria-label="Tiny OS terminal input"
              className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none"
            />
          </div>
        </>
      );
    }

    if (id === "files") {
      return (
        <>
          <div className="flex items-center gap-1 border-b border-white/10 bg-black/50 px-2 py-1.5">
            {explorerPath.length > 2 && (
              <button
                type="button"
                onClick={() => setExplorerPath((p) => p.slice(0, -1))}
                className="cursor-pointer rounded border border-white/20 px-1.5 py-0.5 text-[7px] text-amber-300 hover:bg-white/10"
                style={PIXEL_FONT}
              >
                ..
              </button>
            )}
            <input
              type="text"
              value={newEntryName}
              onChange={(e) => setNewEntryName(e.target.value)}
              placeholder="new name..."
              className="arcade-body min-w-0 flex-1 rounded border border-white/15 bg-black/70 px-1.5 py-0.5 text-[11px] text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => createEntryInExplorer("file")}
              className="cursor-pointer rounded border border-amber-500/50 bg-amber-950/50 px-1.5 py-0.5 text-[7px] text-amber-300 hover:bg-amber-500/25"
              style={PIXEL_FONT}
              title="Create File"
            >
              +F
            </button>
            <button
              type="button"
              onClick={() => createEntryInExplorer("dir")}
              className="cursor-pointer rounded border border-emerald-500/50 bg-emerald-950/50 px-1.5 py-0.5 text-[7px] text-emerald-300 hover:bg-emerald-500/25"
              style={PIXEL_FONT}
              title="Create Folder"
            >
              +D
            </button>
          </div>
          <div className="arcade-body flex-1 space-y-1 overflow-y-auto p-2 text-[12px]">
            {explorerItems.length === 0 ? (
              <p className="py-4 text-center text-white/40">(empty)</p>
            ) : (
              explorerItems.map(([name, node]) => (
                <div
                  key={name}
                  className="group flex items-center justify-between rounded px-2 py-1 hover:bg-white/10"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (node.type === "dir") {
                        playMove();
                        setExplorerPath([...explorerPath, name]);
                      } else {
                        openFileInNoteBad([...explorerPath, name]);
                      }
                    }}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left text-white/90 focus:outline-none"
                  >
                    {node.type === "dir" ? (
                      <PixelFolderIcon className="h-4 w-4 shrink-0 text-amber-400" />
                    ) : (
                      <PixelFileIcon className="h-4 w-4 shrink-0 text-emerald-300" />
                    )}
                    <span className="truncate">{name}</span>
                  </button>
                  {!(explorerPath.length <= 2 && ["README.txt", "projects"].includes(name)) && (
                    <button
                      type="button"
                      onClick={() => deleteEntryInExplorer(name)}
                      className="cursor-pointer px-1 text-[10px] text-white/30 transition group-hover:opacity-100 hover:text-rose-400 md:opacity-0"
                      title="Delete"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      );
    }

    if (id === "notepad") {
      return (
        <>
          <div className="arcade-body flex items-center gap-3 border-b border-white/10 bg-black/60 px-3 py-1 text-[11px] text-white/70">
            <button type="button" onClick={handleSaveNote} className="cursor-pointer hover:text-amber-300">
              File
            </button>
            <button
              type="button"
              onClick={() => setNoteStatus("Undo is overrated")}
              className="cursor-pointer hover:text-amber-300"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setNoteStatus("Vibes: Immaculate")}
              className="cursor-pointer hover:text-emerald-300"
            >
              Vibes
            </button>
            <button
              type="button"
              onClick={() => setNoteStatus("NoteBad v1.0")}
              className="cursor-pointer hover:text-cyan-300"
            >
              Help
            </button>
          </div>
          <textarea
            value={noteText}
            onChange={(e) => {
              setNoteText(e.target.value);
              setNoteStatus("Unsaved genius");
            }}
            aria-label="NoteBad text editor"
            className="arcade-body min-h-[140px] flex-1 resize-none bg-transparent p-3 text-[12px] leading-relaxed text-white/90 focus:outline-none"
          />
          <div className="arcade-body flex items-center justify-between border-t border-white/10 bg-black/60 px-3 py-1 text-[11px] text-emerald-300/80">
            <span>{formatCwd(notePath)} · {noteWordCount}w</span>
            <span>{noteStatus}</span>
          </div>
        </>
      );
    }

    if (id === "paint") {
      return (
        <>
          <div className="flex items-center gap-2 border-b border-white/10 bg-black/60 px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              {PAINT_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    playMove();
                    setPaintColor(c.hex);
                    setPaintStatus(c.name);
                  }}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  className={`h-4 w-4 cursor-pointer rounded-sm border transition ${
                    paintColor === c.hex
                      ? "scale-125 border-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                      : "border-white/30"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                playClose();
                setPaintGrid(createBlankGrid());
                setPaintStatus("Cleared");
              }}
              className="ml-auto cursor-pointer rounded border border-white/25 px-2 py-0.5 text-[7px] text-white/80 hover:border-pink-300 hover:text-pink-200"
              style={PIXEL_FONT}
            >
              CLEAR
            </button>
          </div>
          <div
            onPointerLeave={() => setPaintDrawing(false)}
            className="flex flex-1 items-center justify-center bg-[#040608] p-2.5"
          >
            <div
              className="grid w-full max-w-[360px] select-none gap-px border border-white/15 bg-white/10 p-px"
              style={{ gridTemplateColumns: `repeat(${PAINT_COLS}, minmax(0, 1fr))` }}
            >
              {paintGrid.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setPaintDrawing(true);
                      paintCell(r, c);
                    }}
                    onPointerEnter={() => {
                      if (paintDrawing) paintCell(r, c);
                    }}
                    style={{ backgroundColor: cell }}
                    className="aspect-square w-full cursor-crosshair"
                  />
                ))
              )}
            </div>
          </div>
          <div className="arcade-body flex items-center justify-between border-t border-white/10 bg-black/60 px-3 py-1 text-[11px] text-pink-200/80">
            <span>{PAINT_COLS}x{PAINT_ROWS} Canvas</span>
            <span>{paintStatus}</span>
          </div>
        </>
      );
    }

    if (id === "snake") {
      return (
        <>
          <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-3 py-1.5">
            <div className="flex gap-3 text-[8px]" style={PIXEL_FONT}>
              <span className="text-emerald-300">SCR {snakeScore}</span>
              <span className="text-amber-300">BEST {snakeBest}</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (snakeOver) startOrResetSnake(true);
                  else {
                    playSelect();
                    setSnakeRunning((r) => !r);
                  }
                }}
                className="cursor-pointer rounded border border-emerald-400/60 bg-emerald-950/60 px-2 py-0.5 text-[7px] text-emerald-200 hover:bg-emerald-800/50"
                style={PIXEL_FONT}
              >
                {snakeOver ? "RETRY" : snakeRunning ? "PAUSE" : "PLAY"}
              </button>
              <button
                type="button"
                onClick={() => startOrResetSnake(false)}
                className="cursor-pointer rounded border border-white/25 px-2 py-0.5 text-[7px] text-white/75 hover:text-white"
                style={PIXEL_FONT}
              >
                RST
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center bg-[#030805] p-2">
            <div
              className="grid w-full max-w-[320px] gap-px border border-emerald-500/35 bg-emerald-950/30 p-px"
              style={{ gridTemplateColumns: `repeat(${SNAKE_COLS}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: SNAKE_ROWS }).map((_, r) =>
                Array.from({ length: SNAKE_COLS }).map((__, c) => {
                  const isHead = snake[0].x === c && snake[0].y === r;
                  const isBody = !isHead && snake.some((seg) => seg.x === c && seg.y === r);
                  const isFood = snakeFood.x === c && snakeFood.y === r;
                  const cellClass = isHead
                    ? "bg-emerald-200"
                    : isBody
                      ? "bg-emerald-500"
                      : isFood
                        ? "bg-amber-400"
                        : "bg-[#040d08]";
                  return <div key={`${r}-${c}`} className={`aspect-square w-full ${cellClass}`} />;
                })
              )}
            </div>

            {snakeOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75">
                <p className="text-[11px] text-rose-400" style={PIXEL_FONT}>GAME OVER</p>
                <button
                  type="button"
                  onClick={() => startOrResetSnake(true)}
                  className="mt-3 cursor-pointer rounded border-2 border-emerald-400 bg-emerald-950/80 px-3 py-1.5 text-[8px] text-emerald-200 hover:bg-emerald-800/60"
                  style={PIXEL_FONT}
                >
                  PLAY AGAIN
                </button>
              </div>
            )}
          </div>

          {/* Touch & Mouse D-pad */}
          <div className="flex items-center justify-between border-t border-white/10 bg-black/65 px-3 py-1.5">
            <span className="arcade-body text-[11px] text-white/60">WASD / Arrows</span>
            <div className="flex gap-1">
              {[
                { label: "◄", dx: -1, dy: 0 },
                { label: "▲", dx: 0, dy: -1 },
                { label: "▼", dx: 0, dy: 1 },
                { label: "►", dx: 1, dy: 0 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => {
                    queueSnakeDir(btn.dx, btn.dy);
                    if (!snakeRunning && !snakeOver) setSnakeRunning(true);
                  }}
                  className="cursor-pointer rounded border border-emerald-500/40 bg-emerald-950/50 px-2 py-0.5 text-[8px] text-emerald-300 hover:bg-emerald-700/40"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </>
      );
    }

    if (id === "browser") {
      return <TinyOsBrowserApp onOpenProject={onOpenProject} />;
    }

    // sysinfo
    return (
      <div className="arcade-body space-y-2 p-4 text-[12px] leading-relaxed text-white/85">
        <div className="flex items-center gap-2">
          <TinyOsLogo className="h-5 w-5" />
          <span className="font-semibold text-cyan-300">TINY OS v1.0</span>
        </div>
        <p>Host: University of Alberta · CS</p>
        <p>Credits: {String(credits).padStart(2, "0")}</p>
        <p>
          Motherboard Clock:{" "}
          <span className={overclock ? "text-cyan-300" : "text-emerald-300"}>
            {overclock ? "OVERCLOCK (2.8x)" : "STANDARD (1.0x)"}
          </span>
        </p>
        <p className="text-white/60">
          Konami Code: Up Up Down Down Left Right Left Right B A
        </p>
      </div>
    );
  };

  const renderWindowHeaderActions = (win) => {
    const style = WINDOW_STYLES[win.id];
    return (
      <div className="flex gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
        {win.id === "notepad" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSaveNote();
            }}
            className="cursor-pointer rounded border border-emerald-400/60 bg-emerald-950/60 px-2 py-0.5 text-[7px] text-emerald-300 hover:bg-emerald-500/25"
            style={PIXEL_FONT}
          >
            SAVE
          </button>
        )}
        {win.id === "paint" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSavePaintToVfs();
            }}
            className="cursor-pointer rounded border border-emerald-400/60 bg-emerald-950/60 px-2 py-0.5 text-[7px] text-emerald-300 hover:bg-emerald-500/25"
            style={PIXEL_FONT}
          >
            SAVE
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            minimizeWindow(win.id);
          }}
          className={`hidden cursor-pointer rounded border px-1.5 py-0.5 text-[7px] md:inline-block ${style.btn}`}
          style={PIXEL_FONT}
        >
          _
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(win.id);
          }}
          className={`cursor-pointer rounded border px-1.5 py-0.5 text-[7px] hover:bg-rose-500/30 ${style.btn}`}
          style={PIXEL_FONT}
        >
          X
        </button>
      </div>
    );
  };

  const getWindowTitle = (win) => {
    if (win.id === "terminal") return "TERMINAL · adnan@os";
    if (win.id === "files") return `FILES · ${formatCwd(explorerPath)}`;
    if (win.id === "notepad") return `NOTEBAD · ${notePath[notePath.length - 1]}`;
    if (win.id === "browser") return "PIXELFOX · http://adnan.local";
    return win.title;
  };

  return (
    <section
      id="os"
      aria-labelledby="os-heading"
      className="arcade-screen relative mx-auto w-full max-w-[59rem] px-6 py-6"
    >
      <div className="mb-5 flex items-center justify-center gap-3">
        <span className="h-0.5 w-14 bg-amber-500/40" />
        <div className="flex items-center gap-2.5">
          <TinyOsLogo className="h-5 w-5" />
          <h2
            id="os-heading"
            className="text-[11.5px] uppercase tracking-[0.25em] text-amber-400/95 sm:text-[14px]"
            style={PIXEL_FONT}
          >
            TINY OS
          </h2>
        </div>
        <span className="h-0.5 w-14 bg-amber-500/40" />
      </div>

      {/* CRT Computer Monitor Shell */}
      <div className="overflow-hidden rounded-lg border-4 border-[#272736] bg-[#12121a] p-3 shadow-[0_24px_55px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div
          ref={desktopRef}
          onClick={() => setStartMenuOpen(false)}
          className="relative flex min-h-[490px] flex-col justify-between overflow-hidden rounded border-2 border-emerald-700/60 bg-[#040a07] shadow-[inset_0_0_45px_rgba(0,0,0,0.85)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Mobile quick launcher bar (< md) */}
          <div className="relative z-10 flex flex-wrap gap-2 p-3 md:hidden">
            {desktopIcons.map((item) => {
              const Icon = item.Icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onOpen}
                  className={`flex cursor-pointer flex-col items-center gap-1 rounded p-2 transition focus:outline-none ${item.color}`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-[7px]" style={PIXEL_FONT}>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Movable / Draggable Desktop Icons (md+) */}
          <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
            {desktopIcons.map((item) => {
              const Icon = item.Icon;
              const pos = iconPositions[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onPointerDown={(e) => startDragIcon(e, item.id, item.onOpen)}
                  style={{ left: pos.x, top: pos.y }}
                  title={`Drag to move or click to open ${item.label}`}
                  className={`pointer-events-auto absolute flex w-16 cursor-grab select-none flex-col items-center gap-1 rounded p-1.5 transition-colors active:cursor-grabbing focus:outline-none ${item.color}`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-[6.5px] leading-tight" style={PIXEL_FONT}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile stacked windows (< md) supporting ALL Tiny OS apps */}
          <div className="space-y-3 p-3 md:hidden">
            {Object.values(windows)
              .filter((w) => w.open && !w.minimized)
              .sort((a, b) => b.z - a.z)
              .map((win) => {
                const style = WINDOW_STYLES[win.id];
                return (
                  <div
                    key={win.id}
                    className={`flex flex-col overflow-hidden rounded border-2 ${style.border} ${style.bg} ${
                      win.id === "terminal" ? "h-64" : win.id === "browser" ? "h-80" : ""
                    }`}
                  >
                    <div className={`flex items-center justify-between border-b px-3 py-1.5 ${style.bar}`}>
                      <span className={`text-[8px] ${style.title}`} style={PIXEL_FONT}>
                        {getWindowTitle(win)}
                      </span>
                      {renderWindowHeaderActions(win)}
                    </div>
                    {renderAppBody(win.id)}
                  </div>
                );
              })}
          </div>

          {/* Desktop Draggable Windows (md+) */}
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            {Object.values(windows)
              .filter((w) => w.open && !w.minimized)
              .map((win) => {
                const style = WINDOW_STYLES[win.id];
                return (
                  <div
                    key={win.id}
                    onPointerDown={() => focusWindow(win.id)}
                    style={{
                      left: win.x,
                      top: win.y,
                      width: win.w,
                      height: win.h,
                      zIndex: win.z,
                    }}
                    className={`pointer-events-auto absolute flex flex-col overflow-hidden rounded border-2 shadow-[0_14px_32px_rgba(0,0,0,0.85)] ${style.border} ${style.bg}`}
                  >
                    <div
                      onPointerDown={(e) => startDragWindow(e, win.id)}
                      className={`flex cursor-grab items-center justify-between border-b px-3 py-1.5 active:cursor-grabbing ${style.bar}`}
                    >
                      <span className={`text-[8px] ${style.title}`} style={PIXEL_FONT}>
                        {getWindowTitle(win)}
                      </span>
                      {renderWindowHeaderActions(win)}
                    </div>
                    {renderAppBody(win.id)}
                  </div>
                );
              })}
          </div>

          {/* Start Menu Popover */}
          {startMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-11 left-2 z-30 w-52 rounded border-2 border-amber-400/70 bg-[#090b10] p-2 shadow-2xl"
            >
              <div className="mb-2 flex items-center gap-2 border-b border-white/15 pb-1.5">
                <TinyOsLogo className="h-4 w-4" />
                <p className="text-[8px] text-amber-300" style={PIXEL_FONT}>
                  TINY OS
                </p>
              </div>
              <div className="space-y-1">
                {[
                  { id: "terminal", label: "TERMINAL" },
                  { id: "files", label: "FILE EXPLORER" },
                  { id: "notepad", label: "NOTEBAD" },
                  { id: "paint", label: "PIXEL PAINT" },
                  { id: "snake", label: "SNAKE.EXE" },
                  { id: "browser", label: "PIXEL BROWSER" },
                  { id: "sysinfo", label: "SYSINFO" },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      playSelect();
                      setStartMenuOpen(false);
                      focusWindow(app.id);
                    }}
                    className="block w-full cursor-pointer rounded px-2 py-1.5 text-left text-[8px] text-white/85 hover:bg-amber-400 hover:text-black"
                    style={PIXEL_FONT}
                  >
                    {app.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="arcade-body absolute bottom-11 right-2 z-30 w-64 rounded border-2 border-emerald-500/70 bg-[#060d0a] p-1.5 text-[12px] shadow-2xl"
            >
              {searchResults.map((res, idx) => (
                <button
                  key={`${res.kind}-${res.label}-${idx}`}
                  type="button"
                  onClick={() => {
                    setOsSearch("");
                    if (res.kind === "app") {
                      playSelect();
                      focusWindow(res.id);
                    } else if (res.kind === "file") {
                      openFileInNoteBad(res.path);
                    } else if (res.kind === "project") {
                      playSelect();
                      onOpenProject?.(res.id);
                    }
                  }}
                  className="flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-left text-white/90 hover:bg-emerald-500/20"
                >
                  <span className="truncate">{res.label}</span>
                  <span className="ml-2 shrink-0 text-[10px] uppercase text-emerald-300/75">
                    {res.kind}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Bottom OS Taskbar with Tiny OS Logo + Window Tabs + Search Bar */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-t-2 border-emerald-700/50 bg-[#0a110e] px-2 py-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playSelect();
                  setStartMenuOpen((prev) => !prev);
                }}
                className="flex cursor-pointer items-center gap-1.5 rounded border border-amber-400/70 bg-amber-950/60 px-2 py-1 text-[8px] text-amber-300 hover:bg-amber-400 hover:text-black"
                style={PIXEL_FONT}
              >
                <TinyOsLogo className="h-3.5 w-3.5" />
                <span>OS</span>
              </button>

              {Object.values(windows)
                .filter((w) => w.open)
                .map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      playMove();
                      focusWindow(w.id);
                    }}
                    className={`cursor-pointer rounded border px-2 py-1 text-[7px] transition ${
                      w.minimized
                        ? "border-white/15 bg-black/50 text-white/50"
                        : "border-emerald-400/60 bg-emerald-950/50 text-emerald-200"
                    }`}
                    style={PIXEL_FONT}
                  >
                    {w.title}
                  </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={osSearch}
                onChange={(e) => setOsSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Search OS..."
                aria-label="Search Tiny OS apps, files, and projects"
                className="arcade-body w-36 rounded border border-emerald-500/40 bg-black/70 px-2 py-0.5 text-[11px] text-white placeholder-white/35 focus:border-amber-400 focus:outline-none sm:w-44"
              />
              <div className="arcade-body hidden items-center gap-2 pr-1 text-[11px] tabular-nums text-emerald-300/80 sm:flex">
                {overclock && <span className="text-cyan-300">OC</span>}
                <span>{clockText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
