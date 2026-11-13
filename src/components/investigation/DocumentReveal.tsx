import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EDITORIAL_EASE, documentSlide } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";
import { CaseStamp, type CaseStampPreset } from "./CaseStamp";

export type DocumentRevealProps = {
  docNumber?: string;
  agency?: string;
  subject: string;
  body: string;
  redactedPhrases?: readonly string[];
  annotations?: readonly string[];
  stamp?: CaseStampPreset | (string & {});
  mode?: "slide" | "unfold";
  width?: number;
  style?: React.CSSProperties;
};

const renderRedactedText = (
  text: string,
  redactedPhrases: readonly string[],
): React.ReactNode[] => {
  if (redactedPhrases.length === 0) return [text];

  const escaped = redactedPhrases
    .filter(Boolean)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return [text];

  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    const isRedacted = redactedPhrases.some(
      (p) => p.toLowerCase() === part.toLowerCase(),
    );
    if (!isRedacted) return <span key={idx}>{part}</span>;
    return (
      <span
        key={idx}
        style={{
          backgroundColor: ARSIP_COLORS.inkBlack,
          color: ARSIP_COLORS.inkBlack,
          padding: "0 6px",
          margin: "0 2px",
          userSelect: "none",
        }}
      >
        {part}
      </span>
    );
  });
};

export const DocumentReveal = ({
  docNumber = "DOC-71-0449",
  agency = "SPECIAL INVESTIGATION UNIT",
  subject,
  body,
  redactedPhrases = [],
  annotations = [],
  stamp = "CONFIDENTIAL",
  mode = "slide",
  width = 880,
  style,
}: DocumentRevealProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const slide = documentSlide(
    { frame, durationInFrames, fps },
    { duration: 22, distance: 80 },
  );
  const unfoldT =
    mode === "unfold"
      ? interpolate(frame, [0, 22], [0, 1], {
          easing: EDITORIAL_EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <div
      style={{
        position: "relative",
        width,
        backgroundColor: ARSIP_COLORS.archivePaper,
        color: ARSIP_COLORS.inkBlack,
        padding: stamp ? "40px 44px 104px" : "40px 44px 48px",
        boxSizing: "border-box",
        border: "1px solid rgba(17, 17, 17, 0.25)",
        boxShadow: "0 28px 72px rgba(0, 0, 0, 0.62)",
        transform:
          mode === "slide"
            ? `translateY(${slide.translateY}px) rotate(${slide.rotationDelta}deg)`
            : `scaleY(${0.15 + unfoldT * 0.85})`,
        transformOrigin: mode === "unfold" ? "top center" : "center center",
        opacity: slide.opacity,
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${ARSIP_COLORS.inkBlack}`,
          paddingBottom: 14,
          marginBottom: 22,
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <span>{agency}</span>
        <span style={{ color: ARSIP_COLORS.bloodRed }}>{docNumber}</span>
      </div>

      {/* Subject */}
      <div
        style={{
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 18,
        }}
      >
        SUBJECT: {subject}
      </div>

      {/* Typewritten body with redactions */}
      <div
        style={{
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 22,
          lineHeight: 1.68,
          color: "#23211E",
          marginBottom: annotations.length > 0 ? 24 : 0,
        }}
      >
        {renderRedactedText(body, redactedPhrases)}
      </div>

      {/* Margin / footer annotations */}
      {annotations.length > 0 && (
        <div
          style={{
            borderTop: "1px dashed rgba(17, 17, 17, 0.35)",
            paddingTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 16,
            color: ARSIP_COLORS.bloodRed,
            letterSpacing: "0.08em",
          }}
        >
          {annotations.map((note, idx) => (
            <div key={idx}>NOTE [{idx + 1}]: {note}</div>
          ))}
        </div>
      )}

      {/* Animated Stamp */}
      {stamp && (
        <div
          style={{
            position: "absolute",
            right: 36,
            bottom: 30,
          }}
        >
          <CaseStamp
            text={stamp}
            delayFrames={16}
            fontSize={42}
            rotation={-11}
          />
        </div>
      )}
    </div>
  );
};
