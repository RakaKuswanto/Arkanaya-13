import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, typewriterReveal } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type TelegramMessageProps = {
  sender: string;
  recipient: string;
  timestamp: string;
  stationCode?: string;
  message: string;
  priority?: "ROUTINE" | "URGENT" | "FLASH";
  style?: React.CSSProperties;
};

/**
 * Vintage telegraphic dispatch slip with sequential monospaced reveal.
 */
export const TelegramMessage = ({
  sender,
  recipient,
  timestamp,
  stationCode = "WIRE-DESK // ARCHIVE",
  message,
  priority = "URGENT",
  style,
}: TelegramMessageProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 14], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const typed = typewriterReveal(
    { frame, durationInFrames, fps },
    { totalChars: message.length, startFrame: 8, charsPerSecond: 42 },
  );

  return (
    <div
      style={{
        backgroundColor: ARKANAYA_COLORS.archiveCream,
        color: ARKANAYA_COLORS.inkBlack,
        border: ARKANAYA_BORDERS.paperHeavy,
        padding: "24px 28px",
        boxShadow: ARKANAYA_SHADOWS.panel,
        fontFamily: ARKANAYA_FONTS.mono,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px)`,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: ARKANAYA_BORDERS.paperHeavy,
          paddingBottom: 10,
          marginBottom: 14,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.14em",
        }}
      >
        <span>TELEGRAM // {stationCode}</span>
        <span
          style={{
            backgroundColor:
              priority === "FLASH"
                ? ARKANAYA_COLORS.bloodRed
                : ARKANAYA_COLORS.inkBlack,
            color: ARKANAYA_COLORS.archiveCream,
            padding: "2px 10px",
          }}
        >
          {priority}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          fontSize: 14,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "1px dashed rgba(20, 19, 17, 0.35)",
        }}
      >
        <div>FROM: {sender}</div>
        <div>TO: {recipient}</div>
        <div>TIME: {timestamp}</div>
      </div>

      <div
        style={{
          backgroundColor: "#EFE6D4",
          border: ARKANAYA_BORDERS.paper,
          padding: "16px 18px",
          fontSize: 22,
          lineHeight: 1.5,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {message.slice(0, typed.visibleChars)}
        {typed.isTyping && (
          <span style={{ color: ARKANAYA_COLORS.bloodRed }}>█</span>
        )}
      </div>
    </div>
  );
};
