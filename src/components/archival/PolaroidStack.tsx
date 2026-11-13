import type React from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import { evidenceAppear } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";
import { signedHash } from "../../utils/deterministic";

export type PolaroidItem = {
  src?: string;
  caption?: string;
  date?: string;
  rotation?: number;
};

export type PolaroidStackProps = {
  items: readonly PolaroidItem[];
  staggerFrames?: number;
  width?: number;
  photoHeight?: number;
  showPin?: boolean;
  style?: React.CSSProperties;
};

export const PolaroidStack = ({
  items,
  staggerFrames = 10,
  width = 560,
  photoHeight = 440,
  showPin = true,
  style,
}: PolaroidStackProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "relative",
        width: width + 120,
        height: photoHeight + 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {items.map((item, idx) => {
        const anim = evidenceAppear(
          { frame, durationInFrames, fps },
          { delay: idx * staggerFrames },
        );

        const defaultRot = signedHash(idx * 17.3 + 5) * 8;
        const rotation = item.rotation ?? defaultRot;
        const offsetX = (idx - (items.length - 1) / 2) * 26;
        const offsetY = (idx - (items.length - 1) / 2) * 14;

        return (
          <div
            key={`${item.caption ?? "polaroid"}-${idx}`}
            style={{
              position: "absolute",
              width,
              backgroundColor: ARSIP_COLORS.archivePaper,
              padding: "20px 20px 68px 20px",
              boxSizing: "border-box",
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.52)",
              transform: `translate(${offsetX}px, ${offsetY + anim.translateY}px) rotate(${rotation}deg) scale(${anim.scale})`,
              opacity: anim.opacity,
            }}
          >
            {showPin && idx === items.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 22,
                  height: 22,
                  borderRadius: 9999,
                  backgroundColor: ARSIP_COLORS.bloodRed,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.45)",
                  border: "2px solid #F3EFE7",
                }}
              />
            )}

            <div
              style={{
                width: "100%",
                height: photoHeight,
                backgroundColor: "#171614",
                overflow: "hidden",
                filter: "grayscale(1) sepia(0.16) contrast(1.15)",
              }}
            >
              {item.src ? (
                <Img
                  src={item.src}
                  alt={item.caption ?? "Archival polaroid"}
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
                    fontSize: 20,
                    letterSpacing: "0.14em",
                    color: "rgba(232, 228, 220, 0.42)",
                    background:
                      "radial-gradient(circle, #302C27 0%, #111111 100%)",
                  }}
                >
                  EXHIBIT #{String(idx + 1).padStart(2, "0")}
                </div>
              )}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 18,
                left: 22,
                right: 22,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: ARSIP_FONTS.mono,
                fontSize: 17,
                color: ARSIP_COLORS.inkBlack,
                letterSpacing: "0.08em",
              }}
            >
              <span>{item.caption ?? `EVIDENCE ${idx + 1}`}</span>
              {item.date && (
                <span style={{ color: ARSIP_COLORS.bloodRed, fontWeight: 600 }}>
                  {item.date}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
