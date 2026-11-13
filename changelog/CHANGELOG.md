# Changelog — ARKANAYA 13

Semua perubahan signifikan pada sistem produksi, komponen Remotion, dan standar editorial **ARKANAYA 13** dicatat di sini.

## [2.2.0] - 2026-11-13
### Added
- Upgrade arsitektur SFX & Audio Mixing terpusat di `src/audio/` (`types.ts`, `registry.ts`, `mixing.ts`, `timeline.ts`, `presets.ts`, `validation.ts`, `index.ts`).
- 6 aset SFX baru tergenerasi lokal (`radio-static.mp3`, `film-projector.mp3`, `digital-glitch.mp3`, `subtle-transition.mp3`, `tension-pulse.mp3`, `wind-ambience.mp3`) melengkapi total **14 aset riil** pada `SFX_ASSET_REGISTRY` across seluruh **8 kategori** (`Archive`, `Investigation`, `Analog`, `Suspense`, `Transition`, `Environment`, `Technology`, `Atmosphere`).
- Komponen `SfxTimelinePlayer` dan peningkatan `SoundEffect`, `AudioFade`, `AudioDuck`, `AmbientSoundTrack`, dan `BackgroundMusicTrack` (berbasis `<Html5Audio>`, dukungan `assetId`, `event`, `trimBefore`, `playbackRate`, proteksi polyphony, dan anti-duplikasi trigger).
- 9 Sound Design Presets deterministik di `src/audio/presets.ts` serta dukungan `soundPreset`, `sfxTimeline`, dan `audioMix` di `src/schema/episode.ts` & `src/DocumentaryEpisode.tsx`.
- Komposisi showcase preview audio `arkanaya-sfx-showcase` (`9:16`) & `arkanaya-sfx-showcase-16x9` (`16:9`) di `src/SfxShowcase.tsx` & `src/Root.tsx`.
- Skrip validasi `scripts/validate-audio.mjs` (`npm run validate-audio`) dan dokumentasi lengkap `docs/SFX_SYSTEM.md`.

## [2.1.0] - 2026-11-13
### Added
- Episode 03 (`ep03-the-fall-of-nokia`, ~305 detik / 9.151 frame @ 30fps, 12 scene penuh) di `src/episodes/ep03-the-fall-of-nokia.ts` & didaftarkan pada `src/episodes/index.ts`, disinkronkan presisi dengan 12 rekaman VO `.m4a` (`public/audio/voiceover/ep03/`).
- Dokumentasi produksi lengkap di `episodes/003-the-fall-of-nokia/` (`README.md`, `transcript-vo.md`, `research.md`, `sources.md`, `storyboard.md`).
- Aset audio SFX & ambient bebas royalti yang di-generate lokal via FFmpeg: `ep03-gsm-chime.mp3` (ditempatkan tepat pada jeda `Intro.m4a` di frame `221`), `low-cinematic-impact.mp3`, `camera-shutter.mp3`, `paper-movement.mp3`, `stamp-impact.mp3`, `tape-rewind.mp3`, `typewriter.mp3`, dan `archive-hum.mp3`.
- Dukungan per-scene `voiceover`, `sfxList`, `sfx.duration`, auto-ducking multi-scene VO, `integrityStatus`, `speakerCredential`, `factCheck`, `citation`, `chartData`, dan `conclusionData` di `src/schema/episode.ts` dan `src/DocumentaryEpisode.tsx`.

## [2.0.0] - 2026-11-13
### Added
- Menambahkan workflow produksi lengkap di `prompts/MASTER_EPISODE_PRODUCTION_PROMPT.md` (Version 2.0, disinkronkan dengan library v2.0 & 6 status Data Integrity) serta menautkannya di `AGENTS.md` dan `docs/AI_PRODUCTION_GUIDE.md`.
- Shared design system v2 di `src/theme/tokens.ts` (`ARKANAYA_SPACING`, `ARKANAYA_BORDERS`, `ARKANAYA_SHADOWS`, `ARKANAYA_TEXTURES`, `ARKANAYA_FILM_GRAIN`, `ARKANAYA_DURATIONS`, `ARKANAYA_EASINGS`, `ARKANAYA_MOTION_INTENSITY`, `getSafeMargins`, `isLandscapeLayout`) dengan palet `#101114`, `#E8DFCF`, `#9E302D`, `#77746D`, `#343638` serta kompatibilitas mundur `ARSIP_*`.
- Sistem Data Integrity Fase 5 (`src/theme/dataIntegrity.ts` + `VerificationBadge`) untuk 6 status: `VERIFIED`, `ALLEGED`, `UNVERIFIED`, `DISPUTED`, `UNKNOWN`, `OFFICIAL STATEMENT`.
- Shared primitives di `src/components/shared/` (`GrainSurface`, `MediaFallbackPlate`) dan 25 komponen baru di kategori Editorial/Storytelling (`ChapterTransition`, `LowerThird`, `SourceCitation`, `FactCheckCard`, `NarrativePause`, `QuestionReveal`, `ConclusionCard`), Geographic/Data (`MapZoomTransition`, `SatelliteMap`, `CoordinateOverlay`, `LocationComparison`, `DataChart`, `DistanceMeasurement`), Archival/Investigation (`HandwrittenNote`, `TelegramMessage`, `PoliceReport`, `EvidenceZoom`, `PhotoAnnotation`, `DocumentComparison`, `AudioTranscript`, `WitnessStatement`), dan Branding (`BrandIdent`, `EpisodeNumber`, `SeriesLabel`, `SocialEndScreen`).
- Peningkatan `ComponentShowcase` (vertikal `9:16` + horizontal `16:9`, 8 visual presets, label prop, data contoh berlabel `FIKTIF`) serta 5 komposisi QA independen di folder `Library-QA` (`src/Root.tsx`).
- Dokumentasi lengkap 6 berkas di `docs/`: `COMPONENTS.md`, `DESIGN_SYSTEM.md`, `EPISODE_SCHEMA.md`, `ASSET_GUIDELINES.md`, `RENDERING_GUIDE.md`, `AI_PRODUCTION_GUIDE.md`.

### Fixed
- Menghapus zoom ganda `<KenBurns>` di atas `<ArchivePhoto>` dan memperbaiki `resolveMediaSrc(scene.background)` pada scene `incident` di `src/DocumentaryEpisode.tsx`.
- Mengganti ID SVG hardcode di `InvestigationBoard`, `MapRoute`, dan `GrainSurface` dengan `React.useId()`.
- Menambah dukungan tata letak responsif `16:9` via `getSafeMargins(width, height)` pada `CaseOpening`, `BrandOpening`, `CaseEnding`, dan `DocumentaryEpisode`.

## [1.4.0] - 2026-11-13
### Added
- 5 komponen reusable baru: `EvidenceMarker`, `SourceCard`, `PhotoParallax`, `DocumentaryLowerThird`, dan `ChapterProgress`.
- 8 visual presets di `src/presets/visualPresets.ts` (`VISUAL_PRESETS`: `archiveReveal`, `classifiedDossier`, `evidenceDiscovery`, `timelineInvestigation`, `mapJourney`, `archivalMemory`, `mysteryPause`, `cinematicClosing`) dan diekspor via `src/library.ts`.
- Komposisi sampel `16:9` (`1920×1080`) dengan ID `arkanaya-16x9-preview` di `src/Root.tsx`.
- Pembaruan `arkanaya-showcase` (`src/ComponentShowcase.tsx`, durasi `1770` frames) untuk menampilkan 5 komponen baru dan 8 `VISUAL_PRESETS`.

## [1.3.0] - 2026-11-13
### Added
- 4 variasi tipe scene baru di `EpisodeSceneSchema` & `DocumentaryEpisode`: `"statHero"`, `"transcript"`, `"theorySplit"`, dan `"chapterBreak"` untuk menjaga ritme visual episode tetap dinamis tanpa keluar dari karakter editorial **ARKANAYA 13**.

## [1.2.0] - 2026-11-13
### Added
- Dukungan `srtText` global di level `EpisodeSchema` & `DocumentaryEpisode` (cukup tempel 1 file `.srt` utuh tanpa perlu memotong per scene).
- Script CLI `npm run sync-srt -- <file.srt>` (`scripts/sync-srt.mjs`) untuk menghitung total durasi dan menampilkan timestamp setiap kalimat dari rekaman VO.

## [1.1.0] - 2026-11-13
### Added
- 6 motion presets deterministik baru di `src/motion/presets.ts`: `highlighterSweep`, `microfilmScroll`, `cameraRackFocus`, `redactWipe`, `pulseBeacon`, dan `handheldDrift`.
- 5 komponen dokumenter baru: `QuoteCallout`, `AudioWaveform`, `RedactedLine`, `SuspectDossier`, dan `SplitComparison`.
- 4 tipe scene baru di `EpisodeSceneSchema` & `DocumentaryEpisode`: `"quote"`, `"audioTape"`, `"dossier"`, dan `"comparison"`.
- Dokumentasi lengkap komponen & motion di `docs/COMPONENTS_AND_MOTION.md`.

## [1.0.0] - 2026-11-13
### Added
- Standalone Remotion production project di `ARKANAYA 13/` (`1080×1920`, `9:16`, `30 fps`).
- 7 kategori komponen reusable (`typography`, `archival`, `investigation`, `geographic`, `effects`, `transitions`, `branding`, `audio`).
- `EpisodeSchema`, `sec()`, dan `DocumentaryEpisode` dengan dukungan `srtText`, `galleryMode` (`photo`, `contactSheet`, `polaroidStack`), `resolveMediaSrc()`, serta smart audio ducking per scene bernarasi.
- Episode generator CLI (`npm run new-episode`), registry `src/episodes/index.ts`, dan `arkanaya-showcase`.
- `EDITORIAL_BIBLE.md` dan `AI_PRODUCTION_RULES.md` versi awal (`1.0.0`).
