import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import type { AnyVerificationStatus } from "../../theme/dataIntegrity";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { GrainSurface } from "../shared";
import { VerificationBadge } from "./VerificationBadge";

export type HandwrittenNoteProps = {
  note: string;
  author?: string;
  date?: string;
  highlightLine?: string;
  verificationStatus?: AnyVerificationStatus;
  rotation?: number;
  style?: React.CSSProperties;
};

/**
 * Archival ruled-notebook card representing recovered handwritten notes or field logs.
 */
export const HandwrittenNote = ({
  note,
  author = "ANONYMOUS NOTEBOOK",
  date,
  highlightLine,
  verificationStatus,
  rotation = -1.5,
  style,
}: HandwrittenNoteProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweep = interpolate(frame, [14, 34], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: ARKANAYA_COLORS.agedPaper,
        color: ARKANAYA_COLORS.inkBlack,
        padding: "28px 34px 28px 54px",
        border: ARKANAYA_BORDERS.paper,
        boxShadow: ARKANAYA_SHADOWS.panel,
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, rgba(20,19,17,0.12) 36px)",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px) rotate(${rotation}deg)`,
        ...style,
      }}
    >
      <GrainSurface opacity={0.12} seed={19} mixBlendMode="multiply" />

      {/* Vertical margin rule */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 38,
          width: 2,
          backgroundColor: "rgba(158, 48, 45, 0.38)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 13,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span>
          {author}
          {date ? ` · ${date}` : ""}
        </span>
        {verificationStatus && (
          <VerificationBadge status={verificationStatus} compact />
        )}
      </div>

      <div
        style={{
          position: "relative",
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: 25,
          fontStyle: "italic",
          lineHeight: "36px",
          color: ARKANAYA_COLORS.inkBlack,
        }}
      >
        {note}
      </div>

      {highlightLine && (
        <div
          style={{
            position: "relative",
            marginTop: 12,
            display: "inline-block",
            fontFamily: ARKANAYA_FONTS.body,
            fontSize: 22,
            fontWeight: 700,
            fontStyle: "italic",
            color: ARKANAYA_COLORS.bloodRed,
            borderBottom: `2px solid ${ARKANAYA_COLORS.bloodRed}`,
            transformOrigin: "left center",
            clipPath: `inset(0 ${(1 - sweep) * 100}% 0 0)`,
          }}
        >
          {highlightLine}
        </div>
      )}
    </div>
  );
};
