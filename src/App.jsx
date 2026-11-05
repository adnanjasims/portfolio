import { useCallback, useState } from "react";
import ArcadeBootScreen from "./components/ArcadeBootScreen";
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
const LEGACY_LIFT_URL = "https://github.com/adnanjasims/legacylift";

function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [booting, setBooting] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  // content starts rising under the collapsing CRT overlay
  const handleBootReveal = useCallback(() => {
    requestAnimationFrame(() => setContentReady(true));
  }, []);

  const handleBootDone = useCallback(() => {
    setBooting(false);
  }, []);

  const enter = (delayClass = "") =>
    `arcade-enter ${delayClass} ${contentReady ? "is-ready" : ""}`.trim();

  const stageClass = `arcade-stage ${contentReady ? "is-ready" : ""}`.trim();

  const projectLabel = (id) => {
    if (id === "legacy-lift") return "Legacy Lift, verified code migration";
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
      {booting && (
        <ArcadeBootScreen onReveal={handleBootReveal} onDone={handleBootDone} />
      )}

      <div className={stageClass}>
        {/* Subtle grid background for center */}
        <div className="fixed inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <ArcadeSidePanels />

        <ArcadePageFrame>
          <div className={enter("arcade-enter-delay-1")}>
            <ArcadeIntro />
          </div>

          <section id="projects" className={`flex flex-col items-center justify-center py-6 ${enter("arcade-enter-delay-2")}`}>
            <ArcadeCabinet>
              <ArcadeMenu onSelectProject={setActiveProject} />
            </ArcadeCabinet>
          </section>

          {(CHIRP_URL.startsWith("http") || SMART_SUPPLY_URL.startsWith("http")) && (
            <section className={`mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-4 px-4 py-3 ${enter("arcade-enter-delay-3")}`}>
              <p className="w-full text-center text-[7px] uppercase tracking-widest text-amber-500/60" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                Live apps
              </p>
              {CHIRP_URL.startsWith("http") && (
                <a
                  href={CHIRP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border-2 border-amber-500/60 bg-amber-950/40 px-4 py-2 text-[8px] uppercase text-amber-400/90 hover:bg-amber-500/20"
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
                  className="rounded border-2 border-amber-500/60 bg-amber-950/40 px-4 py-2 text-[8px] uppercase text-amber-400/90 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  Smart Supply
                </a>
              )}
            </section>
          )}

          <div className={enter("arcade-enter-delay-3")}>
            <ChessEngineEmbed />
          </div>

          <div className={enter("arcade-enter-delay-4")}>
            <ArcadeChessSection />
          </div>

          <div className={enter("arcade-enter-delay-5")}>
            <ArcadeFooter />
          </div>
        </ArcadePageFrame>
      </div>

      {/* Project modal (arcade style) */}
      {activeProject && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 p-4">
          <div className="arcade-screen w-full max-w-lg rounded border-4 border-amber-500/80 bg-black p-6 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
            <h2 className="mb-4 border-b border-white/30 pb-2 text-[14px] text-amber-400" style={{ fontFamily: '"Press Start 2P", cursive' }}>
              {projectLabel(activeProject)}
            </h2>
            {activeProject === "legacy-lift" && (
              <div className="arcade-body mb-4 space-y-3 text-[13px] leading-relaxed text-white/90">
                <p>
                  Migrates legacy code in a series of incremental steps. It pins behavior with characterization tests, applies rewrites and marks a file verified once tests pass in an isolated sandbox.
                </p>
                <p className="text-white/55">
                  Stack: Python, FastAPI, Fastify, React, Postgres, RabbitMQ, Docker
                </p>
                <a
                  href={LEGACY_LIFT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            {activeProject === "doc-intel" && (
              <div className="arcade-body mb-4 space-y-3 text-[13px] leading-relaxed text-white/90">
                <p>
                  Document intelligence pipeline for engineering PDFs and drawings with extraction of tables and fields with rule checks.
                </p>
                <p className="text-white/55">Stack: Python, OCR, PDF parsing</p>
                <a
                  href={DOC_INTEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            {activeProject === "rail-interlock" && (
              <div className="arcade-body mb-4 space-y-3 text-[13px] leading-relaxed text-white/90">
                <p>
                  Safety-critical railway interlock and fault detection logic for transit signaling.
                </p>
                <p className="text-white/55">Stack: C</p>
                <a
                  href={RAIL_INTERLOCK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            {activeProject === "warehouse-robot" && (
              <div className="arcade-body mb-4 space-y-3 text-[13px] leading-relaxed text-white/90">
                <p>
                  Autonomous mobile robot simulator with mapping, lidar sensing, path planning, and local obstacle avoidance.
                </p>
                <p className="text-white/55">Stack: Python, simulation, path planning</p>
                <a
                  href={WAREHOUSE_ROBOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            {activeProject === "chirp" && (
              <div className="arcade-body mb-4 space-y-3 text-[13px] leading-relaxed text-white/90">
                <p>
                  Full-stack social app with auth, timelines, and a Twitter-style feed UI.
                </p>
                <p className="text-white/55">Stack: React, Flask, SQLite</p>
                {CHIRP_URL.startsWith("http") && (
                  <a
                    href={CHIRP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}
                  >
                    View live app
                  </a>
                )}
              </div>
            )}
            {activeProject === "smart-supply" && (
              <div className="arcade-body mb-4 space-y-3 text-[13px] leading-relaxed text-white/90">
                <p>
                  Inventory optimization using LightGBM demand forecasts on the Walmart M5 dataset. Compares model-based orders to a baseline on waste and stockouts.
                </p>
                <p className="text-white/55">Stack: Python, LightGBM, Streamlit</p>
                <a
                  href={SMART_SUPPLY_GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
                {SMART_SUPPLY_URL.startsWith("http") && (
                  <a
                    href={SMART_SUPPLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 ml-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}
                  >
                    View live app
                  </a>
                )}
              </div>
            )}
            {activeProject === "chess-engine" && (
              <div className="arcade-body mb-4 space-y-3 text-[13px] leading-relaxed text-white/90">
                <p>
                  UCI chess engine with legal move generation, alpha-beta search, and a browser client for strength-limited play.
                </p>
                <p className="text-white/55">Stack: Python, FastAPI, React, UCI</p>
              </div>
            )}
            {activeProject === "event-lottery" && (
              <div className="arcade-body mb-4 space-y-3 text-[13px] leading-relaxed text-white/90">
                <p>
                  Android event lottery app (CMPUT 301). Organizers host events and entrants join a waiting list and get drawn in.
                </p>
                <p className="text-white/55">Stack: Android, Java</p>
                <a
                  href={EVENT_LOTTERY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            {activeProject === "neural-network" && (
              <div className="arcade-body mb-4 space-y-3 text-[13px] leading-relaxed text-white/90">
                <p>
                  Multilayer perceptron inference engine written from scratch, including a custom matrix class and forward propagation.
                </p>
                <p className="text-white/55">Stack: C++, ReLU, sigmoid</p>
                <a
                  href={NEURAL_NETWORK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  View on GitHub
                </a>
              </div>
            )}
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              className="w-full rounded border-2 border-amber-500/80 bg-black py-3 text-[10px] uppercase text-amber-400 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
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
