# ARKANAYA — Design System (`v2.0`)

Dokumen ini mendefinisikan token desain bersama, tipografi, tekstur, motion curve, batas aman, dan spesifikasi integritas bukti yang dikonsumsi oleh seluruh komponen di `src/theme/`, `src/motion/`, dan `src/components/`.

---

## 1. Brand Identity & Visual Direction

- **Brand:** `ARKANAYA` (`ARKANAYA 13`)
- **Tagline:** `"Setiap kejadian punya cerita. Tidak semua cerita punya jawaban."`
- **Arah Visual:** Dark investigative archive — dokumenter editorial, kliping koran arsip, film analog 16mm/VHS terkendali, foto bukti bernomor, dan berkas investigasi resmi.
- **Prinsip Tone:** Serius, cerdas, tertahan (*restrained*), investigatif, sinematik. Hindari efek horor murahan, glitch agresif tanpa konteks naratif, atau teks yang melanggar integritas fakta.

---

## 2. Color Tokens (`src/theme/tokens.ts` → `ARKANAYA_COLORS`)

| Token | Hex / Value | Fungsi Utama |
|---|---|---|
| `obsidian` | `#101114` | Background primer kanvas & panel arsip gelap |
| `deepBlack` | `#0A0B0D` | Latar luar komposisi, vignette edge, & fade-to-black |
| `charcoal` | `#343638` | Surface sekunder, border aktif, track bar |
| `ashGrey` / `mutedGray` | `#77746D` | Metadata sekunder, timestamp, keterangan sumber |
| `archiveCream` / `archivePaper` | `#E8DFCF` | Teks utama, dokumen terang, aksen krem arsip |
| `agedPaper` | `#D6CBB8` | Kertas tua untuk *NewspaperClipping* / berkas |
| `inkBlack` | `#141311` | Teks tinta di atas kertas/kliping/memo |
| `offWhite` | `#F3EDE0` | High-contrast headline highlights di kartu kertas |
| `bloodRed` | `#9E302D` | Aksen investigasi, red string, marker, `DISPUTED` |
| `archiveGold` | `#A58C50` | Penekanan arsip hangat, telemetri, tag sejarah |
| `verifiedOlive` | `#6E8F6B` | Status verifikasi `VERIFIED` |
| `allegedAmber` | `#C48A3D` | Status `ALLEGED` / klaim belum terbukti |
| `officialSlate` | `#7B909E` | Status `OFFICIAL STATEMENT` |
| `borderSubtle` | `rgba(232, 223, 207, 0.16)` | Border standar panel & divider halus |
| `borderStrong` | `rgba(232, 223, 207, 0.28)` | Border tegas kartu bukti / dokumen |
| `borderPaper` | `rgba(20, 19, 17, 0.24)` | Border tinta pada dokumen/memo terang |
| `surfacePanel` | `rgba(16, 17, 20, 0.90)` | Backdrop kartu terstruktur di atas peta/foto |
| `surfaceCharcoal` | `rgba(52, 54, 56, 0.45)` | Kontainer metadata & tag kecil |

> **Backward Compatibility:** `ARSIP_COLORS`, `ARSIP_BRAND`, dan `ARSIP_SAFE_MARGINS` tetap diekspor sebagai alias dari token `ARKANAYA_*` sehingga komponen atau episode lama tetap kompatibel.

---

## 3. Typography (`src/theme/typography.ts` → `ARKANAYA_FONTS`)

Seluruh font dimuat secara deterministik via `@remotion/google-fonts`:

| Key | Font Family | Weights | Penggunaan |
|---|---|---|---|
| `headline` | `Anton` | `400` | Judul utama (*HeadlineReveal*, *BrandOpening*, *CaseOpening*) |
| `secondary` | `Bebas Neue` | `400` | Subjudul bab, stempel besar (*CaseStamp*), angka besar (*KineticNumber*) |
| `body` | `Inter` | `400, 500, 600, 700` | Paragraf investigasi, transkrip, kutipan, badan laporan |
| `mono` | `IBM Plex Mono` | `400, 500, 600, 700` | Kode kasus, timestamp, koordinat, label bukti, tabel sumber |

Alias lama `ARSIP_FONTS` dan tipe `ArsipFontVariant` tetap tersedia.

---

## 4. Spacing, Borders, Shadows, & Textures (`src/theme/tokens.ts`)

### Spacing (`ARKANAYA_SPACING`)
- `xxs: 4`, `xs: 8`, `sm: 14`, `md: 20`, `lg: 28`, `xl: 36`, `xxl: 48` (pixel).

### Borders (`ARKANAYA_BORDERS`)
- `subtle`: `1px solid rgba(232, 223, 207, 0.16)`
- `strong`: `1px solid rgba(232, 223, 207, 0.28)`
- `paper`: `1px solid rgba(20, 19, 17, 0.24)`
- `paperHeavy`: `2px solid #141311`
- `accentLeft(color?)`: `4px solid <color>` (default `bloodRed`)

### Shadows (`ARKANAYA_SHADOWS`)
- `panel`: `"0 20px 52px rgba(0, 0, 0, 0.55)"`
- `heavy`: `"0 28px 72px rgba(0, 0, 0, 0.65)"`
- `pin`: `"0 4px 10px rgba(0, 0, 0, 0.45)"`
- `insetBoard`: `"inset 0 0 90px rgba(0, 0, 0, 0.65)"`

### Textures & Film Grain (`ARKANAYA_TEXTURES`, `ARKANAYA_FILM_GRAIN`)
- `darkPlateGradient`: `radial-gradient(circle at 50% 45%, #232428 0%, #101114 82%)`
- `boardSurface`: `"#15171B"`
- `newspaperPaper`: `"#DDD3C0"`
- `vignetteRadial(strength = 0.52)`: gradasi elips vignette untuk atmosfer gelap
- Grain levels (`ARKANAYA_FILM_GRAIN`): `off: 0`, `subtle: 0.08`, `standard: 0.12`, `heavy: 0.2`, `dustDefault: 0.35`, `scratchesDefault: 0.25`, `vignetteDefault: 0.5`.
- Shared SVG noise primitive: `<GrainSurface />` menggunakan `React.useId()` agar filter ID SVG tidak pernah bertabrakan ketika beberapa komponen arsip dirender bersamaan.

---

## 5. Animation Durations, Easing, Motion Intensity, & Variants

### Durations (`ARKANAYA_DURATIONS` dalam frame @ 30fps)
- `micro: 8` (~0.27s)
- `enter: 16` (~0.53s)
- `reveal: 22` (~0.73s)
- `transition: 28` (~0.93s)
- `stagger: 6` (0.2s per item)
- `exit: 12` (0.4s)

### Easings (`ARKANAYA_EASINGS` → `src/motion/presets.ts`)
- `editorial`: `[0.16, 1, 0.3, 1]` (`EDITORIAL_EASE`) — cepat masuk, pelan mengendap; standar dokumenter.
- `sharpExit`: `[0.7, 0, 0.84, 0]` (`SHARP_EXIT_EASE`) — keluar bersih sebelum transisi.
- `analog`: `[0.25, 0.1, 0.25, 1]` (`ANALOG_EASE`) — pergerakan kamera / zoom analog halus.

### Motion Intensity (`MotionIntensity`)
Digunakan oleh `scaleMotionDuration()` dan `resolveMotionIntensity()`:
- `"restrained"` → faktor `0.55` (lebih tenang/lambat untuk jeda reflektif & teks sensitif)
- `"editorial"` → faktor `1.0` (standar dokumenter ARKANAYA)
- `"urgent"` → faktor `1.35` (lebih cepat untuk kronologi kritis)

### Visual Variants (`ComponentVariant`)
`"minimal" | "archive" | "investigative" | "cinematic" | "urgent"` — didukung oleh komponen editorial dan branding baru agar variasi tampilan tetap konsisten dengan token merek.

---

## 6. Safe Margins (`9:16` vs `16:9`)

Gunakan helper `getSafeMargins(width, height)` dan `isLandscapeLayout(width, height)` dari `src/theme/tokens.ts` dengan ukuran dari `useVideoConfig()`:

| Layout | Constant | `top` | `bottom` | `left` | `right` | Catatan |
|---|---|---|---|---|---|---|
| Vertical `9:16` (`1080×1920`) | `ARKANAYA_SAFE_MARGINS` | `140` | `340` | `64` | `120` | Menghindari UI ikon kanan & deskripsi bawah Shorts/Reels/TikTok |
| Horizontal `16:9` (`1920×1080`) | `ARKANAYA_LANDSCAPE_SAFE_MARGINS` | `72` | `84` | `96` | `96` | Rasio televisi/YouTube widescreen |

---

## 7. Data Integrity System (`src/theme/dataIntegrity.ts`)

Kanal investigasi wajib membedakan tingkat kepastian informasi secara visual lewat `<VerificationBadge />` dan token di `src/theme/dataIntegrity.ts`:

| Status | Warna | Gaya Border | Makna Editorial |
|---|---|---|---|
| `VERIFIED` | `verifiedOlive` (`#6E8F6B`) | `solid` | Terkonfirmasi arsip / sumber ganda tepercaya |
| `OFFICIAL STATEMENT` (juga menerima alias `OFFICIAL`) | `officialSlate` (`#7B909E`) | `solid` | Pernyataan resmi instansi/otoritas yang tercatat |
| `ALLEGED` | `allegedAmber` (`#C48A3D`) | `dashed` | Dugaan, teori, atau kesaksian yang belum dibuktikan |
| `UNVERIFIED` | `ashGrey` (`#77746D`) | `dashed` | Informasi beredar tanpa verifikasi independen |
| `DISPUTED` | `bloodRed` (`#9E302D`) | `dashed` | Klaim dibantah atau terdapat kontradiksi sumber |
| `UNKNOWN` | `ashGrey` (`#77746D`) | `dotted` | Data hilang, nama tak dikenal, atau status tidak terjawab |

> Aturan tegas: Jangan pernah menandai pernyataan `ALLEGED`, `UNVERIFIED`, atau `DISPUTED` menggunakan gaya visual `VERIFIED`.
