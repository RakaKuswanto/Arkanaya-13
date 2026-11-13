import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type CaseMetadataProps = {
  caseNumber: string;
  location: string;
  date: string;
  category?: string;
  status?: string;
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderColor?: string;
  compact?: boolean;
  style?: React.CSSProperties;
};

export const CaseMetadata = ({
  caseNumber,
  location,
  date,
  category = "INVESTIGATION",
  status = "UNSOLVED",
  accentColor = ARSIP_COLORS.bloodRed,
  textColor = ARSIP_COLORS.archivePaper,
  mutedColor = ARSIP_COLORS.mutedGray,
  borderColor = "rgba(232, 228, 220, 0.22)",
  compact = false,
  style,
}: CaseMetadataProps) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 16], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rows: Array<{ label: string; value: string; highlight?: boolean }> = [
    { label: "CASE NO.", value: caseNumber },
    { label: "DATE", value: date },
    { label: "LOCATION", value: location },
    { label: "CATEGORY", value: category },
    { label: "STATUS", value: status, highlight: true },
  ];

  return (
    <div
      style={{
        fontFamily: ARSIP_FONTS.mono,
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        padding: compact ? "12px 0" : "18px 0",
        display: "grid",
        gridTemplateColumns: compact ? "repeat(2, minmax(0, 1fr))" : "1fr",
        gap: compact ? "10px 24px" : "10px",
        opacity: reveal,
        translate: `0px ${(1 - reveal) * 14}px`,
        ...style,
      }}
    >
      {rows.map((row) => (
        <div
          key={row.label}
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 16,
            fontSize: compact ? 18 : 22,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: mutedColor, fontWeight: 500 }}>
            {row.label}
          </span>
          <span
            style={{
              color: row.highlight ? accentColor : textColor,
              fontWeight: row.highlight ? 700 : 500,
              textAlign: "right",
            }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};
