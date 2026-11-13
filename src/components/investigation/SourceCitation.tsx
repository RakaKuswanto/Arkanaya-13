import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE, scaleMotionDuration } from "../../motion/presets";
import {
  type AnyVerificationStatus,
  getIntegrityVisualSpec,
} from "../../theme/dataIntegrity";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_DURATIONS,
  ARKANAYA_SHADOWS,
  type ComponentVariant,
  type MotionIntensity,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { VerificationBadge } from "./VerificationBadge";

export type SourceCitationProps = {
  sourceId: string;
  title: string;
  publisher: string;
  publicationDate: string;
  sourceType?:
    | "ARCHIVE"
    | "OFFICIAL"
    | "COURT"
    | "NEWS"
    | "MEDIA"
    | "WITNESS"
    | "REPORT"
    | "ACADEMIC";
  url?: string;
  verificationStatus?: AnyVerificationStatus;
  excerpt?: string;
  variant?: ComponentVariant;
  motionIntensity?: MotionIntensity;
  showIntegrityHint?: boolean;
  style?: React.CSSProperties;
};

/**
 * Canonical Phase 5 documentary source citation card with full metadata & data integrity status.
 */
export const SourceCitation = ({
  sourceId,
  title,
  publisher,
  publicationDate,
  sourceType = "ARCHIVE",
  url,
  verificationStatus = "UNVERIFIED",
  excerpt,
  variant = "investigative",
  motionIntensity = "editorial",
  showIntegrityHint = false,
  style,
}: SourceCitationProps) => {
  const frame = useCurrentFrame();
  const dur = scaleMotionDuration(ARKANAYA_DURATIONS.enter, motionIntensity);
  const enter = interpolate(frame, [0, dur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spec = getIntegrityVisualSpec(verificationStatus);
  const isArchive = variant === "archive";

  return (
    <div
      style={{
        border: isArchive ? ARKANAYA_BORDERS.paper : ARKANAYA_BORDERS.subtle,
        borderLeft: ARKANAYA_BORDERS.accentLeft(spec.color),
        backgroundColor: isArchive
          ? ARKANAYA_COLORS.archiveCream
          : ARKANAYA_COLORS.surfacePanel,
        color: isArchive
          ? ARKANAYA_COLORS.inkBlack
          : ARKANAYA_COLORS.archiveCream,
        padding: "18px 22px",
        boxShadow: ARKANAYA_SHADOWS.panel,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: isArchive
              ? ARKANAYA_COLORS.charcoal
              : ARKANAYA_COLORS.ashGrey,
          }}
        >
          {sourceId} // {sourceType} · {publicationDate}
        </div>
        <VerificationBadge
          status={verificationStatus}
          showHint={showIntegrityHint}
          compact
        />
      </div>

      <div
        style={{
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1.32,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 14,
          color: isArchive
            ? ARKANAYA_COLORS.bloodRed
            : ARKANAYA_COLORS.archiveGold,
          marginTop: 6,
        }}
      >
        PUBLISHER: {publisher}
      </div>

      {url && (
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 12,
            color: ARKANAYA_COLORS.ashGrey,
            marginTop: 4,
            wordBreak: "break-all",
          }}
        >
          REF URL: {url}
        </div>
      )}

      {excerpt && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: isArchive
              ? ARKANAYA_BORDERS.paper
              : ARKANAYA_BORDERS.subtle,
            fontFamily: ARKANAYA_FONTS.body,
            fontSize: 18,
            lineHeight: 1.42,
            color: isArchive
              ? ARKANAYA_COLORS.charcoal
              : ARKANAYA_COLORS.agedPaper,
          }}
        >
          “{excerpt}”
        </div>
      )}
    </div>
  );
};
