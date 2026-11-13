import { Html5Audio, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { computeFadeEnvelope } from "./AudioFade";

export type DuckRange = {
  startFrame: number;
  endFrame: number;
};

export const computeDuckEnvelope = ({
  frame,
  duckRanges = [],
  baseVolume = 0.3,
  duckedVolume = 0.1,
  rampFrames = 10,
}: {
  frame: number;
  duckRanges?: readonly DuckRange[];
  baseVolume?: number;
  duckedVolume?: number;
  rampFrames?: number;
}): number => {
  if (duckRanges.length === 0) return baseVolume;

  let minMultiplier = 1;
  const targetRatio = baseVolume > 0 ? duckedVolume / baseVolume : 0;

  for (const range of duckRanges) {
    if (frame >= range.startFrame - rampFrames && frame <= range.endFrame + rampFrames) {
      const m = interpolate(
        frame,
        [
          range.startFrame - rampFrames,
          range.startFrame,
          range.endFrame,
          range.endFrame + rampFrames,
        ],
        [1, targetRatio, targetRatio, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      );
      minMultiplier = Math.min(minMultiplier, m);
    }
  }

  return Math.max(0, Math.min(1, baseVolume * minMultiplier));
};

export type AudioDuckProps = {
  src?: string;
  startFrame?: number;
  duration?: number;
  baseVolume?: number;
  duckedVolume?: number;
  duckRanges?: readonly DuckRange[];
  rampFrames?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  playbackRate?: number;
  trimBefore?: number;
  loop?: boolean;
};

export const AudioDuck = ({
  src,
  startFrame = 0,
  duration,
  baseVolume = 0.3,
  duckedVolume = 0.1,
  duckRanges = [],
  rampFrames = 10,
  fadeInFrames = 18,
  fadeOutFrames = 24,
  playbackRate = 1,
  trimBefore = 0,
  loop = true,
}: AudioDuckProps) => {
  const { durationInFrames } = useVideoConfig();
  const effectiveDuration = duration ?? Math.max(1, durationInFrames - startFrame);

  if (!src) return null;

  return (
    <Sequence from={startFrame} durationInFrames={effectiveDuration}>
      <AudioDuckInner
        src={src}
        duration={effectiveDuration}
        baseVolume={baseVolume}
        duckedVolume={duckedVolume}
        duckRanges={duckRanges}
        rampFrames={rampFrames}
        fadeInFrames={fadeInFrames}
        fadeOutFrames={fadeOutFrames}
        playbackRate={playbackRate}
        trimBefore={trimBefore}
        loop={loop}
      />
    </Sequence>
  );
};

const AudioDuckInner = ({
  src,
  duration,
  baseVolume,
  duckedVolume,
  duckRanges,
  rampFrames,
  fadeInFrames,
  fadeOutFrames,
  playbackRate,
  trimBefore,
  loop,
}: {
  src: string;
  duration: number;
  baseVolume: number;
  duckedVolume: number;
  duckRanges: readonly DuckRange[];
  rampFrames: number;
  fadeInFrames: number;
  fadeOutFrames: number;
  playbackRate: number;
  trimBefore: number;
  loop: boolean;
}) => {
  const frame = useCurrentFrame();
  const ducked = computeDuckEnvelope({
    frame,
    duckRanges,
    baseVolume,
    duckedVolume,
    rampFrames,
  });
  const finalVol = computeFadeEnvelope({
    frame,
    durationInFrames: duration,
    fadeInFrames,
    fadeOutFrames,
    baseVolume: ducked,
  });

  return (
    <Html5Audio
      src={src}
      volume={finalVol}
      playbackRate={playbackRate}
      trimBefore={trimBefore > 0 ? trimBefore : undefined}
      loop={loop}
    />
  );
};
