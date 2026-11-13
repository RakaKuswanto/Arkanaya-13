import type React from "react";
import { ARSIP_BRAND, ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type WatermarkProps = {
  text?: string;
  position?: WatermarkPosition;
  opacity?: number;
  accentColor?: string;
  style?: React.CSSProperties;
};

const posStyles: Record<WatermarkPosition, React.CSSProperties> = {
  "top-left": { top: 44, left: 48 },
  "top-right": { top: 44, right: 48 },
  "bottom-left": { bottom: 44, left: 48 },
  "bottom-right": { bottom: 44, right: 48 },
};

export const Watermark = ({
  text = ARSIP_BRAND.name,
  position = "top-right",
  opacity = 0.52,
  accentColor = ARSIP_COLORS.bloodRed,
  style,
}: WatermarkProps) => {
  return (
    <div
      style={{
        position: "absolute",
        ...posStyles[position],
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        opacity,
        pointerEvents: "none",
        ...style,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          backgroundColor: accentColor,
        }}
      />
      <span
        style={{
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.2em",
          color: ARSIP_COLORS.archivePaper,
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
};
