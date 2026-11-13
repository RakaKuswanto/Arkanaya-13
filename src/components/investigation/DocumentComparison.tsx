import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import type { AnyVerificationStatus } from "../../theme/dataIntegrity";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
  isLandscapeLayout,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { VerificationBadge } from "./VerificationBadge";

export type DocumentVersionItem = {
  versionLabel: string;
  docCode?: string;
  date?: string;
  verificationStatus?: AnyVerificationStatus;
  lines: ReadonlyArray<{ text: string; changed?: boolean }>;
};

export type DocumentComparisonProps = {
  leftDoc: DocumentVersionItem;
  rightDoc: DocumentVersionItem;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Forensic document diff layout contrasting two versions or contradictory records side by side.
 */
export const DocumentComparison = ({
  leftDoc,
  rightDoc,
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: DocumentComparisonProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const landscape = isLandscapeLayout(width, height);

  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderDoc = (doc: DocumentVersionItem, isRight: boolean) => (
    <div
      style={{
        flex: 1,
        backgroundColor: ARKANAYA_COLORS.archiveCream,
        color: ARKANAYA_COLORS.inkBlack,
        border: ARKANAYA_BORDERS.paperHeavy,
        borderTop: `4px solid ${isRight ? accentColor : ARKANAYA_COLORS.archiveGold}`,
        padding: "18px 22px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
          borderBottom: ARKANAYA_BORDERS.paper,
          paddingBottom: 8,
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 13,
        }}
      >
        <div>
          <div style={{ fontWeight: 700 }}>{doc.versionLabel}</div>
          {(doc.docCode || doc.date) && (
            <div style={{ color: ARKANAYA_COLORS.charcoal, fontSize: 12 }}>
              {[doc.docCode, doc.date].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        {doc.verificationStatus && (
          <VerificationBadge status={doc.verificationStatus} compact />
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {doc.lines.map((line, idx) => (
          <div
            key={idx}
            style={{
              fontFamily: ARKANAYA_FONTS.mono,
              fontSize: 16,
              lineHeight: 1.45,
              padding: line.changed ? "4px 8px" : 0,
              backgroundColor: line.changed
                ? "rgba(158, 48, 45, 0.14)"
                : "transparent",
              borderLeft: line.changed ? `3px solid ${accentColor}` : "none",
            }}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: landscape ? "row" : "column",
        gap: 16,
        boxShadow: ARKANAYA_SHADOWS.panel,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px)`,
        ...style,
      }}
    >
      {renderDoc(leftDoc, false)}
      {renderDoc(rightDoc, true)}
    </div>
  );
};
