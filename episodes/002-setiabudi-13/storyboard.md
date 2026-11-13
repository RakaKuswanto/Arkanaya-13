# CREATIVE DIRECTION, STORYBOARD & REMOTION PLAN — EPISODE 002 (SETIABUDI 13)

## Deliverable 02 — Creative Direction
- **Judul Utama:** `MISTERI KARDUS SETIABUDI 13`
- **Judul Alternatif:** `DUA KARDUS DI SUDIRMAN 1981` / `MR. X DI BALIK SETIABUDI 13`
- **Sudut Pandang Naratif (*Central Angle*):** Paradoks identifikasi 1981 — bagaimana jenazah dengan ciri wajah dan sidik jari yang menurut catatan forensik masih relatif utuh justru tetap tidak teridentifikasi hingga empat dekade.
- **Hook Utama:** Kontradiksi antara adanya ciri fisik yang bisa dikenali vs nihilnya identitas resmi.
- **Alur Emosi:** Penasaran (`0–7s`) → Terkejut faktual (`7–31s`) → Ketelitian analitis (`31–48s`) → Suram/empati kemanusiaan (`48–60s`) → Kontradiksi & tanya tak terjawab (`60–72s`).
- **Arah Warna & Tipografi:** `ARKANAYA_COLORS` (`obsidian #101114`, `archiveCream #E8DFCF`, `bloodRed #9E302D`, `ashGrey #77746D`, `charcoal #343638`) dan `ARKANAYA_FONTS` (`Anton`, `Bebas Neue`, `Inter`, `IBM Plex Mono`).
- **Preset Visual Utama (`VISUAL_PRESETS`):** `archiveReveal` → `timelineInvestigation` → `mapJourney` → `classifiedDossier` → `mysteryPause` → `cinematicClosing`.

---

## Deliverable 04 & 06 — Storyboard & Remotion v2.0 Implementation Plan

| Scene ID & Range (`30fps`) | Tipe (`EpisodeSceneType`) | Komponen Utama (v2.0) | Komposisi Visual & Motion | Text Overlay & Status Integritas | Audio / SFX & Transisi |
|---|---|---|---|---|---|
| `sc-01-hook` `00:00–00:07` (`0–210f`) | `opening` (`CaseOpening` / `QuestionReveal`) | `CaseOpening`, `SeriesLabel`, `EpisodeNumber` | Latar gelap obsidian + reveal headline cepat bertahap | `EPISODE 02 · A13-1981-013`, *"MISTERI KARDUS SETIABUDI 13"*, Status: `UNSOLVED` | Hit bas rendah (`low_cinematic_impact` @ f8) → `paperCut` |
| `sc-02-discovery` `00:07–00:18` (`210–540f`) | `background` | `SectionTitle`, `PolaroidStack`, `PoliceReport` / `MediaFallbackPlate` | Dua Polaroid reka ulang lokasi trotoar jatuh bergantian (*spring*); catatan laporan awal | *"23 NOV 1981 · JL. SUDIRMAN, SETIABUDI"*, Badge `VERIFIED` pada tanggal & lokasi | Shutter kamera (`camera_shutter` @ f12) → `verticalWipe` |
| `sc-03-contents` `00:18–00:31` (`540–930f`) | `statHero` + `evidence` | `KineticNumber`, `DataChart`, `EvidenceMarker` | Dua angka besar (`13` tulang utama vs `180` potongan daging) + kartu bukti terhubung benang merah | `13 BAGIAN TULANG` / `±180 POTONGAN DAGING`, sitasi `SRC-SB13-01` | Gesekan kertas (`paper_movement` @ f6) → `paperCut` |
| `sc-04-autopsy` `00:31–00:48` (`930–1440f`) | `dossier` + `quote` | `LowerThird`, `SuspectDossier`, `EvidenceZoom`, `SourceCitation` | `LowerThird` ahli forensik (`dr. Abdul Mun'im Idries`), kartu `MR. X` (`±165 cm`), zoom perlahan pada ringkasan analisis | Ringkasan otopsi RSCM (`VERIFIED`), perkiraan durasi pemisahan 3–4 jam (`ALLEGED`) | Rewind pita pelan (`tape_rewind`) → `verticalWipe` |
| `sc-05-burial` `00:48–01:00` (`1440–1800f`) | `location` + `timeline` | `MapRoute`, `DistanceMeasurement`, `CaseTimeline` | Rute 3 titik (`Setiabudi → RSCM → TPU Tegal Alur`) bergerak deterministik + timeline 23→27 Nov 1981 | `23 NOV 1981` → `27 NOV 1981: DIMAKAMKAN MR. X (TPU TEGAL ALUR)` (`VERIFIED`) | Ambient kota sunyi naik pelan → `paperCut` |
| `sc-06-disputed` `01:00–01:07` (`1800–2010f`) | `theorySplit` / `mystery` | `FactCheckCard`, `DocumentComparison`, `VerificationBadge` | Kartu `DISPUTED`: perbandingan klaim media populer (*sidik jari hilang*) vs catatan forensik (*wajah & sidik jari masih ada*) | Badge merah putus-putus `DISPUTED` + badge `UNKNOWN` untuk identitas pelaku | Stempel (`stamp_impact` @ f24) → `filmBurn` |
| `sc-07-ending` `01:07–01:12` (`2010–2160f`) | `conclusion` | `NarrativePause`, `ConclusionCard`, `CaseEnding`, `FadeToBlack` | Jeda tenang (`MotionIntensity: "restrained"`), kartu pertanyaan terbuka, lalu `ARKANAYA` tagline & fade to black | *"Mengapa seseorang yang cirinya tertinggal justru menghilang tanpa nama?"* + tagline ARKANAYA | Musik turun bersih ke sunyi sebelum detik ke-72 |

---

## Deliverable 05 — Asset Requirements

| Asset ID | Kategori | Saran Sumber & Kata Kunci | Path Target Lokal | Status Wajib Label |
|---|---|---|---|---|
| `ast-map-jkt` | Map | Peta jalan resmi Jakarta Selatan–Barat (OpenStreetMap / peta grafis buatan internal rute Setiabudi–RSCM–Tegal Alur) | *(Atau render langsung via `MapRoute` + `waypoints`)* | Peta ilustratif rute |
| `ast-bg-sudirman` | Authentic Archival / Licensed Stock | Foto arsip Jalan Jenderal Sudirman / Jakarta awal 1980-an (Arsip Nasional / ANRI / Perpusnas / media berlisensi) | `public/media/ep02/sudirman-1981.jpg` | Wajib lisensi & kredit sumber |
| `ast-recon-box` | AI-Generated Illustration / Graphic *(Opsional)* | Ilustrasi monokrom kardus di trotoar malam/pagi bergaya arsip (tanpa konten grafis korban) | `public/media/ep02/recon-trotoar.jpg` | Wajib diberi label **REKONSTRUKSI ILUSTRATIF** |
| `ast-vo-ep02` | Voice Over | Rekaman narasi manual kreator (`48kHz WAV/MP3`) + `.srt` via `npm run sync-srt` | `public/audio/voiceover/ep02-setiabudi-13.mp3` | — |
| `ast-bgm-dark` | Music & Ambient | Musik minimalis ambient piano/cello bernada serius + room tone ruang arsip (royalty-free / orisinal) | `public/audio/music/dark-archive-theme.mp3` & `public/audio/ambient/archive-hum.mp3` | — |
| `ast-sfx-pack` | Sound Effects | `low_cinematic_impact`, `camera_shutter`, `paper_movement`, `tape_rewind`, `stamp_impact` | `public/audio/sfx/*.mp3` | — |

---

## Deliverable 07 — Editing & Audio Plan
1. Rekam VO sesuai `script.md` dengan jeda natural 0.5–0.8 detik di akhir tiap segmen; konversi subtitle `.srt` ke token kata melalui `npm run sync-srt`.
2. Konfigurasikan `AudioDuck` / `BackgroundMusicTrack` pada `DocumentaryEpisode` (`baseVolume: 0.24`, `duckedVolume: 0.09`, `rampFrames: 10`) di sepanjang rentang bicara VO.
3. Hindari lonjakan bass horor atau efek *jump scare* saat menyebut angka potongan tubuh; gunakan SFX realistis (`paper_movement`, `camera_shutter`, `stamp_impact`).
4. Lakukan uji render melalui `npx remotion render ep02-setiabudi-13 out/ep02-setiabudi-13.mp4` dan cek frame pada `9:16` (`1080×1920`).

---

## Deliverable 08 — Quality Control Checklist
- [x] Akurasi faktual: memisahkan fakta (`VERIFIED`), indikasi otopsi (`ALLEGED`), beda versi sumber sekunder (`DISPUTED`), dan kekosongan bukti (`UNKNOWN`).
- [x] Hook `0–7s`: langsung menyorot kontradiksi identifikasi tanpa intro klise.
- [x] Panjang VO `~168 kata`: masuk kisaran `130–190 kata` untuk durasi `~72 detik`.
- [x] Safe area `9:16` terjaga (`getSafeMargins(1080, 1920)`), tidak ada teks tertutup UI media sosial.
- [ ] Aset foto arsip 1981 & rekaman VO asli belum tersedia di `public/` (saat ini komponen media fallback bersih ke `MediaFallbackPlate`).
