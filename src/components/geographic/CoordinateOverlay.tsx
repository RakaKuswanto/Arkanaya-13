import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARKANAYA_BORDERS, ARKANAYA_COLORS } from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type CoordinateOverlayProps = {
  lat: number;
  lng: number;
  sectorLabel?: string;
  elevationMeters?: number;
  bearingDeg?: number;
  position?: "inline" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  accentColor?: string;
  style?: React.CSSProperties;
};

const fmtCoord = (v: number, pos: string, neg: string) =>
  `${Math.abs(v).toFixed(5)}° ${v >= 0 ? pos : neg}`;

/**
 * Editorial GPS coordinate telemetry strip for map or evidence frames.
 */
export const CoordinateOverlay = ({
  lat,
  lng,
  sectorLabel = "GEO TELEMETRY",
  elevationMeters,
  bearingDeg,
  position = "inline",
  accentColor = ARKANAYA_COLORS.archiveGold,
  style,
}: CoordinateOverlayProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const posStyle: React.CSSProperties =
    position === "top-left"
      ? { position: "absolute", top: 24, left: 24 }
      : position === "top-right"
        ? { position: "absolute", top: 24, right: 24 }
        : position === "bottom-left"
          ? { position: "absolute", bottom: 24, left: 24 }
          : position === "bottom-right"
            ? { position: "absolute", bottom: 24, right: 24 }
            : {};

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 4,
        backgroundColor: ARKANAYA_COLORS.surfacePanel,
        border: ARKANAYA_BORDERS.subtle,
        borderLeft: ARKANAYA_BORDERS.accentLeft(accentColor),
        padding: "10px 16px",
        fontFamily: ARKANAYA_FONTS.mono,
        opacity: enter,
        ...posStyle,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.14em",
          color: accentColor,
          textTransform: "uppercase",
        }}
      >
        {sectorLabel}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: ARKANAYA_COLORS.archiveCream,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {fmtCoord(lat, "N", "S")} · {fmtCoord(lng, "E", "W")}
      </div>
      {(elevationMeters !== undefined || bearingDeg !== undefined) && (
        <div
          style={{
            fontSize: 12,
            color: ARKANAYA_COLORS.ashGrey,
            letterSpacing: "0.1em",
          }}
        >
          {[
            elevationMeters !== undefined ? `ELEV ${elevationMeters}M` : null,
            bearingDeg !== undefined ? `BRG ${bearingDeg}°` : null,
          ]
            .filter(Boolean)
            .join(" // ")}
        </div>
      )}
    </div>
  );
};
