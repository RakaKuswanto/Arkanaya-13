import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  ShieldAlert,
  ShieldQuestion,
} from "lucide-react";
import type React from "react";
import {
  type AnyVerificationStatus,
  getIntegrityVisualSpec,
} from "../../theme/dataIntegrity";
import { ARKANAYA_FONTS } from "../../theme/typography";

export type VerificationBadgeProps = {
  status?: AnyVerificationStatus | string;
  showHint?: boolean;
  compact?: boolean;
  style?: React.CSSProperties;
};

const renderStatusIcon = (status: string, color: string, size: number) => {
  switch (status) {
    case "VERIFIED":
      return <CheckCircle2 size={size} color={color} />;
    case "OFFICIAL STATEMENT":
      return <FileCheck2 size={size} color={color} />;
    case "ALLEGED":
      return <ShieldQuestion size={size} color={color} />;
    case "DISPUTED":
      return <ShieldAlert size={size} color={color} />;
    case "UNKNOWN":
      return <HelpCircle size={size} color={color} />;
    default:
      return <AlertTriangle size={size} color={color} />;
  }
};

/**
 * Distinct Phase 5 Data Integrity badge so VERIFIED facts are visually separated
 * from ALLEGED, UNVERIFIED, DISPUTED, UNKNOWN, or OFFICIAL STATEMENT claims.
 */
export const VerificationBadge = ({
  status = "UNVERIFIED",
  showHint = false,
  compact = false,
  style,
}: VerificationBadgeProps) => {
  const spec = getIntegrityVisualSpec(status);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: compact ? "2px 8px" : "4px 10px",
          border: `1px ${spec.borderStyle} ${spec.color}`,
          backgroundColor: spec.background,
          color: spec.color,
          fontFamily: ARKANAYA_FONTS.mono,
          fontSize: compact ? 12 : 13,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {renderStatusIcon(spec.status, spec.color, compact ? 13 : 15)}
        <span>{spec.label}</span>
      </span>
      {showHint && (
        <span
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 11,
            color: spec.color,
            letterSpacing: "0.06em",
            opacity: 0.9,
          }}
        >
          {spec.shortHint}
        </span>
      )}
    </div>
  );
};
