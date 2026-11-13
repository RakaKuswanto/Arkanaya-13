import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";
import { hash1D } from "../../utils/deterministic";

export type AudioWaveformProps = {
  label?: string;
  speaker?: string;
  transcript?: string;
  barCount?: number;
  accentColor?: string;
  height?: number;
  style?: React.CSSProperties;
};

export const AudioWaveform = ({
  label = "INTERCEPTED TAPE // ARCHIVE AUDIO",
  speaker,
  transcript,
  barCount = 36,
  accentColor = ARSIP_COLORS.bloodRed,
  height = 110,
  style,
}: AudioWaveformProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 14], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const seconds = Math.floor(frame / fps);
  const remFrames = frame % fps;
  const tc = `00:${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}:${String(remFrames).padStart(2, "0")}`;

  return (
    <div
      style={{
        border: "1px solid rgba(232, 228, 220, 0.18)",
        backgroundColor: ARSIP_COLORS.charcoal,
        padding: "22px 26px",
        opacity: enter,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 15,
          letterSpacing: "0.1em",
          color: ARSIP_COLORS.archiveGold,
          marginBottom: 16,
        }}
      >
        <span>● {label}</span>
        <span style={{ color: ARSIP_COLORS.mutedGray }}>{tc}</span>
      </div>

      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 5,
          padding: "8px 0",
        }}
      >
        {Array.from({ length: barCount }).map((_, i) => {
          const base = hash1D(i * 3.7 + 1.3);
          const wave = Math.abs(Math.sin(frame * 0.24 + i * 0.45));
          const level = 0.16 + base * 0.38 + wave * 0.46;
          const barHeight = Math.max(8, Math.round(level * height));
          const isPeak = level > 0.72;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: barHeight,
                backgroundColor: isPeak ? accentColor : ARSIP_COLORS.archivePaper,
                opacity: isPeak ? 0.95 : 0.72,
              }}
            />
          );
        })}
      </div>

      {(speaker || transcript) && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid rgba(232, 228, 220, 0.14)",
          }}
        >
          {speaker && (
            <div
              style={{
                fontFamily: ARSIP_FONTS.mono,
                fontSize: 14,
                letterSpacing: "0.1em",
                color: accentColor,
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              {speaker}
            </div>
          )}
          {transcript && (
            <div
              style={{
                fontFamily: ARSIP_FONTS.body,
                fontSize: 24,
                lineHeight: 1.4,
                color: ARSIP_COLORS.archivePaper,
              }}
            >
              “{transcript}”
            </div>
          )}
        </div>
      )}
    </div>
  );
};
