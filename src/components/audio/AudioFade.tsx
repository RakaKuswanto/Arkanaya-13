import { Html5Audio, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const computeFadeEnvelope = ({
  frame,
  durationInFrames,
  fadeInFrames = 12,
  fadeOutFrames = 18,
  baseVolume = 1,
}: {
  frame: number;
  durationInFrames: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  baseVolume?: number;
}): number => {
  const inMult =
    fadeInFrames > 0
      ? interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const outStart = Math.max(fadeInFrames, durationInFrames - fadeOutFrames);
  const outMult =
    fadeOutFrames > 0
      ? interpolate(
          frame,
          [outStart, Math.max(outStart + 1, durationInFrames - 1)],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 1;

  return Math.max(0, Math.min(1, baseVolume * inMult * outMult));
};

export type AudioFadeProps = {
  src?: string;
  startFrame?: number;
  duration?: number;
  volume?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  playbackRate?: number;
  trimBefore?: number;
  loop?: boolean;
};

export const AudioFade = ({
  src,
  startFrame = 0,
  duration,
  volume = 1,
  fadeInFrames = 12,
  fadeOutFrames = 18,
  playbackRate = 1,
  trimBefore = 0,
  loop = false,
}: AudioFadeProps) => {
  const { durationInFrames } = useVideoConfig();
  const effectiveDuration = duration ?? Math.max(1, durationInFrames - startFrame);

  if (!src) return null;

  return (
    <Sequence from={startFrame} durationInFrames={effectiveDuration}>
      <AudioFadeInner
        src={src}
        duration={effectiveDuration}
        volume={volume}
        fadeInFrames={fadeInFrames}
        fadeOutFrames={fadeOutFrames}
        playbackRate={playbackRate}
        trimBefore={trimBefore}
        loop={loop}
      />
    </Sequence>
  );
};

const AudioFadeInner = ({
  src,
  duration,
  volume,
  fadeInFrames,
  fadeOutFrames,
  playbackRate,
  trimBefore,
  loop,
}: {
  src: string;
  duration: number;
  volume: number;
  fadeInFrames: number;
  fadeOutFrames: number;
  playbackRate: number;
  trimBefore: number;
  loop: boolean;
}) => {
  const frame = useCurrentFrame();
  const vol = computeFadeEnvelope({
    frame,
    durationInFrames: duration,
    fadeInFrames,
    fadeOutFrames,
    baseVolume: volume,
  });

  return (
    <Html5Audio
      src={src}
      volume={vol}
      playbackRate={playbackRate}
      trimBefore={trimBefore > 0 ? trimBefore : undefined}
      loop={loop}
    />
  );
};
