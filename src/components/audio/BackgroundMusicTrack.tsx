import { AudioDuck, type DuckRange } from "./AudioDuck";

export type BackgroundMusicTrackProps = {
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

export const BackgroundMusicTrack = ({
  src,
  startFrame = 0,
  duration,
  volume = 0.26,
  duckedVolume = 0.1,
  duckRanges = [],
  rampFrames = 12,
  fadeInFrames = 24,
  fadeOutFrames = 30,
  loop = true,
}: BackgroundMusicTrackProps) => {
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
};
