import { AudioFade } from "./AudioFade";

export type VoiceOverTrackProps = {
  src?: string;
  startFrame?: number;
  duration?: number;
  volume?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
};

export const VoiceOverTrack = ({
  src,
  startFrame = 0,
  duration,
  volume = 1,
  fadeInFrames = 6,
  fadeOutFrames = 8,
}: VoiceOverTrackProps) => {
  return (
    <AudioFade
      src={src}
      startFrame={startFrame}
      duration={duration}
      volume={volume}
      fadeInFrames={fadeInFrames}
      fadeOutFrames={fadeOutFrames}
      loop={false}
    />
  );
};
