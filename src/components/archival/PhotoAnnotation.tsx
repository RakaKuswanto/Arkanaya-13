import type React from "react";
import { Img } from "remotion";
import type { AnyVerificationStatus } from "../../theme/dataIntegrity";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { EvidenceMarker } from "../investigation/EvidenceMarker";
import { VerificationBadge } from "../investigation/VerificationBadge";
import { MediaFallbackPlate } from "../shared";

export type PhotoAnnotationMarker = {
  number: string | number;
  label: string;
  annotation?: string;
  xPercent: number;
  yPercent: number;
};

export type PhotoAnnotationProps = {
  src?: string;
  caption?: string;
  verificationStatus?: AnyVerificationStatus;
  markers: readonly PhotoAnnotationMarker[];
  height?: number;
  accentColor?: string;
  style?: React.CSSProperties;
};

/**
 * Multi-marker evidence photography container composing numbered EvidenceMarkers and verification status.
 */
export const PhotoAnnotation = ({
  src,
  caption,
  verificationStatus = "VERIFIED",
  markers,
  height = 480,
  accentColor = ARKANAYA_COLORS.bloodRed,
  style,
}: PhotoAnnotationProps) => {
  return (
    <div
      style={{
        backgroundColor: ARKANAYA_COLORS.surfacePanel,
        border: ARKANAYA_BORDERS.subtle,
        boxShadow: ARKANAYA_SHADOWS.panel,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          height,
          overflow: "hidden",
          backgroundColor: ARKANAYA_COLORS.deepBlack,
        }}
      >
        {src ? (
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(1) contrast(1.12)",
            }}
          />
        ) : (
          <MediaFallbackPlate
            label="ANNOTATED ARCHIVE PHOTO"
            sublabel="SUPPLY SRC ASSET FOR PHOTOGRAPHIC INSPECTION"
          />
        )}

        {markers.map((m, idx) => (
          <EvidenceMarker
            key={`${m.number}-${idx}`}
            number={m.number}
            label={m.label}
            annotation={m.annotation}
            xPercent={m.xPercent}
            yPercent={m.yPercent}
            accentColor={accentColor}
          />
        ))}
      </div>

      {(caption || verificationStatus) && (
        <div
          style={{
            padding: "12px 18px",
            borderTop: ARKANAYA_BORDERS.subtle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: ARKANAYA_FONTS.mono,
              fontSize: 14,
              color: ARKANAYA_COLORS.archiveCream,
            }}
          >
            {caption ?? "ARCHIVE PHOTO ANNOTATION"}
          </span>
          <VerificationBadge status={verificationStatus} compact />
        </div>
      )}
    </div>
  );
};
