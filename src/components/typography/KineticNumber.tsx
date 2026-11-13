import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type KineticNumberProps = {
  from?: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  sublabel?: string;
  durationFrames?: number;
  delayFrames?: number;
  fontSize?: number;
  color?: string;
  accentColor?: string;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
};

export const KineticNumber = ({
  from = 0,
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  sublabel,
  durationFrames = 42,
  delayFrames = 0,
  fontSize = 136,
  color = ARSIP_COLORS.archivePaper,
  accentColor = ARSIP_COLORS.bloodRed,
  align = "left",
  style,
}: KineticNumberProps) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [delayFrames, delayFrames + Math.max(1, durationFrames)],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const labelReveal = interpolate(
    frame,
    [delayFrames + 4, delayFrames + 18],
    [0, 1],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const currentVal = from + (to - from) * progress;
  const formatted =
    decimals > 0
      ? currentVal.toFixed(decimals)
      : Math.round(currentVal).toLocaleString("en-US");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems:
          align === "center"
            ? "center"
            : align === "right"
              ? "flex-end"
              : "flex-start",
        textAlign: align,
        gap: 8,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: ARSIP_FONTS.headline,
          fontSize,
          lineHeight: 0.92,
          letterSpacing: "0.02em",
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: accentColor }}>{prefix}</span>
        <span>{formatted}</span>
        <span style={{ color: accentColor }}>{suffix}</span>
      </div>

      {label && (
        <div
          style={{
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: ARSIP_COLORS.archiveGold,
            opacity: labelReveal,
            translate: `0px ${(1 - labelReveal) * 10}px`,
          }}
        >
          {label}
        </div>
      )}

      {sublabel && (
        <div
          style={{
            fontFamily: ARSIP_FONTS.body,
            fontSize: 22,
            lineHeight: 1.35,
            color: ARSIP_COLORS.mutedGray,
            opacity: labelReveal,
            maxWidth: 640,
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};
