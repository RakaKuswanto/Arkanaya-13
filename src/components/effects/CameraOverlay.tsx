import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ARSIP_COLORS, ARSIP_SAFE_MARGINS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type CameraOverlayProps = {
  cameraId?: string;
  showRec?: boolean;
  showTimestamp?: boolean;
  showViewfinder?: boolean;
  accentColor?: string;
  textColor?: string;
  style?: React.CSSProperties;
};

const formatTimecode = (frame: number, fps: number): string => {
  const safeFps = Math.max(1, Math.round(fps));
  const totalSeconds = Math.floor(frame / safeFps);
  const ff = frame % safeFps;
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
};

export const CameraOverlay = ({
  cameraId = "CAM-01 // ARCHIVE UNIT",
  showRec = true,
  showTimestamp = true,
  showViewfinder = true,
  accentColor = ARSIP_COLORS.bloodRed,
  textColor = ARSIP_COLORS.archivePaper,
  style,
}: CameraOverlayProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const recBlink = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        paddingTop: ARSIP_SAFE_MARGINS.top - 48,
        paddingBottom: ARSIP_SAFE_MARGINS.bottom - 180,
        paddingLeft: 52,
        paddingRight: 52,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style,
      }}
    >
      {/* Top REC & Camera ID bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "0.14em",
          color: textColor,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {showRec && (
            <>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 9999,
                  backgroundColor: accentColor,
                  opacity: recBlink ? 1 : 0.2,
                }}
              />
              <span style={{ color: accentColor }}>REC</span>
            </>
          )}
        </div>
        <span style={{ opacity: 0.82 }}>{cameraId}</span>
      </div>

      {/* Viewfinder center crosshair */}
      {showViewfinder && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <svg width={96} height={96} viewBox="0 0 96 96">
            <line
              x1={48}
              y1={16}
              x2={48}
              y2={36}
              stroke={textColor}
              strokeOpacity={0.35}
              strokeWidth={1.5}
            />
            <line
              x1={48}
              y1={60}
              x2={48}
              y2={80}
              stroke={textColor}
              strokeOpacity={0.35}
              strokeWidth={1.5}
            />
            <line
              x1={16}
              y1={48}
              x2={36}
              y2={48}
              stroke={textColor}
              strokeOpacity={0.35}
              strokeWidth={1.5}
            />
            <line
              x1={60}
              y1={48}
              x2={80}
              y2={48}
              stroke={textColor}
              strokeOpacity={0.35}
              strokeWidth={1.5}
            />
          </svg>
        </div>
      )}

      {/* Bottom Timecode */}
      {showTimestamp && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "0.14em",
            color: textColor,
            opacity: 0.85,
          }}
        >
          <span>TC {formatTimecode(frame, fps)}</span>
          <span>30P · ARCHIVE TAPE</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
