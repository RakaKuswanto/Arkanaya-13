import { useId } from "react";
import { ARKANAYA_COLORS } from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type MediaFallbackPlateProps = {
  label?: string;
  sublabel?: string;
  showGrid?: boolean;
};

/**
 * Deterministic fallback plate rendered cleanly whenever an optional media asset is absent.
 */
export const MediaFallbackPlate = ({
  label = "ARCHIVAL PLATE // NO. 00",
  sublabel = "SUPPLY SRC ASSET TO RENDER MEDIA",
  showGrid = true,
}: MediaFallbackPlateProps) => {
  const uid = useId().replace(/:/g, "");
  const gradId = `plate-grad-${uid}`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 600 420"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block", backgroundColor: ARKANAYA_COLORS.obsidian }}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="45%" r="68%">
          <stop offset="0%" stopColor={ARKANAYA_COLORS.charcoal} />
          <stop offset="100%" stopColor={ARKANAYA_COLORS.deepBlack} />
        </radialGradient>
      </defs>
      <rect width="600" height="420" fill={`url(#${gradId})`} />
      {showGrid && (
        <g
          stroke={ARKANAYA_COLORS.archiveCream}
          strokeOpacity="0.16"
          strokeWidth="1"
          fill="none"
        >
          <line x1="0" y1="210" x2="600" y2="210" />
          <line x1="300" y1="0" x2="300" y2="420" />
          <circle cx="300" cy="210" r="95" />
          <rect x="40" y="34" width="520" height="352" strokeDasharray="6 6" />
        </g>
      )}
      <text
        x="300"
        y="204"
        textAnchor="middle"
        fill={ARKANAYA_COLORS.archiveCream}
        fillOpacity="0.62"
        fontFamily={ARKANAYA_FONTS.mono}
        fontSize="16"
        letterSpacing="3"
      >
        {label}
      </text>
      <text
        x="300"
        y="234"
        textAnchor="middle"
        fill={ARKANAYA_COLORS.archiveGold}
        fillOpacity="0.72"
        fontFamily={ARKANAYA_FONTS.mono}
        fontSize="12"
        letterSpacing="2"
      >
        {sublabel}
      </text>
    </svg>
  );
};
