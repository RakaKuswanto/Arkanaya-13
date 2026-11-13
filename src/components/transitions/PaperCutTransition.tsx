import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { hash1D } from "../../utils/deterministic";

export type PaperCutTransitionProps = {
  paperColor?: string;
  edgeShadowColor?: string;
  style?: React.CSSProperties;
};

export const PaperCutTransition = ({
  paperColor = ARSIP_COLORS.archivePaper,
  edgeShadowColor = "rgba(8, 8, 8, 0.55)",
  style,
}: PaperCutTransitionProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const half = Math.max(8, Math.floor(durationInFrames / 2));
  const xPercent = interpolate(
    frame,
    [0, half - 2, half + 2, Math.max(half + 3, durationInFrames - 1)],
    [115, 0, 0, -115],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Deterministic torn vertical edge on left & right of paper sheet
  const steps = 28;
  const leftPoints: string[] = [];
  const rightPoints: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * height;
    const lx = hash1D(i * 4.3 + 11) * 26;
    const rx = width - hash1D(i * 5.9 + 29) * 26;
    leftPoints.push(`${lx.toFixed(1)},${y.toFixed(1)}`);
    rightPoints.unshift(`${rx.toFixed(1)},${y.toFixed(1)}`);
  }
  const polygonPoints = [...leftPoints, ...rightPoints].join(" ");

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", ...style }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${xPercent}%)`,
          filter: `drop-shadow(0 0 24px ${edgeShadowColor})`,
        }}
      >
        <polygon points={polygonPoints} fill={paperColor} />
      </svg>
    </AbsoluteFill>
  );
};
