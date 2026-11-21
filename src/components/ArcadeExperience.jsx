import { playHover } from "../utils/arcadeSfx";

/**
 * Pixelized tribute logo for GleamCo (deep navy + aqua gleam star).
 */
function GleamCoPixelLogo({ className = "h-16 w-20" }) {
  return (
    <svg
      viewBox="0 0 25 20"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Darker midnight navy backing */}
      <rect x="0" y="0" width="25" height="20" fill="#041024" />
      <rect x="0" y="0" width="25" height="1" fill="#172554" />
      <rect x="0" y="19" width="25" height="1" fill="#020814" />

      {/* Double comet trail sweeping toward top-right sparkle */}
      <rect x="7" y="7" width="3" height="1" fill="#2dd4bf" />
      <rect x="10" y="6" width="4" height="1" fill="#2dd4bf" />
      <rect x="14" y="5" width="4" height="1" fill="#38d9c8" />
      <rect x="11" y="8" width="3" height="1" fill="#0d9488" />
      <rect x="14" y="7" width="4" height="1" fill="#2dd4bf" />

      {/* 4-point sparkle star + tiny satellite pixels */}
      <rect x="20" y="1" width="1" height="7" fill="#38d9c8" />
      <rect x="17" y="4" width="7" height="1" fill="#38d9c8" />
      <rect x="19" y="3" width="3" height="3" fill="#5eead4" />
      <rect x="20" y="4" width="1" height="1" fill="#ccfbf1" />
      <rect x="18" y="2" width="1" height="1" fill="#2dd4bf" />
      <rect x="22" y="6" width="1" height="1" fill="#2dd4bf" />

      {/* Crisp pixel "GLEAM" wordmark */}
      {/* G */}
      <rect x="2" y="11" width="3" height="1" fill="#38d9c8" />
      <rect x="2" y="12" width="1" height="4" fill="#38d9c8" />
      <rect x="2" y="16" width="3" height="1" fill="#38d9c8" />
      <rect x="4" y="14" width="1" height="2" fill="#38d9c8" />
      <rect x="3" y="14" width="1" height="1" fill="#38d9c8" />
      {/* L */}
      <rect x="6" y="11" width="1" height="6" fill="#38d9c8" />
      <rect x="7" y="16" width="2" height="1" fill="#38d9c8" />
      {/* E */}
      <rect x="10" y="11" width="1" height="6" fill="#38d9c8" />
      <rect x="11" y="11" width="2" height="1" fill="#38d9c8" />
      <rect x="11" y="13" width="2" height="1" fill="#38d9c8" />
      <rect x="11" y="16" width="2" height="1" fill="#38d9c8" />
      {/* A */}
      <rect x="15" y="11" width="1" height="1" fill="#38d9c8" />
      <rect x="14" y="12" width="1" height="5" fill="#38d9c8" />
      <rect x="16" y="12" width="1" height="5" fill="#38d9c8" />
      <rect x="15" y="14" width="1" height="1" fill="#38d9c8" />
      {/* M */}
      <rect x="18" y="11" width="1" height="6" fill="#38d9c8" />
      <rect x="19" y="12" width="1" height="2" fill="#38d9c8" />
      <rect x="20" y="13" width="1" height="2" fill="#38d9c8" />
      <rect x="21" y="12" width="1" height="2" fill="#38d9c8" />
      <rect x="22" y="11" width="1" height="6" fill="#38d9c8" />
    </svg>
  );
}

/**
 * Pixelized tribute logo for TELUS Communications Inc. (deep purple + vibrant green).
 */
function TelusPixelLogo({ className = "h-16 w-20" }) {
  return (
    <svg
      viewBox="0 0 25 20"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Darker deep purple backing */}
      <rect x="0" y="0" width="25" height="20" fill="#140626" />
      <rect x="0" y="0" width="25" height="1" fill="#4c1d95" />
      <rect x="0" y="19" width="25" height="1" fill="#0b0316" />

      {/* Muted retro green signal arc & leaf dots above wordmark */}
      <rect x="5" y="5" width="4" height="2" fill="#3f6212" />
      <rect x="9" y="4" width="5" height="2" fill="#4d7c0f" />
      <rect x="14" y="3" width="5" height="2" fill="#16a34a" />
      <rect x="18" y="5" width="2" height="2" fill="#15803d" />
      <rect x="19" y="2" width="2" height="2" fill="#65a30d" />
      <rect x="6" y="7" width="3" height="1" fill="#6b21a8" />

      {/* Crisp pixel "TELUS" wordmark */}
      {/* T */}
      <rect x="3" y="10" width="3" height="1" fill="#e2e8f0" />
      <rect x="4" y="11" width="1" height="5" fill="#e2e8f0" />
      {/* E */}
      <rect x="7" y="10" width="1" height="6" fill="#e2e8f0" />
      <rect x="8" y="10" width="2" height="1" fill="#e2e8f0" />
      <rect x="8" y="12" width="2" height="1" fill="#e2e8f0" />
      <rect x="8" y="15" width="2" height="1" fill="#e2e8f0" />
      {/* L */}
      <rect x="11" y="10" width="1" height="6" fill="#e2e8f0" />
      <rect x="12" y="15" width="2" height="1" fill="#e2e8f0" />
      {/* U */}
      <rect x="15" y="10" width="1" height="5" fill="#e2e8f0" />
      <rect x="17" y="10" width="1" height="5" fill="#e2e8f0" />
      <rect x="15" y="15" width="3" height="1" fill="#e2e8f0" />
      {/* S */}
      <rect x="19" y="10" width="3" height="1" fill="#e2e8f0" />
      <rect x="19" y="11" width="1" height="2" fill="#e2e8f0" />
      <rect x="20" y="12" width="2" height="1" fill="#e2e8f0" />
      <rect x="21" y="13" width="1" height="2" fill="#e2e8f0" />
      <rect x="19" y="15" width="3" height="1" fill="#e2e8f0" />
    </svg>
  );
}

/**
 * Arcade-style experience section: GleamCo and TELUS Communications Inc.
 */
const EXPERIENCES = [
  {
    id: "gleamco",
    role: "Software Developer",
    company: "GleamCo",
    employmentType: "Seasonal",
    period: "May 2026 - Aug 2026",
    duration: "4 mos",
    location: "Edmonton, Alberta, Canada · On-site",
    Logo: GleamCoPixelLogo,
    highlights: [
      "Migrated a full-stack CRM using TypeScript, Next.js, and SQL, designing custom multi-table relational data models and optimized query workflows to automate price calculations, process $80,000+ in revenue, and reduce quote creation time from 10 to under 2 minutes.",
      "Implemented secure Role-Based Access Control using NextAuth.js and server-side session validation, protecting sensitive client contact records, financial transactions, and internal sales data across multi-user permission tiers.",
      "Engineered and deployed a high-performance, client-facing web application using TypeScript, Next.js (App Router), and Tailwind CSS, building lead-capture pipelines that funnel organic customer data into backend databases.",
    ],
    skills: [
      "Software Infrastructure",
      "Web Development",
      "TypeScript",
      "Next.js",
      "SQL",
      "NextAuth.js",
      "Tailwind CSS",
    ],
    theme: {
      card: "border-[#172554]/90 bg-gradient-to-b from-[#040d1f] via-[#030916] to-[#02050d] shadow-[0_14px_30px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(56,189,248,0.1)] hover:border-sky-500/75 hover:shadow-[0_18px_38px_rgba(14,165,233,0.16),inset_0_1px_0_rgba(125,211,252,0.2)]",
      corner: "border-sky-400/45",
      logoBox: "border-[#172554]/90 bg-[#041024]",
      company: "text-sky-300/85",
      skill:
        "border-sky-500/35 bg-[#06132b]/80 text-sky-200/85 hover:border-sky-400/80 hover:bg-sky-400/90 hover:text-[#030916]",
    },
    featured: true,
  },
  {
    id: "telus",
    role: "Sales Representative",
    company: "TELUS Communications Inc.",
    employmentType: "Seasonal",
    period: "May 2024 - Aug 2024",
    duration: "4 mos",
    location: "Edmonton, Alberta, Canada · On-site",
    Logo: TelusPixelLogo,
    highlights: [
      "Generated $59,256 in company revenue providing technology-based service contracts.",
      "Excelled in communication and problem-solving, ensuring tailored solutions and high satisfaction.",
    ],
    skills: ["Communication", "Pitching", "Problem Solving"],
    theme: {
      card: "border-[#3b0764]/90 bg-gradient-to-b from-[#130624] via-[#0c0417] to-[#06020c] shadow-[0_14px_30px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(52,211,153,0.08)] hover:border-emerald-500/70 hover:shadow-[0_18px_38px_rgba(107,33,168,0.2),inset_0_1px_0_rgba(74,222,128,0.18)]",
      corner: "border-emerald-500/45",
      logoBox: "border-[#4c1d95]/80 bg-[#140626]",
      company: "text-emerald-400/85",
      skill:
        "border-emerald-600/40 bg-[#18082e]/80 text-emerald-300/85 hover:border-emerald-400/80 hover:bg-emerald-400/85 hover:text-[#0b0316]",
    },
  },
];

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

export default function ArcadeExperience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="arcade-screen relative mx-auto w-full max-w-[65.5rem] px-4 py-4 sm:px-5"
    >
      <div className="mb-6 flex items-center justify-center gap-3">
        <span className="h-0.5 w-14 bg-amber-500/40" />
        <h2
          id="experience-heading"
          className="text-[11.5px] uppercase tracking-[0.25em] text-amber-400/95 sm:text-[14px]"
          style={PIXEL_FONT}
        >
          EXPERIENCE
        </h2>
        <span className="h-0.5 w-14 bg-amber-500/40" />
      </div>

      <div className="space-y-5">
        {EXPERIENCES.map((exp) => {
          const isFeatured = Boolean(exp.featured);
          const CompanyLogo = exp.Logo;

          return (
            <article
              key={exp.id}
              onMouseEnter={() => playHover()}
              className={`group relative origin-center rounded border-2 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 motion-safe:hover:scale-[1.02] ${exp.theme.card}`}
            >
              <div className={`pointer-events-none absolute left-1.5 top-1.5 h-3 w-3 border-l-2 border-t-2 transition-opacity group-hover:opacity-100 ${exp.theme.corner}`} />
              <div className={`pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 border-r-2 border-t-2 transition-opacity group-hover:opacity-100 ${exp.theme.corner}`} />
              <div className={`pointer-events-none absolute bottom-1.5 left-1.5 h-3 w-3 border-b-2 border-l-2 transition-opacity group-hover:opacity-100 ${exp.theme.corner}`} />
              <div className={`pointer-events-none absolute bottom-1.5 right-1.5 h-3 w-3 border-b-2 border-r-2 transition-opacity group-hover:opacity-100 ${exp.theme.corner}`} />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded border-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] transition-transform duration-200 group-hover:scale-105 ${exp.theme.logoBox}`}
                  >
                    <CompanyLogo className="h-full w-full" />
                  </div>

                  <div>
                    <h3
                      className="text-[16px] leading-snug text-white sm:text-[21px]"
                      style={PIXEL_FONT}
                    >
                      {exp.role}
                    </h3>
                    <p
                      className={`mt-2 text-[11px] leading-relaxed sm:text-[13px] ${exp.theme.company}`}
                      style={PIXEL_FONT}
                    >
                      {exp.company} · {exp.employmentType}
                    </p>
                  </div>
                </div>

                <div className="arcade-body shrink-0 text-[15px] leading-snug text-white/75 sm:text-right sm:text-[16.5px]">
                  <p className="font-medium tabular-nums text-white/95">
                    {exp.period} · {exp.duration}
                  </p>
                  <p className="mt-0.5 text-[12px] text-white/65 sm:text-[15px]">{exp.location}</p>
                </div>
              </div>

              <ul
                className={
                  isFeatured
                    ? "arcade-body mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed tracking-wide text-white/90 sm:text-[17px]"
                    : "arcade-body mt-3.5 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed tracking-wide text-white/85 sm:text-[16px]"
                }
              >
                {exp.highlights.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>

              {exp.skills && exp.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      onMouseEnter={() => playHover()}
                      className={`arcade-body cursor-default rounded border px-2.5 py-0.5 text-[12px] font-medium transition-colors duration-150 sm:text-[15px] ${exp.theme.skill}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <p className="arcade-body mt-4 text-center text-[11px] text-white/45">
        Company logos are stylized pixel tributes. GleamCo and TELUS Communications Inc. trademarks and all rights remain with their respective owners.
      </p>
    </section>
  );
}
