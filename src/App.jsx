import { useState } from "react";
import ArcadeCabinet from "./components/ArcadeCabinet";
import ArcadeChessSection from "./components/ArcadeChessSection";
import ArcadeFooter from "./components/ArcadeFooter";
import ChessEngineEmbed from "./components/ChessEngineEmbed";
import ArcadeIntro from "./components/ArcadeIntro";
import ArcadeMenu from "./components/ArcadeMenu";
import ArcadePageFrame from "./components/ArcadePageFrame";
import ArcadeSidePanels from "./components/ArcadeSidePanels";

const CHIRP_URL = import.meta.env.VITE_CHIRP_URL || "";
const SMART_SUPPLY_URL = import.meta.env.VITE_SMART_SUPPLY_URL || "";
const SMART_SUPPLY_GITHUB_URL = "https://github.com/adnanjasims/smart-supply";
const EVENT_LOTTERY_URL = "https://github.com/adnanjasims/quanti-agents";
const NEURAL_NETWORK_URL = "https://github.com/adnanjasims/neural-network";
const DOC_INTEL_URL = "https://github.com/adnanjasims/doc-intel";
const RAIL_INTERLOCK_URL = "https://github.com/adnanjasims/rail-interlock-system";
const WAREHOUSE_ROBOT_URL = "https://github.com/adnanjasims/warehouse-robot";

function App() {
  const [activeProject, setActiveProject] = useState(null);

  const projectLabel = (id) => {
    if (id === "doc-intel") return "Doc Intelligence, OCR for drawings";
    if (id === "rail-interlock") return "Railway Interlock, C safety system";
    if (id === "warehouse-robot") return "Warehouse Robot, AMR simulator";
    if (id === "chirp") return "Chirp, full-stack social platform";
    if (id === "smart-supply") return "Smart Supply, inventory forecasting";
    if (id === "chess-engine") return "Chess Engine, UCI engine and web";
    if (id === "event-lottery") return "Event Lottery, Android app";
    if (id === "neural-network") return "Neural Network, C++ MLP engine";
    return id;
  };

  return (
    <div className="min-h-screen w-full bg-[#060608] text-white">
      {/* Subtle grid background for center */}
      <div className="fixed inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <ArcadeSidePanels />

      <ArcadePageFrame>
        <ArcadeIntro />

        <section id="projects" className="flex flex-col items-center justify-center py-6">
          <ArcadeCabinet>
            <ArcadeMenu onSelectProject={setActiveProject} />
          </ArcadeCabinet>
        </section>

        {(CHIRP_URL.startsWith("http") || SMART_SUPPLY_URL.startsWith("http")) && (
          <section className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-4 px-4 py-3">
            <p className="w-full text-center text-[5px] uppercase tracking-widest text-amber-500/60" style={{ fontFamily: '"Press Start 2P", cursive' }}>
              Live apps
            </p>
            {CHIRP_URL.startsWith("http") && (
              <a
                href={CHIRP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border-2 border-amber-500/60 bg-amber-950/40 px-4 py-2 text-[6px] uppercase text-amber-400/90 hover:bg-amber-500/20"
                style={{ fontFamily: '"Press Start 2P", cursive' }}
              >
                Chirp
              </a>
            )}
            {SMART_SUPPLY_URL.startsWith("http") && (
              <a
                href={SMART_SUPPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border-2 border-amber-500/60 bg-amber-950/40 px-4 py-2 text-[6px] uppercase text-amber-400/90 hover:bg-amber-500/20"
                style={{ fontFamily: '"Press Start 2P", cursive' }}
              >
                Smart Supply
              </a>
            )}
          </section>
        )}

        <ChessEngineEmbed />

        <ArcadeChessSection />

        <ArcadeFooter />
      </ArcadePageFrame>

      {/* Project modal (arcade style) */}
      {activeProject && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 p-4">
          <div className="arcade-screen w-full max-w-lg rounded border-4 border-amber-500/80 bg-black p-6 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
            <h2 className="mb-4 border-b border-white/30 pb-2 text-[12px] text-amber-400" style={{ fontFamily: '"Press Start 2P", cursive' }}>
              {projectLabel(activeProject)}
            </h2>
            {activeProject === "doc-intel" && (
              <div className="mb-4 space-y-3 text-[8px] leading-relaxed text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                <p>
                  READS ENGINEERING PDFS AND DRAWINGS. EXTRACTS TABLES AND FIELDS, THEN CHECKS THEM AGAINST SIMPLE RULES.
                </p>
                <a
                  href={DOC_INTEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[8px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            {activeProject === "rail-interlock" && (
              <div className="mb-4 space-y-3 text-[8px] leading-relaxed text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                <p>
                  SAFETY CRITICAL C INTERLOCK AND FAULT DETECTION FOR RAILWAY TRANSIT.
                </p>
                <a
                  href={RAIL_INTERLOCK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[8px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            {activeProject === "warehouse-robot" && (
              <div className="mb-4 space-y-3 text-[8px] leading-relaxed text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                <p>
                  WAREHOUSE ROBOT SIMULATOR WITH MAP, LIDAR, PATH PLANNING, AND LOCAL AVOIDANCE.
                </p>
                <a
                  href={WAREHOUSE_ROBOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[8px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            {activeProject === "chirp" && (
              <div className="mb-4 space-y-3 text-[8px] leading-relaxed text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                <p>
                  CHIRP IS A TWITTER-STYLE CLONE I BUILT TO PRACTICE FULL-STACK THINKING: AUTH, TIMELINES, AND HOW THE UI FEELS.
                </p>
                <p className="text-white/60">
                  I CAN WALK YOU THROUGH THE STACK, TRADEOFFS, AND WHAT I WOULD IMPROVE NEXT.
                </p>
                {CHIRP_URL.startsWith("http") && (
                  <a
                    href={CHIRP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[8px] uppercase text-amber-400 hover:bg-amber-500/20"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}
                  >
                    View live app
                  </a>
                )}
              </div>
            )}
            {activeProject === "smart-supply" && (
              <div className="mb-4 space-y-3 text-[8px] leading-relaxed text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                <p>
                  INVENTORY OPTIMIZATION WITH LIGHTGBM DEMAND FORECASTING ON THE WALMART M5 DATASET. CUTS WASTE AND STOCKOUTS, THEN COMPARES ML MODEL ORDERS VS A SIMPLE BASELINE.
                </p>
                <p className="text-white/60">
                  PYTHON PIPELINE PLUS A STREAMLIT DASHBOARD FOR PROFIT, WASTE, AND ITEM-LEVEL RECS.
                </p>
                <a
                  href={SMART_SUPPLY_GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[8px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
                {SMART_SUPPLY_URL.startsWith("http") && (
                  <a
                    href={SMART_SUPPLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 ml-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[8px] uppercase text-amber-400 hover:bg-amber-500/20"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}
                  >
                    View live app
                  </a>
                )}
              </div>
            )}
            {activeProject === "chess-engine" && (
              <div className="mb-4 space-y-3 text-[8px] leading-relaxed text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                <p>
                  PYTHON CHESS ENGINE THAT SPEAKS UCI. BOARD (FEN, MAKE/UNMAKE), LEGAL MOVES (CASTLING, EN PASSANT), ALPHA-BETA SEARCH WITH ITERATIVE DEEPENING AND QUIESCENCE, MATERIAL + PIECE-SQUARE EVAL.
                </p>
                <p>
                  FASTAPI BACKEND SERVES THE ENGINE API AND A REACT WEB FRONTEND TO PLAY IN THE BROWSER AT DIFFERENT STRENGTH LEVELS.
                </p>
                <p className="text-white/60">
                  RUN AS UCI ENGINE VIA PYTHON OR POINT A GUI (ARENA, LICHESS) AT IT. PERFT TESTS IN TESTS/.
                </p>
              </div>
            )}
            {activeProject === "event-lottery" && (
              <div className="mb-4 space-y-3 text-[8px] leading-relaxed text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                <p>
                  ANDROID EVENT LOTTERY APP (CMPUT 301 / QUANTI-AGENTS). ORGANIZERS RUN EVENTS & ENTRANTS JOIN A WAITING LIST TO GET DRAWN INTO THE LOTTERY.
                </p>
                <p className="text-white/60">
                  BUILT AS A TEAM ANDROID PROJECT WITH USER STORIES, UI MOCKS, AND CRC-DRIVEN DESIGN.
                </p>
                <a
                  href={EVENT_LOTTERY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[8px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            {activeProject === "neural-network" && (
              <div className="mb-4 space-y-3 text-[8px] leading-relaxed text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                <p>
                  MULTILAYER PERCEPTRON INFERENCE ENGINE IN C++ FROM SCRATCH. CUSTOM MATRIX CLASS, FORWARD PROP, RELU + SIGMOID (NO TENSORFLOW OR PYTORCH).
                </p>
                <p className="text-white/60">
                  BUILT TO SHOW THE LINEAR ALGEBRA AND MEMORY SIDE OF INFERENCE. COMPILE WITH G++ AND RUN.
                </p>
                <a
                  href={NEURAL_NETWORK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[8px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              className="w-full rounded border-2 border-amber-500/80 bg-black py-3 text-[8px] uppercase text-amber-400 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
