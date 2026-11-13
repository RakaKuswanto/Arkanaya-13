import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { stampImpact } from "../../motion/presets";
import { ARKANAYA_COLORS } from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { GrainSurface } from "../shared";

export type CaseStampPreset =
  | "CONFIDENTIAL"
  | "CLASSIFIED"
  | "EVIDENCE"
  | "UNSOLVED"
  | "DECLASSIFIED"
  | "ARCHIVED"
  | "CASE CLOSED";

export type CaseStampProps = {
  text?: CaseStampPreset | (string & {});
  color?: string;
  rotation?: number;
  opacity?: number;
  textured?: boolean;
  animated?: boolean;
  delayFrames?: number;
  fontSize?: number;
  subtext?: string;
  style?: React.CSSProperties;
};

export const CaseStamp = ({
  text = "UNSOLVED",
  color = ARKANAYA_COLORS.bloodRed,
  rotation = -12,
  opacity = 0.88,
  textured = true,
  animated = true,
  delayFrames = 6,
  fontSize = 54,
  subtext,
  style,
}: CaseStampProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const anim = animated
    ? stampImpact({ frame, durationInFrames, fps }, { delay: delayFrames })
    : { scale: 1, opacity: 1, shakeX: 0, shakeY: 0 };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 26px",
        border: `5px solid ${color}`,
        outline: `2px solid ${color}`,
        outlineOffset: 4,
        borderRadius: 4,
        color,
        opacity: opacity * anim.opacity,
        transform: `translate(${anim.shakeX}px, ${anim.shakeY}px) rotate(${rotation}deg) scale(${anim.scale})`,
        transformOrigin: "center center",
        userSelect: "none",
        ...style,
      }}
    >
      {textured && (
        <GrainSurface
          opacity={0.28}
          baseFrequency="0.65"
          seed={17}
          mixBlendMode="multiply"
        />
      )}

      <div
        style={{
          position: "relative",
          fontFamily: ARKANAYA_FONTS.headline,
          fontSize,
          lineHeight: 0.95,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>

      {subtext && (
        <div
          style={{
            position: "relative",
            marginTop: 6,
            paddingTop: 4,
            borderTop: `2px solid ${color}`,
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: Math.max(13, Math.round(fontSize * 0.28)),
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};
