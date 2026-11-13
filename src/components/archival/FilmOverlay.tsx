import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { filmFlicker } from "../../motion/presets";
import { ARKANAYA_COLORS, ARKANAYA_FILM_GRAIN, ARKANAYA_TEXTURES } from "../../theme/tokens";
import { hash1D, hash2D } from "../../utils/deterministic";
import { GrainSurface } from "../shared";

export type FilmOverlayProps = {
  grain?: number;
  dust?: number;
  scratches?: number;
  flicker?: number;
  vignette?: number;
  lightLeak?: number;
  lightLeakColor?: string;
  style?: React.CSSProperties;
};

export const FilmOverlay = ({
  grain = ARKANAYA_FILM_GRAIN.standard,
  dust = ARKANAYA_FILM_GRAIN.dustDefault,
  scratches = ARKANAYA_FILM_GRAIN.scratchesDefault,
  flicker = 0.05,
  vignette = ARKANAYA_FILM_GRAIN.vignetteDefault,
  lightLeak = 0.18,
  lightLeakColor = ARKANAYA_COLORS.bloodRed,
  style,
}: FilmOverlayProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();

  const flickerVal =
    flicker > 0
      ? 1 - filmFlicker({ frame, durationInFrames, fps }, { amount: flicker })
      : 0;

  // Deterministic dust motes (changed every 2 frames to mimic 15fps film gate dirt)
  const dirtTick = Math.floor(frame / 2);
  const dustCount = Math.round(dust * 18);
  const dustParticles = Array.from({ length: dustCount }, (_, i) => ({
    x: hash2D(i, dirtTick, 19) * width,
    y: hash2D(i, dirtTick, 47) * height,
    r: 1 + hash1D(i * 3.1 + dirtTick) * 2.2,
    opacity: 0.25 + hash1D(i * 7.7 + dirtTick) * 0.45,
  }));

  // Deterministic vertical film scratches
  const scratchCount = Math.round(scratches * 4);
  const scratchLines = Array.from({ length: scratchCount }, (_, i) => {
    const visible = hash1D(frame * 0.7 + i * 11) > 0.42;
    return {
      visible,
      x: hash2D(i, Math.floor(frame / 3), 83) * width,
      opacity: 0.12 + hash1D(frame + i * 5) * 0.18,
    };
  });

  // Deterministic slow light leak drift
  const leakPulse =
    lightLeak > 0
      ? (0.55 + 0.45 * Math.sin(frame * 0.07)) * lightLeak
      : 0;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Analog grain */}
      {grain > 0 && (
        <GrainSurface
          opacity={grain}
          baseFrequency="0.72"
          seed={(frame % 24) + 1}
        />
      )}

      {/* Dust & scratches */}
      {(dustCount > 0 || scratchCount > 0) && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0 }}
        >
          {dustParticles.map((p, idx) => (
            <circle
              key={`d-${idx}`}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill={ARKANAYA_COLORS.archiveCream}
              fillOpacity={p.opacity}
            />
          ))}
          {scratchLines.map(
            (s, idx) =>
              s.visible && (
                <line
                  key={`s-${idx}`}
                  x1={s.x}
                  y1={0}
                  x2={s.x + (idx % 2 === 0 ? 3 : -2)}
                  y2={height}
                  stroke={ARKANAYA_COLORS.archiveCream}
                  strokeOpacity={s.opacity}
                  strokeWidth={1}
                />
              ),
          )}
        </svg>
      )}

      {/* Warm analog light leak */}
      {leakPulse > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 12% 18%, ${lightLeakColor} 0%, transparent 48%), radial-gradient(circle at 92% 84%, ${ARKANAYA_COLORS.archiveGold} 0%, transparent 42%)`,
            opacity: leakPulse,
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Film flicker */}
      {flickerVal > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: ARKANAYA_COLORS.deepBlack,
            opacity: flickerVal,
          }}
        />
      )}

      {/* Deep analog vignette */}
      {vignette > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: ARKANAYA_TEXTURES.vignetteRadial(vignette),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
