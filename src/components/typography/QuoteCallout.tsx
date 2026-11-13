import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, highlighterSweep } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type QuoteCalloutProps = {
  quote: string;
  speaker?: string;
  source?: string;
  highlightPhrase?: string;
  accentColor?: string;
  fontSize?: number;
  style?: React.CSSProperties;
};

const renderHighlightedQuote = (
  quote: string,
  highlightPhrase: string | undefined,
  sweepProgress: number,
  accentColor: string,
): React.ReactNode => {
  if (!highlightPhrase) return quote;
  const idx = quote.toLowerCase().indexOf(highlightPhrase.toLowerCase());
  if (idx === -1) return quote;

  const before = quote.slice(0, idx);
  const match = quote.slice(idx, idx + highlightPhrase.length);
  const after = quote.slice(idx + highlightPhrase.length);

  return (
    <>
      {before}
      <span
        style={{
          position: "relative",
          display: "inline-block",
          padding: "0 6px",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: "2px 0",
            backgroundColor: accentColor,
            opacity: 0.38,
            transformOrigin: "left center",
            transform: `scaleX(${sweepProgress})`,
          }}
        />
        <span style={{ position: "relative" }}>{match}</span>
      </span>
      {after}
    </>
  );
};

export const QuoteCallout = ({
  quote,
  speaker,
  source,
  highlightPhrase,
  accentColor = ARSIP_COLORS.bloodRed,
  fontSize = 38,
  style,
}: QuoteCalloutProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sweep = highlighterSweep(
    { frame, durationInFrames, fps },
    { startFrame: 16, durationFrames: 24 },
  );

  return (
    <div
      style={{
        position: "relative",
        borderLeft: `4px solid ${accentColor}`,
        backgroundColor: "rgba(27, 27, 27, 0.72)",
        padding: "32px 34px",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px)`,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: ARSIP_FONTS.headline,
          fontSize: 64,
          lineHeight: 0.7,
          color: accentColor,
          marginBottom: 14,
        }}
      >
        “
      </div>
      <blockquote
        style={{
          margin: 0,
          fontFamily: ARSIP_FONTS.body,
          fontSize,
          lineHeight: 1.38,
          fontWeight: 500,
          color: ARSIP_COLORS.archivePaper,
        }}
      >
        {renderHighlightedQuote(quote, highlightPhrase, sweep, accentColor)}
      </blockquote>
      {(speaker || source) && (
        <div
          style={{
            marginTop: 22,
            paddingTop: 14,
            borderTop: "1px solid rgba(232, 228, 220, 0.16)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 16,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: ARSIP_COLORS.archiveGold }}>
            {speaker ?? "WITNESS STATEMENT"}
          </span>
          {source && (
            <span style={{ color: ARSIP_COLORS.mutedGray }}>{source}</span>
          )}
        </div>
      )}
    </div>
  );
};
