import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type DocumentaryLowerThirdProps = {
  name: string;
  role?: string;
  credential?: string;
  accentColor?: string;
  style?: React.CSSProperties;
};

export const DocumentaryLowerThird = ({
  name,
  role,
  credential,
  accentColor = ARSIP_COLORS.bloodRed,
  style,
}: DocumentaryLowerThirdProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        backgroundColor: "rgba(17, 17, 17, 0.92)",
        border: "1px solid rgba(232, 228, 220, 0.16)",
        opacity: enter,
        transform: `translateX(${(1 - enter) * -28}px)`,
        ...style,
      }}
    >
      <div style={{ width: 6, backgroundColor: accentColor }} />
      <div style={{ padding: "12px 20px" }}>
        <div
          style={{
            fontFamily: ARSIP_FONTS.secondary,
            fontSize: 32,
            letterSpacing: "0.06em",
            lineHeight: 1.05,
            color: ARSIP_COLORS.archivePaper,
            textTransform: "uppercase",
          }}
        >
          {name}
        </div>
        {(role || credential) && (
          <div
            style={{
              fontFamily: ARSIP_FONTS.mono,
              fontSize: 14,
              color: ARSIP_COLORS.archiveGold,
              letterSpacing: "0.08em",
              marginTop: 4,
              textTransform: "uppercase",
            }}
          >
            {[role, credential].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
};
