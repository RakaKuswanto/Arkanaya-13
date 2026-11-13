import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE, scaleMotionDuration } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_DURATIONS,
  type ComponentVariant,
  type MotionIntensity,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type QuestionRevealProps = {
  question: string;
  context?: string;
  caseId?: string;
  variant?: ComponentVariant;
  accentColor?: string;
  motionIntensity?: MotionIntensity;
  align?: "left" | "center";
  style?: React.CSSProperties;
};

/**
 * Staggered investigative question reveal highlighting open analytical questions without sensationalism.
 */
export const QuestionReveal = ({
  question,
  context,
  caseId,
  variant = "investigative",
  accentColor = ARKANAYA_COLORS.bloodRed,
  motionIntensity = "editorial",
  align = "left",
  style,
}: QuestionRevealProps) => {
  const frame = useCurrentFrame();
  const dur = scaleMotionDuration(ARKANAYA_DURATIONS.reveal, motionIntensity);
  const lineP = interpolate(frame, [0, dur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textP = interpolate(frame, [6, 6 + dur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const words = question.split(/\s+/).filter(Boolean);

  return (
    <div
      style={{
        backgroundColor:
          variant === "minimal" ? "transparent" : ARKANAYA_COLORS.surfacePanel,
        border: variant === "minimal" ? "none" : ARKANAYA_BORDERS.subtle,
        borderLeft: ARKANAYA_BORDERS.accentLeft(accentColor),
        padding: variant === "minimal" ? "16px 22px" : "28px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        gap: 14,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 15,
          letterSpacing: "0.18em",
          color: ARKANAYA_COLORS.archiveGold,
          textTransform: "uppercase",
          opacity: lineP,
        }}
      >
        {caseId ? `OPEN QUESTION // ${caseId}` : "UNANSWERED QUESTION"}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: align === "center" ? "center" : "flex-start",
          columnGap: "0.26em",
          rowGap: "0.08em",
        }}
      >
        {words.map((w, idx) => {
          const wP = interpolate(
            frame,
            [idx * 2, idx * 2 + 12],
            [0, 1],
            {
              easing: EDITORIAL_EASE,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );
          const isQMark = w.includes("?");
          return (
            <span
              key={`${w}-${idx}`}
              style={{
                fontFamily: ARKANAYA_FONTS.secondary,
                fontSize: 52,
                lineHeight: 1.04,
                letterSpacing: "0.02em",
                color: isQMark ? accentColor : ARKANAYA_COLORS.archiveCream,
                opacity: wP,
                transform: `translateY(${(1 - wP) * 14}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>

      {context && (
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.body,
            fontSize: 21,
            lineHeight: 1.45,
            color: ARKANAYA_COLORS.agedPaper,
            maxWidth: 780,
            opacity: textP,
          }}
        >
          {context}
        </div>
      )}
    </div>
  );
};
