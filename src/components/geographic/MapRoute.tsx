import type React from "react";
import { useId } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { archivalPan, slowZoomIn } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { type GeoCoordinates, LocationMarker } from "./LocationMarker";
import { RouteAnimation, type RouteMode } from "./RouteAnimation";

export type MapWaypoint = {
  id: string;
  city: string;
  country?: string;
  coordinates: GeoCoordinates;
  /** Position on map canvas (0-100) */
  xPercent: number;
  /** Position on map canvas (0-100) */
  yPercent: number;
  align?: "left" | "right";
};

export type MapRouteProps = {
  waypoints: readonly MapWaypoint[];
  mode?: RouteMode;
  routeColor?: string;
  mapTitle?: string;
  width?: number;
  height?: number;
  cameraMove?: boolean;
  style?: React.CSSProperties;
};

export const MapRoute = ({
  waypoints,
  mode = "flight",
  routeColor = ARKANAYA_COLORS.bloodRed,
  mapTitle = "SECTOR MAP // ARCHIVE ROUTE",
  width = 900,
  height = 960,
  cameraMove = true,
  style,
}: MapRouteProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const uid = useId().replace(/:/g, "");
  const graticuleId = `map-graticule-${uid}`;
  const vignetteId = `map-vignette-${uid}`;

  const scale = cameraMove
    ? slowZoomIn({ frame, durationInFrames, fps }, { from: 1, to: 1.07 })
    : 1;
  const pan = cameraMove
    ? archivalPan(
        { frame, durationInFrames, fps },
        { xFrom: 8, xTo: -10, yFrom: 8, yTo: -8 },
      )
    : { x: 0, y: 0 };

  const routePoints = waypoints.map((w) => ({
    x: (w.xPercent / 100) * width,
    y: (w.yPercent / 100) * height,
  }));

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        border: ARKANAYA_BORDERS.subtle,
        overflow: "hidden",
        boxShadow: ARKANAYA_SHADOWS.panel,
        ...style,
      }}
    >
      {/* Moving map layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Topographic / Graticule dark vintage grid */}
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <pattern
              id={graticuleId}
              width="75"
              height="75"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 75 0 L 0 0 0 75"
                fill="none"
                stroke={ARKANAYA_COLORS.archiveCream}
                strokeOpacity={0.07}
                strokeWidth="1"
              />
            </pattern>
            <radialGradient id={vignetteId} cx="50%" cy="50%" r="70%">
              <stop offset="45%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(10, 11, 13, 0.85)" />
            </radialGradient>
          </defs>
          <rect width={width} height={height} fill={`url(#${graticuleId})`} />

          {/* Subtle vintage contour rings */}
          <g
            fill="none"
            stroke={ARKANAYA_COLORS.archiveGold}
            strokeOpacity={0.12}
            strokeWidth={1}
          >
            <ellipse cx={width * 0.45} cy={height * 0.48} rx={320} ry={220} />
            <ellipse cx={width * 0.45} cy={height * 0.48} rx={230} ry={155} />
            <ellipse cx={width * 0.45} cy={height * 0.48} rx={140} ry={95} />
          </g>

          <rect width={width} height={height} fill={`url(#${vignetteId})`} />
        </svg>

        {/* Animated route path */}
        <RouteAnimation
          points={routePoints}
          mode={mode}
          color={routeColor}
          width={width}
          height={height}
          startFrame={10}
          durationFrames={Math.max(36, Math.round(durationInFrames * 0.65))}
        />

        {/* Supplied Location Markers */}
        {waypoints.map((wp, idx) => {
          const resolvedAlign = wp.align ?? (wp.xPercent > 60 ? "right" : "left");
          return (
            <div
              key={wp.id}
              style={{
                position: "absolute",
                left: (wp.xPercent / 100) * width - 18,
                top: (wp.yPercent / 100) * height - 18,
                transform:
                  resolvedAlign === "right"
                    ? "translateX(calc(-100% + 36px))"
                    : undefined,
              }}
            >
              <LocationMarker
                city={wp.city}
                country={wp.country}
                coordinates={wp.coordinates}
                color={routeColor}
                align={resolvedAlign}
                delayFrames={idx * 16}
              />
            </div>
          );
        })}
      </div>

      {/* Top tactical header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "14px 20px",
          backgroundColor: "rgba(8, 8, 8, 0.84)",
          borderBottom: ARKANAYA_BORDERS.subtle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 15,
          letterSpacing: "0.14em",
          color: ARKANAYA_COLORS.archiveGold,
        }}
      >
        <span>{mapTitle}</span>
        <span style={{ color: routeColor }}>MODE: {mode.toUpperCase()}</span>
      </div>
    </div>
  );
};
