import fs from "node:fs";
import path from "node:path";

const rawSlug = process.argv[2];
const rawTitle = process.argv.slice(3).join(" ") || "JUDUL KASUS BARU";

if (!rawSlug) {
  console.error("Usage: npm run new-episode -- <slug> [\"JUDUL KASUS\"]");
  console.error("Example: npm run new-episode -- ep02-hilangnya-penerbangan \"HILANGNYA PENERBANGAN 19\"");
  process.exit(1);
}

const slug = rawSlug
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, "-")
  .replace(/^-|-$/g, "");

const camelName =
  slug.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase()) + "Episode";

const targetPath = path.resolve(process.cwd(), "src", "episodes", `${slug}.ts`);

if (fs.existsSync(targetPath)) {
  console.error(`Episode file already exists: ${targetPath}`);
  process.exit(1);
}

const template = `import { type EpisodeData, sec, validateEpisode } from "../schema/episode";

export const ${camelName}: EpisodeData = validateEpisode({
  id: "${slug}",
  episodeNumber: "EPISODE XX",
  caseNumber: "A13-XXXX-001",
  title: "${rawTitle.toUpperCase()}",
  subtitle: "Ringkasan singkat kasus misteri.",
  category: "UNSOLVED CASE",
  location: "Lokasi Kejadian",
  date: "1990-01-01",
  status: "UNSOLVED",
  fps: 30,
  // voiceover: "audio/voiceover/${slug}.mp3",
  // music: "audio/music/dark-ambient.mp3",
  // ambient: "audio/ambient/rain-archive.mp3",
  scenes: [
    {
      id: "opening",
      type: "opening",
      duration: sec(6),
      headline: "${rawTitle.toUpperCase()}",
      subtitle: "Hook pembuka satu sampai dua kalimat.",
      transition: "paperCut",
    },
    {
      id: "background",
      type: "background",
      duration: sec(7),
      chapterNumber: "01",
      headline: "INTRODUCTION",
      subtitle: "Tanggal & Lokasi",
      body: "Narasi pengantar latar belakang kejadian.",
      // galleryMode: "photo", // "photo" | "contactSheet" | "polaroidStack"
      // background: "media/${slug}/photo-01.jpg",
      // srtText: "1\\n00:00:00,200 --> 00:00:05,000\\nTeks subtitle...",
      transition: "verticalWipe",
    },
    {
      id: "timeline",
      type: "timeline",
      duration: sec(8),
      chapterNumber: "02",
      headline: "THE INCIDENT",
      events: [
        {
          date: "00:00",
          title: "KRONOLOGI AWAL",
          description: "Detail kejadian pertama.",
        },
        {
          date: "01:30",
          title: "TITIK BALIK",
          description: "Detail kejadian krusial.",
          highlight: true,
        },
      ],
      transition: "paperCut",
    },
    {
      id: "mystery",
      type: "mystery",
      duration: sec(7),
      chapterNumber: "03",
      headline: "THE MYSTERY",
      docNumber: "A13-DOC-01",
      agency: "ARCHIVE DOSSIER",
      subtitle: "RINGKASAN TEMUAN",
      body: "Kesimpulan investigasi dan bagian yang masih dirahasiakan.",
      redactedPhrases: ["dirahasiakan"],
      annotations: ["NOTE: Belum ditemukan bukti konklusif."],
      stamp: "UNSOLVED",
      transition: "filmBurn",
    },
    {
      id: "conclusion",
      type: "conclusion",
      duration: sec(6),
      headline: "Setiap kejadian punya cerita. Tidak semua cerita punya jawaban.",
    },
  ],
});
`;

fs.writeFileSync(targetPath, template, "utf8");
console.log(`Created ${targetPath}`);
console.log(`Next: import ${camelName} in src/episodes/index.ts and add it to EPISODES.`);
