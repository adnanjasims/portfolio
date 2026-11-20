const CHIRP_URL = import.meta.env.VITE_CHIRP_URL || "";
const SMART_SUPPLY_URL = import.meta.env.VITE_SMART_SUPPLY_URL || "";

export const PROJECTS = [
  {
    id: "true-cursor",
    label: "TRUECURSOR",
    sublabel: "NATHACKS 2026 · ACCESSIBILITY",
    title: "TrueCursor, tremor stabilization & clinical PDF",
    description:
      "natHacks 2026 team lead for a system-wide accessibility application that helps Parkinson's patients by smoothing mouse tremors and enlarging clickable UI target boundaries. Post-event, cleaned up the UI and data export pipeline, improved tremor smoothing, and added clinical PDF reports so physicians have objective motor data that can be used to adjust dosages.",
    stack: "Python, FastAPI, React, TypeScript, Tauri, SQLite",
    githubUrl: "https://github.com/adnanjasims/TrueCursor",
  },
  {
    id: "legacy-lift",
    label: "LEGACY LIFT",
    sublabel: "CODE MIGRATION",
    title: "Legacy Lift, verified code migration",
    description:
      "Migrates legacy code in a series of incremental steps. It pins behavior with characterization tests, applies rewrites and marks a file verified once tests pass in an isolated sandbox.",
    stack: "Python, FastAPI, Fastify, React, Postgres, RabbitMQ, Docker",
    githubUrl: "https://github.com/adnanjasims/legacylift",
  },
  {
    id: "doc-intel",
    label: "DOC INTELLIGENCE",
    sublabel: "OCR + DRAWINGS",
    title: "Doc Intelligence, OCR for drawings",
    description:
      "Document intelligence pipeline for engineering PDFs and drawings with extraction of tables and fields with rule checks.",
    stack: "Python, OCR, PDF parsing",
    githubUrl: "https://github.com/adnanjasims/doc-intel",
  },
  {
    id: "rail-interlock",
    label: "RAIL INTERLOCK",
    sublabel: "C SAFETY SYSTEM",
    title: "Railway Interlock, C safety system",
    description:
      "Safety-critical railway interlock and fault detection logic for transit signaling.",
    stack: "C",
    githubUrl: "https://github.com/adnanjasims/rail-interlock-system",
  },
  {
    id: "warehouse-robot",
    label: "WAREHOUSE ROBOT",
    sublabel: "AMR SIMULATOR",
    title: "Warehouse Robot, AMR simulator",
    description:
      "Autonomous mobile robot simulator with mapping, lidar sensing, path planning, and local obstacle avoidance.",
    stack: "Python, simulation, path planning",
    githubUrl: "https://github.com/adnanjasims/warehouse-robot",
  },
  {
    id: "chirp",
    label: "CHIRP",
    sublabel: "FULL-STACK SOCIAL",
    title: "Chirp, full-stack social platform",
    description:
      "Full-stack social app with auth, timelines, and a Twitter-style feed UI.",
    stack: "React, Flask, SQLite",
    liveUrl: CHIRP_URL.startsWith("http") ? CHIRP_URL : "",
  },
  {
    id: "smart-supply",
    label: "SMART SUPPLY",
    sublabel: "ML & STREAMLIT",
    title: "Smart Supply, inventory forecasting",
    description:
      "Inventory optimization using LightGBM demand forecasts on the Walmart M5 dataset. Compares model-based orders to a baseline on waste and stockouts.",
    stack: "Python, LightGBM, Streamlit",
    githubUrl: "https://github.com/adnanjasims/smart-supply",
    liveUrl: SMART_SUPPLY_URL.startsWith("http") ? SMART_SUPPLY_URL : "",
  },
  {
    id: "chess-engine",
    label: "CHESS ENGINE",
    sublabel: "UCI ENGINE + WEB",
    title: "Chess Engine, UCI engine and web",
    description:
      "UCI chess engine with legal move generation, alpha-beta search, and a browser client for strength-limited play.",
    stack: "Python, FastAPI, React, UCI",
  },
  {
    id: "event-lottery",
    label: "EVENT LOTTERY",
    sublabel: "ANDROID APP",
    title: "Event Lottery, Android app",
    description:
      "Android event lottery app (CMPUT 301). Organizers host events and entrants join a waiting list and get drawn in.",
    stack: "Android, Java",
    githubUrl: "https://github.com/adnanjasims/quanti-agents",
  },
  {
    id: "neural-network",
    label: "NEURAL NETWORK",
    sublabel: "C++ MLP ENGINE",
    title: "Neural Network, C++ MLP engine",
    description:
      "Multilayer perceptron inference engine written from scratch, including a custom matrix class and forward propagation.",
    stack: "C++, ReLU, sigmoid",
    githubUrl: "https://github.com/adnanjasims/neural-network",
  },
];

export const TOP_RUNS = [
  { rank: 1, id: "true-cursor", label: "TRUECURSOR" },
  { rank: 2, id: "legacy-lift", label: "LEGACY LIFT" },
  { rank: 3, id: "doc-intel", label: "DOC INTEL" },
  { rank: 4, id: "rail-interlock", label: "RAIL INTERLOCK" },
  { rank: 5, id: "warehouse-robot", label: "WAREHOUSE" },
];
