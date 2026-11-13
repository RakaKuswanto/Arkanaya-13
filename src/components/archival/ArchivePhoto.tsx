import type React from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import { archivalPan, slowZoomIn } from "../../motion/presets";
import {
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
  ARKANAYA_TEXTURES,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { GrainSurface, MediaFallbackPlate } from "../shared";

export type ArchivePhotoProps = {
  src?: string;
  alt?: string;
  duration?: number;
  grayscale?: boolean;
  sepia?: number;
  contrast?: number;
  grain?: number;
  zoom?: { from: number; to: number };
  pan?: { xFrom: number; xTo: number; yFrom: number; yTo: number };
  position?: "center" | "top" | "bottom" | "left" | "right";
  frameStyle?: "paper" | "film" | "none";
  caption?: string;
  dateStamp?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

const objectPositionMap: Record<NonNullable<ArchivePhotoProps["position"]>, string> = {
  center: "50% 50%",
  top: "50% 15%",
  bottom: "50% 85%",
  left: "15% 50%",
  right: "85% 50%",
};

export const ArchivePhoto = ({
  src,
  alt = "Archival photograph",
  duration,
  grayscale = true,
  sepia = 0.14,
  contrast = 1.15,
  grain = 0.22,
  zoom = { from: 1, to: 1.12 },
  pan = { xFrom: -10, xTo: 10, yFrom: 0, yTo: -6 },
  position = "center",
  frameStyle = "paper",
  caption,
  dateStamp,
  width = 860,
  height = 560,
  style,
}: ArchivePhotoProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const effectiveDuration = duration ?? durationInFrames;

  const scale = slowZoomIn(
    { frame, durationInFrames: effectiveDuration, fps },
    zoom,
  );
  const offset = archivalPan(
    { frame, durationInFrames: effectiveDuration, fps },
    pan,
  );

  const isPaper = frameStyle === "paper";
  const isFilm = frameStyle === "film";

  return (
    <div
      style={{
        position: "relative",
        width,
        backgroundColor: isPaper
          ? ARKANAYA_COLORS.archiveCream
          : isFilm
            ? ARKANAYA_COLORS.deepBlack
            : "transparent",
        padding: isPaper ? "20px 20px 56px 20px" : isFilm ? "26px 14px" : 0,
        boxShadow:
          frameStyle !== "none" ? ARKANAYA_SHADOWS.panel : undefined,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height,
          overflow: "hidden",
          backgroundColor: ARKANAYA_COLORS.deepBlack,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: objectPositionMap[position],
            filter: `grayscale(${grayscale ? 1 : 0}) sepia(${sepia}) contrast(${contrast})`,
          }}
        >
          {src ? (
            <Img
              src={src}
              alt={alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: objectPositionMap[position],
                display: "block",
              }}
            />
          ) : (
            <MediaFallbackPlate
              label="ARCHIVAL PLATE // NO. 00"
              sublabel="SUPPLY SRC PROP TO RENDER PHOTOGRAPH"
            />
          )}
        </div>

        {/* Subtle analog vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: ARKANAYA_TEXTURES.vignetteRadial(0.58),
            pointerEvents: "none",
          }}
        />

        {/* Deterministic photo grain */}
        {grain > 0 && (
          <GrainSurface
            opacity={grain}
            baseFrequency="0.8"
            seed={Math.floor(frame / 2) + 7}
          />
        )}

        {dateStamp && (
          <div
            style={{
              position: "absolute",
              right: 16,
              bottom: 14,
              fontFamily: ARKANAYA_FONTS.mono,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: ARKANAYA_COLORS.archiveGold,
              backgroundColor: ARKANAYA_COLORS.surfacePanel,
              padding: "4px 10px",
            }}
          >
            {dateStamp}
          </div>
        )}
      </div>

      {caption && (
        <div
          style={{
            position: isPaper ? "absolute" : "relative",
            bottom: isPaper ? 16 : undefined,
            left: isPaper ? 22 : undefined,
            right: isPaper ? 22 : undefined,
            marginTop: isPaper ? 0 : 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: isPaper ? ARKANAYA_COLORS.inkBlack : ARKANAYA_COLORS.ashGrey,
          }}
        >
          <span>{caption}</span>
          <span style={{ color: ARKANAYA_COLORS.bloodRed }}>ARSIP // PHOTO</span>
        </div>
      )}
    </div>
  );
};
