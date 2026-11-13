import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, SHARP_EXIT_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type SectionTitlePreset =
  | "INTRODUCTION"
  | "THE INCIDENT"
  | "THE EVIDENCE"
  | "THE DISAPPEARANCE"
  | "THE MYSTERY"
  | "THE CONCLUSION";

export type SectionTitleProps = {
  title: SectionTitlePreset | (string & {});
  chapterNumber?: string;
  subtitle?: string;
  accentColor?: string;
  textColor?: string;
  fontSize?: number;
  exit?: boolean;
  style?: React.CSSProperties;
};

export const SectionTitle = ({
  title,
  chapterNumber = "01",
  subtitle,
  accentColor = ARSIP_COLORS.bloodRed,
  textColor = ARSIP_COLORS.archivePaper,
  fontSize = 86,
  exit = false,
  style,
}: SectionTitleProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const enterT = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineT = interpolate(frame, [4, 24], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitT = exit
    ? interpolate(
        frame,
        [Math.max(20, durationInFrames - 12), Math.max(21, durationInFrames - 1)],
        [0, 1],
        {
          easing: SHARP_EXIT_EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        opacity: 1 - exitT,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: accentColor,
          opacity: enterT,
        }}
      >
        <span
          style={{
            backgroundColor: accentColor,
            color: ARSIP_COLORS.archivePaper,
            padding: "4px 10px",
          }}
        >
          FILE {chapterNumber}
        </span>
        <span style={{ color: ARSIP_COLORS.archiveGold }}>ARCHIVE SECTION</span>
      </div>

      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontFamily: ARSIP_FONTS.secondary,
            fontSize,
            lineHeight: 0.94,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: textColor,
            translate: `0px ${(1 - enterT) * 100}%`,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          width: `${lineT * 100}%`,
          height: 3,
          backgroundColor: accentColor,
        }}
      />

      {subtitle && (
        <div
          style={{
            fontFamily: ARSIP_FONTS.body,
            fontSize: 26,
            lineHeight: 1.4,
            color: ARSIP_COLORS.mutedGray,
            opacity: enterT,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
