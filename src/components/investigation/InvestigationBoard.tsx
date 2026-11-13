import type React from "react";
import { useId } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
  ARKANAYA_TEXTURES,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { EvidenceCard } from "./EvidenceCard";

export type BoardCardConfig = {
  id: string;
  /** Horizontal center position as percentage (0-100) of board width */
  xPercent: number;
  /** Vertical center position as percentage (0-100) of board height */
  yPercent: number;
  evidenceNumber: string;
  title: string;
  description?: string;
  date?: string;
  source?: string;
  image?: string;
  rotation?: number;
  variant?: "polaroid" | "document";
  width?: number;
};

export type BoardConnection = {
  from: string;
  to: string;
  label?: string;
};

export type InvestigationBoardProps = {
  cards: readonly BoardCardConfig[];
  connections?: readonly BoardConnection[];
  width?: number;
  height?: number;
  boardColor?: string;
  stringColor?: string;
  staggerFrames?: number;
  connectionStartFrame?: number;
  style?: React.CSSProperties;
};

export const InvestigationBoard = ({
  cards,
  connections = [],
  width = 960,
  height = 1280,
  boardColor = ARKANAYA_TEXTURES.boardSurface,
  stringColor = ARKANAYA_COLORS.bloodRed,
  staggerFrames = 10,
  connectionStartFrame = 18,
  style,
}: InvestigationBoardProps) => {
  const frame = useCurrentFrame();
  const uid = useId().replace(/:/g, "");
  const gridPatternId = `board-grid-${uid}`;

  const cardMap = new Map(cards.map((c) => [c.id, c]));

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: boardColor,
        border: ARKANAYA_BORDERS.subtle,
        boxShadow: ARKANAYA_SHADOWS.insetBoard,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Subtle cork/grid texture lines */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <pattern
            id={gridPatternId}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke={ARKANAYA_COLORS.archiveCream}
              strokeOpacity="0.055"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width={width} height={height} fill={`url(#${gridPatternId})`} />
      </svg>

      {/* Evidence Cards */}
      {cards.map((card, idx) => {
        const cardW = card.width ?? 360;
        const left = (card.xPercent / 100) * width - cardW / 2;
        const top = (card.yPercent / 100) * height - 180;

        return (
          <div
            key={card.id}
            style={{
              position: "absolute",
              left,
              top,
              zIndex: 2 + idx,
            }}
          >
            <EvidenceCard
              image={card.image}
              evidenceNumber={card.evidenceNumber}
              title={card.title}
              description={card.description}
              date={card.date}
              source={card.source}
              variant={card.variant ?? "polaroid"}
              rotation={card.rotation ?? (idx % 2 === 0 ? -3 : 2.5)}
              delayFrames={idx * staggerFrames}
              width={cardW}
              imageHeight={180}
              showPin={true}
            />
          </div>
        );
      })}

      {/* Animated Red String Connections + Pins overlay */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        {connections.map((conn, idx) => {
          const fromCard = cardMap.get(conn.from);
          const toCard = cardMap.get(conn.to);
          if (!fromCard || !toCard) return null;

          // Pin sits near top-center of each card
          const x1 = (fromCard.xPercent / 100) * width;
          const y1 = (fromCard.yPercent / 100) * height - 178;
          const x2 = (toCard.xPercent / 100) * width;
          const y2 = (toCard.yPercent / 100) * height - 178;

          const length = Math.hypot(x2 - x1, y2 - y1) || 1;
          const start = connectionStartFrame + idx * 12;
          const drawP = interpolate(frame, [start, start + 22], [0, 1], {
            easing: EDITORIAL_EASE,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <g key={`${conn.from}-${conn.to}-${idx}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={stringColor}
                strokeWidth={3.2}
                strokeDasharray={length}
                strokeDashoffset={length * (1 - drawP)}
                strokeLinecap="round"
              />
              {conn.label && drawP > 0.65 && (
                <g
                  opacity={interpolate(drawP, [0.65, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}
                >
                  <rect
                    x={midX - 58}
                    y={midY - 14}
                    width={116}
                    height={26}
                    fill={ARKANAYA_COLORS.deepBlack}
                    stroke={stringColor}
                    strokeWidth={1.5}
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fill={ARKANAYA_COLORS.archiveCream}
                    fontFamily={ARKANAYA_FONTS.mono}
                    fontSize={12}
                    letterSpacing="0.1em"
                  >
                    {conn.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
