import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, pulseBeacon } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type EvidenceMarkerProps = {
  number: string | number;
  label: string;
  annotation?: string;
  xPercent?: number;
  yPercent?: number;
  circleRadius?: number;
  accentColor?: string;
  style?: React.CSSProperties;
};

export const EvidenceMarker = ({
  number,
  label,
  annotation,
  xPercent = 50,
  yPercent = 50,
  circleRadius = 38,
  accentColor = ARSIP_COLORS.bloodRed,
  style,
}: EvidenceMarkerProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 16], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const beacon = pulseBeacon({ frame, durationInFrames, fps });

  return (
    <div
      style={{
        position: "absolute",
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        opacity: enter,
        ...style,
      }}
    >
      {/* Highlight circle */}
      <div
        style={{
          position: "absolute",
          left: -circleRadius,
          top: -circleRadius,
          width: circleRadius * 2,
          height: circleRadius * 2,
          borderRadius: "50%",
          border: `2px solid ${accentColor}`,
          transform: `scale(${0.6 + enter * 0.4})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -circleRadius,
          top: -circleRadius,
          width: circleRadius * 2,
          height: circleRadius * 2,
          borderRadius: "50%",
          border: `1px solid ${accentColor}`,
          transform: `scale(${beacon.scale * 0.75})`,
          opacity: beacon.opacity * 0.5,
        }}
      />

      {/* Number badge */}
      <div
        style={{
          position: "absolute",
          left: -16,
          top: -16,
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: accentColor,
          color: ARSIP_COLORS.archivePaper,
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 15,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
        }}
      >
        {number}
      </div>

      {/* Callout box */}
      <div
        style={{
          position: "absolute",
          left: circleRadius + 14,
          top: -22,
          minWidth: 210,
          backgroundColor: "rgba(17, 17, 17, 0.92)",
          borderLeft: `3px solid ${accentColor}`,
          padding: "8px 12px",
          transform: `translateX(${(1 - enter) * 14}px)`,
        }}
      >
        <div
          style={{
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 14,
            fontWeight: 700,
            color: ARSIP_COLORS.archivePaper,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
        {annotation && (
          <div
            style={{
              fontFamily: ARSIP_FONTS.body,
              fontSize: 15,
              color: ARSIP_COLORS.agedPaper,
              marginTop: 2,
              lineHeight: 1.3,
            }}
          >
            {annotation}
          </div>
        )}
      </div>
    </div>
  );
};
