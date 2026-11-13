import type React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { slowZoomIn, subtleParallax } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";

export type PhotoParallaxProps = {
  backgroundSrc?: string;
  foregroundSrc?: string;
  depth?: number;
  children?: React.ReactNode;
  height?: number;
  style?: React.CSSProperties;
};

export const PhotoParallax = ({
  backgroundSrc,
  foregroundSrc,
  depth = 1.2,
  children,
  height = 460,
  style,
}: PhotoParallaxProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const ctx = { frame, durationInFrames, fps };

  const bgY = subtleParallax(ctx, { depth: depth * 0.6, rangePx: 26 });
  const fgY = subtleParallax(ctx, { depth: depth * 1.4, rangePx: 32 });
  const zoom = slowZoomIn(ctx, { from: 1.02, to: 1.08 });

  return (
    <div
      style={{
        position: "relative",
        height,
        overflow: "hidden",
        backgroundColor: ARSIP_COLORS.obsidian,
        border: "1px solid rgba(232, 228, 220, 0.16)",
        ...style,
      }}
    >
      <AbsoluteFill
        style={{
          transform: `translateY(${bgY}px) scale(${zoom})`,
        }}
      >
        {backgroundSrc ? (
          <Img
            src={backgroundSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%) contrast(1.1) brightness(0.7)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(circle at 50% 45%, #24211D 0%, #0D0D0E 78%)",
            }}
          />
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          transform: `translateY(${fgY}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {foregroundSrc && (
          <Img
            src={foregroundSrc}
            style={{
              maxWidth: "85%",
              maxHeight: "85%",
              objectFit: "contain",
              filter: "drop-shadow(0 18px 28px rgba(0, 0, 0, 0.75))",
            }}
          />
        )}
        {children}
      </AbsoluteFill>
    </div>
  );
};
