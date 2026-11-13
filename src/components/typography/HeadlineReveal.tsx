import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, SHARP_EXIT_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS, type ArsipFontVariant } from "../../theme/typography";

export type HeadlineRevealProps = {
  text: string;
  mode?: "word" | "char";
  font?: ArsipFontVariant;
  fontSize?: number;
  color?: string;
  highlightWords?: readonly string[];
  highlightColor?: string;
  align?: "left" | "center" | "right";
  paperStrip?: boolean;
  paperStripColor?: string;
  staggerFrames?: number;
  enterFrames?: number;
  exit?: boolean;
  exitFrames?: number;
  duration?: number;
  lineHeight?: number;
  letterSpacing?: string;
  uppercase?: boolean;
  style?: React.CSSProperties;
};

export const HeadlineReveal = ({
  text,
  mode = "word",
  font = "headline",
  fontSize = 96,
  color = ARSIP_COLORS.archivePaper,
  highlightWords = [],
  highlightColor = ARSIP_COLORS.bloodRed,
  align = "left",
  paperStrip = false,
  paperStripColor = ARSIP_COLORS.archivePaper,
  staggerFrames = 3,
  enterFrames = 14,
  exit = true,
  exitFrames = 12,
  duration,
  lineHeight = 0.96,
  letterSpacing = "0.02em",
  uppercase = true,
  style,
}: HeadlineRevealProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const effectiveDuration = duration ?? durationInFrames;

  const normalizedHighlights = new Set(
    highlightWords.map((w) => w.trim().toLowerCase()),
  );

  const tokens =
    mode === "char"
      ? Array.from(text).map((ch, idx) => ({
          key: `c-${idx}`,
          label: ch === " " ? "\u00A0" : ch,
          isHighlighted: false,
          isSpace: ch === " ",
        }))
      : text.split(/\s+/).map((word, idx) => {
          const clean = word.replace(/[^a-zA-Z0-9\u00C0-\u024F-]/g, "").toLowerCase();
          return {
            key: `w-${idx}`,
            label: word,
            isHighlighted: normalizedHighlights.has(clean),
            isSpace: false,
          };
        });

  const stripReveal = paperStrip
    ? interpolate(frame, [0, Math.max(8, enterFrames)], [0, 1], {
        easing: EDITORIAL_EASE,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const stripExit =
    paperStrip && exit
      ? interpolate(
          frame,
          [
            Math.max(enterFrames, effectiveDuration - exitFrames),
            Math.max(enterFrames + 1, effectiveDuration - 1),
          ],
          [0, 1],
          {
            easing: Easing.bezier(0.7, 0, 0.84, 0),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems:
          align === "center"
            ? "center"
            : align === "right"
              ? "flex-end"
              : "flex-start",
        textAlign: align,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          justifyContent:
            align === "center"
              ? "center"
              : align === "right"
                ? "flex-end"
                : "flex-start",
          columnGap: mode === "word" ? "0.24em" : 0,
          rowGap: "0.08em",
          padding: paperStrip ? "18px 28px" : 0,
        }}
      >
        {paperStrip && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: paperStripColor,
              clipPath: `inset(0 ${(1 - stripReveal) * 100}% 0 ${stripExit * 100}%)`,
              zIndex: 0,
            }}
          />
        )}

        {tokens.map((token, idx) => {
          const inStart = idx * staggerFrames;
          const inP = interpolate(
            frame,
            [inStart, inStart + Math.max(1, enterFrames)],
            [0, 1],
            {
              easing: EDITORIAL_EASE,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          const outStart = Math.max(
            inStart + enterFrames,
            effectiveDuration - exitFrames - (tokens.length - 1 - idx) * (staggerFrames * 0.5),
          );
          const outP = exit
            ? interpolate(
                frame,
                [outStart, outStart + Math.max(1, exitFrames)],
                [0, 1],
                {
                  easing: SHARP_EXIT_EASE,
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              )
            : 0;

          return (
            <span
              key={token.key}
              style={{
                position: "relative",
                zIndex: 1,
                display: "inline-block",
                overflow: "hidden",
                paddingTop: "0.04em",
                paddingBottom: "0.06em",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontFamily: ARSIP_FONTS[font],
                  fontSize,
                  lineHeight,
                  letterSpacing,
                  textTransform: uppercase ? "uppercase" : "none",
                  color: token.isHighlighted ? highlightColor : color,
                  translate: `0 ${(1 - inP) * 105 - outP * 105}%`,
                  opacity: inP * (1 - outP),
                }}
              >
                {token.label}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
