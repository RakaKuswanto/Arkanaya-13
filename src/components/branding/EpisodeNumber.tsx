import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  type ComponentVariant,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type EpisodeNumberProps = {
  episodeNumber: string | number;
  caseCode?: string;
  season?: string;
  variant?: ComponentVariant;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Editorial episode number and case code badge for documentary openers and cards.
 */
export const EpisodeNumber = ({
  episodeNumber,
  caseCode,
  season,
  variant = "investigative",
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: EpisodeNumberProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const formatted =
    typeof episodeNumber === "number"
      ? `EPISODE ${String(episodeNumber).padStart(2, "0")}`
      : episodeNumber;

  const isMinimal = variant === "minimal";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontFamily: ARKANAYA_FONTS.mono,
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 10}px)`,
        ...style,
      }}
    >
      <span
        style={{
          backgroundColor: isMinimal ? "transparent" : accentColor,
          color: isMinimal ? accentColor : ARKANAYA_COLORS.archiveCream,
          border: isMinimal ? `1px solid ${accentColor}` : "none",
          padding: "5px 12px",
        }}
      >
        {formatted}
      </span>
      {season && (
        <span style={{ color: ARKANAYA_COLORS.archiveGold }}>{season}</span>
      )}
      {caseCode && (
        <span
          style={{
            color: ARKANAYA_COLORS.ashGrey,
            borderLeft: ARKANAYA_BORDERS.subtle,
            paddingLeft: 12,
          }}
        >
          {caseCode}
        </span>
      )}
    </div>
  );
};
