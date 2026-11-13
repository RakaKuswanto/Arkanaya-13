# Dokumentasi Komponen & Motion — ARKANAYA 13

Panduan lengkap seluruh **20 motion presets** dan **komponen dokumenter** yang tersedia di `src/motion/presets.ts` dan `src/components/`.

---

## 1. Motion Presets (`src/motion/presets.ts`)

Semua fungsi motion bersifat **deterministik berbasis frame** (`ctx = { frame, durationInFrames, fps }`).

### Kamera & Pembesaran
| Preset | Output | Kegunaan |
| :--- | :--- | :--- |
| `slowZoomIn(ctx, { from?, to? })` | `number` (`scale`) | Zoom in perlahan pada foto arsip / peta. |
| `slowZoomOut(ctx, { from?, to? })` | `number` (`scale`) | Zoom out perlahan untuk reveal konteks. |
| `archivalPan(ctx, { xFrom?, xTo?, yFrom?, yTo? })` | `{ x, y }` | Panning halus dokumen atau foto lebar. |
| `subtleParallax(ctx, { depth?, rangePx? })` | `number` (`translateY`) | Pergeseran kedalaman antar layer. |
| `cameraRackFocus(ctx, { startFrame?, durationFrames?, maxBlurPx?, startScale? })` | `{ blurPx, scale, opacity }` | Efek fokus kamera dari buram ke tajam. |
| `handheldDrift(ctx, { amplitudePx?, rotationDeg?, seed? })` | `{ x, y, rotate }` | Gerakan napas kamera dokumenter yang sangat halus. |

### Tipografi & Dokumen
| Preset | Output | Kegunaan |
| :--- | :--- | :--- |
| `typewriterReveal(ctx, totalChars, { charsPerSecond?, startFrame? })` | `number` (jumlah karakter) | Efek ketik mesin tik untuk transkrip/dokumen. |
| `headlineImpact(ctx, { startFrame?, enterFrames?, exitFrames?, exit? })` | `{ opacity, translateY }` | Masuk/keluar headline editorial. |
| `paperReveal(ctx, { delay?, duration? })` | `{ clipPercent, opacity, translateY }` | Kemunculan kertas/kliping arsip. |
| `documentSlide(ctx, { startFrame?, enterFrames?, distancePx? })` | `{ opacity, translateY }` | Slide dokumen deklasifikasi. |
| `stampImpact(ctx, { delayFrames? })` | `{ scale, opacity }` | Hentakan stempel kasus (`UNSOLVED`, `CLASSIFIED`). |
| `evidenceAppear(ctx, index, { staggerFrames?, enterFrames? })` | `{ opacity, scale, translateY }` | Kemunculan berurutan kartu bukti. |
| `highlighterSweep(ctx, { startFrame?, durationFrames? })` | `number` (`0..1`) | Sapuan stabilo/sorotan pada frasa kunci. |
| `redactWipe(ctx, { startFrame?, durationFrames?, mode? })` | `number` (`0..100` %) | Sapuan sensor hitam (`"redact"`) atau buka sensor (`"declassify"`). |
| `microfilmScroll(ctx, { distancePx?, stepFrames? })` | `number` (`translateY`) | Guliran arsip mikrofilm. |

### Analog, Efek & Transisi
| Preset | Output | Kegunaan |
| :--- | :--- | :--- |
| `fadeToBlack(ctx, { fadeInFrames?, fadeOutFrames? })` | `number` (`opacity`) | Opacity overlay hitam untuk intro/outro. |
| `glitchInterruption(ctx, { intensity?, seed? })` | `{ active, offsetX, rgbSplit }` | Gangguan sinyal VHS deterministik. |
| `filmFlicker(ctx, { amount?, seed? })` | `number` (`opacity`) | Kedipan proyektor film analog. |
| `verticalWipe(ctx, { direction? })` | `number` (`translateY` %) | Sapuan transisi vertikal. |
| `pulseBeacon(ctx, { periodFrames?, maxScale? })` | `{ scale, opacity }` | Denyut radar/pin koordinat & jejak aktif. |

---

## 2. Daftar Komponen (7 Kategori)

### A. Typography (`src/components/typography/`)
- **`HeadlineReveal`**: Judul editorial besar dengan highlight kata merah (`highlightWords`) dan opsi `paperStrip`.
- **`TypewriterText`**: Teks mesin tik dengan kecepatan `charsPerSecond` dan kursor opsional.
- **`DocumentaryCaption`**: Subtitle narasi dengan word-highlighting; mendukung `srtText` atau array `captions`.
- **`CaseMetadata`**: Tabel metadata monospace (`caseNumber`, `location`, `date`, `category`, `status`).
- **`SectionTitle`**: Header bab arsip (`FILE 01`, judul, garis merah, subjudul).
- **`KineticNumber`**: Counter angka statistik besar (`from`, `to`, `prefix`, `suffix`).
- **`QuoteCallout`** *(Baru)*: Blok kutipan saksi/dokumen resmi dengan tanda kutip merah besar, sorotan `highlightPhrase` (`highlighterSweep`), serta atribusi `speaker` & `source`.

### B. Archival Media (`src/components/archival/`)
- **`ArchivePhoto`**: Bingkai foto arsip dengan gaya `paper` / `film`, cap tanggal, dan caption.
- **`ContactSheet`**: Lembar kontak negatif film 35mm (`items`, `columns`, `filmStockLabel`).
- **`PolaroidStack`**: Tumpukan foto polaroid dengan rotasi dan pin merah.
- **`FilmOverlay`**: Lapisan grain, debu, goresan film, dan vignette analog.
- **`SplitComparison`** *(Baru)*: Perbandingan dua sisi (`left` vs `right`, mis. Klaim vs Bukti atau Sebelum vs Sesudah) dengan garis pemisah animasi.

### C. Investigation (`src/components/investigation/`)
- **`CaseStamp`**: Stempel kasus berputar (`UNSOLVED`, `CLASSIFIED`, `DECLASSIFIED`, `VERIFIED`, dll.).
- **`EvidenceCard`**: Kartu barang bukti bergaya polaroid atau dokumen.
- **`InvestigationBoard`**: Papan bukti interaktif dengan pin dan benang merah penghubung (`cards`, `connections`).
- **`CaseTimeline`**: Garis waktu kronologi vertikal atau horizontal.
- **`NewspaperClipping`**: Potongan koran vintage dengan efek sobekan kertas.
- **`DocumentReveal`**: Dokumen rahasia dengan sensor teks otomatis (`redactedPhrases`), catatan kaki, dan stempel.
- **`RedactedLine`** *(Baru)*: Baris teks inline yang disensor (`mode="redact"`) atau dibuka sensornya (`mode="declassify"`) secara animatif.
- **`SuspectDossier`** *(Baru)*: Kartu profil subjek investigasi lengkap dengan foto rack-focus, alias, status, atribut 2-kolom, dan catatan penyidik.

### D. Geographic & Data (`src/components/geographic/`)
- **`LocationMarker`**: Pin koordinat dengan animasi pulse dan label kota/koordinat.
- **`RouteAnimation`**: Jalur pergerakan animatif (`flight`, `vehicle`, `walking`).
- **`MapRoute`**: Peta sektor dengan grid koordinat, multiple `waypoints`, dan `RouteAnimation`.
- **`FactCounter`**: Kartu fakta angka besar lengkap dengan deskripsi dan sumber.

### E. Effects & Transitions (`src/components/effects/`, `src/components/transitions/`)
- **`KenBurns`**: Gerakan zoom/pan halus pada gambar atau dokumen.
- **`VHSGlitch`**: Efek distorsi tracking pita VHS dan RGB split.
- **`FilmBurn`**: Efek cahaya film burn untuk transisi hangat.
- **`CameraOverlay`**: HUD viewfinder kamera arsip (`● REC`, timecode, `cameraId`).
- **`AudioWaveform`** *(Baru)*: Visualisator gelombang audio pita rekaman / sadapan (`label`, `speaker`, `transcript`, timecode).
- **`VerticalWipe`**, **`FadeToBlack`**, **`PaperCutTransition`**: Transisi antar adegan.

### F. Branding (`src/components/branding/`)
- **`BrandOpening`**, **`CaseOpening`**, **`CaseEnding`**, **`Watermark`**.

### G. Audio Layer (`src/components/audio/`)
- **`VoiceOverTrack`**, **`BackgroundMusicTrack`** (auto-ducking via `AudioDuck`), **`AmbientSoundTrack`**, **`AudioFade`**, **`SoundEffect`** (10 preset kategori SFX).

---

## 3. Contoh Pemakaian Scene Baru di Episode

Di `src/episodes/ep02-kasus.ts`, kamu bisa langsung memakai tipe scene baru:

```ts
{
  id: "testimony",
  type: "quote",
  duration: sec(6),
  chapterNumber: "03",
  headline: "WITNESS STATEMENT",
  body: "Ia tidak tampak tergesa-gesa, hanya meminta segelas bourbon dan menyalakan rokok.",
  highlightPhrase: "tidak tampak tergesa-gesa",
  speaker: "PRAMUGARI PENERBANGAN 305",
  source: "FBI INTERVIEW // 25 NOV 1971",
  transition: "paperCut",
},
{
  id: "atc-tape",
  type: "audioTape",
  duration: sec(6),
  chapterNumber: "04",
  headline: "INTERCEPTED RECORDING",
  docNumber: "ATC-SEA // 20:13 PST",
  speaker: "FLIGHT 305 COCKPIT",
  body: "Indikator tangga belakang menyala. Kami mengalami penurunan tekanan kabin.",
  transition: "verticalWipe",
}
```

---

## 4. Komponen Tambahan v1.4.0

1. **`EvidenceMarker`** (`src/components/investigation/EvidenceMarker.tsx`)
   - **Fungsi:** Penanda barang bukti bernomor dengan cincin sorot berdenyut (`pulseBeacon`) dan callout anotasi.
   - **Props:** `number`, `label`, `annotation?`, `xPercent?`, `yPercent?`, `circleRadius?`, `accentColor?`, `style?`.
2. **`SourceCard`** (`src/components/investigation/SourceCard.tsx`)
   - **Fungsi:** Kartu verifikasi sumber (judul, penerbit, tanggal, tipe sumber `COURT | OFFICIAL | MEDIA | ARCHIVE | WITNESS`, status `VERIFIED | OFFICIAL | DISPUTED | UNVERIFIED`, dan catatan).
   - **Props:** `title`, `publisher`, `publicationDate?`, `sourceType?`, `verificationStatus?`, `notes?`, `style?`.
3. **`PhotoParallax`** (`src/components/effects/PhotoParallax.tsx`)
   - **Fungsi:** Lapisan 2.5D dengan pergerakan kedalaman deterministik antara `backgroundSrc`, `foregroundSrc`, dan slot `children`. Tetap aman meski aset gambar belum tersedia (fallback kanvas arsip).
   - **Props:** `backgroundSrc?`, `foregroundSrc?`, `depth?`, `children?`, `height?`, `style?`.
4. **`DocumentaryLowerThird`** (`src/components/typography/DocumentaryLowerThird.tsx`)
   - **Fungsi:** Lower-third editorial untuk narasumber, saksi, atau identitas peneliti beserta peran dan kredensialnya.
   - **Props:** `name`, `role?`, `credential?`, `accentColor?`, `style?`.
5. **`ChapterProgress`** (`src/components/branding/ChapterProgress.tsx`)
   - **Fungsi:** Indikator progres bab tersegmentasi untuk memetakan posisi episode.
   - **Props:** `currentChapter`, `totalChapters`, `label?`, `accentColor?`, `style?`.

---

## 5. Visual Presets (`src/presets/visualPresets.ts`)

`VISUAL_PRESETS` menyediakan 8 konfigurasi preset siap pakai (`VisualPresetName`) yang memetakan `sceneType`, `transition`, `accentColor`, `filmGrainOpacity`, dan `vignetteIntensity`:

| Preset | `sceneType` | `transition` | Karakter |
|---|---|---|---|
| `archiveReveal` | `document` | `paperCut` | Pembukaan arsip / dokumen resmi |
| `classifiedDossier` | `dossier` | `verticalWipe` | Profil subjek / berkas rahasia |
| `evidenceDiscovery` | `evidence` | `paperCut` | Pemaparan barang bukti & penanda |
| `timelineInvestigation` | `timeline` | `verticalWipe` | Urutan kronologi kejadian |
| `mapJourney` | `map` | `fadeBlack` | Perjalanan rute & lokasi |
| `archivalMemory` | `photo` | `filmBurn` | Foto arsip & memori historis |
| `mysteryPause` | `quote` | `fadeBlack` | Jeda reflektif / kutipan saksi |
| `cinematicClosing` | `closing` | `fadeBlack` | Penutup episode & pertanyaan terbuka |

Komposisi pratinjau layar lebar (`16:9`, `1920×1080`) juga tersedia di `src/Root.tsx` dengan ID **`arkanaya-16x9-preview`**.

