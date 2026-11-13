import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ARSIP_COLORS, ARSIP_SAFE_MARGINS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";
import { parseTimestampToMs } from "../../utils/deterministic";

export type CaptionToken = {
  text: string;
  startMs: number;
  endMs: number;
};

export type DocumentaryCaptionProps = {
  captions?: readonly CaptionToken[];
  srtText?: string;
  position?: "bottom" | "center" | "top";
  safeMarginBottom?: number;
  safeMarginTop?: number;
  maxCharsPerLine?: number;
  fontSize?: number;
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  style?: React.CSSProperties;
};

/**
 * Parses basic SRT or WebVTT text into evenly timed word tokens per cue.
 */
export const parseCaptionsFromText = (raw: string): CaptionToken[] => {
  const blocks = raw
    .replace(/\r\n/g, "\n")
    .replace(/^WEBVTT[^\n]*\n+/, "")
    .trim()
    .split(/\n{2,}/);

  const tokens: CaptionToken[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const timeIdx = lines.findIndex((l) => l.includes("-->"));
    if (timeIdx === -1) continue;

    const [startRaw, endRaw] = lines[timeIdx].split("-->");
    const startMs = parseTimestampToMs(startRaw ?? "0");
    const endMs = parseTimestampToMs((endRaw ?? "0").split(/\s+/)[0] ?? "0");
    const text = lines.slice(timeIdx + 1).join(" ").trim();
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0 || endMs <= startMs) continue;

    const step = (endMs - startMs) / words.length;
    words.forEach((word, i) => {
      tokens.push({
        text: word,
        startMs: Math.round(startMs + i * step),
        endMs: Math.round(startMs + (i + 1) * step),
      });
    });
  }
  return tokens;
};

const groupIntoPages = (
  tokens: readonly CaptionToken[],
  maxCharsPerLine: number,
): Array<CaptionToken[]> => {
  const pages: Array<CaptionToken[]> = [];
  let current: CaptionToken[] = [];
  let charCount = 0;

  for (const token of tokens) {
    const nextLen = charCount + token.text.length + (current.length > 0 ? 1 : 0);
    if (nextLen > maxCharsPerLine * 2 && current.length > 0) {
      pages.push(current);
      current = [token];
      charCount = token.text.length;
    } else {
      current.push(token);
      charCount = nextLen;
    }
  }
  if (current.length > 0) pages.push(current);
  return pages;
};

export const DocumentaryCaption = ({
  captions = [],
  srtText,
  position = "bottom",
  safeMarginBottom = ARSIP_SAFE_MARGINS.bottom,
  safeMarginTop = ARSIP_SAFE_MARGINS.top,
  maxCharsPerLine = 26,
  fontSize = 44,
  textColor = ARSIP_COLORS.archivePaper,
  highlightColor = ARSIP_COLORS.bloodRed,
  backgroundColor = "rgba(8, 8, 8, 0.82)",
  style,
}: DocumentaryCaptionProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / Math.max(1, fps)) * 1000;

  const resolvedTokens =
    captions.length > 0
      ? captions
      : srtText
        ? parseCaptionsFromText(srtText)
        : [];

  if (resolvedTokens.length === 0) return null;

  const pages = groupIntoPages(resolvedTokens, maxCharsPerLine);
  const activePage = pages.find((page) => {
    const first = page[0];
    const last = page[page.length - 1];
    return currentMs >= first.startMs && currentMs <= last.endMs;
  });

  if (!activePage) return null;

  const positionStyle: React.CSSProperties =
    position === "top"
      ? { top: safeMarginTop }
      : position === "center"
        ? { top: "50%", transform: "translateY(-50%)" }
        : { bottom: safeMarginBottom };

  return (
    <div
      style={{
        position: "absolute",
        left: ARSIP_SAFE_MARGINS.left,
        right: ARSIP_SAFE_MARGINS.right,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        ...positionStyle,
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: "16px 26px",
          borderLeft: `4px solid ${highlightColor}`,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "0.32em",
          rowGap: "0.14em",
          maxWidth: "100%",
        }}
      >
        {activePage.map((token, idx) => {
          const isActive =
            currentMs >= token.startMs && currentMs <= token.endMs;
          const isSpoken = currentMs > token.endMs;

          return (
            <span
              key={`${token.startMs}-${idx}`}
              style={{
                fontFamily: ARSIP_FONTS.body,
                fontSize,
                fontWeight: isActive ? 700 : 600,
                lineHeight: 1.28,
                color: isActive
                  ? highlightColor
                  : isSpoken
                    ? textColor
                    : "rgba(232, 228, 220, 0.58)",
                backgroundColor: isActive
                  ? "rgba(169, 35, 43, 0.16)"
                  : "transparent",
                padding: isActive ? "0 6px" : 0,
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
