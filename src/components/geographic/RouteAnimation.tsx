import { Car, Footprints, Plane } from "lucide-react";
import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";

export type RouteMode = "flight" | "vehicle" | "walking";

export type RoutePoint = {
  x: number;
  y: number;
};

export type RouteAnimationProps = {
  points: readonly RoutePoint[];
  mode?: RouteMode;
  color?: string;
  strokeWidth?: number;
  startFrame?: number;
  durationFrames?: number;
  showMovingIcon?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
};

export const RouteAnimation = ({
  points,
  mode = "flight",
  color = ARSIP_COLORS.bloodRed,
  strokeWidth = 3.5,
  startFrame = 8,
  durationFrames = 64,
  showMovingIcon = true,
  width = 900,
  height = 900,
  style,
}: RouteAnimationProps) => {
  const frame = useCurrentFrame();

  if (points.length < 2) return null;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationFrames)],
    [0, 1],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Compute polyline segments & cumulative lengths
  const segments: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    len: number;
  }> = [];
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const len = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
    segments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, len });
    totalLength += len;
  }

  // Find current head position & angle
  const targetDist = totalLength * progress;
  let acc = 0;
  let headX = points[0].x;
  let headY = points[0].y;
  let angleDeg = 0;

  for (const seg of segments) {
    if (acc + seg.len >= targetDist || seg === segments[segments.length - 1]) {
      const localT = Math.min(1, Math.max(0, (targetDist - acc) / seg.len));
      headX = seg.x1 + (seg.x2 - seg.x1) * localT;
      headY = seg.y1 + (seg.y2 - seg.y1) * localT;
      angleDeg = (Math.atan2(seg.y2 - seg.y1, seg.x2 - seg.x1) * 180) / Math.PI;
      break;
    }
    acc += seg.len;
  }

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const dashPattern =
    mode === "walking" ? "5 9" : mode === "vehicle" ? "12 8" : "10 10";

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        pointerEvents: "none",
        ...style,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Base faint guide */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeOpacity={0.22}
          strokeWidth={strokeWidth}
          strokeDasharray={dashPattern}
        />

        {/* Animated active route */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength * (1 - progress)}
          strokeLinecap="round"
        />
      </svg>

      {showMovingIcon && progress > 0 && (
        <div
          style={{
            position: "absolute",
            left: headX,
            top: headY,
            width: 38,
            height: 38,
            borderRadius: 9999,
            backgroundColor: ARSIP_COLORS.deepBlack,
            border: `2px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(-50%, -50%) rotate(${mode === "flight" ? angleDeg + 45 : 0}deg)`,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6)",
          }}
        >
          {mode === "flight" ? (
            <Plane size={18} color={ARSIP_COLORS.archivePaper} />
          ) : mode === "vehicle" ? (
            <Car size={18} color={ARSIP_COLORS.archivePaper} />
          ) : (
            <Footprints size={18} color={ARSIP_COLORS.archivePaper} />
          )}
        </div>
      )}
    </div>
  );
};
