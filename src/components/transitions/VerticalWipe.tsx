import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";

export type VerticalWipeProps = {
  direction?: "up" | "down";
  color?: string;
  accentColor?: string;
  style?: React.CSSProperties;
};

export const VerticalWipe = ({
  direction = "up",
  color = ARSIP_COLORS.obsidian,
  accentColor = ARSIP_COLORS.bloodRed,
  style,
}: VerticalWipeProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const half = Math.max(8, Math.floor(durationInFrames / 2));
  const yPercent = interpolate(
    frame,
    [0, half - 2, half + 2, Math.max(half + 3, durationInFrames - 1)],
    direction === "up" ? [105, 0, 0, -105] : [-105, 0, 0, 105],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: color,
          transform: `translateY(${yPercent}%)`,
          borderTop: `8px solid ${accentColor}`,
          borderBottom: `8px solid ${accentColor}`,
        }}
      />
    </AbsoluteFill>
  );
};
