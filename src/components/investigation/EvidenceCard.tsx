import type React from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import { evidenceAppear } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type EvidenceCardProps = {
  image?: string;
  evidenceNumber?: string;
  title: string;
  description?: string;
  date?: string;
  source?: string;
  variant?: "polaroid" | "document";
  rotation?: number;
  delayFrames?: number;
  exit?: boolean;
  showPin?: boolean;
  width?: number;
  imageHeight?: number;
  style?: React.CSSProperties;
};

export const EvidenceCard = ({
  image,
  evidenceNumber = "EVIDENCE 001",
  title,
  description,
  date,
  source,
  variant = "polaroid",
  rotation = -2,
  delayFrames = 0,
  exit = false,
  showPin = true,
  width = 520,
  imageHeight = 300,
  style,
}: EvidenceCardProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const anim = evidenceAppear(
    { frame, durationInFrames, fps },
    { delay: delayFrames, exit },
  );

  const isPolaroid = variant === "polaroid";

  return (
    <div
      style={{
        position: "relative",
        width,
        backgroundColor: isPolaroid
          ? ARSIP_COLORS.archivePaper
          : ARSIP_COLORS.agedPaper,
        padding: isPolaroid ? "18px 18px 22px 18px" : "22px 24px",
        boxSizing: "border-box",
        border: isPolaroid
          ? "1px solid rgba(17, 17, 17, 0.16)"
          : `2px solid ${ARSIP_COLORS.inkBlack}`,
        boxShadow: "0 20px 52px rgba(0, 0, 0, 0.55)",
        transform: `translateY(${anim.translateY}px) rotate(${rotation}deg) scale(${anim.scale})`,
        opacity: anim.opacity,
        ...style,
      }}
    >
      {showPin && (
        <div
          style={{
            position: "absolute",
            top: -11,
            left: "50%",
            transform: "translateX(-50%)",
            width: 22,
            height: 22,
            borderRadius: 9999,
            backgroundColor: ARSIP_COLORS.bloodRed,
            border: `2px solid ${ARSIP_COLORS.offWhite}`,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.45)",
            zIndex: 2,
          }}
        />
      )}

      {/* Header metadata bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: ARSIP_COLORS.bloodRed,
        }}
      >
        <span>{evidenceNumber}</span>
        {date && <span style={{ color: ARSIP_COLORS.inkBlack }}>{date}</span>}
      </div>

      {/* Photo or archival plate */}
      <div
        style={{
          width: "100%",
          height: imageHeight,
          backgroundColor: ARSIP_COLORS.deepBlack,
          overflow: "hidden",
          marginBottom: 16,
          border: "1px solid rgba(17, 17, 17, 0.25)",
          filter: "grayscale(1) sepia(0.16) contrast(1.16)",
        }}
      >
        {image ? (
          <Img
            src={image}
            alt={title}
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
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "radial-gradient(circle, #2A2825 0%, #101010 100%)",
              fontFamily: ARSIP_FONTS.mono,
              fontSize: 16,
              letterSpacing: "0.14em",
              color: "rgba(232, 228, 220, 0.48)",
            }}
          >
            <span>EXHIBIT PHOTO</span>
            <span style={{ fontSize: 12, color: ARSIP_COLORS.archiveGold }}>
              {evidenceNumber}
            </span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div
        style={{
          fontFamily: ARSIP_FONTS.secondary,
          fontSize: 38,
          lineHeight: 0.96,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          color: ARSIP_COLORS.inkBlack,
          marginBottom: description ? 8 : 0,
        }}
      >
        {title}
      </div>

      {description && (
        <div
          style={{
            fontFamily: ARSIP_FONTS.body,
            fontSize: 20,
            lineHeight: 1.4,
            color: "#33312D",
            marginBottom: source ? 12 : 0,
          }}
        >
          {description}
        </div>
      )}

      {source && (
        <div
          style={{
            paddingTop: 8,
            borderTop: "1px dashed rgba(17, 17, 17, 0.28)",
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#55524C",
          }}
        >
          SOURCE: {source}
        </div>
      )}
    </div>
  );
};
