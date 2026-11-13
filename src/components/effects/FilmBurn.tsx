import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ARSIP_COLORS } from "../../theme/tokens";

export type FilmBurnDirection = "left" | "right" | "top" | "bottom" | "center";

export type FilmBurnProps = {
  direction?: FilmBurnDirection;
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  style?: React.CSSProperties;
};

const originMap: Record<FilmBurnDirection, string> = {
  left: "12% 50%",
  right: "88% 50%",
  top: "50% 10%",
  bottom: "50% 90%",
  center: "50% 50%",
};

export const FilmBurn = ({
  direction = "right",
  intensity = 0.85,
  primaryColor = "#D95D24",
  secondaryColor = ARSIP_COLORS.bloodRed,
  style,
}: FilmBurnProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const peakFrame = Math.max(4, Math.floor(durationInFrames * 0.48));
  const envelope = interpolate(
    frame,
    [0, peakFrame, Math.max(peakFrame + 1, durationInFrames - 1)],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const spread = 25 + envelope * 75;
  const flashOpacity = Math.max(0, (envelope - 0.65) / 0.35) * 0.42 * intensity;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${originMap[direction]}, #FFF1D0 0%, ${primaryColor} ${(spread * 0.35).toFixed(1)}%, ${secondaryColor} ${(spread * 0.68).toFixed(1)}%, transparent ${spread.toFixed(1)}%)`,
          opacity: envelope * intensity,
          mixBlendMode: "screen",
        }}
      />
      {flashOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFF3DC",
            opacity: flashOpacity,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
