import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_COLORS,
  ARSIP_BRAND,
  getSafeMargins,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { FadeToBlack } from "../transitions/FadeToBlack";

export type CaseEndingProps = {
  statement: string;
  brandName?: string;
  tagline?: string;
  fadeOutFrames?: number;
  style?: React.CSSProperties;
};

export const CaseEnding = ({
  statement,
  brandName = ARSIP_BRAND.name,
  tagline = ARSIP_BRAND.tagline,
  fadeOutFrames = 24,
  style,
}: CaseEndingProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const margins = getSafeMargins(width, height);

  const textIn = interpolate(frame, [4, 24], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandIn = interpolate(frame, [20, 40], [0, 1], {
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
        gap: 44,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.secondary,
          fontSize: 64,
          lineHeight: 1.06,
          letterSpacing: "0.03em",
          color: ARKANAYA_COLORS.archiveCream,
          maxWidth: 840,
          opacity: textIn,
          translate: `0px ${(1 - textIn) * 20}px`,
        }}
      >
        {statement}
      </div>

      <div
        style={{
          width: 240,
          height: 3,
          backgroundColor: ARKANAYA_COLORS.bloodRed,
          opacity: brandIn,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: brandIn,
        }}
      >
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.headline,
            fontSize: 56,
            letterSpacing: "0.08em",
            color: ARKANAYA_COLORS.archiveCream,
          }}
        >
          {brandName}
        </div>
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 18,
            letterSpacing: "0.1em",
            color: ARKANAYA_COLORS.ashGrey,
            maxWidth: 680,
          }}
        >
          {tagline}
        </div>
      </div>

      <FadeToBlack fadeInFrames={0} fadeOutFrames={fadeOutFrames} />
    </AbsoluteFill>
  );
};
