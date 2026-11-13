import type React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, scaleMotionDuration } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
  type MotionIntensity,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { MediaFallbackPlate } from "../shared";

export type EvidenceZoomProps = {
  src?: string;
  calloutLabel: string;
  calloutDetail?: string;
  focalPoint?: { xPercent: number; yPercent: number };
  zoomFrom?: number;
  zoomTo?: number;
  lensShape?: "circle" | "rect";
  height?: number;
  accentColor?: string;
  motionIntensity?: MotionIntensity;
  style?: React.CSSProperties;
};

/**
 * Forensic evidence zoom magnifying a specified focal area of an archival photo or plate.
 */
export const EvidenceZoom = ({
  src,
  calloutLabel,
  calloutDetail,
  focalPoint = { xPercent: 52, yPercent: 48 },
  zoomFrom = 1.0,
  zoomTo = 2.15,
  lensShape = "circle",
  height = 460,
  accentColor = ARKANAYA_COLORS.bloodRed,
  motionIntensity = "editorial",
  style,
}: EvidenceZoomProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const dur = Math.min(
    durationInFrames - 1,
    scaleMotionDuration(Math.max(24, Math.round(durationInFrames * 0.6)), motionIntensity),
  );

  const zoomP = interpolate(frame, [0, Math.max(1, dur)], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentScale = zoomFrom + (zoomTo - zoomFrom) * zoomP;

  return (
    <div
      style={{
        position: "relative",
        height,
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        border: ARKANAYA_BORDERS.subtle,
        boxShadow: ARKANAYA_SHADOWS.panel,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${focalPoint.xPercent}% ${focalPoint.yPercent}%`,
          transform: `scale(${currentScale})`,
        }}
      >
        {src ? (
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(1) contrast(1.16)",
            }}
          />
        ) : (
          <MediaFallbackPlate
            label="EVIDENCE DETAIL PLATE"
            sublabel="FORENSIC ZOOM INSPECTION"
          />
        )}
      </div>

      {/* Lens target */}
      <div
        style={{
          position: "absolute",
          left: `${focalPoint.xPercent}%`,
          top: `${focalPoint.yPercent}%`,
          width: 112,
          height: 112,
          transform: "translate(-50%, -50%)",
          borderRadius: lensShape === "circle" ? "50%" : 4,
          border: `3px solid ${accentColor}`,
          boxShadow: "0 0 0 9999px rgba(10, 11, 13, 0.42)",
          pointerEvents: "none",
        }}
      />

      {/* Callout caption */}
      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          backgroundColor: ARKANAYA_COLORS.surfacePanel,
          borderLeft: ARKANAYA_BORDERS.accentLeft(accentColor),
          padding: "10px 16px",
          maxWidth: 480,
        }}
      >
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 15,
            fontWeight: 700,
            color: ARKANAYA_COLORS.archiveCream,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {calloutLabel} · {currentScale.toFixed(2)}X
        </div>
        {calloutDetail && (
          <div
            style={{
              fontFamily: ARKANAYA_FONTS.body,
              fontSize: 17,
              color: ARKANAYA_COLORS.agedPaper,
              marginTop: 4,
              lineHeight: 1.35,
            }}
          >
            {calloutDetail}
          </div>
        )}
      </div>
    </div>
  );
};
