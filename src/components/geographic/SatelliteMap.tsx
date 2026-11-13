import type React from "react";
import { useId } from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
  ARKANAYA_TEXTURES,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { MediaFallbackPlate } from "../shared";
import type { GeoCoordinates } from "./LocationMarker";

export type SatellitePin = {
  id: string;
  label: string;
  xPercent: number;
  yPercent: number;
};

export type SatelliteMapProps = {
  mapSrc?: string;
  sectorTitle?: string;
  scaleLabel?: string;
  coordinates?: GeoCoordinates;
  pins?: readonly SatellitePin[];
  width?: number;
  height?: number;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Reconnaissance map frame rendering a supplied satellite/topographic image with tactical grid and markers.
 */
export const SatelliteMap = ({
  mapSrc,
  sectorTitle = "SATELLITE RECON // SECTOR PLATE",
  scaleLabel = "SCALE // AS SUPPLIED",
  coordinates,
  pins = [],
  width = 896,
  height = 560,
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: SatelliteMapProps) => {
  const frame = useCurrentFrame();
  const uid = useId().replace(/:/g, "");
  const gridId = `sat-grid-${uid}`;

  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scanY = (frame * 5) % (height + 80) - 40;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        border: ARKANAYA_BORDERS.subtle,
        boxShadow: ARKANAYA_SHADOWS.panel,
        overflow: "hidden",
        opacity: enter,
        ...style,
      }}
    >
      {mapSrc ? (
        <Img
          src={mapSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(0.7) contrast(1.18) brightness(0.76)",
          }}
        />
      ) : (
        <MediaFallbackPlate
          label="SATELLITE IMAGERY NOT SUPPLIED"
          sublabel="PROVIDE VERIFIED MAPSRC ASSET"
        />
      )}

      {/* Telemetry grid */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <pattern id={gridId} width="64" height="64" patternUnits="userSpaceOnUse">
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke={ARKANAYA_COLORS.archiveGold}
              strokeOpacity={0.14}
              strokeWidth={1}
            />
          </pattern>
        </defs>
        <rect width={width} height={height} fill={`url(#${gridId})`} />
      </svg>

      {/* Subtle sweep line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          backgroundColor: accentColor,
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: ARKANAYA_TEXTURES.vignetteRadial(0.45),
          pointerEvents: "none",
        }}
      />

      {/* Pins */}
      {pins.map((pin) => (
        <div
          key={pin.id}
          style={{
            position: "absolute",
            left: `${pin.xPercent}%`,
            top: `${pin.yPercent}%`,
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: accentColor,
              border: `2px solid ${ARKANAYA_COLORS.archiveCream}`,
            }}
          />
          <span
            style={{
              fontFamily: ARKANAYA_FONTS.mono,
              fontSize: 12,
              backgroundColor: ARKANAYA_COLORS.surfacePanel,
              color: ARKANAYA_COLORS.archiveCream,
              padding: "2px 6px",
              border: ARKANAYA_BORDERS.subtle,
              whiteSpace: "nowrap",
            }}
          >
            {pin.label}
          </span>
        </div>
      ))}

      {/* Top HUD */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "10px 16px",
          backgroundColor: ARKANAYA_COLORS.surfacePanel,
          borderBottom: ARKANAYA_BORDERS.subtle,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 13,
          color: ARKANAYA_COLORS.archiveGold,
          letterSpacing: "0.1em",
        }}
      >
        <span>{sectorTitle}</span>
        <span>
          {coordinates
            ? `${coordinates.lat.toFixed(4)}°, ${coordinates.lng.toFixed(4)}°`
            : scaleLabel}
        </span>
      </div>
    </div>
  );
};
