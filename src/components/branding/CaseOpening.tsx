import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_COLORS,
  getSafeMargins,
  isLandscapeLayout,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { CaseMetadata } from "../typography/CaseMetadata";
import { HeadlineReveal } from "../typography/HeadlineReveal";

export type CaseOpeningProps = {
  episodeNumber: string;
  caseTitle: string;
  subtitle?: string;
  location: string;
  date: string;
  status?: string;
  caseNumber?: string;
  highlightWords?: readonly string[];
  style?: React.CSSProperties;
};

export const CaseOpening = ({
  episodeNumber,
  caseTitle,
  subtitle,
  location,
  date,
  status = "UNSOLVED",
  caseNumber = "AG-ARCHIVE",
  highlightWords = [],
  style,
}: CaseOpeningProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const margins = getSafeMargins(width, height);
  const landscape = isLandscapeLayout(width, height);

  const epReveal = interpolate(frame, [0, 16], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ARKANAYA_COLORS.obsidian,
        paddingTop: margins.top + (landscape ? 10 : 40),
        paddingBottom: margins.bottom,
        paddingLeft: margins.left,
        paddingRight: margins.right,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: landscape ? 24 : 36 }}>
        {/* Episode indicator */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: ARKANAYA_COLORS.archiveCream,
            opacity: epReveal,
          }}
        >
          <span
            style={{
              backgroundColor: ARKANAYA_COLORS.bloodRed,
              padding: "6px 14px",
            }}
          >
            {episodeNumber}
          </span>
          <span style={{ color: ARKANAYA_COLORS.archiveGold }}>CASE DOSSIER</span>
        </div>

        {/* Main case title */}
        <HeadlineReveal
          text={caseTitle}
          highlightWords={highlightWords}
          fontSize={landscape ? 92 : 108}
          exit={false}
        />

        {subtitle && (
          <div
            style={{
              fontFamily: ARKANAYA_FONTS.body,
              fontSize: landscape ? 26 : 30,
              lineHeight: 1.45,
              color: ARKANAYA_COLORS.ashGrey,
              opacity: epReveal,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Bottom Case Metadata block */}
      <CaseMetadata
        caseNumber={caseNumber}
        location={location}
        date={date}
        status={status}
        compact={landscape}
      />
    </AbsoluteFill>
  );
};
