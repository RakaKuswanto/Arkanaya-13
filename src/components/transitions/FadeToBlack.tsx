import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fadeToBlack } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";

export type FadeToBlackProps = {
  fadeInFrames?: number;
  fadeOutFrames?: number;
  color?: string;
  style?: React.CSSProperties;
};

export const FadeToBlack = ({
  fadeInFrames = 12,
  fadeOutFrames = 18,
  color = ARSIP_COLORS.deepBlack,
  style,
}: FadeToBlackProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const opacity = fadeToBlack(
    { frame, durationInFrames, fps },
    { fadeInFrames, fadeOutFrames },
  );

  if (opacity <= 0) return null;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};
