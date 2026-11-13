import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
  isLandscapeLayout,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type SocialEndScreenProps = {
  closingQuestion: string;
  nextEpisodeLabel?: string;
  channelHandle?: string;
  callToAction?: string;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Responsive end-screen panel supporting both 9:16 vertical action safe areas and 16:9 side-by-side cards.
 */
export const SocialEndScreen = ({
  closingQuestion,
  nextEpisodeLabel = "NEXT DOSSIER // ARCHIVE QUEUE",
  channelHandle = "@ARKANAYA.ARCHIVE",
  callToAction = "Ikuti arsip lengkapnya atau tuliskan temuan Anda di kolom diskusi.",
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: SocialEndScreenProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const landscape = isLandscapeLayout(width, height);

  const enter = interpolate(frame, [0, 20], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        border: ARKANAYA_BORDERS.subtle,
        borderTop: `4px solid ${accentColor}`,
        padding: landscape ? "28px 34px" : "24px 26px",
        boxShadow: ARKANAYA_SHADOWS.panel,
        display: "flex",
        flexDirection: landscape ? "row" : "column",
        gap: 24,
        alignItems: landscape ? "center" : "stretch",
        justifyContent: "space-between",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px)`,
        ...style,
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 13,
            letterSpacing: "0.16em",
            color: ARKANAYA_COLORS.archiveGold,
          }}
        >
          {channelHandle}
        </div>
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.secondary,
            fontSize: landscape ? 44 : 38,
            lineHeight: 1.04,
            color: ARKANAYA_COLORS.archiveCream,
          }}
        >
          {closingQuestion}
        </div>
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.body,
            fontSize: 18,
            lineHeight: 1.4,
            color: ARKANAYA_COLORS.ashGrey,
          }}
        >
          {callToAction}
        </div>
      </div>

      {/* Next Episode Slot */}
      <div
        style={{
          width: landscape ? 340 : "100%",
          height: landscape ? 190 : 120,
          backgroundColor: ARKANAYA_COLORS.charcoal,
          border: ARKANAYA_BORDERS.subtle,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          padding: 16,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 12,
            letterSpacing: "0.14em",
            color: accentColor,
          }}
        >
          UP NEXT
        </span>
        <span
          style={{
            fontFamily: ARKANAYA_FONTS.secondary,
            fontSize: 26,
            color: ARKANAYA_COLORS.archiveCream,
          }}
        >
          {nextEpisodeLabel}
        </span>
      </div>
    </div>
  );
};
