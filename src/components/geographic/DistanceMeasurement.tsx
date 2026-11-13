import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARKANAYA_BORDERS, ARKANAYA_COLORS } from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type DistanceMeasurementProps = {
  fromLabel: string;
  toLabel: string;
  distanceLabel: string;
  note?: string;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Editorial distance vector readout connecting two caller-supplied locations without fabricating spatial data.
 */
export const DistanceMeasurement = ({
  fromLabel,
  toLabel,
  distanceLabel,
  note,
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: DistanceMeasurementProps) => {
  const frame = useCurrentFrame();
  const lineP = interpolate(frame, [0, 24], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        backgroundColor: ARKANAYA_COLORS.surfacePanel,
        border: ARKANAYA_BORDERS.subtle,
        padding: "20px 24px",
        opacity: interpolate(lineP, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 15,
          color: ARKANAYA_COLORS.archiveCream,
          marginBottom: 14,
        }}
      >
        <span>A // {fromLabel}</span>
        <span style={{ color: ARKANAYA_COLORS.archiveGold, fontWeight: 700 }}>
          {distanceLabel}
        </span>
        <span>B // {toLabel}</span>
      </div>

      <div
        style={{
          position: "relative",
          height: 24,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: ARKANAYA_COLORS.archiveGold,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            flex: 1,
            height: 2,
            backgroundColor: ARKANAYA_COLORS.borderSubtle,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${lineP * 100}%`,
              height: "100%",
              backgroundColor: accentColor,
            }}
          />
        </div>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: accentColor,
            flexShrink: 0,
          }}
        />
      </div>

      {note && (
        <div
          style={{
            marginTop: 10,
            fontFamily: ARKANAYA_FONTS.body,
            fontSize: 18,
            color: ARKANAYA_COLORS.agedPaper,
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
};
