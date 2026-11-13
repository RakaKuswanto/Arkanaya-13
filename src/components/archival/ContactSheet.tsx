import type React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type ContactSheetItem = {
  src?: string;
  frameCode?: string;
  label?: string;
};

export type ContactSheetProps = {
  items: readonly ContactSheetItem[];
  columns?: number;
  highlightIndex?: number;
  sequentialHighlight?: boolean;
  framesPerStep?: number;
  highlightColor?: string;
  filmStockLabel?: string;
  width?: number;
  style?: React.CSSProperties;
};

export const ContactSheet = ({
  items,
  columns = 2,
  highlightIndex,
  sequentialHighlight = true,
  framesPerStep = 24,
  highlightColor = ARSIP_COLORS.bloodRed,
  filmStockLabel = "KODAK TRI-X 400 · ARCHIVE ROLL",
  width = 920,
  style,
}: ContactSheetProps) => {
  const frame = useCurrentFrame();

  const enterT = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const activeIdx =
    highlightIndex !== undefined
      ? highlightIndex
      : sequentialHighlight && items.length > 0
        ? Math.floor(frame / Math.max(1, framesPerStep)) % items.length
        : -1;

  return (
    <div
      style={{
        width,
        backgroundColor: ARSIP_COLORS.deepBlack,
        border: "1px solid rgba(232, 228, 220, 0.14)",
        padding: "24px 28px",
        boxSizing: "border-box",
        opacity: enterT,
        translate: `0px ${(1 - enterT) * 24}px`,
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.65)",
        ...style,
      }}
    >
      {/* Film stock header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 16,
          letterSpacing: "0.14em",
          color: ARSIP_COLORS.archiveGold,
        }}
      >
        <span>{filmStockLabel}</span>
        <span>35MM CONTACT SHEET</span>
      </div>

      {/* Sprocket top */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
          padding: "0 6px",
        }}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={`top-sp-${i}`}
            style={{
              width: 24,
              height: 14,
              borderRadius: 2,
              backgroundColor: "rgba(232, 228, 220, 0.12)",
            }}
          />
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 18,
        }}
      >
        {items.map((item, idx) => {
          const isHighlighted = idx === activeIdx;
          const code = item.frameCode ?? `${30 + idx}A`;

          return (
            <div
              key={`${code}-${idx}`}
              style={{
                position: "relative",
                backgroundColor: ARSIP_COLORS.obsidian,
                border: isHighlighted
                  ? `3px solid ${highlightColor}`
                  : "1px solid rgba(232, 228, 220, 0.15)",
                padding: 10,
                transform: isHighlighted ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 220,
                  overflow: "hidden",
                  backgroundColor: "#191816",
                  filter: isHighlighted
                    ? "grayscale(1) contrast(1.2)"
                    : "grayscale(1) contrast(1.05) brightness(0.65)",
                }}
              >
                {item.src ? (
                  <Img
                    src={item.src}
                    alt={item.label ?? `Frame ${code}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: ARSIP_FONTS.mono,
                      fontSize: 18,
                      letterSpacing: "0.14em",
                      color: "rgba(232, 228, 220, 0.4)",
                      background:
                        "radial-gradient(circle, #2D2A26 0%, #111111 100%)",
                    }}
                  >
                    NEG // {code}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: ARSIP_FONTS.mono,
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  color: isHighlighted ? highlightColor : ARSIP_COLORS.mutedGray,
                }}
              >
                <span>{code}</span>
                <span>{item.label ?? "ARCHIVE"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sprocket bottom */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
          padding: "0 6px",
        }}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={`bot-sp-${i}`}
            style={{
              width: 24,
              height: 14,
              borderRadius: 2,
              backgroundColor: "rgba(232, 228, 220, 0.12)",
            }}
          />
        ))}
      </div>
    </div>
  );
};
