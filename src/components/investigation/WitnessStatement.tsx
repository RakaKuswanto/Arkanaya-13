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
import { VerificationBadge } from "./VerificationBadge";

export type WitnessStatementProps = {
  witnessLabel: string;
  role?: string;
  statement: string;
  dateRecorded: string;
  sourceId?: string;
  verificationStatus?: AnyVerificationStatus;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Formal witness deposition card separating testimony quotes from verified archival facts.
 */
export const WitnessStatement = ({
  witnessLabel,
  role = "WITNESS // DEPOSITION",
  statement,
  dateRecorded,
  sourceId,
  verificationStatus = "ALLEGED",
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: WitnessStatementProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        backgroundColor: ARKANAYA_COLORS.surfacePanel,
        border: ARKANAYA_BORDERS.subtle,
        borderLeft: ARKANAYA_BORDERS.accentLeft(accentColor),
        padding: "24px 28px",
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
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 13,
            color: ARKANAYA_COLORS.archiveGold,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {role} · {dateRecorded}
        </div>
        <VerificationBadge status={verificationStatus} compact />
      </div>

      <div
        style={{
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: 24,
          lineHeight: 1.44,
          color: ARKANAYA_COLORS.archiveCream,
          fontStyle: "italic",
          marginBottom: 16,
        }}
      >
        “{statement}”
      </div>

      <div
        style={{
          borderTop: ARKANAYA_BORDERS.subtle,
          paddingTop: 10,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 14,
          color: ARKANAYA_COLORS.ashGrey,
        }}
      >
        <span style={{ color: ARKANAYA_COLORS.archiveCream, fontWeight: 600 }}>
          {witnessLabel}
        </span>
        {sourceId && <span>REF: {sourceId}</span>}
      </div>
    </div>
  );
};
