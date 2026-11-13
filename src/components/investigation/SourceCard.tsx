import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  type AnyVerificationStatus,
  getIntegrityVisualSpec,
} from "../../theme/dataIntegrity";
import { ARKANAYA_BORDERS, ARKANAYA_COLORS } from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { VerificationBadge } from "./VerificationBadge";

export type SourceVerificationStatus = AnyVerificationStatus;

export type SourceCardProps = {
  sourceId?: string;
  title: string;
  publisher: string;
  publicationDate?: string;
  sourceType?: "COURT" | "OFFICIAL" | "MEDIA" | "ARCHIVE" | "WITNESS";
  url?: string;
  verificationStatus?: SourceVerificationStatus;
  notes?: string;
  style?: React.CSSProperties;
};

export const SourceCard = ({
  sourceId,
  title,
  publisher,
  publicationDate,
  sourceType = "ARCHIVE",
  url,
  verificationStatus = "VERIFIED",
  notes,
  style,
}: SourceCardProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spec = getIntegrityVisualSpec(verificationStatus);

  return (
    <div
      style={{
        border: ARKANAYA_BORDERS.subtle,
        borderLeft: ARKANAYA_BORDERS.accentLeft(spec.color),
        backgroundColor: ARKANAYA_COLORS.surfacePanel,
        padding: "18px 22px",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 13,
          letterSpacing: "0.1em",
          marginBottom: 8,
        }}
      >
        <span style={{ color: ARKANAYA_COLORS.ashGrey }}>
          {sourceId ? `${sourceId} // ` : "SOURCE // "}
          {sourceType}
          {publicationDate ? ` · ${publicationDate}` : ""}
        </span>
        <VerificationBadge status={verificationStatus} compact />
      </div>
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: 22,
          fontWeight: 600,
          color: ARKANAYA_COLORS.archiveCream,
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 15,
          color: ARKANAYA_COLORS.archiveGold,
          marginTop: 6,
        }}
      >
        {publisher}
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
          {url}
        </div>
      )}
      {notes && (
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.body,
            fontSize: 17,
            color: ARKANAYA_COLORS.agedPaper,
            marginTop: 8,
            lineHeight: 1.4,
          }}
        >
          {notes}
        </div>
      )}
    </div>
  );
};
