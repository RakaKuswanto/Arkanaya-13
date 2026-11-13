import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE, scaleMotionDuration } from "../../motion/presets";
import type { AnyVerificationStatus } from "../../theme/dataIntegrity";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_DURATIONS,
  ARKANAYA_SHADOWS,
  type ComponentVariant,
  type MotionIntensity,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { VerificationBadge } from "../investigation/VerificationBadge";

export type ConclusionCardProps = {
  title?: string;
  summary: string;
  openQuestions?: readonly string[];
  caseStatus?: string;
  verificationSummary?: AnyVerificationStatus;
  variant?: ComponentVariant;
  accentColor?: string;
  motionIntensity?: MotionIntensity;
  style?: React.CSSProperties;
};

/**
 * Structured investigative summary panel contrasting confirmed records with remaining open questions.
 */
export const ConclusionCard = ({
  title = "RINGKASAN TEMUAN ARSIP",
  summary,
  openQuestions = [],
  caseStatus = "UNSOLVED",
  verificationSummary,
  variant = "investigative",
  accentColor = ARKANAYA_COLORS.bloodRed,
  motionIntensity = "editorial",
  style,
}: ConclusionCardProps) => {
  const frame = useCurrentFrame();
  const dur = scaleMotionDuration(ARKANAYA_DURATIONS.reveal, motionIntensity);
  const enter = interpolate(frame, [0, dur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isArchive = variant === "archive";

  return (
    <div
      style={{
        backgroundColor: isArchive
          ? ARKANAYA_COLORS.archiveCream
          : ARKANAYA_COLORS.surfacePanel,
        color: isArchive
          ? ARKANAYA_COLORS.inkBlack
          : ARKANAYA_COLORS.archiveCream,
        border: isArchive ? ARKANAYA_BORDERS.paper : ARKANAYA_BORDERS.subtle,
        borderTop: `4px solid ${accentColor}`,
        padding: "26px 30px",
        boxShadow: ARKANAYA_SHADOWS.panel,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px)`,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: ARKANAYA_COLORS.archiveGold,
            textTransform: "uppercase",
          }}
        >
          CASE STATUS // {caseStatus}
        </span>
        {verificationSummary && (
          <VerificationBadge status={verificationSummary} compact />
        )}
      </div>

      <div
        style={{
          fontFamily: ARKANAYA_FONTS.secondary,
          fontSize: 42,
          lineHeight: 1.02,
          letterSpacing: "0.03em",
          marginBottom: 12,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: 22,
          lineHeight: 1.46,
          color: isArchive
            ? ARKANAYA_COLORS.charcoal
            : ARKANAYA_COLORS.agedPaper,
        }}
      >
        {summary}
      </div>

      {openQuestions.length > 0 && (
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: isArchive
              ? ARKANAYA_BORDERS.paper
              : ARKANAYA_BORDERS.subtle,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: ARKANAYA_FONTS.mono,
              fontSize: 13,
              letterSpacing: "0.12em",
              color: accentColor,
              textTransform: "uppercase",
            }}
          >
            PERTANYAAN TERBUKA
          </div>
          {openQuestions.map((q, idx) => (
            <div
              key={idx}
              style={{
                fontFamily: ARKANAYA_FONTS.body,
                fontSize: 19,
                lineHeight: 1.38,
              }}
            >
              • {q}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
