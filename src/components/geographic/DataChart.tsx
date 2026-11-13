import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type DataPoint = {
  label: string;
  value: number;
  highlight?: boolean;
};

export type DataChartProps = {
  title: string;
  type?: "bar" | "line" | "timeline";
  data: readonly DataPoint[];
  unit?: string;
  sourceCitation?: string;
  accentColor?: string;
  height?: number;
  style?: React.CSSProperties;
};

/**
 * Deterministic documentary data chart supporting horizontal bar, line trend, and quantitative timeline views.
 */
export const DataChart = ({
  title,
  type = "bar",
  data,
  unit = "",
  sourceCitation,
  accentColor = ARKANAYA_COLORS.bloodRed,
  height = 240,
  style,
}: DataChartProps) => {
  const frame = useCurrentFrame();
  const maxValue = Math.max(1, ...data.map((d) => d.value));

  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const drawP = interpolate(frame, [6, 36], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chartW = 760;
  const chartH = height;

  return (
    <div
      style={{
        backgroundColor: ARKANAYA_COLORS.surfacePanel,
        border: ARKANAYA_BORDERS.subtle,
        padding: "22px 26px",
        boxShadow: ARKANAYA_SHADOWS.panel,
        opacity: enter,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 13,
          letterSpacing: "0.14em",
          color: ARKANAYA_COLORS.archiveGold,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        QUANTITATIVE RECORD // {type.toUpperCase()}
      </div>
      <div
        style={{
          fontFamily: ARKANAYA_FONTS.secondary,
          fontSize: 34,
          color: ARKANAYA_COLORS.archiveCream,
          letterSpacing: "0.03em",
          marginBottom: 18,
        }}
      >
        {title}
      </div>

      {type === "bar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.map((d, idx) => {
            const pct = (d.value / maxValue) * 100 * drawP;
            const barColor = d.highlight
              ? accentColor
              : ARKANAYA_COLORS.archiveGold;
            return (
              <div key={`${d.label}-${idx}`}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: ARKANAYA_FONTS.mono,
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: ARKANAYA_COLORS.archiveCream }}>
                    {d.label}
                  </span>
                  <span style={{ color: barColor, fontWeight: 700 }}>
                    {Math.round(d.value * drawP)}
                    {unit}
                  </span>
                </div>
                <div
                  style={{
                    height: 12,
                    backgroundColor: "rgba(232, 223, 207, 0.1)",
                  }}
                >
                  <div
                    style={{
                      width: `${pct.toFixed(1)}%`,
                      height: "100%",
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(type === "line" || type === "timeline") && data.length > 0 && (
        <svg
          width="100%"
          height={chartH}
          viewBox={`0 0 ${chartW} ${chartH}`}
          style={{ display: "block", overflow: "visible" }}
        >
          <line
            x1={24}
            y1={chartH - 36}
            x2={chartW - 24}
            y2={chartH - 36}
            stroke={ARKANAYA_COLORS.borderStrong}
            strokeWidth={1}
          />
          {data.length > 1 && (
            <polyline
              fill="none"
              stroke={accentColor}
              strokeWidth={3}
              points={data
                .map((d, idx) => {
                  const x =
                    36 + (idx / (data.length - 1)) * (chartW - 72);
                  const y =
                    chartH -
                    44 -
                    (d.value / maxValue) * (chartH - 72) * drawP;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(" ")}
            />
          )}
          {data.map((d, idx) => {
            const x =
              data.length === 1
                ? chartW / 2
                : 36 + (idx / (data.length - 1)) * (chartW - 72);
            const y =
              chartH - 44 - (d.value / maxValue) * (chartH - 72) * drawP;
            return (
              <g key={`${d.label}-${idx}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={d.highlight ? 7 : 5}
                  fill={
                    d.highlight ? accentColor : ARKANAYA_COLORS.archiveCream
                  }
                />
                <text
                  x={x}
                  y={chartH - 12}
                  textAnchor="middle"
                  fill={ARKANAYA_COLORS.ashGrey}
                  fontFamily={ARKANAYA_FONTS.mono}
                  fontSize={13}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {sourceCitation && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: ARKANAYA_BORDERS.subtle,
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 13,
            color: ARKANAYA_COLORS.ashGrey,
          }}
        >
          SOURCE // {sourceCitation}
        </div>
      )}
    </div>
  );
};
