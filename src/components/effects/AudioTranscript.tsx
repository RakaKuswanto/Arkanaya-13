import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type TranscriptEntry = {
  speaker: string;
  timecode?: string;
  text: string;
  redacted?: boolean;
};

export type AudioTranscriptProps = {
  title?: string;
  sourceCode?: string;
  lines: readonly TranscriptEntry[];
  framesPerLine?: number;
  activeIndex?: number;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Timed archival audio transcript viewer with speaker cues, redactions, and active-line tracking.
 */
export const AudioTranscript = ({
  title = "RECORDED AUDIO TRANSCRIPT",
  sourceCode = "TAPE-LOG // 001",
  lines,
  framesPerLine = 45,
  activeIndex,
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: AudioTranscriptProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 14], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const computedActive =
    activeIndex !== undefined
      ? activeIndex
      : lines.length > 0
        ? Math.min(lines.length - 1, Math.floor(frame / Math.max(1, framesPerLine)))
        : -1;

  const tcSec = Math.floor(frame / Math.max(1, fps));

  return (
    <div
      style={{
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        border: ARKANAYA_BORDERS.subtle,
        padding: "22px 26px",
        boxShadow: ARKANAYA_SHADOWS.panel,
        opacity: enter,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: ARKANAYA_BORDERS.subtle,
          paddingBottom: 10,
          marginBottom: 16,
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 14,
          color: ARKANAYA_COLORS.archiveGold,
          letterSpacing: "0.1em",
        }}
      >
        <span>
          {title} // {sourceCode}
        </span>
        <span style={{ color: accentColor }}>
          TC 00:{String(Math.floor(tcSec / 60)).padStart(2, "0")}:
          {String(tcSec % 60).padStart(2, "0")}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {lines.map((line, idx) => {
          const isActive = idx === computedActive;
          return (
            <div
              key={`${line.speaker}-${idx}`}
              style={{
                borderLeft: `3px solid ${
                  isActive ? accentColor : ARKANAYA_COLORS.borderSubtle
                }`,
                padding: "8px 14px",
                backgroundColor: isActive
                  ? "rgba(158, 48, 45, 0.12)"
                  : "transparent",
                opacity: isActive ? 1 : 0.65,
              }}
            >
              <div
                style={{
                  fontFamily: ARKANAYA_FONTS.mono,
                  fontSize: 13,
                  color: isActive
                    ? accentColor
                    : ARKANAYA_COLORS.archiveGold,
                  marginBottom: 4,
                  letterSpacing: "0.1em",
                }}
              >
                {line.speaker}
                {line.timecode ? ` · ${line.timecode}` : ""}
              </div>
              <div
                style={{
                  fontFamily: ARKANAYA_FONTS.mono,
                  fontSize: 20,
                  lineHeight: 1.4,
                  color: line.redacted
                    ? ARKANAYA_COLORS.inkBlack
                    : ARKANAYA_COLORS.archiveCream,
                  backgroundColor: line.redacted
                    ? ARKANAYA_COLORS.inkBlack
                    : "transparent",
                  display: "inline-block",
                }}
              >
                {line.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
