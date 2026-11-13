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

export type FactCheckCardProps = {
  claim: string;
  finding: string;
  verificationStatus?: AnyVerificationStatus;
  sourceId?: string;
  sourceTitle?: string;
  variant?: ComponentVariant;
  motionIntensity?: MotionIntensity;
  style?: React.CSSProperties;
};

/**
 * Investigative claim-versus-finding verification panel enforcing visual integrity between proven and disputed claims.
 */
export const FactCheckCard = ({
  claim,
  finding,
  verificationStatus = "DISPUTED",
  sourceId,
  sourceTitle,
  variant = "investigative",
  motionIntensity = "editorial",
  style,
}: FactCheckCardProps) => {
  const frame = useCurrentFrame();
  const dur = scaleMotionDuration(ARKANAYA_DURATIONS.reveal, motionIntensity);
  const enter = interpolate(frame, [0, dur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spec = getIntegrityVisualSpec(verificationStatus);

  return (
    <div
      style={{
        backgroundColor:
          variant === "minimal"
            ? ARKANAYA_COLORS.obsidian
            : ARKANAYA_COLORS.surfacePanel,
        border: ARKANAYA_BORDERS.subtle,
        borderTop: `3px ${spec.borderStyle} ${spec.color}`,
        padding: "22px 26px",
        boxShadow: ARKANAYA_SHADOWS.panel,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px)`,
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
            fontSize: 13,
            letterSpacing: "0.14em",
            color: ARKANAYA_COLORS.archiveGold,
            textTransform: "uppercase",
          }}
        >
          FACT CHECK // VERIFICATION LOG
        </span>
        <VerificationBadge status={verificationStatus} showHint />
      </div>

      <div
        style={{
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 13,
          color: ARKANAYA_COLORS.ashGrey,
          letterSpacing: "0.1em",
          marginBottom: 4,
        }}
      >
        CIRCULATED CLAIM
      </div>
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: 22,
          lineHeight: 1.38,
          color: ARKANAYA_COLORS.archiveCream,
          marginBottom: 16,
          paddingLeft: 14,
          borderLeft: `2px ${spec.borderStyle} ${spec.color}`,
        }}
      >
        {claim}
      </div>

      <div
        style={{
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 13,
          color: ARKANAYA_COLORS.archiveGold,
          letterSpacing: "0.1em",
          marginBottom: 4,
        }}
      >
        ARCHIVAL FINDING
      </div>
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: 20,
          lineHeight: 1.42,
          color: ARKANAYA_COLORS.agedPaper,
        }}
      >
        {finding}
      </div>

      {(sourceId || sourceTitle) && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: ARKANAYA_BORDERS.subtle,
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 13,
            color: ARKANAYA_COLORS.ashGrey,
            letterSpacing: "0.08em",
          }}
        >
          {[sourceId, sourceTitle].filter(Boolean).join(" · ")}
        </div>
      )}
    </div>
  );
};
