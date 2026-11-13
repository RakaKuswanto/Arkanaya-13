import { ARKANAYA_COLORS } from "./tokens";

export const EVIDENCE_VERIFICATION_STATUSES = [
  "VERIFIED",
  "ALLEGED",
  "UNVERIFIED",
  "DISPUTED",
  "UNKNOWN",
  "OFFICIAL STATEMENT",
] as const;

export type EvidenceVerificationStatus =
  (typeof EVIDENCE_VERIFICATION_STATUSES)[number];

/**
 * Accepts the 6 canonical Phase 5 statuses plus legacy aliases ("OFFICIAL")
 * so existing callers continue working cleanly.
 */
export type AnyVerificationStatus =
  | EvidenceVerificationStatus
  | "OFFICIAL";

export type IntegrityVisualSpec = {
  status: EvidenceVerificationStatus;
  label: string;
  shortHint: string;
  color: string;
  borderStyle: "solid" | "dashed" | "dotted";
  background: string;
};

const INTEGRITY_SPECS: Record<EvidenceVerificationStatus, IntegrityVisualSpec> = {
  VERIFIED: {
    status: "VERIFIED",
    label: "VERIFIED",
    shortHint: "TERKONFIRMASI ARSIP / SUMBER GANDA",
    color: ARKANAYA_COLORS.verifiedOlive,
    borderStyle: "solid",
    background: "rgba(110, 143, 107, 0.14)",
  },
  "OFFICIAL STATEMENT": {
    status: "OFFICIAL STATEMENT",
    label: "OFFICIAL STATEMENT",
    shortHint: "PERNYATAAN RESMI OTORITAS TERCATAT",
    color: ARKANAYA_COLORS.officialSlate,
    borderStyle: "solid",
    background: "rgba(123, 144, 158, 0.14)",
  },
  ALLEGED: {
    status: "ALLEGED",
    label: "ALLEGED",
    shortHint: "DUGAAN / KLAIM BELUM DIBUKTIKAN",
    color: ARKANAYA_COLORS.allegedAmber,
    borderStyle: "dashed",
    background: "rgba(196, 138, 61, 0.12)",
  },
  UNVERIFIED: {
    status: "UNVERIFIED",
    label: "UNVERIFIED",
    shortHint: "BELUM TERVERIFIKASI INDEPENDEN",
    color: ARKANAYA_COLORS.ashGrey,
    borderStyle: "dashed",
    background: "rgba(119, 116, 109, 0.12)",
  },
  DISPUTED: {
    status: "DISPUTED",
    label: "DISPUTED",
    shortHint: "DIBANTAH / SALING BERTENTANGAN",
    color: ARKANAYA_COLORS.bloodRed,
    borderStyle: "dashed",
    background: "rgba(158, 48, 45, 0.15)",
  },
  UNKNOWN: {
    status: "UNKNOWN",
    label: "UNKNOWN",
    shortHint: "TIDAK DIKETAHUI / DATA KURANG",
    color: ARKANAYA_COLORS.ashGrey,
    borderStyle: "dotted",
    background: "rgba(52, 54, 56, 0.25)",
  },
};

export const normalizeVerificationStatus = (
  status?: AnyVerificationStatus | string,
): EvidenceVerificationStatus => {
  if (!status) return "UNVERIFIED";
  const upper = status.trim().toUpperCase();
  if (upper === "OFFICIAL" || upper === "OFFICIAL STATEMENT") {
    return "OFFICIAL STATEMENT";
  }
  if (
    upper === "VERIFIED" ||
    upper === "ALLEGED" ||
    upper === "UNVERIFIED" ||
    upper === "DISPUTED" ||
    upper === "UNKNOWN"
  ) {
    return upper;
  }
  return "UNVERIFIED";
};

export const getIntegrityVisualSpec = (
  status?: AnyVerificationStatus | string,
): IntegrityVisualSpec => {
  const normalized = normalizeVerificationStatus(status);
  return INTEGRITY_SPECS[normalized];
};
