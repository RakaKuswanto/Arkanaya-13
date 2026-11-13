import { Html5Audio, Sequence, useCurrentFrame } from "remotion";
import { computeSfxCombinedEnvelope } from "../../audio/mixing";
import { resolveSfxEvent, type ResolvedSfxEvent } from "../../audio/timeline";
import type {
  SfxDomainCategory,
  SfxTimelineEvent,
  SoundEffectCategory,
} from "../../audio/types";
import { resolveMediaSrc } from "../../utils/assets";
import type { DuckRange } from "./AudioDuck";

export type { SoundEffectCategory };

export type SoundEffectProps = {
  /** Declarative timeline event (takes precedence over loose props when supplied). */
  event?: SfxTimelineEvent | ResolvedSfxEvent;
  /** Registry ID referencing SFX_ASSET_REGISTRY. */
  assetId?: string;
  /** Legacy or domain SFX category (optional when assetId or event is supplied). */
  category?: SoundEffectCategory | SfxDomainCategory;
  /** Direct file path or staticFile-resolved URI. */
  src?: string;
  startFrame?: number;
  endFrame?: number;
  duration?: number;
  trimBefore?: number;
  volume?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  playbackRate?: number;
  stereoPan?: number;
  duckVoiceOver?: boolean;
  voDuckRanges?: readonly DuckRange[];
  polyphonyScale?: number;
  enabled?: boolean;
};

export const SoundEffect = ({
  event,
  assetId,
  category,
  src,
  startFrame = 0,
  endFrame,
  duration,
  trimBefore = 0,
  volume,
  fadeInFrames = 2,
  fadeOutFrames = 6,
  playbackRate = 1,
  stereoPan,
  duckVoiceOver = false,
  voDuckRanges = [],
  polyphonyScale = 1,
  enabled = true,
}: SoundEffectProps) => {
  const baseEvent: SfxTimelineEvent = event ?? {
    id: assetId ?? category ?? "inline-sfx",
    assetId,
    category,
    src,
    startFrame,
    endFrame,
    duration,
    trimBefore,
    volume,
    fadeInFrames,
    fadeOutFrames,
    playbackRate,
    stereoPan,
    duckVoiceOver,
    enabled,
  };

  if (enabled === false || baseEvent.enabled === false) {
    return null;
  }

  const resolved = resolveSfxEvent(baseEvent);
  const mediaSrc = resolveMediaSrc(resolved.resolvedSrc);
  if (!mediaSrc || resolved.resolvedDurationFrames <= 0) {
    return null;
  }

  return (
    <Sequence
      name={`SFX: ${resolved.assetId ?? resolved.category ?? resolved.id}`}
      from={resolved.resolvedStartFrame}
      durationInFrames={resolved.resolvedDurationFrames}
    >
      <SoundEffectInner
        src={mediaSrc}
        compositionStartFrame={resolved.resolvedStartFrame}
        durationInFrames={resolved.resolvedDurationFrames}
        volume={resolved.resolvedVolume}
        fadeInFrames={resolved.resolvedFadeInFrames}
        fadeOutFrames={resolved.resolvedFadeOutFrames}
        playbackRate={resolved.resolvedPlaybackRate}
        trimBefore={resolved.resolvedTrimBefore}
        duckVoiceOver={Boolean(resolved.duckVoiceOver)}
        voDuckRanges={voDuckRanges}
        polyphonyScale={polyphonyScale}
      />
    </Sequence>
  );
};

const SoundEffectInner = ({
  src,
  compositionStartFrame,
  durationInFrames,
  volume,
  fadeInFrames,
  fadeOutFrames,
  playbackRate,
  trimBefore,
  duckVoiceOver,
  voDuckRanges,
  polyphonyScale,
}: {
  src: string;
  compositionStartFrame: number;
  durationInFrames: number;
  volume: number;
  fadeInFrames: number;
  fadeOutFrames: number;
  playbackRate: number;
  trimBefore: number;
  duckVoiceOver: boolean;
  voDuckRanges: readonly DuckRange[];
  polyphonyScale: number;
}) => {
  const localFrame = useCurrentFrame();
  const compositionFrame = compositionStartFrame + localFrame;

  const finalVolume = computeSfxCombinedEnvelope({
    localFrame,
    compositionFrame,
    durationInFrames,
    baseVolume: volume,
    fadeInFrames,
    fadeOutFrames,
    duckVoiceOver,
    voDuckRanges,
    polyphonyScale,
  });

  return (
    <Html5Audio
      src={src}
      volume={finalVolume}
      playbackRate={playbackRate}
      trimBefore={trimBefore > 0 ? trimBefore : undefined}
      loop={false}
    />
  );
};
