import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import { ARSIP_COLORS } from "../../theme/tokens";
import { ARSIP_FONTS } from "../../theme/typography";

export type TimelineEvent = {
  date: string;
  title: string;
  description: string;
  highlight?: boolean;
};

export type CaseTimelineProps = {
  events: readonly TimelineEvent[];
  orientation?: "vertical" | "horizontal";
  staggerFrames?: number;
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
  lineColor?: string;
  width?: number;
  style?: React.CSSProperties;
};

export const CaseTimeline = ({
  events,
  orientation = "vertical",
  staggerFrames = 14,
  accentColor = ARSIP_COLORS.bloodRed,
  textColor = ARSIP_COLORS.archivePaper,
  mutedColor = ARSIP_COLORS.mutedGray,
  lineColor = "rgba(232, 228, 220, 0.24)",
  width = 880,
  style,
}: CaseTimelineProps) => {
  const frame = useCurrentFrame();

  const totalSpan = Math.max(18, events.length * staggerFrames + 12);
  const spineProgress = interpolate(frame, [0, totalSpan], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (orientation === "horizontal") {
    return (
      <div
        style={{
          position: "relative",
          width,
          paddingTop: 32,
          ...style,
        }}
      >
        <div
          style={{
            position: "relative",
            height: 2,
            backgroundColor: lineColor,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: `${spineProgress * 100}%`,
              height: "100%",
              backgroundColor: accentColor,
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.max(1, events.length)}, minmax(0, 1fr))`,
            gap: 24,
          }}
        >
          {events.map((ev, idx) => {
            const start = idx * staggerFrames;
            const reveal = interpolate(frame, [start, start + 16], [0, 1], {
              easing: EDITORIAL_EASE,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={`${ev.date}-${idx}`}
                style={{
                  position: "relative",
                  opacity: reveal,
                  translate: `0px ${(1 - reveal) * 20}px`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -37,
                    left: 0,
                    width: 16,
                    height: 16,
                    borderRadius: 9999,
                    backgroundColor: ev.highlight
                      ? accentColor
                      : ARSIP_COLORS.archivePaper,
                    border: `3px solid ${ARSIP_COLORS.deepBlack}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: ARSIP_FONTS.mono,
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: ev.highlight ? accentColor : ARSIP_COLORS.archiveGold,
                    marginBottom: 6,
                  }}
                >
                  {ev.date}
                </div>
                <div
                  style={{
                    fontFamily: ARSIP_FONTS.secondary,
                    fontSize: 32,
                    lineHeight: 0.98,
                    letterSpacing: "0.03em",
                    color: textColor,
                    marginBottom: 8,
                  }}
                >
                  {ev.title}
                </div>
                <div
                  style={{
                    fontFamily: ARSIP_FONTS.body,
                    fontSize: 19,
                    lineHeight: 1.4,
                    color: mutedColor,
                  }}
                >
                  {ev.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width,
        paddingLeft: 44,
        display: "flex",
        flexDirection: "column",
        gap: 34,
        ...style,
      }}
    >
      {/* Vertical background line & active progress line */}
      <div
        style={{
          position: "absolute",
          left: 11,
          top: 10,
          bottom: 10,
          width: 2,
          backgroundColor: lineColor,
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${spineProgress * 100}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>

      {events.map((ev, idx) => {
        const start = idx * staggerFrames;
        const reveal = interpolate(frame, [start, start + 16], [0, 1], {
          easing: EDITORIAL_EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={`${ev.date}-${idx}`}
            style={{
              position: "relative",
              opacity: reveal,
              translate: `${(1 - reveal) * 24}px 0px`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -42,
                top: 4,
                width: 20,
                height: 20,
                borderRadius: 9999,
                backgroundColor: ev.highlight
                  ? accentColor
                  : ARSIP_COLORS.archivePaper,
                border: `4px solid ${ARSIP_COLORS.deepBlack}`,
                boxShadow: ev.highlight
                  ? `0 0 0 4px rgba(169, 35, 43, 0.25)`
                  : undefined,
              }}
            />

            <div
              style={{
                fontFamily: ARSIP_FONTS.mono,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: ev.highlight ? accentColor : ARSIP_COLORS.archiveGold,
                marginBottom: 6,
              }}
            >
              {ev.date}
            </div>

            <div
              style={{
                fontFamily: ARSIP_FONTS.secondary,
                fontSize: 42,
                lineHeight: 0.96,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                color: textColor,
                marginBottom: 8,
              }}
            >
              {ev.title}
            </div>

            <div
              style={{
                fontFamily: ARSIP_FONTS.body,
                fontSize: 23,
                lineHeight: 1.45,
                color: mutedColor,
              }}
            >
              {ev.description}
            </div>
          </div>
        );
      })}
    </div>
  );
};
