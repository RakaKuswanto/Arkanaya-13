import type React from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import { cameraRackFocus, paperReveal } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type SuspectDossierProps = {
  subjectName: string;
  alias?: string;
  dossierCode?: string;
  photoSrc?: string;
  status?: string;
  attributes?: ReadonlyArray<{ label: string; value: string }>;
  notes?: string;
  style?: React.CSSProperties;
};

export const SuspectDossier = ({
  subjectName,
  alias,
  dossierCode = "SUBJ-01",
  photoSrc,
  status = "UNIDENTIFIED",
  attributes = [],
  notes,
  style,
}: SuspectDossierProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const card = paperReveal({ frame, durationInFrames, fps }, { duration: 18 });
  const focus = cameraRackFocus(
    { frame, durationInFrames, fps },
    { startFrame: 4, durationFrames: 24 },
  );

  return (
    <div
      style={{
        backgroundColor: ARSIP_COLORS.archivePaper,
        color: ARSIP_COLORS.inkBlack,
        padding: 28,
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.55)",
        opacity: card.opacity,
        transform: `translateY(${card.translateY}px)`,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${ARSIP_COLORS.inkBlack}`,
          paddingBottom: 10,
          marginBottom: 20,
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 15,
          letterSpacing: "0.1em",
        }}
      >
        <span>DOSSIER // {dossierCode}</span>
        <span
          style={{
            backgroundColor: ARSIP_COLORS.bloodRed,
            color: ARSIP_COLORS.archivePaper,
            padding: "3px 10px",
            fontWeight: 700,
          }}
        >
          {status}
        </span>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div
          style={{
            width: 240,
            height: 280,
            flexShrink: 0,
            backgroundColor: ARSIP_COLORS.obsidian,
            border: `1px solid ${ARSIP_COLORS.inkBlack}`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {photoSrc ? (
            <Img
              src={photoSrc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: `grayscale(100%) contrast(1.15) blur(${focus.blurPx}px)`,
                transform: `scale(${focus.scale})`,
                opacity: focus.opacity,
              }}
            />
          ) : (
            <div
              style={{
                fontFamily: ARSIP_FONTS.mono,
                fontSize: 14,
                color: ARSIP_COLORS.mutedGray,
                textAlign: "center",
                padding: 16,
                letterSpacing: "0.08em",
              }}
            >
              NO PHOTO
              <br />
              ON FILE
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: ARSIP_FONTS.headline,
              fontSize: 44,
              lineHeight: 1.02,
              textTransform: "uppercase",
            }}
          >
            {subjectName}
          </div>
          {alias && (
            <div
              style={{
                fontFamily: ARSIP_FONTS.mono,
                fontSize: 16,
                color: ARSIP_COLORS.bloodRed,
                marginTop: 6,
                marginBottom: 16,
              }}
            >
              ALIAS: {alias}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 12,
            }}
          >
            {attributes.map((attr) => (
              <div
                key={attr.label}
                style={{
                  borderTop: "1px solid rgba(21, 20, 18, 0.25)",
                  paddingTop: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: ARSIP_FONTS.mono,
                    fontSize: 12,
                    color: ARSIP_COLORS.mutedGray,
                    textTransform: "uppercase",
                  }}
                >
                  {attr.label}
                </div>
                <div
                  style={{
                    fontFamily: ARSIP_FONTS.body,
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {attr.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {notes && (
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px dashed rgba(21, 20, 18, 0.35)",
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 16,
            lineHeight: 1.45,
          }}
        >
          NOTE: {notes}
        </div>
      )}
    </div>
  );
};
