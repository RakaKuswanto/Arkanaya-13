import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type GeoCoordinates = {
  lat: number;
  lng: number;
};

export type LocationMarkerProps = {
  city: string;
  country?: string;
  coordinates: GeoCoordinates;
  color?: string;
  showCrosshair?: boolean;
  pulse?: boolean;
  delayFrames?: number;
  align?: "left" | "right";
  style?: React.CSSProperties;
};

const formatCoord = (val: number, posLabel: string, negLabel: string): string => {
  const dir = val >= 0 ? posLabel : negLabel;
  return `${Math.abs(val).toFixed(4)}° ${dir}`;
};

export const LocationMarker = ({
  city,
  country,
  coordinates,
  color = ARSIP_COLORS.bloodRed,
  showCrosshair = true,
  pulse = true,
  delayFrames = 0,
  align = "left",
  style,
}: LocationMarkerProps) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - delayFrames);

  const reveal = interpolate(localFrame, [0, 14], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulseCycle = (localFrame % 36) / 36;
  const ringScale = pulse ? 1 + pulseCycle * 1.8 : 1;
  const ringOpacity = pulse ? (1 - pulseCycle) * 0.65 : 0;

  const coordText = `${formatCoord(coordinates.lat, "N", "S")} · ${formatCoord(coordinates.lng, "E", "W")}`;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        flexDirection: align === "right" ? "row-reverse" : "row",
        gap: 14,
        opacity: reveal,
        ...style,
      }}
    >
      {/* Pin + optional crosshair + pulse */}
      <div
        style={{
          position: "relative",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {showCrosshair && (
          <svg
            width={36}
            height={36}
            viewBox="0 0 36 36"
            style={{ position: "absolute", inset: 0 }}
          >
            <line
              x1={18}
              y1={0}
              x2={18}
              y2={36}
              stroke={color}
              strokeOpacity={0.55}
              strokeWidth={1}
            />
            <line
              x1={0}
              y1={18}
              x2={36}
              y2={18}
              stroke={color}
              strokeOpacity={0.55}
              strokeWidth={1}
            />
            <circle
              cx={18}
              cy={18}
              r={13}
              fill="none"
              stroke={color}
              strokeOpacity={0.45}
              strokeWidth={1}
            />
          </svg>
        )}

        {pulse && (
          <div
            style={{
              position: "absolute",
              width: 14,
              height: 14,
              borderRadius: 9999,
              border: `2px solid ${color}`,
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
        )}

        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 9999,
            backgroundColor: color,
            border: `2px solid ${ARSIP_COLORS.archivePaper}`,
          }}
        />
      </div>

      {/* Label box */}
      <div
        style={{
          backgroundColor: "rgba(8, 8, 8, 0.88)",
          borderLeft: align === "left" ? `3px solid ${color}` : undefined,
          borderRight: align === "right" ? `3px solid ${color}` : undefined,
          padding: "8px 14px",
          textAlign: align,
        }}
      >
        <div
          style={{
            fontFamily: ARSIP_FONTS.secondary,
            fontSize: 28,
            lineHeight: 0.96,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: ARSIP_COLORS.archivePaper,
            whiteSpace: "nowrap",
          }}
        >
          {city}
          {country ? `, ${country}` : ""}
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 13,
            letterSpacing: "0.1em",
            color: ARSIP_COLORS.archiveGold,
            whiteSpace: "nowrap",
          }}
        >
          {coordText}
        </div>
      </div>
    </div>
  );
};
