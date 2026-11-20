import { useCallback, useEffect, useRef, useState } from "react";
import ArcadeBackdrop from "./components/ArcadeBackdrop";
import ArcadeBootScreen from "./components/ArcadeBootScreen";
import ArcadeCabinet from "./components/ArcadeCabinet";
import ArcadeChessSection from "./components/ArcadeChessSection";
import ArcadeExperience from "./components/ArcadeExperience";
import ArcadeFooter from "./components/ArcadeFooter";
import ArcadeIntro from "./components/ArcadeIntro";
import ArcadeMenu from "./components/ArcadeMenu";
import ArcadePageFrame from "./components/ArcadePageFrame";
import ArcadeSidePanels from "./components/ArcadeSidePanels";
import ChessEngineEmbed from "./components/ChessEngineEmbed";
import PortfolioOsSection from "./components/PortfolioOsSection";
import { GitHubPixelLogo } from "./components/SocialPixelIcons";
import { PROJECTS } from "./data/projects";
import {
  playClose,
  playCoin,
  playMove,
  playOverclock,
  playSelect,
  setSfxEnabled as syncAudioSfx,
} from "./utils/arcadeSfx";

const CHIRP_URL = import.meta.env.VITE_CHIRP_URL || "";
const SMART_SUPPLY_URL = import.meta.env.VITE_SMART_SUPPLY_URL || "";
const isSafeHttpUrl = (url) => typeof url === "string" && /^https?:\/\//i.test(url.trim());
const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };
const KONAMI_SEQUENCE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0].id);
  const [credits, setCredits] = useState(0);
  const [sfxEnabled, setSfxEnabled] = useState(false);
  const [focusOsRequestId, setFocusOsRequestId] = useState(0);
  const [overclock, setOverclock] = useState(false);
  const [overclockUnlocked, setOverclockUnlocked] = useState(false);
  const [overclockModalOpen, setOverclockModalOpen] = useState(false);
  const [booting, setBooting] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [bootRunId, setBootRunId] = useState(0);
  const konamiProgressRef = useRef(0);

  // content starts rising under the collapsing CRT overlay
  const handleBootReveal = useCallback(() => {
    requestAnimationFrame(() => setContentReady(true));
  }, []);

  const handleBootDone = useCallback(() => {
    setBooting(false);
  }, []);

  const handleToggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev;
      syncAudioSfx(next);
      if (next) playSelect();
      return next;
    });
  }, []);

  const handleInsertCoin = useCallback(() => {
    setCredits((c) => c + 1);
    playCoin();
  }, []);

  const handleMoveSelection = useCallback((delta) => {
    setSelectedProjectId((currentId) => {
      const idx = PROJECTS.findIndex((p) => p.id === currentId);
      const startIdx = idx === -1 ? 0 : idx;
      const nextIdx = (startIdx + delta + PROJECTS.length) % PROJECTS.length;
      return PROJECTS[nextIdx].id;
    });
    playMove();
  }, []);

  const handleLaunchSelected = useCallback(() => {
    playSelect();
    setActiveProject(selectedProjectId);
  }, [selectedProjectId]);

  const handleJumpSection = useCallback((sectionId) => {
    playSelect();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleOpenTerminal = useCallback(() => {
    playSelect();
    document.getElementById("os")?.scrollIntoView({ behavior: "smooth" });
    setFocusOsRequestId((n) => n + 1);
  }, []);

  const handleSelectTopRun = useCallback((projectId) => {
    setSelectedProjectId(projectId);
    playSelect();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    setActiveProject(projectId);
  }, []);

  const handleReplayBoot = useCallback(() => {
    playSelect();
    window.scrollTo({ top: 0, behavior: "instant" });
    setActiveProject(null);
    setOverclockModalOpen(false);
    setContentReady(false);
    setBooting(true);
    setBootRunId((id) => id + 1);
  }, []);

  const handleToggleOverclock = useCallback(() => {
    setOverclockUnlocked(true);
    setOverclock((prev) => {
      const next = !prev;
      if (next) playOverclock();
      else playClose();
      return next;
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    playClose();
    setActiveProject(null);
  }, []);

  const handleKonamiStep = useCallback((rawKey) => {
    const key = rawKey.toLowerCase();
    const expected = KONAMI_SEQUENCE[konamiProgressRef.current];
    if (key === expected) {
      konamiProgressRef.current += 1;
      if (konamiProgressRef.current === KONAMI_SEQUENCE.length) {
        konamiProgressRef.current = 0;
        setOverclockUnlocked(true);
        setOverclock(true);
        setCredits((c) => c + 99);
        setOverclockModalOpen(true);
        playOverclock();
      }
    } else {
      konamiProgressRef.current = key === KONAMI_SEQUENCE[0] ? 1 : 0;
    }
  }, []);

  // Global keyboard shortcuts: Konami code, `~` terminal focus, ESC modal close
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      const isTypingField = tag === "INPUT" || tag === "TEXTAREA";

      if (e.key === "Escape") {
        if (overclockModalOpen) {
          playClose();
          setOverclockModalOpen(false);
          return;
        }
        if (activeProject) {
          handleCloseModal();
          return;
        }
      }

      if ((e.key === "~" || e.key === "`") && !isTypingField && !booting) {
        e.preventDefault();
        handleOpenTerminal();
        return;
      }

      if (isTypingField || booting) return;

      handleKonamiStep(e.key);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeProject, booting, handleCloseModal, handleKonamiStep, handleOpenTerminal, overclockModalOpen]);

  const enter = (delayClass = "") =>
    `arcade-enter ${delayClass} ${contentReady ? "is-ready" : ""}`.trim();

  const stageClass = `arcade-stage ${contentReady ? "is-ready" : ""}`.trim();
  const activeProjectData = PROJECTS.find((p) => p.id === activeProject) || null;

  return (
    <div className="min-h-screen w-full bg-[#060608] text-white">
      {booting && (
        <ArcadeBootScreen
          key={bootRunId}
          onReveal={handleBootReveal}
          onDone={handleBootDone}
        />
      )}

      <div className={stageClass}>
        <ArcadeBackdrop overclock={overclock} />

        <ArcadeSidePanels
          selectedProjectId={selectedProjectId}
          onSelectTopRun={handleSelectTopRun}
          onJumpSection={handleJumpSection}
          credits={credits}
          onInsertCoin={handleInsertCoin}
          onReplayBoot={handleReplayBoot}
          onOpenTerminal={handleOpenTerminal}
        />

        <ArcadePageFrame
          sfxEnabled={sfxEnabled}
          onToggleSfx={handleToggleSfx}
          overclockUnlocked={overclockUnlocked}
          overclock={overclock}
          onToggleOverclock={handleToggleOverclock}
        >
          <div className={enter("arcade-enter-delay-1")}>
            <ArcadeIntro key={bootRunId} startTyping={!booting} />
          </div>

          <div className={enter("arcade-enter-delay-2")}>
            <PortfolioOsSection
              focusRequestId={focusOsRequestId}
              onOpenProject={setActiveProject}
              onJumpSection={handleJumpSection}
              onInsertCoin={handleInsertCoin}
              onToggleOverclock={handleToggleOverclock}
              overclock={overclock}
              credits={credits}
            />
          </div>

          <div className={enter("arcade-enter-delay-3")}>
            <ArcadeExperience />
          </div>

          <section
            id="projects"
            className={`flex flex-col items-center justify-center py-6 ${enter("arcade-enter-delay-3")}`}
          >
            <ArcadeCabinet
              onMoveSelection={handleMoveSelection}
              onLaunchSelected={handleLaunchSelected}
              onArcadeInput={handleKonamiStep}
              credits={credits}
              onInsertCoin={handleInsertCoin}
              onJumpSection={handleJumpSection}
              onReplayBoot={handleReplayBoot}
            >
              <ArcadeMenu
                selectedProjectId={selectedProjectId}
                onChangeSelection={setSelectedProjectId}
                onMoveSelection={handleMoveSelection}
                onSelectProject={setActiveProject}
              />
            </ArcadeCabinet>
          </section>

          {(isSafeHttpUrl(CHIRP_URL) || isSafeHttpUrl(SMART_SUPPLY_URL)) && (
            <section
              className={`mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-4 px-4 py-3 ${enter("arcade-enter-delay-3")}`}
            >
              <p
                className="w-full text-center text-[7px] uppercase tracking-widest text-amber-500/60"
                style={PIXEL_FONT}
              >
                Live apps
              </p>
              {isSafeHttpUrl(CHIRP_URL) && (
                <a
                  href={CHIRP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border-2 border-amber-500/60 bg-amber-950/40 px-4 py-2 text-[8px] uppercase text-amber-400/90 hover:bg-amber-500/20"
                  style={PIXEL_FONT}
                >
                  Chirp
                </a>
              )}
              {isSafeHttpUrl(SMART_SUPPLY_URL) && (
                <a
                  href={SMART_SUPPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border-2 border-amber-500/60 bg-amber-950/40 px-4 py-2 text-[8px] uppercase text-amber-400/90 hover:bg-amber-500/20"
                  style={PIXEL_FONT}
                >
                  Smart Supply
                </a>
              )}
            </section>
          )}

          <div id="chess" className={enter("arcade-enter-delay-3")}>
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

      {/* Konami Code / Overclock Modal */}
      {overclockModalOpen && (
        <div
          onClick={() => {
            playClose();
            setOverclockModalOpen(false);
          }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="overclock-modal-title"
            className="arcade-screen w-full max-w-lg rounded border-4 border-cyan-400/90 bg-[#040a10] p-6 shadow-[0_0_35px_rgba(34,211,238,0.28)]"
          >
            <h2
              id="overclock-modal-title"
              className="mb-4 border-b border-cyan-400/30 pb-3 text-[14px] leading-relaxed text-cyan-300 sm:text-[15px]"
              style={PIXEL_FONT}
            >
              OVERCLOCK UNLOCKED
            </h2>
            <div className="arcade-body mb-5 space-y-3 text-[14px] leading-relaxed text-white/90">
              <p className="font-semibold text-amber-300">
                +99 CREDITS ADDED · MOTHERBOARD BUS TURBO (2.8x CYAN/GOLD)
              </p>
              <p>
                Secret Dev Notes: Built with React 19, Vite, Tailwind CSS, a custom
                HTML5 Canvas motherboard pulse engine, Portfolio OS desktop + shell,
                and a Web Audio 8-bit chiptune synthesizer.
              </p>
              <p className="text-cyan-200/80">
                Tip: Press <code className="text-amber-300">~</code> anytime to jump to
                Portfolio OS, or toggle <code className="text-cyan-300">OC</code> in
                the top bar.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setOverclockModalOpen(false);
                  handleOpenTerminal();
                }}
                className="flex-1 cursor-pointer rounded border-2 border-emerald-400/80 bg-emerald-950/60 py-3 text-[10px] uppercase text-emerald-300 hover:bg-emerald-900/50"
                style={PIXEL_FONT}
              >
                Open Portfolio OS
              </button>
              <button
                type="button"
                onClick={() => {
                  playClose();
                  setOverclockModalOpen(false);
                }}
                className="flex-1 cursor-pointer rounded border-2 border-cyan-400/80 bg-black py-3 text-[10px] uppercase text-cyan-300 hover:bg-cyan-500/10"
                style={PIXEL_FONT}
              >
                Awesome (ESC)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project modal (arcade style, uniform font sizes) */}
      {activeProjectData && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="arcade-screen w-full max-w-lg rounded border-4 border-amber-500/80 bg-black p-6 shadow-[0_0_30px_rgba(251,191,36,0.2)]"
          >
            <h2
              id="project-modal-title"
              className="mb-4 border-b border-white/30 pb-3 text-[14px] leading-relaxed text-amber-400 sm:text-[15px]"
              style={PIXEL_FONT}
            >
              {activeProjectData.title}
            </h2>

            <div className="arcade-body mb-5 space-y-3 text-[15px] leading-relaxed text-white/90">
              <p className="text-[15px] leading-relaxed text-white/90">
                {activeProjectData.description}
              </p>
              <p className="text-[15px] leading-relaxed text-amber-200/75">
                Stack: {activeProjectData.stack}
              </p>

              {(activeProjectData.githubUrl || activeProjectData.liveUrl) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeProjectData.githubUrl && (
                    <a
                      href={activeProjectData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded border-2 border-amber-500/80 bg-amber-950/50 px-3.5 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                      style={PIXEL_FONT}
                    >
                      <GitHubPixelLogo className="h-4 w-4 shrink-0" />
                      <span>View on GitHub</span>
                    </a>
                  )}
                  {activeProjectData.liveUrl && (
                    <a
                      href={activeProjectData.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded border-2 border-amber-500/80 bg-amber-950/50 px-3.5 py-2 text-[10px] uppercase text-amber-400 hover:bg-amber-500/20"
                      style={PIXEL_FONT}
                    >
                      View live app
                    </a>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full cursor-pointer rounded border-2 border-amber-500/80 bg-black py-3 text-[10px] uppercase text-amber-400 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              style={PIXEL_FONT}
            >
              Close (ESC)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
