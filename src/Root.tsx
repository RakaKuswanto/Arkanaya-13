import { Composition, Folder } from "remotion";
import {
  COMPONENT_SHOWCASE_DURATION,
  ComponentShowcase,
  SECTION_PREVIEW_DURATION,
} from "./ComponentShowcase";
import { DocumentaryEpisode } from "./DocumentaryEpisode";
import {
  SFX_SHOWCASE_DURATION,
  SfxShowcase,
} from "./SfxShowcase";
import { EPISODES } from "./episodes";
import { calculateEpisodeDuration } from "./schema/episode";
import { ARKANAYA_BRAND } from "./theme/tokens";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Episodes">
        {EPISODES.map((episode) => (
          <Composition
            key={episode.id}
            id={episode.id}
            component={DocumentaryEpisode}
            width={ARKANAYA_BRAND.width}
            height={ARKANAYA_BRAND.height}
            fps={episode.fps}
            durationInFrames={calculateEpisodeDuration(episode)}
            defaultProps={{
              episode,
              showWatermark: true,
              showFilmGrain: true,
            }}
            calculateMetadata={({ props }) => ({
              durationInFrames: calculateEpisodeDuration(props.episode),
              fps: props.episode.fps,
            })}
          />
        ))}
      </Folder>

      <Folder name="Library">
        <Composition
          id="arkanaya-showcase"
          component={ComponentShowcase}
          width={ARKANAYA_BRAND.width}
          height={ARKANAYA_BRAND.height}
          fps={ARKANAYA_BRAND.fps}
          durationInFrames={COMPONENT_SHOWCASE_DURATION}
          defaultProps={{
            showWatermark: true,
            showFilmGrain: true,
            caseNumber: "FICTIONAL-QA-01",
            section: "all",
          }}
        />
        <Composition
          id="arkanaya-showcase-16x9"
          component={ComponentShowcase}
          width={ARKANAYA_BRAND.landscapeWidth}
          height={ARKANAYA_BRAND.landscapeHeight}
          fps={ARKANAYA_BRAND.fps}
          durationInFrames={COMPONENT_SHOWCASE_DURATION}
          defaultProps={{
            showWatermark: true,
            showFilmGrain: true,
            caseNumber: "FICTIONAL-QA-16X9",
            section: "all",
          }}
        />
        <Composition
          id="arkanaya-16x9-preview"
          component={DocumentaryEpisode}
          width={ARKANAYA_BRAND.landscapeWidth}
          height={ARKANAYA_BRAND.landscapeHeight}
          fps={EPISODES[0].fps}
          durationInFrames={calculateEpisodeDuration(EPISODES[0])}
          defaultProps={{
            episode: EPISODES[0],
            showWatermark: true,
            showFilmGrain: true,
          }}
        />
        <Composition
          id="arkanaya-sfx-showcase"
          component={SfxShowcase}
          width={ARKANAYA_BRAND.width}
          height={ARKANAYA_BRAND.height}
          fps={ARKANAYA_BRAND.fps}
          durationInFrames={SFX_SHOWCASE_DURATION}
          defaultProps={{
            showWatermark: true,
            showFilmGrain: true,
          }}
        />
        <Composition
          id="arkanaya-sfx-showcase-16x9"
          component={SfxShowcase}
          width={ARKANAYA_BRAND.landscapeWidth}
          height={ARKANAYA_BRAND.landscapeHeight}
          fps={ARKANAYA_BRAND.fps}
          durationInFrames={SFX_SHOWCASE_DURATION}
          defaultProps={{
            showWatermark: true,
            showFilmGrain: true,
          }}
        />
      </Folder>

      <Folder name="Library-QA">
        <Composition
          id="qa-editorial-integrity"
          component={ComponentShowcase}
          width={ARKANAYA_BRAND.width}
          height={ARKANAYA_BRAND.height}
          fps={ARKANAYA_BRAND.fps}
          durationInFrames={SECTION_PREVIEW_DURATION}
          defaultProps={{ section: "editorial", caseNumber: "FICTIONAL-ED-01" }}
        />
        <Composition
          id="qa-geographic-data"
          component={ComponentShowcase}
          width={ARKANAYA_BRAND.width}
          height={ARKANAYA_BRAND.height}
          fps={ARKANAYA_BRAND.fps}
          durationInFrames={SECTION_PREVIEW_DURATION}
          defaultProps={{ section: "geographic", caseNumber: "FICTIONAL-GEO-01" }}
        />
        <Composition
          id="qa-archival-forensics"
          component={ComponentShowcase}
          width={ARKANAYA_BRAND.width}
          height={ARKANAYA_BRAND.height}
          fps={ARKANAYA_BRAND.fps}
          durationInFrames={SECTION_PREVIEW_DURATION}
          defaultProps={{ section: "archival", caseNumber: "FICTIONAL-ARC-01" }}
        />
        <Composition
          id="qa-branding-status"
          component={ComponentShowcase}
          width={ARKANAYA_BRAND.width}
          height={ARKANAYA_BRAND.height}
          fps={ARKANAYA_BRAND.fps}
          durationInFrames={SECTION_PREVIEW_DURATION}
          defaultProps={{ section: "branding", caseNumber: "FICTIONAL-BRD-01" }}
        />
        <Composition
          id="qa-visual-presets"
          component={ComponentShowcase}
          width={ARKANAYA_BRAND.landscapeWidth}
          height={ARKANAYA_BRAND.landscapeHeight}
          fps={ARKANAYA_BRAND.fps}
          durationInFrames={SECTION_PREVIEW_DURATION}
          defaultProps={{ section: "presets", caseNumber: "FICTIONAL-PRE-01" }}
        />
      </Folder>
    </>
  );
};
