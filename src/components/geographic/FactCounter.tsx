import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";
import { KineticNumber } from "../typography/KineticNumber";

export type FactCounterProps = {
  value: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  source?: string;
  accentColor?: string;
  width?: number;
  style?: React.CSSProperties;
};

export const FactCounter = ({
  value,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  description,
  source,
  accentColor = ARSIP_COLORS.bloodRed,
  width = 860,
  style,
}: FactCounterProps) => {
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        borderLeft: `6px solid ${accentColor}`,
        backgroundColor: "rgba(17, 17, 17, 0.9)",
        padding: "28px 34px",
        boxSizing: "border-box",
        opacity: reveal,
        translate: `0px ${(1 - reveal) * 20}px`,
        ...style,
      }}
    >
      <KineticNumber
        from={from}
        to={value}
        decimals={decimals}
        prefix={prefix}
        suffix={suffix}
        label={label}
        fontSize={120}
        accentColor={accentColor}
      />

      <div
        style={{
          marginTop: 14,
          fontFamily: ARSIP_FONTS.body,
          fontSize: 25,
          lineHeight: 1.45,
          color: ARSIP_COLORS.archivePaper,
        }}
      >
        {description}
      </div>

      {source && (
        <div
          style={{
            marginTop: 14,
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 15,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: ARSIP_COLORS.mutedGray,
          }}
        >
          SOURCE // {source}
        </div>
      )}
    </div>
  );
};
