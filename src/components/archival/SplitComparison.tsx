import type React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type SplitSide = {
  label: string;
  src?: string;
  caption?: string;
};

export type SplitComparisonProps = {
  left: SplitSide;
  right: SplitSide;
  height?: number;
  accentColor?: string;
  style?: React.CSSProperties;
};

export const SplitComparison = ({
  left,
  right,
  height = 520,
  accentColor = ARSIP_COLORS.bloodRed,
  style,
}: SplitComparisonProps) => {
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [0, 26], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderPanel = (side: SplitSide, alignRight: boolean) => (
    <div
      style={{
        flex: 1,
        height: "100%",
        position: "relative",
        backgroundColor: ARSIP_COLORS.charcoal,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {side.src ? (
        <Img
          src={side.src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(100%) contrast(1.1)",
          }}
        />
      ) : (
        <div
          style={{
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 15,
            color: ARSIP_COLORS.mutedGray,
            letterSpacing: "0.08em",
            textAlign: "center",
            padding: 20,
          }}
        >
          ARCHIVE PLATE
          <br />
          {side.label}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 14,
          left: alignRight ? undefined : 14,
          right: alignRight ? 14 : undefined,
          backgroundColor: alignRight ? accentColor : ARSIP_COLORS.deepBlack,
          color: ARSIP_COLORS.archivePaper,
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 14,
          letterSpacing: "0.12em",
          padding: "5px 10px",
          textTransform: "uppercase",
        }}
      >
        {side.label}
      </div>

      {side.caption && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "28px 16px 14px",
            background:
              "linear-gradient(to top, rgba(8, 8, 8, 0.92), rgba(8, 8, 8, 0))",
            fontFamily: ARSIP_FONTS.body,
            fontSize: 19,
            lineHeight: 1.35,
            color: ARSIP_COLORS.archivePaper,
          }}
        >
          {side.caption}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        height,
        border: "1px solid rgba(232, 228, 220, 0.2)",
        display: "flex",
        overflow: "hidden",
        opacity: interpolate(reveal, [0, 0.3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        ...style,
      }}
    >
      {renderPanel(left, false)}
      <div
        style={{
          width: 3,
          backgroundColor: accentColor,
          transform: `scaleY(${reveal})`,
          transformOrigin: "top center",
        }}
      />
      {renderPanel(right, true)}
    </div>
  );
};
