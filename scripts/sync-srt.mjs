import fs from "node:fs";
import path from "node:path";

const srtArg = process.argv[2];
const fps = Number(process.argv[3] || 30);

if (!srtArg) {
  console.error("Usage: npm run sync-srt -- <path-to-file.srt> [fps]");
  console.error("Example: npm run sync-srt -- public/audio/voiceover/ep02-setiabudi-13.srt 30");
  process.exit(1);
}

const fullPath = path.resolve(process.cwd(), srtArg);
if (!fs.existsSync(fullPath)) {
  console.error(`SRT file not found: ${fullPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(fullPath, "utf8").replace(/\r\n/g, "\n").trim();

const toSeconds = (ts) => {
  const m = ts.trim().match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
};

const blocks = raw.split(/\n{2,}/);
const cues = [];

for (const block of blocks) {
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) continue;
  const timeLineIdx = lines.findIndex((l) => l.includes("-->"));
  if (timeLineIdx === -1) continue;
  const [startStr, endStr] = lines[timeLineIdx].split("-->").map((s) => s.trim());
  const startSec = toSeconds(startStr);
  const endSec = toSeconds(endStr);
  const text = lines.slice(timeLineIdx + 1).join(" ");
  cues.push({ startSec, endSec, text });
}

if (cues.length === 0) {
  console.error("No valid SRT cues found.");
  process.exit(1);
}

const totalSec = cues[cues.length - 1].endSec;
const totalFrames = Math.ceil(totalSec * fps);

console.log(`\n=== ARKANAYA 13 SRT SYNC (${fps} FPS) ===`);
console.log(`Cues       : ${cues.length}`);
console.log(`Total Audio: ${totalSec.toFixed(2)}s (${totalFrames} frames)\n`);

cues.forEach((cue, i) => {
  const dur = (cue.endSec - cue.startSec).toFixed(2);
  console.log(
    `[${String(i + 1).padStart(2, "0")}] ${cue.startSec.toFixed(2)}s -> ${cue.endSec.toFixed(2)}s (dur: ${dur}s) | ${cue.text}`,
  );
});

console.log("\n--- Tempelkan ini di episode.ts (level episode, tanpa perlu potong per scene) ---");
console.log(`srtText: ${JSON.stringify(raw)},`);
console.log(`duration: sec(${totalSec.toFixed(2)}),\n`);
