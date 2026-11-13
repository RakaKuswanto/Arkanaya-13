import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { archivalPan, slowZoomIn, slowZoomOut } from "../../motion/presets";

export type KenBurnsMode =
  | "zoomIn"
  | "zoomOut"
  | "panLeft"
  | "panRight"
  | "panUp"
  | "panDown";

export type KenBurnsProps = {
  children: React.ReactNode;
  mode?: KenBurnsMode;
  focalPoint?: { x: number; y: number };
  zoomFrom?: number;
  zoomTo?: number;
  panDistance?: number;
  duration?: number;
  style?: React.CSSProperties;
};

export const KenBurns = ({
  children,
  mode = "zoomIn",
  focalPoint = { x: 50, y: 50 },
  zoomFrom = 1,
  zoomTo = 1.14,
  panDistance = 36,
  duration,
  style,
}: KenBurnsProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const effectiveDuration = duration ?? durationInFrames;
  const ctx = { frame, durationInFrames: effectiveDuration, fps };

  const scale =
    mode === "zoomOut"
      ? slowZoomOut(ctx, { from: zoomTo, to: zoomFrom })
      : mode === "zoomIn"
        ? slowZoomIn(ctx, { from: zoomFrom, to: zoomTo })
        : Math.max(1.06, zoomFrom + 0.06);

  const panRange =
    mode === "panLeft"
      ? { xFrom: panDistance * 0.5, xTo: -panDistance * 0.5, yFrom: 0, yTo: 0 }
      : mode === "panRight"
        ? { xFrom: -panDistance * 0.5, xTo: panDistance * 0.5, yFrom: 0, yTo: 0 }
        : mode === "panUp"
          ? { xFrom: 0, xTo: 0, yFrom: panDistance * 0.5, yTo: -panDistance * 0.5 }
          : mode === "panDown"
            ? { xFrom: 0, xTo: 0, yFrom: -panDistance * 0.5, yTo: panDistance * 0.5 }
            : { xFrom: 0, xTo: 0, yFrom: 0, yTo: 0 };

  const offset = archivalPan(ctx, panRange);

  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: `${focalPoint.x}% ${focalPoint.y}%`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
