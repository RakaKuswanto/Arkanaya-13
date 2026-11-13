import type React from "react";
import { useId } from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, scaleMotionDuration } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_DURATIONS,
  ARKANAYA_SHADOWS,
  type MotionIntensity,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import type { GeoCoordinates } from "./LocationMarker";

export type MapZoomTransitionProps = {
  mapSrc?: string;
  targetLabel: string;
  coordinates?: GeoCoordinates;
  focalPoint?: { xPercent: number; yPercent: number };
  fromZoom?: number;
  toZoom?: number;
  width?: number;
  height?: number;
  accentColor?: string;
  motionIntensity?: MotionIntensity;
  style?: React.CSSProperties;
};

/**
 * Deterministic map zoom-in/out transition over a supplied map asset or tactical graticule.
 */
export const MapZoomTransition = ({
  mapSrc,
  targetLabel,
  coordinates,
  focalPoint = { xPercent: 52, yPercent: 48 },
  fromZoom = 1.0,
  toZoom = 1.85,
  width = 896,
  height = 560,
  accentColor = ARKANAYA_COLORS.bloodRed,
  motionIntensity = "editorial",
  style,
}: MapZoomTransitionProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const gridId = `mzt-grid-${uid}`;

  const dur = Math.min(
    durationInFrames - 1,
    scaleMotionDuration(Math.max(36, Math.round(durationInFrames * 0.72)), motionIntensity),
  );
  const zoomP = interpolate(frame, [0, Math.max(1, dur)], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentZoom = fromZoom + (toZoom - fromZoom) * zoomP;

  const badgeIn = interpolate(
    frame,
    [Math.round(dur * 0.35), Math.round(dur * 0.35) + ARKANAYA_DURATIONS.enter],
    [0, 1],
    { easing: EDITORIAL_EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        border: ARKANAYA_BORDERS.subtle,
        boxShadow: ARKANAYA_SHADOWS.panel,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${focalPoint.xPercent}% ${focalPoint.yPercent}%`,
          transform: `scale(${currentZoom})`,
        }}
      >
        {mapSrc ? (
          <Img
            src={mapSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(0.85) contrast(1.15) brightness(0.8)",
            }}
          />
        ) : (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <pattern id={gridId} width="56" height="56" patternUnits="userSpaceOnUse">
                <path
                  d="M 56 0 L 0 0 0 56"
                  fill="none"
                  stroke={ARKANAYA_COLORS.archiveCream}
                  strokeOpacity={0.09}
                  strokeWidth={1}
                />
              </pattern>
            </defs>
            <rect width={width} height={height} fill={`url(#${gridId})`} />
            <circle
              cx={(focalPoint.xPercent / 100) * width}
              cy={(focalPoint.yPercent / 100) * height}
              r={120}
              fill="none"
              stroke={ARKANAYA_COLORS.archiveGold}
              strokeOpacity={0.28}
              strokeDasharray="6 6"
            />
          </svg>
        )}
      </div>

      {/* Reticle */}
      <div
        style={{
          position: "absolute",
          left: `${focalPoint.xPercent}%`,
          top: `${focalPoint.yPercent}%`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: `2px solid ${accentColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>

      {/* HUD Label */}
      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          backgroundColor: ARKANAYA_COLORS.surfacePanel,
          borderLeft: ARKANAYA_BORDERS.accentLeft(accentColor),
          padding: "10px 16px",
          opacity: badgeIn,
        }}
      >
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.secondary,
            fontSize: 30,
            color: ARKANAYA_COLORS.archiveCream,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {targetLabel}
        </div>
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 13,
            color: ARKANAYA_COLORS.archiveGold,
            marginTop: 2,
          }}
        >
          ZOOM {currentZoom.toFixed(2)}X
          {coordinates
            ? ` · ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
            : ""}
        </div>
      </div>
    </div>
  );
};
