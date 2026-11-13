import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, scaleMotionDuration } from "../../motion/presets";
import {
  ARKANAYA_BRAND,
  ARKANAYA_COLORS,
  ARKANAYA_DURATIONS,
  type ComponentVariant,
  type MotionIntensity,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type BrandIdentProps = {
  brandName?: string;
  tagline?: string;
  variant?: ComponentVariant;
  accentColor?: string;
  motionIntensity?: MotionIntensity;
  compact?: boolean;
  style?: React.CSSProperties;
};

/**
 * Compact ARKANAYA animated bumper ident adaptable to full-screen or inline showcase display.
 */
export const BrandIdent = ({
  brandName = ARKANAYA_BRAND.name,
  tagline = ARKANAYA_BRAND.tagline,
  variant = "cinematic",
  accentColor = ARKANAYA_COLORS.bloodRed,
  motionIntensity = "editorial",
  compact = false,
  style,
}: BrandIdentProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const dur = scaleMotionDuration(ARKANAYA_DURATIONS.reveal, motionIntensity);
  const inP = interpolate(frame, [0, dur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineP = interpolate(frame, [6, 6 + dur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: compact ? 10 : 18,
        padding: compact ? "24px 28px" : 36,
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        border: compact ? "1px solid rgba(232, 223, 207, 0.16)" : undefined,
      }}
    >
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: compact ? 13 : 16,
          letterSpacing: "0.28em",
          color:
            variant === "archive"
              ? ARKANAYA_COLORS.archiveGold
              : accentColor,
          opacity: inP,
          textTransform: "uppercase",
        }}
      >
        ARCHIVE DOCUMENTARY SERIES · 00/{String(durationInFrames).padStart(3, "0")}F
      </div>
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.headline,
          fontSize: compact ? 68 : 118,
          lineHeight: 0.92,
          letterSpacing: "0.08em",
          color: ARKANAYA_COLORS.archiveCream,
          opacity: inP,
          transform: `translateY(${(1 - inP) * 18}px)`,
        }}
      >
        {brandName}
      </div>
      <div
        style={{
          width: `${lineP * (compact ? 180 : 320)}px`,
          height: 3,
          backgroundColor: accentColor,
        }}
      />
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: compact ? 18 : 24,
          color: ARKANAYA_COLORS.ashGrey,
          maxWidth: 620,
          opacity: lineP,
        }}
      >
        “{tagline}”
      </div>
    </div>
  );

  if (compact) {
    return <div style={style}>{content}</div>;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      {content}
    </AbsoluteFill>
  );
};
