import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, pulseBeacon, scaleMotionDuration } from "../../motion/presets";
import {
  ARKANAYA_COLORS,
  ARKANAYA_DURATIONS,
  type ComponentVariant,
  type MotionIntensity,
  getSafeMargins,
  isLandscapeLayout,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type NarrativePauseProps = {
  statement: string;
  subtext?: string;
  label?: string;
  showPulseDot?: boolean;
  variant?: ComponentVariant;
  accentColor?: string;
  motionIntensity?: MotionIntensity;
  style?: React.CSSProperties;
};

/**
 * Quiet editorial breathing beat separating factual segments or emphasizing an unresolved silence.
 */
export const NarrativePause = ({
  statement,
  subtext,
  label = "ARSIP // HENING",
  showPulseDot = true,
  variant = "cinematic",
  accentColor = ARKANAYA_COLORS.bloodRed,
  motionIntensity = "restrained",
  style,
}: NarrativePauseProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, width, height } = useVideoConfig();
  const margins = getSafeMargins(width, height);
  const landscape = isLandscapeLayout(width, height);

  const enterDur = scaleMotionDuration(ARKANAYA_DURATIONS.reveal, motionIntensity);
  const enter = interpolate(frame, [4, 4 + enterDur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const beacon = pulseBeacon({ frame, durationInFrames, fps }, { periodFrames: 54 });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        paddingLeft: margins.left,
        paddingRight: margins.right,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 22,
        ...style,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 15,
          letterSpacing: "0.22em",
          color:
            variant === "archive"
              ? ARKANAYA_COLORS.archiveGold
              : ARKANAYA_COLORS.ashGrey,
          textTransform: "uppercase",
          opacity: enter,
        }}
      >
        {showPulseDot && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: accentColor,
              transform: `scale(${0.8 + (beacon.scale - 1) * 0.4})`,
              opacity: 0.45 + beacon.opacity * 0.55,
            }}
          />
        )}
        <span>{label}</span>
      </div>

      <div
        style={{
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: landscape ? 40 : 42,
          fontWeight: 500,
          lineHeight: 1.42,
          color: ARKANAYA_COLORS.archiveCream,
          maxWidth: landscape ? 980 : 780,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 14}px)`,
        }}
      >
        {statement}
      </div>

      {subtext && (
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 17,
            letterSpacing: "0.1em",
            color: ARKANAYA_COLORS.ashGrey,
            maxWidth: 680,
            opacity: enter * 0.85,
          }}
        >
          {subtext}
        </div>
      )}
    </AbsoluteFill>
  );
};
