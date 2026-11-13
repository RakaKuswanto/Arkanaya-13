import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { typewriterReveal } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS, type ArsipFontVariant } from "../../theme/typography";

export type TypewriterTextProps = {
  text: string;
  charsPerSecond?: number;
  startFrame?: number;
  showCursor?: boolean;
  cursorChar?: string;
  cursorColor?: string;
  cursorBlinkFrames?: number;
  font?: ArsipFontVariant;
  fontSize?: number;
  color?: string;
  lineHeight?: number;
  letterSpacing?: string;
  maxWidth?: number;
  style?: React.CSSProperties;
};

export const TypewriterText = ({
  text,
  charsPerSecond = 28,
  startFrame = 0,
  showCursor = true,
  cursorChar = "_",
  cursorColor = ARSIP_COLORS.bloodRed,
  cursorBlinkFrames = 14,
  font = "mono",
  fontSize = 30,
  color = ARSIP_COLORS.archivePaper,
  lineHeight = 1.5,
  letterSpacing = "0.02em",
  maxWidth = 880,
  style,
}: TypewriterTextProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const { visibleChars, isTyping } = typewriterReveal(
    { frame, durationInFrames, fps },
    {
      totalChars: text.length,
      startFrame,
      charsPerSecond,
    },
  );

  const visibleText = text.slice(0, visibleChars);
  const cursorVisible =
    showCursor &&
    (isTyping || Math.floor(frame / Math.max(1, cursorBlinkFrames)) % 2 === 0);

  return (
    <div
      style={{
        fontFamily: ARSIP_FONTS[font],
        fontSize,
        lineHeight,
        letterSpacing,
        color,
        maxWidth,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        ...style,
      }}
    >
      <span>{visibleText}</span>
      {showCursor && (
        <span
          style={{
            color: cursorColor,
            opacity: cursorVisible ? 1 : 0,
            fontWeight: 700,
          }}
        >
          {cursorChar}
        </span>
      )}
    </div>
  );
};
