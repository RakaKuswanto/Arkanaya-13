import type React from "react";
import { useId } from "react";

export type GrainSurfaceProps = {
  opacity?: number;
  seed?: number;
  baseFrequency?: string;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
};

/**
 * Deterministic SVG fractal noise overlay with collision-safe ID.
 */
export const GrainSurface = ({
  opacity = 0.14,
  seed = 7,
  baseFrequency = "0.75",
  mixBlendMode = "overlay",
}: GrainSurfaceProps) => {
  const uid = useId().replace(/:/g, "");
  const filterId = `ark-grain-${uid}`;

  if (opacity <= 0) return null;

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        mixBlendMode,
        pointerEvents: "none",
      }}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={2}
          seed={seed}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
};
