import { PROJECTS } from "../data/projects";

export const VFS_STORAGE_KEY = "portfolio_os_vfs_v4";

export const DEFAULT_VFS = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        adnan: {
          type: "dir",
          children: {
            "README.txt": {
              type: "file",
              content:
                "Tiny operating system.\nTry out the Konami Code (Up, Up, Down, Down, Left, Right, Left, Right, B, A).",
            },
            "education.txt": {
              type: "file",
              content:
                "University of Alberta, B.S. Computer Science (Sep 2022 - Dec 2026)\nGPA: 3.6 · Faculty of Science Dean's Honor Roll",
            },
            "experience.txt": {
              type: "file",
              content:
                "1. Software Developer @ GleamCo (May 2026 - Aug 2026)\n   - Migrated full-stack CRM (TypeScript, Next.js, SQL, NextAuth.js)\n   - Processed $80,000+ revenue, cut quote creation 10m -> <2m\n2. Sales Representative @ TELUS (May 2024 - Jul 2024)\n   - Generated $59,256 in revenue",
            },
            notes: {
              type: "dir",
              children: {
                "ideas.txt": {
                  type: "file",
                  content: "Try typing the Konami Code anywhere on the page for Overclock Mode.",
                },
              },
            },
            projects: {
              type: "dir",
              children: Object.fromEntries(
                PROJECTS.map((p) => [
                  `${p.id}.txt`,
                  {
                    type: "file",
                    content: `${p.title}\nStack: ${p.stack}\n\n${p.description}${p.githubUrl ? `\nGitHub: ${p.githubUrl}` : ""}`,
                  },
                ])
              ),
            },
          },
        },
      },
    },
  },
};

export const MAX_VFS_TEXT_LENGTH = 32768;
const BLOCKED_SEGMENTS = new Set(["__proto__", "constructor", "prototype", ".", ".."]);

export function isSafeEntryName(name) {
  if (typeof name !== "string") return false;
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 64) return false;
  if (BLOCKED_SEGMENTS.has(trimmed)) return false;
  if (
    trimmed.includes("/") ||
    trimmed.includes("\\") ||
    [...trimmed].some((ch) => ch.charCodeAt(0) < 32)
  ) {
    return false;
  }
  return true;
}

function sanitizeVfsNode(node, depth = 0) {
  if (!node || typeof node !== "object" || depth > 24) return null;
  if (node.type === "file") {
    const raw = typeof node.content === "string" ? node.content : "";
    return {
      type: "file",
      content: raw.slice(0, MAX_VFS_TEXT_LENGTH),
    };
  }
  if (node.type === "dir") {
    const safeChildren = {};
    const children = node.children;
    if (children && typeof children === "object" && !Array.isArray(children)) {
      for (const key of Object.keys(children)) {
        if (!Object.prototype.hasOwnProperty.call(children, key)) continue;
        if (!isSafeEntryName(key)) continue;
        const cleanChild = sanitizeVfsNode(children[key], depth + 1);
        if (cleanChild) {
          safeChildren[key] = cleanChild;
        }
      }
    }
    return {
      type: "dir",
      children: safeChildren,
    };
  }
  return null;
}

export function cloneDefaultVfs() {
  return JSON.parse(JSON.stringify(DEFAULT_VFS));
}

export function loadVfs() {
  try {
    const raw = window.localStorage.getItem(VFS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const sanitized = sanitizeVfsNode(parsed);
      if (sanitized && getNode(sanitized, ["home", "adnan"])?.type === "dir") {
        return sanitized;
      }
    }
  } catch {
    // ignore storage or parse errors and restore default filesystem
  }
  return cloneDefaultVfs();
}

export function saveVfs(vfs) {
  try {
    window.localStorage.setItem(VFS_STORAGE_KEY, JSON.stringify(vfs));
  } catch {
    // ignore storage errors
  }
}

export function resolvePath(cwdParts, rawTarget) {
  if (!rawTarget || rawTarget === "~") return ["home", "adnan"];
  let parts;
  if (rawTarget.startsWith("/")) {
    parts = rawTarget.split("/").filter(Boolean);
  } else if (rawTarget.startsWith("~/")) {
    parts = ["home", "adnan", ...rawTarget.slice(2).split("/").filter(Boolean)];
  } else {
    parts = [...cwdParts, ...rawTarget.split("/").filter(Boolean)];
  }

  const stack = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return stack;
}

export function getNode(root, pathParts) {
  let curr = root;
  for (const seg of pathParts) {
    if (!isSafeEntryName(seg)) return null;
    if (
      !curr ||
      curr.type !== "dir" ||
      !curr.children ||
      !Object.prototype.hasOwnProperty.call(curr.children, seg)
    ) {
      return null;
    }
    curr = curr.children[seg];
  }
  return curr;
}

export function formatCwd(parts) {
  if (parts.length === 2 && parts[0] === "home" && parts[1] === "adnan") return "~";
  if (parts.length > 2 && parts[0] === "home" && parts[1] === "adnan") {
    return `~/${parts.slice(2).join("/")}`;
  }
  return `/${parts.join("/")}`;
}
