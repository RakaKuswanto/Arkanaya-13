import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  EDITORIAL_EASE,
  SHARP_EXIT_EASE,
  scaleMotionDuration,
} from "../../motion/presets";
import type { AnyVerificationStatus } from "../../theme/dataIntegrity";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_DURATIONS,
  type ComponentVariant,
  type MotionIntensity,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { VerificationBadge } from "../investigation/VerificationBadge";

export type LowerThirdPosition =
  | "inline"
  | "bottom-left"
  | "bottom-right"
  | "top-left";

export type LowerThirdProps = {
  name: string;
  role?: string;
  credential?: string;
  organization?: string;
  verificationStatus?: AnyVerificationStatus;
  variant?: ComponentVariant;
  position?: LowerThirdPosition;
  accentColor?: string;
  motionIntensity?: MotionIntensity;
  exit?: boolean;
  style?: React.CSSProperties;
};

/**
 * Editorial documentary lower-third for speakers, witnesses, archival experts, and source roles.
 */
export const LowerThird = ({
  name,
  role,
  credential,
  organization,
  verificationStatus,
  variant = "investigative",
  position = "inline",
  accentColor = ARKANAYA_COLORS.bloodRed,
  motionIntensity = "editorial",
  exit = false,
  style,
}: LowerThirdProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const enterDur = scaleMotionDuration(ARKANAYA_DURATIONS.enter, motionIntensity);
  const enter = interpolate(frame, [0, enterDur], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitDur = scaleMotionDuration(ARKANAYA_DURATIONS.exit, motionIntensity);
  const exitStart = Math.max(enterDur + 8, durationInFrames - exitDur);
  const exitP = exit
    ? interpolate(
        frame,
        [exitStart, Math.max(exitStart + 1, durationInFrames - 1)],
        [0, 1],
        {
          easing: SHARP_EXIT_EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;

  const isMinimal = variant === "minimal";
  const isArchive = variant === "archive";
  const resolvedAccent = isArchive ? ARKANAYA_COLORS.archiveGold : accentColor;

  const posStyle: React.CSSProperties =
    position === "bottom-left"
      ? { position: "absolute", left: 64, bottom: 160 }
      : position === "bottom-right"
        ? { position: "absolute", right: 64, bottom: 160 }
        : position === "top-left"
          ? { position: "absolute", left: 64, top: 96 }
          : {};

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        backgroundColor: isMinimal
          ? "transparent"
          : isArchive
            ? ARKANAYA_COLORS.archiveCream
            : ARKANAYA_COLORS.surfacePanel,
        border: isMinimal
          ? "none"
          : isArchive
            ? ARKANAYA_BORDERS.paper
            : ARKANAYA_BORDERS.subtle,
        opacity: enter * (1 - exitP),
        transform: `translateX(${(1 - enter) * -28 + exitP * -18}px)`,
        ...posStyle,
        ...style,
      }}
    >
      <div style={{ width: 6, backgroundColor: resolvedAccent, flexShrink: 0 }} />
      <div style={{ padding: isMinimal ? "8px 14px" : "12px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: ARKANAYA_FONTS.secondary,
              fontSize: 32,
              letterSpacing: "0.06em",
              lineHeight: 1.05,
              color: isArchive
                ? ARKANAYA_COLORS.inkBlack
                : ARKANAYA_COLORS.archiveCream,
              textTransform: "uppercase",
            }}
          >
            {name}
          </span>
          {verificationStatus && (
            <VerificationBadge status={verificationStatus} compact />
          )}
        </div>
        {(role || credential || organization) && (
          <div
            style={{
              fontFamily: ARKANAYA_FONTS.mono,
              fontSize: 14,
              color: isArchive
                ? ARKANAYA_COLORS.bloodRed
                : ARKANAYA_COLORS.archiveGold,
              letterSpacing: "0.08em",
              marginTop: 4,
              textTransform: "uppercase",
            }}
          >
            {[role, organization, credential].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
};
