# ARKANAYA — Reusable Component Library (`v2.0`)

Seluruh komponen dapat diimpor dari `@/components` (`src/components/index.ts`) atau `src/library.ts`. Semua animasi bersifat **100% deterministik** berbasis `useCurrentFrame()` dan `useVideoConfig()`, tanpa timer browser maupun nilai acak non-deterministik.

> Lihat juga [DESIGN_SYSTEM.md](file:///D:/RAKA%20KUSWANTO/1.%20PROJECTS/OTHER/Remotion/ARKANAYA%2013/docs/DESIGN_SYSTEM.md) untuk token warna, font, safe margins, dan aturan Data Integrity.

---

## 1. Typography & Editorial Storytelling

### `HeadlineReveal`
- **Purpose:** Mengungkap judul besar per kata atau per karakter dengan highlight merah darah dan opsi strip kertas arsip.
- **Props & Defaults:** `text` (wajib), `mode = "word"` (`"word" | "char"`), `font = "headline"`, `fontSize = 96`, `color = archivePaper`, `highlightWords = []`, `highlightColor = bloodRed`, `align = "left"`, `paperStrip = false`, `paperStripColor = archivePaper`, `staggerFrames = 3`, `enterFrames = 14`, `exit = true`, `exitFrames = 12`, `duration?`, `lineHeight = 0.96`, `letterSpacing = "0.02em"`, `uppercase = true`, `style?`.
- **Example:** `<HeadlineReveal text="ARSIP STASIUN BARAT" highlightWords={["STASIUN"]} paperStrip />`
- **Animation:** Masked slide-up ber-stagger dengan kurva `editorial`; opsi exit tajam di akhir `Sequence`.
- **Assets / Limitations:** Tanpa aset eksternal. Di mode `"char"` pada teks sangat panjang (>80 karakter) dengan `staggerFrames` besar dapat melebihi durasi scene pendek.

### `SectionTitle`
- **Purpose:** Penanda pembukaan bab naratif dengan nomor bab dan aksen garis merah.
- **Props & Defaults:** `title` (wajib; mendukung preset string bebas), `chapterNumber = "01"`, `subtitle?`, `accentColor = bloodRed`, `textColor = archivePaper`, `fontSize = 86`, `exit = false`, `style?`.
- **Animation:** Reveal bertahap nomor bab → garis aksen → judul & subjudul.
- **Assets / Limitations:** Tanpa aset. Judul 1–4 kata optimal pada `1080px`.

### `TypewriterText`
- **Purpose:** Efek pengetikan dokumen arsip monospaced dengan kursor berkedip deterministik.
- **Props & Defaults:** `text` (wajib), `charsPerSecond = 28`, `startFrame = 0`, `showCursor = true`, `cursorChar = "_"`, `cursorColor = bloodRed`, `cursorBlinkFrames = 14`, `font = "mono"`, `fontSize = 30`, `color = archivePaper`, `lineHeight = 1.5`, `letterSpacing = "0.02em"`, `maxWidth = 880`, `style?`.
- **Animation:** `typewriterReveal()` menghitung jumlah karakter dari frame saat ini dan FPS.
- **Limitations:** Pastikan durasi `Sequence` cukup panjang untuk `text.length / charsPerSecond * fps`.

### `KineticNumber`
- **Purpose:** Animasi angka statistik atau tahun arsip berformat.
- **Props & Defaults:** `from = 0`, `to` (wajib), `decimals = 0`, `prefix = ""`, `suffix = ""`, `label?`, `sublabel?`, `durationFrames = 42`, `delayFrames = 0`, `fontSize = 136`, `color = archivePaper`, `accentColor = bloodRed`, `align = "left"`, `style?`.
- **Animation:** Interpolasi angka terklem dengan easing `EDITORIAL_EASE`.
- **Limitations:** Angka sangat besar dengan sufiks panjang sebaiknya memakai `fontSize <= 84` pada grid dua kolom.

### `CaseMetadata`
- **Purpose:** Baris metadata berkas (nomor kasus, lokasi, tanggal, kategori, status).
- **Props & Defaults:** `caseNumber`, `location`, `date` (wajib), `category = "INVESTIGATION"`, `status = "UNSOLVED"`, `accentColor = bloodRed`, `textColor = archivePaper`, `mutedColor = mutedGray`, `borderColor`, `compact = false`, `style?`.
- **Variants:** Mode standar grid & `compact = true` untuk ruang terbatas / `16:9`.
- **Animation:** Slide fade editorial ringkas.

### `DocumentaryCaption`
- **Purpose:** Menampilkan subtitle narasi kata-demi-kata tersinkronisasi audio/SRT yang menghormati `safeMarginBottom` dan `safeMarginTop`.
- **Props & Defaults:** `captions = []`, `srtText?`, `position = "bottom"` (`"bottom" | "center" | "top"`), `safeMarginBottom = 340`, `safeMarginTop = 140`, `maxCharsPerLine = 26`, `fontSize = 44`, `textColor = archivePaper`, `highlightColor = bloodRed`, `backgroundColor`, `style?`.
- **Animation:** Menyorot kata aktif berdasarkan timestamp ms saat ini (`frame / fps * 1000`).
- **Limitations:** Jika `captions` dan `srtText` sama-sama kosong, tidak merender teks.

### `DocumentaryLowerThird`
- **Purpose:** Lower-third ringkas narasumber (versi klasik).
- **Props & Defaults:** `name` (wajib), `role?`, `credential?`, `accentColor = bloodRed`, `style?`.
- **Animation:** Bar aksen memanjang vertikal disusul fade-in nama & kredensial.

### `LowerThird` *(Baru — Phase 3)*
- **Purpose:** Lower-third narasumber versi baru dengan dukungan `VerificationBadge`, varian preset, posisi absolut aman (`inline | bottom-left | bottom-right`), dan `motionIntensity`.
- **Props & Defaults:** `name` (wajib), `role?`, `credential?`, `organization?`, `verificationStatus?`, `variant = "investigative"`, `position = "inline"`, `accentColor = bloodRed`, `motionIntensity = "editorial"`, `exit = false`, `style?`.
- **Variants:** `minimal`, `archive`, `investigative`, `cinematic`, `urgent`.
- **Example:** `<LowerThird name="Dr. Hendra" role="Ahli Forensik" verificationStatus="OFFICIAL STATEMENT" variant="investigative" />`
- **Animation:** Geser masuk dari kiri dengan intensitas terukur `scaleMotionDuration`.

### `QuoteCallout`
- **Purpose:** Kotak kutipan sumber berbatas aksen kiri dengan fitur highlight frasa kunci.
- **Props & Defaults:** `quote` (wajib), `speaker?`, `source?`, `highlightPhrase?`, `accentColor = bloodRed`, `fontSize = 38`, `style?`.
- **Animation:** Reveal kartu + penyorotan frasa kunci di tengah teks.

### `NarrativePause` *(Baru — Phase 3)*
- **Purpose:** Jeda naratif tenang di antara fakta berat untuk memberi ruang refleksi pada penonton.
- **Props & Defaults:** `statement` (wajib), `subtext?`, `label = "ARSIP // HENING"`, `showPulseDot = true`, `variant = "cinematic"`, `accentColor = bloodRed`, `motionIntensity = "restrained"`, `style?`.
- **Animation:** Fade lambat (`restrained` intensitas `0.55`) dan denyut indikator deterministik sinusoidal.

### `QuestionReveal` *(Baru — Phase 3)*
- **Purpose:** Menampilkan pertanyaan investigatif utama atau teka-teki tak terjawab.
- **Props & Defaults:** `question` (wajib), `context?`, `caseId?`, `variant = "investigative"`, `accentColor = bloodRed`, `motionIntensity = "editorial"`, `align = "left"`, `style?`.
- **Animation:** Bar tanda tanya & teks pertanyaan terungkap bertahap.

---

## 2. Archival Media

### `ArchivePhoto`
- **Purpose:** Bingkai foto arsip (kertas/film) lengkap dengan grain, filter monokrom/sepia, tanggal, dan gerakan Ken Burns internal.
- **Props & Defaults:** `src?`, `alt = "Archival photograph"`, `duration?`, `grayscale = true`, `sepia = 0.14`, `contrast = 1.15`, `grain = 0.22`, `zoom = { from: 1, to: 1.12 }`, `pan = { xFrom: -10, xTo: 10, yFrom: 0, yTo: -6 }`, `position = "center"`, `frameStyle = "paper"` (`"paper" | "film" | "none"`), `caption?`, `dateStamp?`, `width = 860`, `height = 560`, `style?`.
- **Animation:** Zoom & pan deterministik; memakai `<GrainSurface />`.
- **Assets & Fallback:** Jika `src` kosong, otomatis merender `<MediaFallbackPlate />` dengan label arsip tanpa error.

### `PhotoAnnotation` *(Baru — Phase 3)*
- **Purpose:** Overlay foto arsip dengan multi-titik marker bernomor, badge status integritas, dan label keterangan.
- **Props & Defaults:** `src?`, `caption?`, `verificationStatus = "VERIFIED"`, `markers` (wajib: `{ number, label, xPercent, yPercent }[]`), `height = 480`, `accentColor = bloodRed`, `style?`.
- **Assets & Fallback:** Menampilkan `<MediaFallbackPlate />` saat `src` tidak disuplai.

### `ContactSheet`
- **Purpose:** Lembar kontak film negatif berisi grid frame bernomor yang disorot berurutan.
- **Props & Defaults:** `items` (wajib), `columns = 2`, `highlightIndex?`, `sequentialHighlight = true`, `framesPerStep = 24`, `highlightColor = bloodRed`, `filmStockLabel = "KODAK TRI-X 400 · ARCHIVE ROLL"`, `width = 920`, `style?`.
- **Animation:** Bingkai merah bergerak berurutan per `framesPerStep` atau mengunci pada `highlightIndex`.

### `PolaroidStack`
- **Purpose:** Tumpukan foto Polaroid miring yang jatuh bertahap di atas meja investigasi.
- **Props & Defaults:** `items` (wajib), `staggerFrames = 10`, `width = 560`, `photoHeight = 440`, `showPin = true`, `style?`.
- **Animation:** Spring ber-stagger dengan rotasi deterministik.

### `SplitComparison`
- **Purpose:** Perbandingan dua kondisi media secara berdampingan (*Before / After* atau *Versi A / Versi B*).
- **Props & Defaults:** `left`, `right` (wajib: `{ label, src?, caption?, accentColor? }`), `height = 520`, `accentColor = bloodRed`, `style?`.
- **Assets & Fallback:** Jika `src` sisi kiri/kanan kosong, menampilkan plat arsip berlabel.

### `FilmOverlay`
- **Purpose:** Lapisan film analog global (grain SVG, debu, goresan vertikal, flicker, vignette, light leak).
- **Props & Defaults:** `grain = 0.12`, `dust = 0.35`, `scratches = 0.25`, `flicker = 0.05`, `vignette = 0.5`, `lightLeak = 0.18`, `lightLeakColor = bloodRed`, `style?`.
- **Limitations:** Setel `pointerEvents: "none"`; hindari `grain > 0.25` agar teks body tetap tajam saat kompresi video.

---

## 3. Investigation & Data Integrity

### `VerificationBadge` *(Baru — Phase 5)*
- **Purpose:** Indikator status integritas fakta untuk membedakan secara tegas fakta terkonfirmasi vs klaim terbantah/dugaan.
- **Props & Defaults:** `status = "UNVERIFIED"`, `showHint = false`, `compact = false`, `style?`.
- **Statuses Supported:** `"VERIFIED"`, `"OFFICIAL STATEMENT"` (alias `"OFFICIAL"`), `"ALLEGED"`, `"UNVERIFIED"`, `"DISPUTED"`, `"UNKNOWN"`.
- **Animation:** Muncul cepat disertai border warna & gaya solid/dashed/dotted sesuai status.

### `SourceCard`
- **Purpose:** Kartu sumber referensi bergaya arsip (klasik).
- **Props & Defaults:** `sourceId?`, `title`, `publisher` (wajib), `publicationDate?`, `sourceType = "ARCHIVE"` (`"COURT" | "OFFICIAL" | "MEDIA" | "ARCHIVE" | "WITNESS"`), `url?`, `verificationStatus = "VERIFIED"`, `notes?`, `style?`.

### `SourceCitation` *(Baru — Phase 3 & Phase 5)*
- **Purpose:** Kartu sitasi formal penuh dengan `sourceId`, tanggal publikasi wajib, URL opsional, tipe sumber, kutipan singkat, dan badge integritas bukti.
- **Props & Defaults:** `sourceId`, `title`, `publisher`, `publicationDate` (wajib), `sourceType = "ARCHIVE"`, `url?`, `verificationStatus = "UNVERIFIED"`, `excerpt?`, `variant = "investigative"`, `motionIntensity = "editorial"`, `showIntegrityHint = false`, `style?`.

### `FactCheckCard` *(Baru — Phase 3)*
- **Purpose:** Membandingkan pernyataan/klaim (`claim`) melawan temuan arsip (`finding`) dengan badge status yang jujur.
- **Props & Defaults:** `claim`, `finding` (wajib), `verificationStatus = "DISPUTED"`, `sourceId?`, `sourceTitle?`, `variant = "investigative"`, `motionIntensity = "editorial"`, `style?`.

### `NewspaperClipping`
- **Purpose:** Simulasi kliping koran antik dengan header koran, headline, foto monokrom opsional, dan kolom artikel.
- **Props & Defaults:** `newspaperName = "THE DAILY CHRONICLE"`, `issueDate = "VOL. XLII · ARCHIVE EDITION"`, `headline`, `excerpt` (wajib), `subheadline?`, `image?`, `columns = 2`, `monochrome = true`, `agedPaperColor = "#DDD3C0"`, `tornEdges = true`, `rotation = -1.2`, `width = 880`, `style?`.

### `DocumentReveal`
- **Purpose:** Halaman memo / dokumen rahasia dengan efek unfold/slide, penyensoran kata otomatis (`redactedPhrases`), catatan pinggir, dan `CaseStamp`.
- **Props & Defaults:** `docNumber = "DOC-71-0449"`, `agency = "SPECIAL INVESTIGATION UNIT"`, `subject`, `body` (wajib), `redactedPhrases = []`, `annotations = []`, `stamp = "CONFIDENTIAL"`, `mode = "slide"` (`"slide" | "unfold"`), `width = 880`, `style?`.

### `HandwrittenNote` *(Baru — Phase 3)*
- **Purpose:** Catatan kertas bergaris bergaya tulis tangan/catatan lapangan dengan stabilo sorot.
- **Props & Defaults:** `note` (wajib), `author = "ANONYMOUS NOTEBOOK"`, `date?`, `highlightLine?`, `verificationStatus?`, `rotation = -1.5`, `style?`.

### `TelegramMessage` *(Baru — Phase 3)*
- **Purpose:** Pesan kawat telegraf arsip dengan kode stasiun dan badge prioritas.
- **Props & Defaults:** `sender`, `recipient`, `timestamp`, `message` (wajib), `stationCode = "WIRE-DESK // ARCHIVE"`, `priority = "URGENT"` (`"ROUTINE" | "URGENT" | "FLASH"`), `style?`.

### `PoliceReport` *(Baru — Phase 3)*
- **Purpose:** Formulir laporan insiden terstruktur berisi nomor laporan, instansi, petugas pencatat, ringkasan, poin temuan, dan status verifikasi.
- **Props & Defaults:** `reportNumber`, `date`, `incidentSummary` (wajib), `department = "INVESTIGATIVE RECORDS DIVISION"`, `officer = "DUTY OFFICER // ARCHIVE LOG"`, `findings = []`, `classification?`, `verificationStatus = "OFFICIAL STATEMENT"`, `style?`.

### `DocumentComparison` *(Baru — Phase 3)*
- **Purpose:** Membandingkan dua versi dokumen (mis. laporan awal vs laporan revisi) lengkap dengan sorotan baris yang berubah (`changed: true`) dan badge status masing-masing.
- **Props & Defaults:** `leftDoc`, `rightDoc` (wajib: `{ versionLabel, docCode?, verificationStatus?, lines: { text, changed? }[] }`), `accentColor = bloodRed`, `style?`.

### `WitnessStatement` *(Baru — Phase 3)*
- **Purpose:** Kartu keterangan saksi berisi label saksi, tanggal pencatatan, nomor sumber opsional, kutipan kesaksian, dan `VerificationBadge`.
- **Props & Defaults:** `witnessLabel`, `statement`, `dateRecorded` (wajib), `role = "WITNESS // DEPOSITION"`, `sourceId?`, `verificationStatus = "ALLEGED"`, `accentColor = bloodRed`, `style?`.

### `EvidenceZoom` *(Baru — Phase 3)*
- **Purpose:** Efek lup pembesaran forensik terarah (`focalPoint`) dengan pilihan lensa lingkaran atau persegi dan callout detail.
- **Props & Defaults:** `calloutLabel` (wajib), `src?`, `calloutDetail?`, `focalPoint = { xPercent: 52, yPercent: 48 }`, `zoomFrom = 1.0`, `zoomTo = 2.15`, `lensShape = "circle"`, `height = 460`, `accentColor = bloodRed`, `motionIntensity = "editorial"`, `style?`.

### `InvestigationBoard` & `EvidenceCard` & `EvidenceMarker`
- **`InvestigationBoard`:** Papan gabus/gelap berukuran fleksibel dengan pin kartu & animasi penarikan benang merah antar ID bukti. Defaults: `connections = []`, `width = 960`, `height = 1280`, `boardColor = "#15171B"`, `stringColor = bloodRed`, `staggerFrames = 10`, `connectionStartFrame = 18`.
- **`EvidenceCard`:** Kartu Polaroid atau dokumen dengan pin atas opsional. Defaults: `evidenceNumber = "EVIDENCE 001"`, `variant = "polaroid"`, `rotation = -2`, `showPin = true`, `width = 520`, `imageHeight = 300`.
- **`EvidenceMarker`:** Marker bernomor + lingkaran sorot + label di koordinat persen (`xPercent = 50`, `yPercent = 50`, `circleRadius = 38`).

### `CaseStamp`, `CaseTimeline`, `SuspectDossier`, `RedactedLine`
- **`CaseStamp`:** Stempel benturan realistis. Defaults: `text = "UNSOLVED"`, `color = bloodRed`, `rotation = -12`, `opacity = 0.88`, `textured = true`, `animated = true`, `delayFrames = 6`, `fontSize = 54`.
- **`CaseTimeline`:** Daftar peristiwa kronologis vertikal/horizontal dengan sorot milestone. Defaults: `orientation = "vertical"`, `staggerFrames = 14`, `width = 880`.
- **`SuspectDossier`:** Kartu profil subjek/tersangka berisi kode dossier, status, foto opsional, dan daftar atribut. Defaults: `dossierCode = "SUBJ-01"`, `status = "UNIDENTIFIED"`, `attributes = []`.
- **`RedactedLine`:** Animasi bar hitam penyensoran (`"redact"`) atau pengungkapan (`"declassify"`). Defaults: `mode = "redact"`, `startFrame = 12`, `durationFrames = 20`, `fontSize = 24`.

---

## 4. Geographic & Data

### `MapRoute` & `RouteAnimation` & `LocationMarker`
- **`MapRoute`:** Kanvas peta bergaris koordinat dengan banyak waypoint, ikon kendaraan/pesawat/jalan kaki bergerak, serta animasi lintasan. Defaults: `mode = "flight"`, `routeColor = bloodRed`, `mapTitle = "SECTOR MAP // ARCHIVE ROUTE"`, `width = 900`, `height = 960`, `cameraMove = true`.
- **`RouteAnimation`:** Layer jalur SVG bertahap antar titik. Defaults: `mode = "flight"`, `strokeWidth = 3.5`, `startFrame = 8`, `durationFrames = 64`, `showMovingIcon = true`.
- **`LocationMarker`:** Pin crosshair + koordinat lintang/bujur berdenyut. Defaults: `showCrosshair = true`, `pulse = true`, `delayFrames = 0`, `align = "left"`.

### `MapZoomTransition` *(Baru — Phase 3)*
- **Purpose:** Transisi zoom kamera ke titik sektor geografis di atas peta arsip (`mapSrc`) atau grid koordinat fallback.
- **Props & Defaults:** `targetLabel` (wajib), `mapSrc?`, `coordinates?`, `focalPoint = { xPercent: 52, yPercent: 48 }`, `fromZoom = 1.0`, `toZoom = 1.85`, `width = 896`, `height = 560`, `accentColor = bloodRed`, `motionIntensity = "editorial"`, `style?`.

### `SatelliteMap` *(Baru — Phase 3)*
- **Purpose:** Bingkai pengintaian satelit berlabel skala dengan daftar pin (`pins`) yang ditempatkan deterministik.
- **Props & Defaults:** `mapSrc?`, `sectorTitle = "SATELLITE RECON // SECTOR PLATE"`, `scaleLabel = "SCALE // AS SUPPLIED"`, `coordinates?`, `pins = []`, `width = 896`, `height = 560`, `accentColor = bloodRed`, `style?`.

### `CoordinateOverlay` *(Baru — Phase 3)*
- **Purpose:** HUD telemetri lintang, bujur, elevasi, dan arah kompas (*bearing*).
- **Props & Defaults:** `lat`, `lng` (wajib), `sectorLabel = "GEO TELEMETRY"`, `elevationMeters?`, `bearingDeg?`, `position = "inline"`, `accentColor = archiveGold`, `style?`.

### `LocationComparison` *(Baru — Phase 3)*
- **Purpose:** Membandingkan dua lokasi kasus berdampingan lengkap dengan tanggal & koordinat masing-masing.
- **Props & Defaults:** `left`, `right` (wajib: `{ title, subtitle?, dateLabel?, coordinatesLabel?, notes? }`), `relationLabel = "LOCATION COMPARISON"`, `accentColor = bloodRed`, `style?`.

### `DataChart` *(Baru — Phase 3)*
- **Purpose:** Visualisasi data terukur (`bar`, `line`, atau `timeline`) lengkap dengan unit dan kutipan sumber.
- **Props & Defaults:** `title`, `data` (wajib: `{ label, value, highlight? }[]`), `type = "bar"`, `unit = ""`, `sourceCitation?`, `accentColor = bloodRed`, `height = 240`, `style?`.
- **Limitations:** Nilai `value` harus non-negatif untuk tipe `bar`.

### `DistanceMeasurement` *(Baru — Phase 3)*
- **Purpose:** Garis ukur jarak antara dua titik lokasi (`fromLabel` → `toLabel`) dengan jarak terukur resmi.
- **Props & Defaults:** `fromLabel`, `toLabel`, `distanceLabel` (wajib), `note?`, `accentColor = bloodRed`, `style?`.

### `FactCounter`
- **Purpose:** Kartu metrik tunggal besar disertai konteks dan kutipan sumber.
- **Props & Defaults:** `value`, `label`, `description` (wajib), `from = 0`, `decimals = 0`, `prefix = ""`, `suffix = ""`, `source?`, `accentColor = bloodRed`, `width = 860`, `style?`.

---

## 5. Effects & Transitions

### `KenBurns`, `PhotoParallax`, `VHSGlitch`, `CameraOverlay`, `FilmBurn`, `AudioWaveform`, `AudioTranscript`
- **`KenBurns`:** Pembungkus transform zoom & pan halus (`mode = "zoomIn" | "zoomOut" | "panLeft" | "panRight"`, `zoomFrom = 1`, `zoomTo = 1.14`, `panDistance = 36`).
- **`PhotoParallax`:** Efek kedalaman berlapis 2.5D dengan fallback bila `backgroundSrc` kosong (`depth = 1.2`, `height = 460`).
- **`VHSGlitch`:** Gangguan scanline + RGB split deterministik saat adegan rekaman lama (`intensity = 0.55`, `seed = 17`, `scanlineOpacity = 0.22`).
- **`CameraOverlay`:** Viewfinder kamera arsip + REC indicator (`cameraId = "CAM-01 // ARCHIVE UNIT"`, `showRec = true`, `showTimestamp = true`).
- **`FilmBurn`:** Sapuan bakar film organik untuk transisi (`direction = "right"`, `intensity = 0.85`).
- **`AudioWaveform`:** Visualisasi bar audio intersep bertenaga deterministik (`barCount = 36`, `height = 110`).
- **`AudioTranscript`** *(Baru — Phase 3)*: Daftar baris transkrip rekaman bertimestamp (`sourceCode`, `speaker`, `timecode`, `text`, `redacted?`) dengan sorotan baris aktif otomatis berdasarkan `framesPerLine = 45`.

### Transisi (`ChapterTransition`, `FadeToBlack`, `PaperCutTransition`, `VerticalWipe`)
- **`ChapterTransition`** *(Baru — Phase 3)*: Pembuka bab full-screen dengan nomor bab, garis editorial, judul, dan varian preset (`variant = "investigative"`, `motionIntensity = "editorial"`).
- **`FadeToBlack`:** Gelap-terang-gelap halus (`fadeInFrames = 12`, `fadeOutFrames = 18`).
- **`PaperCutTransition`:** Sobekan kertas melintas layar (`paperColor = archivePaper`).
- **`VerticalWipe`:** Sapuan vertikal tajam dengan garis aksen (`direction = "up"`).

---

## 6. Branding

- **`BrandIdent`** *(Baru — Phase 3)*: Badge identitas/stinger logo `ARKANAYA` + tagline (`variant = "cinematic"`, `compact = false`).
- **`BrandOpening`**: Layar pembuka merek penuh dengan tipografi besar & opsi tekstur film.
- **`CaseOpening`**: Layar awal berkas kasus yang menghormati `getSafeMargins(width, height)` baik untuk `9:16` maupun `16:9`.
- **`EpisodeNumber`** *(Baru — Phase 3)*: Label nomor episode terstruktur (`episodeNumber`, `caseCode?`, `season?`, `variant = "investigative"`).
- **`SeriesLabel`** *(Baru — Phase 3)*: Label seri & kategori (`seriesTitle = "ARKANAYA ARCHIVES"`, `category = "UNSOLVED FILES"`, `partLabel?`, `variant = "archive"`).
- **`ChapterProgress`**: Indikator progress bab aktif di atas layar (`currentChapter`, `totalChapters`, `label?`).
- **`ConclusionCard`** *(Baru — Phase 3)*: Kartu kesimpulan akhir episode berisi ringkasan temuan, daftar pertanyaan terbuka (`openQuestions`), status kasus, serta `VerificationBadge`.
- **`CaseEnding`**: Penutup episode dengan pernyataan inti + merek + `FadeToBlack` dan margin responsif `9:16`/`16:9`.
- **`SocialEndScreen`** *(Baru — Phase 3)*: End-screen penutup media sosial dengan pertanyaan penutup interaktif, teaser episode berikutnya, dan handle kanal (`@ARKANAYA.ARCHIVE`).
- **`Watermark`**: Watermark sudut kecil non-intrusif (`position = "top-right"`, `opacity = 0.52`).

---

## 7. Audio Layer

Semua komponen audio hanya merender `<Audio>` Remotion saat `src` bernilai valid dan membungkusnya melalui `resolveMediaSrc(src)`:
- **`VoiceOverTrack`:** Trek vokal narator (`volume = 1`, `fadeInFrames = 6`, `fadeOutFrames = 8`).
- **`BackgroundMusicTrack`:** Musik latar otomatis merunduk (*auto-ducking*) di `duckRanges` (`volume = 0.28`, `duckedVolume = 0.11`).
- **`AmbientSoundTrack`:** Suasana latar berulang (`volume = 0.16`, `loop = true`).
- **`AudioDuck` & `AudioFade`:** Utilitas volume envelope deterministik (`computeDuckEnvelope`, `computeFadeEnvelope`).
- **`SoundEffect`:** Pemicu SFX berbasis kategori `SoundEffectCategory` pada `startFrame`.

---

## 8. Shared Internal Primitives (`src/components/shared/`)

- **`GrainSurface`:** Tekstur noise SVG ber-`useId()` agar aman dirender berlapis tanpa tabrakan DOM ID.
- **`MediaFallbackPlate`:** Plat arsip pengganti deterministik ketika media visual `src` belum disediakan.
