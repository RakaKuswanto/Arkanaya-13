import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EDITORIAL_EASE } from "../../motion/presets";
import type { AnyVerificationStatus } from "../../theme/dataIntegrity";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  ARKANAYA_SHADOWS,
} from "../../theme/tokens";
import { ARKANAYA_FONTS } from "../../theme/typography";
import { CaseStamp } from "./CaseStamp";
import { VerificationBadge } from "./VerificationBadge";

export type PoliceReportProps = {
  reportNumber: string;
  department?: string;
  date: string;
  officer?: string;
  incidentSummary: string;
  findings?: readonly string[];
  classification?: string;
  verificationStatus?: AnyVerificationStatus;
  style?: React.CSSProperties;
};

/**
 * Structured investigative/incident dossier sheet with itemized findings and archival classification stamp.
 */
export const PoliceReport = ({
  reportNumber,
  department = "INVESTIGATIVE RECORDS DIVISION",
  date,
  officer = "DUTY OFFICER // ARCHIVE LOG",
  incidentSummary,
  findings = [],
  classification,
  verificationStatus = "OFFICIAL STATEMENT",
  style,
}: PoliceReportProps) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: ARKANAYA_COLORS.archiveCream,
        color: ARKANAYA_COLORS.inkBlack,
        border: ARKANAYA_BORDERS.paperHeavy,
        padding: "28px 34px",
        boxShadow: ARKANAYA_SHADOWS.heavy,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px)`,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: ARKANAYA_BORDERS.paperHeavy,
          paddingBottom: 12,
          marginBottom: 16,
          fontFamily: ARKANAYA_FONTS.mono,
        }}
      >
        <div>
          <div style={{ fontSize: 13, letterSpacing: "0.14em" }}>
            {department}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: ARKANAYA_COLORS.bloodRed,
              marginTop: 2,
            }}
          >
            INCIDENT REPORT // {reportNumber}
          </div>
        </div>
        <VerificationBadge status={verificationStatus} compact />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: 14,
          color: ARKANAYA_COLORS.charcoal,
          marginBottom: 16,
        }}
      >
        <span>DATE FILED: {date}</span>
        <span>EXAMINER: {officer}</span>
      </div>

      <div
        style={{
          fontFamily: ARKANAYA_FONTS.body,
          fontSize: 21,
          lineHeight: 1.48,
          marginBottom: findings.length > 0 ? 16 : 0,
        }}
      >
        {incidentSummary}
      </div>

      {findings.length > 0 && (
        <div
          style={{
            borderTop: "1px dashed rgba(20, 19, 17, 0.35)",
            paddingTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 15,
          }}
        >
          {findings.map((f, idx) => (
            <div key={idx}>
              [{String(idx + 1).padStart(2, "0")}] {f}
            </div>
          ))}
        </div>
      )}

      {classification && (
        <div style={{ position: "absolute", right: 24, bottom: 18 }}>
          <CaseStamp text={classification} fontSize={32} delayFrames={14} />
        </div>
      )}
    </div>
  );
};
