import type React from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import { paperReveal } from "../../motion/presets";
import {
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
  ARKANAYA_TEXTURES,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { hash1D } from "../../utils/deterministic";
import { GrainSurface } from "../shared";

export type NewspaperClippingProps = {
  newspaperName?: string;
  issueDate?: string;
  headline: string;
  subheadline?: string;
  excerpt: string;
  image?: string;
  columns?: 1 | 2;
  monochrome?: boolean;
  agedPaperColor?: string;
  tornEdges?: boolean;
  rotation?: number;
  width?: number;
  style?: React.CSSProperties;
};

const buildTornClipPath = (seed = 7): string => {
  const pts: string[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const y = hash1D(i * 3.1 + seed) * 1.4;
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * 100;
    const x = 100 - hash1D(i * 4.7 + seed + 30) * 1.4;
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * 100;
    const y = 100 - hash1D(i * 5.3 + seed + 60) * 1.6;
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  for (let i = steps; i >= 0; i--) {
    const y = (i / steps) * 100;
    const x = hash1D(i * 6.1 + seed + 90) * 1.4;
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  return `polygon(${pts.join(", ")})`;
};

const TORN_CLIP = buildTornClipPath(19);

export const NewspaperClipping = ({
  newspaperName = "THE DAILY CHRONICLE",
  issueDate = "VOL. XLII · ARCHIVE EDITION",
  headline,
  subheadline,
  excerpt,
  image,
  columns = 2,
  monochrome = true,
  agedPaperColor = ARKANAYA_TEXTURES.newspaperPaper,
  tornEdges = true,
  rotation = -1.2,
  width = 880,
  style,
}: NewspaperClippingProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const anim = paperReveal({ frame, durationInFrames, fps }, { duration: 22 });

  return (
    <div
      style={{
        position: "relative",
        width,
        backgroundColor: agedPaperColor,
        color: ARKANAYA_COLORS.inkBlack,
        padding: "36px 40px 42px",
        boxSizing: "border-box",
        clipPath: tornEdges ? TORN_CLIP : undefined,
        filter: monochrome ? "grayscale(1) contrast(1.08)" : undefined,
        boxShadow: ARKANAYA_SHADOWS.heavy,
        transform: `translateY(${anim.translateY}px) rotate(${rotation}deg)`,
        opacity: anim.opacity,
        ...style,
      }}
    >
      {/* Paper grain texture */}
      <GrainSurface opacity={0.14} baseFrequency="0.7" seed={5} mixBlendMode="multiply" />

      {/* Masthead */}
      <div
        style={{
          position: "relative",
          borderTop: `3px solid ${ARKANAYA_COLORS.inkBlack}`,
          borderBottom: `1px solid ${ARKANAYA_COLORS.inkBlack}`,
          padding: "8px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 18,
        }}
      >
        <span>{newspaperName}</span>
        <span>{issueDate}</span>
      </div>

      {/* Headline */}
      <div
        style={{
          position: "relative",
          fontFamily: ARKANAYA_FONTS.headline,
          fontSize: 66,
          lineHeight: 0.94,
          letterSpacing: "0.01em",
          textTransform: "uppercase",
          marginBottom: subheadline ? 10 : 18,
        }}
      >
        {headline}
      </div>

      {subheadline && (
        <div
          style={{
            position: "relative",
            fontFamily: ARKANAYA_FONTS.secondary,
            fontSize: 30,
            lineHeight: 1.05,
            letterSpacing: "0.04em",
            color: "#3A3731",
            borderBottom: `2px solid ${ARKANAYA_COLORS.inkBlack}`,
            paddingBottom: 12,
            marginBottom: 18,
          }}
        >
          {subheadline}
        </div>
      )}

      {image && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 260,
            marginBottom: 18,
            border: `1px solid ${ARKANAYA_COLORS.inkBlack}`,
            overflow: "hidden",
            filter: "grayscale(1) contrast(1.22)",
          }}
        >
          <Img
            src={image}
            alt={headline}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Article columns */}
      <div
        style={{
          position: "relative",
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: 22,
          lineHeight: 1.5,
          columnCount: columns,
          columnGap: 32,
          textAlign: "justify",
          color: "#1F1D1A",
        }}
      >
        {excerpt}
      </div>
    </div>
  );
};
