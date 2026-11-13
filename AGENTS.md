# AGENTS.md — ARKANAYA 13

Workspace rules for all AI coding agents, researchers, and writers working inside `ARKANAYA 13`.

## Mandatory Reading Order (Before Any Work)
1. Read `EDITORIAL_BIBLE.md` (highest editorial & accuracy authority).
2. Read `AI_PRODUCTION_RULES.md` (research, asset, visual, and reporting rules).
3. Read `prompts/MASTER_EPISODE_PRODUCTION_PROMPT.md` when producing end-to-end episode research, VO script, storyboard, and Remotion implementation deliverables.
4. Read `README.md` and `docs/COMPONENTS.md` (project structure, scene schema, v2 component props, and CLI workflow).

## Production & Technical Guardrails
- **Brand**: `ARKANAYA` / `ARKANAYA 13` (`1080 × 1920`, `9:16`, `30 fps`, with responsive `16:9` support via `getSafeMargins(width, height)`). Never alter `src/theme/tokens.ts`, `src/theme/typography.ts`, or global motion presets for a single episode without explicit approval.
- **Reuse First**: Use `src/DocumentaryEpisode.tsx`, `src/schema/episode.ts` (`EpisodeSchema`, `sec()`), `src/presets/visualPresets.ts`, and existing components under `src/components/` (see `docs/COMPONENTS.md`). Do not duplicate components.
- **Data Integrity**: Distinguish `VERIFIED`, `OFFICIAL STATEMENT`, `ALLEGED`, `DISPUTED`, `UNVERIFIED`, and `UNKNOWN` (`src/theme/dataIntegrity.ts`, `<VerificationBadge />`). Never style disputed/alleged claims as verified.
- **Deterministic Only**: All Remotion animations must be frame-based (`useCurrentFrame()`). Never use `Math.random()`.
- **Assets**: Place local media/audio inside `public/media/` and `public/audio/` and reference them with relative paths (e.g. `"media/ep02/photo.jpg"`, `"audio/voiceover/ep02.mp3"`) so `resolveMediaSrc()` resolves them via `staticFile()`. Never use unlicensed assets.
- **New Episodes**: Scaffold with `npm run new-episode -- <slug> "TITLE"`, register in `src/episodes/index.ts`, and verify with `npm run check` (`tsc --noEmit && eslint src`).
- **Governance**: Record approved system/standard changes in `changelog/CHANGELOG.md`. Always include the 6-item report format from `AI_PRODUCTION_RULES.md`.
