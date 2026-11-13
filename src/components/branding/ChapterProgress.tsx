import type React from "react";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type ChapterProgressProps = {
  currentChapter: number;
  totalChapters: number;
  label?: string;
  accentColor?: string;
  style?: React.CSSProperties;
};

export const ChapterProgress = ({
  currentChapter,
  totalChapters,
  label,
  accentColor = ARSIP_COLORS.bloodRed,
  style,
}: ChapterProgressProps) => {
  const safeTotal = Math.max(1, totalChapters);
  const clampedCurrent = Math.max(1, Math.min(safeTotal, currentChapter));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        ...style,
      }}
    >
      {label && (
        <span
          style={{
            fontFamily: ARSIP_FONTS.mono,
            fontSize: 13,
            letterSpacing: "0.12em",
            color: ARSIP_COLORS.mutedGray,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}
      <div style={{ display: "flex", gap: 6, flex: 1 }}>
        {Array.from({ length: safeTotal }).map((_, idx) => {
          const isActive = idx + 1 === clampedCurrent;
          const isDone = idx + 1 < clampedCurrent;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: 4,
                backgroundColor: isActive
                  ? accentColor
                  : isDone
                    ? ARSIP_COLORS.archiveGold
                    : "rgba(232, 228, 220, 0.16)",
              }}
            />
          );
        })}
      </div>
      <span
        style={{
          fontFamily: ARSIP_FONTS.mono,
          fontSize: 13,
          color: ARSIP_COLORS.archivePaper,
        }}
      >
        {String(clampedCurrent).padStart(2, "0")}/
        {String(safeTotal).padStart(2, "0")}
      </span>
    </div>
  );
};
