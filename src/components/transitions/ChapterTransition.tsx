import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, SHARP_EXIT_EASE, scaleMotionDuration } from "../../motion/presets";
import {
  ARKANAYA_COLORS,
  ARKANAYA_DURATIONS,
  type ComponentVariant,
  type MotionIntensity,
  getSafeMargins,
  isLandscapeLayout,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type ChapterTransitionProps = {
  chapterNumber: string | number;
  title: string;
  subtitle?: string;
  variant?: ComponentVariant;
  accentColor?: string;
  motionIntensity?: MotionIntensity;
  duration?: number;
  style?: React.CSSProperties;
};

/**
 * Editorial chapter divider transition combining an obsidian slate wipe with staggered chapter typography.
 */
export const ChapterTransition = ({
  chapterNumber,
  title,
  subtitle,
  variant = "investigative",
  accentColor = ARKANAYA_COLORS.bloodRed,
  motionIntensity = "editorial",
  duration,
  style,
}: ChapterTransitionProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const effectiveDuration = duration ?? durationInFrames;
  const margins = getSafeMargins(width, height);
  const landscape = isLandscapeLayout(width, height);

  const enterDur = scaleMotionDuration(ARKANAYA_DURATIONS.enter, motionIntensity);
  const exitDur = scaleMotionDuration(ARKANAYA_DURATIONS.exit, motionIntensity);

  const enterP = interpolate(frame, [0, enterDur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitStart = Math.max(enterDur + 6, effectiveDuration - exitDur);
  const exitP = interpolate(
    frame,
    [exitStart, Math.max(exitStart + 1, effectiveDuration - 1)],
    [0, 1],
    {
      easing: SHARP_EXIT_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const resolvedAccent =
    variant === "archive"
      ? ARKANAYA_COLORS.archiveGold
      : variant === "urgent"
        ? ARKANAYA_COLORS.bloodRed
        : accentColor;

  const formattedNum = String(chapterNumber).padStart(2, "0");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        paddingLeft: margins.left,
        paddingRight: margins.right,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        opacity: (1 - exitP) * interpolate(enterP, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 18,
          letterSpacing: "0.26em",
          color: resolvedAccent,
          textTransform: "uppercase",
          marginBottom: 14,
          opacity: enterP,
          transform: `translateY(${(1 - enterP) * 14}px)`,
        }}
      >
        CHAPTER // {formattedNum}
      </div>

      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.headline,
            fontSize: landscape ? 96 : 104,
            lineHeight: 0.94,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: ARKANAYA_COLORS.archiveCream,
            transform: `translateY(${(1 - enterP) * 100 - exitP * 100}%)`,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          width: `${enterP * 320}px`,
          height: 3,
          backgroundColor: resolvedAccent,
          marginTop: 22,
          marginBottom: subtitle ? 18 : 0,
        }}
      />

      {subtitle && (
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.body,
            fontSize: landscape ? 24 : 26,
            lineHeight: 1.4,
            color: ARKANAYA_COLORS.ashGrey,
            maxWidth: landscape ? 900 : 740,
            opacity: enterP,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
