# ARKANAYA — Episode Schema Reference

Sistem data-driven ARKANAYA memvalidasi seluruh episode dengan **Zod** di `src/schema/episode.ts` dan me-render-nya melalui `DocumentaryEpisode` (`src/DocumentaryEpisode.tsx`).

---

## 1. `EpisodeSchema` (Top-Level)

| Field | Tipe | Default / Wajib | Deskripsi |
|---|---|---|---|
| `id` | `string` | Wajib (`min(1)`) | ID unik komposisi Remotion (mis. `ep02-setiabudi-13`) |
| `episodeNumber` | `string` | `"EPISODE 01"` | Label nomor episode |
| `caseNumber` | `string` | `"A13-001"` | Kode berkas arsip (`CaseMetadata`, `CaseOpening`) |
| `title` | `string` | Wajib (`min(1)`) | Judul kasus |
| `subtitle` | `string` | Opsional | Subjudul konteks singkat |
| `category` | `string` | `"UNSOLVED CASE"` | Kategori kasus |
| `location` | `string` | Wajib (`min(1)`) | Lokasi kejadian utama |
| `date` | `string` | Wajib (`min(1)`) | Tanggal kejadian / periode arsip |
| `status` | `string` | `"UNSOLVED"` | Status investigasi kasus |
| `duration` | `number` (int > 0) | Opsional | Override total durasi frame; default menghitung jumlah `scene.duration` |
| `fps` | `number` (int > 0) | `30` | Frame rate video |
| `voiceover` | `string` | Opsional | Path audio narasi VO (relatif terhadap `public/` atau URL) |
| `music` | `string` | Opsional | Path musik latar (otomatis ter-ducking oleh rentang narasi) |
| `ambient` | `string` | Opsional | Path ambient soundscape |
| `srtText` | `string` | Opsional | Teks subtitle `.srt` global episode |
| `scenes` | `EpisodeScene[]` | Wajib (`min(1)`) | Daftar adegan berurutan |

---

## 2. Daftar 16 `EpisodeSceneType`

| `type` | Komponen Utama yang Dipakai | Kegunaan Naratif |
|---|---|---|
| `opening` | `CaseOpening` | Pembukaan kasus resmi: nomor kasus, judul, lokasi, status |
| `background` | `NewspaperClipping` / `ArchivePhoto` | Latar belakang arsip atau pemberitaan koran |
| `incident` | `ArchivePhoto` / `VHSGlitch` / `CameraOverlay` | Rekonstruksi momen kejadian atau rekaman lapangan |
| `evidence` | `EvidenceBoard` / `InvestigationBoard` | Papan bukti dengan pin dan benang penghubung |
| `timeline` | `CaseTimeline` | Kronologi peristiwa bertahap |
| `location` | `MapRoute` | Rute pergerakan dan penanda koordinat geografis |
| `mystery` | `DocumentReveal` / `TypewriterText` | Fakta janggal, dokumen disunting/classified, jeda investigasi |
| `quote` | `QuoteCallout` | Kutipan sumber / saksi dengan frasa sorotan |
| `audioTape` | `AudioWaveform` + `CameraOverlay` | Putaran rekaman audio/intersep beserta waveform |
| `dossier` | `SuspectDossier` | Profil individu / subjek tak dikenal dengan atribut terstruktur |
| `comparison` | `SplitComparison` | Perbandingan dua foto, kondisi, atau versi bukti |
| `statHero` | `FactCounter` | Penonjolan satu angka/statistik krusial (+ daftar `stats` tambahan) |
| `transcript` | `TypewriterText` + `RedactedLine` | Kutipan transkrip rekaman dengan baris tersensor |
| `theorySplit` | Kartu dual + `VerificationBadge` | Penjelasan teori bersaing dengan status verifikasi masing-masing |
| `chapterBreak` | `SectionTitle` + `ChapterProgress` | Pembatas antar-bab dengan progress bar episode |
| `conclusion` | `CaseEnding` + `FadeToBlack` | Penutup editorial, pertanyaan terbuka, dan merek ARKANAYA |

---

## 3. Field `EpisodeSceneSchema`

### Metadata & Visual Umum
- `id` (`string`, wajib), `type` (`EpisodeSceneType`, wajib), `duration` (`number` frame, wajib; gunakan helper `sec(seconds, fps)`).
- `headline`, `highlightWords` (`string[]`), `subtitle`, `body`, `chapterNumber`, `background` (path gambar/video melalui `resolveMediaSrc`), `captionText`, `dateStamp`.
- `transition`: `"none" | "verticalWipe" | "paperCut" | "filmBurn"`.
- `captions` (`{ text, startMs, endMs }[]`), `srtText` (per scene).

### Media Galeri (`incident` / `background`)
- `galleryMode`: `"photo" | "contactSheet" | "polaroidStack"`
- `galleryItems`: array `{ src?, frameCode?, label?, caption?, date?, rotation? }`
- `filmStockLabel`: label roll film pada `ContactSheet`

### Data Spesifik Scene
- `events` (`TimelineEventSchema[]`): `{ date, title, description, highlight? }`
- `cards` (`BoardCardSchema[]`) & `connections` (`BoardConnectionSchema[]`) untuk `InvestigationBoard`
- `waypoints` (`MapWaypointSchema[]`) & `routeMode` (`"flight" | "vehicle" | "walking"`) untuk `MapRoute`
- `stat` & `stats` (`FactStatSchema`): `{ value, prefix?, suffix?, label, description, source? }`
- `stamp`, `docNumber`, `agency`, `redactedPhrases`, `annotations` untuk `DocumentReveal`
- `speaker`, `source`, `highlightPhrase` untuk `QuoteCallout` / `Document`
- `dossierAttributes`: `{ label, value }[]` untuk `SuspectDossier`
- `comparisonLeft`, `comparisonRight`: `{ label, src?, caption? }` untuk `SplitComparison`
- `transcriptLines`: `{ speaker, text, redacted? }[]`
- `theories`: `{ label, title, summary, status? }[]` (mendukung status `"VERIFIED"`, `"ALLEGED"`, `"UNVERIFIED"`, `"DISPUTED"`, `"UNKNOWN"`, `"OFFICIAL STATEMENT"`)
- `sfx`: `{ category, src?, offsetFrame?, volume? }` dengan 10 kategori `SceneSfxSchema`.

---

## 4. Helper Timeline & Validasi

```ts
import {
  calculateEpisodeDuration,
  computeSceneTimeline,
  sec,
  validateEpisode,
} from "../schema/episode";
```

- `sec(4.5)` → `135` frame (default `fps = 30`).
- `computeSceneTimeline(episode)` → menghitung `from` dan `durationInFrames` berurutan tanpa celah.
- `calculateEpisodeDuration(episode)` → mengembalikan `episode.duration` atau total durasi seluruh `scenes`.
- `validateEpisode(raw)` → mem-parse & melempar error Zod bila ada field wajib hilang atau koordinat/durasi tidak valid.

---

## 5. Visual Presets (`src/presets/visualPresets.ts`)

`VISUAL_PRESETS` menyediakan 8 konfigurasi siap pakai:
1. `archiveReveal` (`paperCut`, `archiveGold`, `filmGrain: 0.14`, `zoomIn`)
2. `classifiedDossier` (`verticalWipe`, `bloodRed`, `filmGrain: 0.12`, `zoomOut`, `stamp: "CLASSIFIED"`)
3. `evidenceDiscovery` (`paperCut`, `bloodRed`, `filmGrain: 0.1`, `panRight`)
4. `timelineInvestigation` (`verticalWipe`, `archiveGold`, `filmGrain: 0.1`, `zoomIn`)
5. `mapJourney` (`verticalWipe`, `bloodRed`, `filmGrain: 0.08`, `panLeft`)
6. `archivalMemory` (`filmBurn`, `archiveGold`, `filmGrain: 0.18`, `zoomOut`)
7. `mysteryPause` (`none`, `bloodRed`, `filmGrain: 0.12`, `zoomIn`, `stamp: "UNSOLVED"`)
8. `cinematicClosing` (`filmBurn`, `bloodRed`, `filmGrain: 0.11`, `zoomOut`)
