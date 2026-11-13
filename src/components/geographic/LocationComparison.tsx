import type React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
  isLandscapeLayout,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { MediaFallbackPlate } from "../shared";

export type LocationPanelItem = {
  title: string;
  dateLabel?: string;
  coordinatesLabel?: string;
  notes?: string;
  imageSrc?: string;
};

export type LocationComparisonProps = {
  left: LocationPanelItem;
  right: LocationPanelItem;
  relationLabel?: string;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Two-location investigative comparison adapting automatically between 9:16 stacked and 16:9 side-by-side layouts.
 */
export const LocationComparison = ({
  left,
  right,
  relationLabel = "LOCATION COMPARISON",
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: LocationComparisonProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const landscape = isLandscapeLayout(width, height);

  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderPanel = (item: LocationPanelItem, tag: string, highlight: boolean) => (
    <div
      style={{
        flex: 1,
        backgroundColor: ARKANAYA_COLORS.surfacePanel,
        border: ARKANAYA_BORDERS.subtle,
        borderTop: `3px solid ${highlight ? accentColor : ARKANAYA_COLORS.archiveGold}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ height: landscape ? 240 : 190, position: "relative", overflow: "hidden" }}>
        {item.imageSrc ? (
          <Img
            src={item.imageSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(0.9) contrast(1.12)",
            }}
          />
        ) : (
          <MediaFallbackPlate
            label={`${tag} // PLATE`}
            sublabel={item.coordinatesLabel ?? "SUPPLIED SITE"}
          />
        )}
      </div>
      <div style={{ padding: "14px 18px" }}>
        {item.dateLabel && (
          <div
            style={{
              fontFamily: ARKANAYA_FONTS.mono,
              fontSize: 13,
              color: ARKANAYA_COLORS.archiveGold,
              letterSpacing: "0.1em",
              marginBottom: 4,
            }}
          >
            {item.dateLabel}
          </div>
        )}
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.secondary,
            fontSize: 32,
            lineHeight: 1.02,
            color: ARKANAYA_COLORS.archiveCream,
          }}
        >
          {item.title}
        </div>
        {item.coordinatesLabel && (
          <div
            style={{
              fontFamily: ARKANAYA_FONTS.mono,
              fontSize: 13,
              color: ARKANAYA_COLORS.ashGrey,
              marginTop: 4,
            }}
          >
            {item.coordinatesLabel}
          </div>
        )}
        {item.notes && (
          <div
            style={{
              fontFamily: ARKANAYA_FONTS.body,
              fontSize: 18,
              color: ARKANAYA_COLORS.agedPaper,
              marginTop: 8,
              lineHeight: 1.38,
            }}
          >
            {item.notes}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px)`,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 13,
          letterSpacing: "0.16em",
          color: ARKANAYA_COLORS.archiveGold,
          textTransform: "uppercase",
        }}
      >
        {relationLabel}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: landscape ? "row" : "column",
          gap: 16,
          boxShadow: ARKANAYA_SHADOWS.panel,
        }}
      >
        {renderPanel(left, "LOC A", false)}
        {renderPanel(right, "LOC B", true)}
      </div>
    </div>
  );
};
