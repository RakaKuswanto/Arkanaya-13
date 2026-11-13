import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  type ComponentVariant,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type SeriesLabelProps = {
  seriesTitle?: string;
  category?: string;
  partLabel?: string;
  variant?: ComponentVariant;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Compact header tag identifying the ongoing investigative series and category classification.
 */
export const SeriesLabel = ({
  seriesTitle = "ARKANAYA ARCHIVES",
  category = "UNSOLVED FILES",
  partLabel,
  variant = "archive",
  accentColor = ARKANAYA_COLORS.archiveGold,
  style,
}: SeriesLabelProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resolvedColor =
    variant === "urgent" ? ARKANAYA_COLORS.bloodRed : accentColor;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 14px",
        backgroundColor: ARKANAYA_COLORS.surfacePanel,
        border: ARKANAYA_BORDERS.subtle,
        fontFamily: ARKANAYA_FONTS.mono,
        fontSize: 13,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        opacity: enter,
        ...style,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          backgroundColor: resolvedColor,
        }}
      />
      <span style={{ color: ARKANAYA_COLORS.archiveCream, fontWeight: 700 }}>
        {seriesTitle}
      </span>
      <span style={{ color: resolvedColor }}>// {category}</span>
      {partLabel && (
        <span style={{ color: ARKANAYA_COLORS.ashGrey }}>· {partLabel}</span>
      )}
    </div>
  );
};
