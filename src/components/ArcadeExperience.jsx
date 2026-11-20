/**
 * Arcade-style experience section: GleamCo (featured) and TELUS.
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
    featured: true,
  },
  {
    id: "telus",
    role: "Sales Representative",
    company: "TELUS",
    employmentType: "Seasonal",
    period: "May 2024 - Jul 2024",
    duration: "3 mos",
    location: "Edmonton, Alberta, Canada · On-site",
    highlights: [
      "Generated $59,256 in company revenue providing technology-based service contracts.",
      "Excelled in communication and problem-solving, ensuring tailored solutions and high satisfaction.",
    ],
  },
];

const PIXEL_FONT = { fontFamily: '"Press Start 2P", cursive' };

export default function ArcadeExperience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="arcade-screen relative mx-auto w-full max-w-[59rem] px-6 py-4"
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

          return (
            <article
              key={exp.id}
              className={
                isFeatured
                  ? "relative rounded border-2 border-amber-500/60 bg-black/80 p-5 text-left shadow-[0_14px_30px_rgba(0,0,0,0.65),inset_0_0_24px_rgba(0,0,0,0.65)]"
                  : "rounded border-2 border-white/20 bg-black/60 p-4 text-left shadow-[0_10px_24px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.5)]"
              }
            >
              {isFeatured && (
                <>
                  <div className="pointer-events-none absolute left-1.5 top-1.5 h-3 w-3 border-l-2 border-t-2 border-amber-400/70" />
                  <div className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 border-r-2 border-t-2 border-amber-400/70" />
                  <div className="pointer-events-none absolute bottom-1.5 left-1.5 h-3 w-3 border-b-2 border-l-2 border-amber-400/70" />
                  <div className="pointer-events-none absolute bottom-1.5 right-1.5 h-3 w-3 border-b-2 border-r-2 border-amber-400/70" />
                </>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3
                    className={
                      isFeatured
                        ? "text-[16px] leading-snug text-white sm:text-[21px]"
                        : "text-[16px] leading-snug text-white/95 sm:text-[21px]"
                    }
                    style={PIXEL_FONT}
                  >
                    {exp.role}
                  </h3>
                  <p
                    className={
                      isFeatured
                        ? "mt-2 text-[12px] text-amber-400/95 sm:text-[14px]"
                        : "mt-2 text-[12px] text-amber-400/85 sm:text-[14px]"
                    }
                    style={PIXEL_FONT}
                  >
                    {exp.company} · {exp.employmentType}
                  </p>
                </div>

                <div className="arcade-body shrink-0 text-[15px] leading-snug text-white/75 sm:text-right sm:text-[16.5px]">
                  <p className="font-medium tabular-nums text-white/90">
                    {exp.period} · {exp.duration}
                  </p>
                  <p className="mt-0.5 text-[12px] text-white/60 sm:text-[15px]">{exp.location}</p>
                </div>
              </div>

              <ul
                className={
                  isFeatured
                    ? "arcade-body mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed tracking-wide text-white/90 sm:text-[17px]"
                    : "arcade-body mt-3.5 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed tracking-wide text-white/80 sm:text-[16px]"
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
                      className="arcade-body cursor-default rounded border border-amber-500/40 bg-amber-950/35 px-2.5 py-0.5 text-[12px] font-medium text-amber-300/95 transition-colors duration-150 hover:border-amber-300 hover:bg-amber-400 hover:text-black sm:text-[15px]"
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
    </section>
  );
}
