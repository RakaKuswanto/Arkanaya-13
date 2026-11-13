import { AudioDuck, type DuckRange } from "./AudioDuck";
import { AudioFade } from "./AudioFade";

export type AmbientSoundTrackProps = {
  src?: string;
  startFrame?: number;
  duration?: number;
  volume?: number;
  duckedVolume?: number;
  duckRanges?: readonly DuckRange[];
  rampFrames?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  loop?: boolean;
};

export const AmbientSoundTrack = ({
  src,
  startFrame = 0,
  duration,
  volume = 0.16,
  duckedVolume = 0.095,
  duckRanges = [],
  rampFrames = 14,
  fadeInFrames = 20,
  fadeOutFrames = 24,
  loop = true,
}: AmbientSoundTrackProps) => {
  if (duckRanges.length > 0) {
    return (
      <AudioDuck
        src={src}
        startFrame={startFrame}
        duration={duration}
        baseVolume={volume}
        duckedVolume={duckedVolume}
        duckRanges={duckRanges}
        rampFrames={rampFrames}
        fadeInFrames={fadeInFrames}
        fadeOutFrames={fadeOutFrames}
        loop={loop}
      />
    );
  }

  return (
    <AudioFade
      src={src}
      startFrame={startFrame}
      duration={duration}
      volume={volume}
      fadeInFrames={fadeInFrames}
      fadeOutFrames={fadeOutFrames}
      loop={loop}
    />
  );
};
