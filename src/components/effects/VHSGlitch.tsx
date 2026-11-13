import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { glitchInterruption } from "../../motion/presets";
import { hash1D, signedHash } from "../../utils/deterministic";

export type VHSGlitchProps = {
  children?: React.ReactNode;
  intensity?: number;
  seed?: number;
  scanlineOpacity?: number;
  style?: React.CSSProperties;
};

export const VHSGlitch = ({
  children,
  intensity = 0.55,
  seed = 17,
  scanlineOpacity = 0.22,
  style,
}: VHSGlitchProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, height } = useVideoConfig();

  const glitch = glitchInterruption(
    { frame, durationInFrames, fps },
    { intensity, seed },
  );

  // Deterministic tracking noise band
  const bandY = ((frame * 11 + seed * 37) % (height + 160)) - 80;
  const bandHeight = 28 + Math.round(hash1D(frame * 2.1 + seed) * 36);
  const trackingAlpha = glitch.active ? 0.38 * intensity : 0.08 * intensity;

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", ...style }}>
      {/* Optional wrapped content with horizontal jitter */}
      {children && (
        <AbsoluteFill
          style={{
            transform: `translateX(${glitch.offsetX}px)`,
            filter: glitch.active
              ? `drop-shadow(${glitch.rgbSplit}px 0 0 rgba(169, 35, 43, 0.75)) drop-shadow(${-glitch.rgbSplit}px 0 0 rgba(165, 140, 80, 0.65))`
              : undefined,
          }}
        >
          {children}
        </AbsoluteFill>
      )}

      {/* Chromatic tracking bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: bandY,
          height: bandHeight,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(232, 228, 220, 0.28) 45%, rgba(169, 35, 43, 0.35) 55%, transparent 100%)",
          opacity: trackingAlpha,
          transform: `translateX(${signedHash(frame * 9.3) * 20 * intensity}px)`,
        }}
      />

      {/* Horizontal CRT scanlines */}
      {scanlineOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(8,8,8,0) 0px, rgba(8,8,8,0) 3px, rgba(8,8,8,0.45) 4px)",
            opacity: scanlineOpacity,
          }}
        />
      )}

      {/* Brief horizontal tear line */}
      {glitch.active && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${(hash1D(frame * 5.7 + seed) * 76 + 12).toFixed(1)}%`,
            height: 6,
            backgroundColor: "rgba(232, 228, 220, 0.55)",
            transform: `translateX(${glitch.sliceShift}px)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
