# ARKANAYA 13 — Documentary Production System

> *"Setiap kejadian punya cerita. Tidak semua cerita punya jawaban."*

Standalone Remotion documentary engine (`1080 × 1920`, `9:16`, `30 fps`) untuk produksi video investigasi, true crime, misteri sejarah, dan arsip dokumenter.

## Struktur Project

```text
ARKANAYA 13/
├── public/
│   ├── media/             # Foto arsip, kliping, bukti (dirujuk relatif: "media/...")
│   └── audio/
│       ├── voiceover/     # Narasi VO ("audio/voiceover/...")
│       ├── music/         # Musik latar (auto-ducking aktif pada scene bernarasi)
│       ├── ambient/       # Suara ambien
│       └── sfx/           # Efek suara per scene
├── scripts/
│   └── new-episode.mjs    # Generator template episode baru
├── src/
│   ├── components/        # 7 kategori komponen reusable
│   ├── episodes/          # Data episode tervalidasi Zod (auto-terdaftar ke Studio)
│   ├── motion/            # 14 preset animasi deterministik
│   ├── schema/            # EpisodeSchema, sec(), & helper durasi
│   ├── theme/             # Token warna, safe margins & tipografi ARKANAYA 13
│   ├── utils/             # resolveMediaSrc (staticFile + URL) & deterministic hash
│   ├── ComponentShowcase.tsx
│   ├── DocumentaryEpisode.tsx
│   ├── Root.tsx
│   └── index.ts
├── remotion.config.ts
└── package.json
```

## Perintah Utama

```bash
# 1. Install dependencies (jika baru pertama kali)
npm install

# 2. Jalankan Remotion Studio
npm run studio

# 3. Buat file episode baru dengan cepat
npm run new-episode -- ep02-judul-kasus "JUDUL KASUS BARU"

# 4. Validasi TypeScript + ESLint Remotion
npm run check

# 5. (Opsional) Analisis file .srt dari rekaman VO untuk sinkronisasi durasi
npm run sync-srt -- public/audio/voiceover/ep02-kasus.srt

# 6. Render video penuh (contoh ep01-cooper)
npx remotion render ep01-cooper out/ep01-cooper.mp4
```

## Workflow Produksi Konten

1. **Siapkan Aset** di `public/media/<slug>/` dan `public/audio/`.
   - Path relatif seperti `"media/ep02/foto.jpg"` atau `"audio/vo/ep02.mp3"` otomatis di-resolve lewat `resolveMediaSrc()` (`staticFile()`), sedangkan URL `http(s)://` langsung diteruskan.
2. **Generate Template**:
   ```bash
   npm run new-episode -- ep02-kasus "JUDUL KASUS"
   ```
3. **Isi Skrip Episode** di `src/episodes/ep02-kasus.ts`:
   - Gunakan `sec(detik)` (dari `../schema/episode`) untuk durasi scene dalam detik.
   - Tempelkan subtitle SRT langsung di field `srtText` per scene, atau gunakan array token `captions`.
   - Musik latar (`music`) otomatis mengecil (`AudioDuck`) hanya pada scene yang memiliki narasi (`srtText`, `captions`, atau `body`).
4. **Daftarkan Episode** ke array `EPISODES` di `src/episodes/index.ts`.
   - Episode otomatis tervalidasi Zod dan muncul di folder **Episodes** pada Remotion Studio.
5. **Cek & Render**: jalankan `npm run check`, preview di `npm run studio`, lalu render dengan `npx remotion render <id> out/<id>.mp4`.

## Referensi Tipe Scene (`EpisodeSceneSchema`)

| `type` | Kegunaan | Field Penting |
| :--- | :--- | :--- |
| `opening` | Judul kasus & metadata | `headline`, `highlightWords`, `subtitle` |
| `background` | Foto/galeri arsip & narasi | `galleryMode` (`"photo"` \| `"contactSheet"` \| `"polaroidStack"`), `background` / `galleryItems`, `filmStockLabel`, `body` |
| `incident` | Kliping koran / ringkasan insiden | `headline`, `subtitle`, `body`, `dateStamp` |
| `timeline` | Kronologi bertahap | `events` (`date`, `title`, `description`, `highlight`) |
| `location` | Peta rute & angka fakta | `waypoints`, `routeMode` (`"flight"` \| `"vehicle"` \| `"walking"`), `stat` |
| `evidence` | Papan investigasi & benang merah | `cards` (`image` mendukung path `public/`), `connections` |
| `mystery` | Dokumen rahasia, redaksi & stempel | `docNumber`, `agency`, `body`, `redactedPhrases`, `annotations`, `stamp` |
| `quote` | Kutipan saksi / pernyataan resmi | `body`, `highlightPhrase`, `speaker`, `source` |
| `audioTape` | Rekaman pita / sadapan / transkrip | `docNumber`, `speaker`, `body` |
| `dossier` | Profil subjek / tersangka | `subtitle` (nama), `speaker` (alias), `background` (foto), `dossierAttributes`, `body`, `stamp` |
| `comparison` | Perbandingan 2 sisi (Klaim vs Bukti) | `comparisonLeft`, `comparisonRight` (`label`, `src`, `caption`) |
| `statHero` | Kartu statistik angka besar beruntun | `stats` (array `{ value, prefix, suffix, label, description, source }`) |
| `transcript` | Log transkrip mikrofilm + sensor inline | `transcriptLines` (`{ speaker, text, redacted? }`) |
| `theorySplit` | Perbandingan teori / hipotesis berstatus | `theories` (`{ label, title, summary, status? }`) |
| `chapterBreak` | Jeda bab sinematik layar penuh | `chapterNumber`, `headline`, `highlightWords`, `subtitle` |
| `conclusion` | Pernyataan penutup & outro | `headline` |

Setiap scene juga mendukung `transition` (`"none"` \| `"verticalWipe"` \| `"paperCut"` \| `"filmBurn"`), `sfx` (`category`, `src`, `offsetFrame`, `volume`), `srtText`, dan `captions`.

Untuk katalog lengkap **20 motion presets** dan seluruh **komponen**, lihat [docs/COMPONENTS_AND_MOTION.md](docs/COMPONENTS_AND_MOTION.md).
