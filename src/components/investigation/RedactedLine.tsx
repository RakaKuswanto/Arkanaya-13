import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { redactWipe } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type RedactedLineProps = {
  text: string;
  mode?: "redact" | "declassify";
  startFrame?: number;
  durationFrames?: number;
  fontSize?: number;
  barColor?: string;
  textColor?: string;
  style?: React.CSSProperties;
};

export const RedactedLine = ({
  text,
  mode = "redact",
  startFrame = 12,
  durationFrames = 20,
  fontSize = 24,
  barColor = ARSIP_COLORS.inkBlack,
  textColor = ARSIP_COLORS.archivePaper,
  style,
}: RedactedLineProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const barWidthPercent = redactWipe(
    { frame, durationInFrames, fps },
    { startFrame, durationFrames, mode },
  );

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        padding: "2px 8px",
        fontFamily: ARSIP_FONTS.mono,
        fontSize,
        color: textColor,
        ...style,
      }}
    >
      <span>{text}</span>
      <span
        style={{
          position: "absolute",
          inset: 0,
          width: `${barWidthPercent}%`,
          backgroundColor: barColor,
          pointerEvents: "none",
        }}
      />
    </span>
  );
};
