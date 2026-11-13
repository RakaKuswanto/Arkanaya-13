import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_BRAND,
  ARKANAYA_COLORS,
  getSafeMargins,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { FilmOverlay } from "../archival/FilmOverlay";
import { FadeToBlack } from "../transitions/FadeToBlack";

export type BrandOpeningProps = {
  brandName?: string;
  tagline?: string;
  showFilmTexture?: boolean;
  accentColor?: string;
  style?: React.CSSProperties;
};

export const BrandOpening = ({
  brandName = ARKANAYA_BRAND.seriesName,
  tagline = ARKANAYA_BRAND.tagline,
  showFilmTexture = true,
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: BrandOpeningProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const margins = getSafeMargins(width, height);

  const logoReveal = interpolate(frame, [6, 28], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineExpand = interpolate(frame, [14, 34], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagReveal = interpolate(frame, [24, 44], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        paddingLeft: margins.left,
        paddingRight: margins.right,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Archive badge */}
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: ARKANAYA_COLORS.archiveGold,
            opacity: logoReveal,
          }}
        >
          DOKUMENTER INVESTIGASI
        </div>

        {/* Main Wordmark */}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontFamily: ARKANAYA_FONTS.headline,
              fontSize: 132,
              lineHeight: 0.92,
              letterSpacing: "0.06em",
              color: ARKANAYA_COLORS.archiveCream,
              translate: `0px ${(1 - logoReveal) * 100}%`,
            }}
          >
            {brandName}
          </div>
        </div>

        {/* Blood Red hairline divider */}
        <div
          style={{
            width: `${lineExpand * 420}px`,
            height: 4,
            backgroundColor: accentColor,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.body,
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.45,
            color: ARKANAYA_COLORS.ashGrey,
            maxWidth: 720,
            opacity: tagReveal,
            translate: `0px ${(1 - tagReveal) * 14}px`,
          }}
        >
          “{tagline}”
        </div>
      </div>

      {showFilmTexture && (
        <FilmOverlay grain={0.14} dust={0.35} scratches={0.22} vignette={0.58} />
      )}

      <FadeToBlack fadeInFrames={10} fadeOutFrames={14} />
    </AbsoluteFill>
  );
};
