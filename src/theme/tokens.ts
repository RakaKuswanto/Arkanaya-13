export const ARKANAYA_BRAND = {
  name: "ARKANAYA",
  seriesName: "ARKANAYA 13",
  tagline: "Setiap kejadian punya cerita. Tidak semua cerita punya jawaban.",
  width: 1080,
  height: 1920,
  landscapeWidth: 1920,
  landscapeHeight: 1080,
  fps: 30,
} as const;

export const ARKANAYA_COLORS = {
  obsidian: "#101114",
  deepBlack: "#0A0B0D",
  archivePaper: "#E8DFCF",
  archiveCream: "#E8DFCF",
  bloodRed: "#9E302D",
  archiveGold: "#A58C50",
  mutedGray: "#77746D",
  ashGrey: "#77746D",
  charcoal: "#343638",
  agedPaper: "#D6CBB8",
  inkBlack: "#141311",
  offWhite: "#F3EDE0",
  verifiedOlive: "#6E8F6B",
  allegedAmber: "#C48A3D",
  officialSlate: "#7B909E",
  borderSubtle: "rgba(232, 223, 207, 0.16)",
  borderStrong: "rgba(232, 223, 207, 0.28)",
  borderPaper: "rgba(20, 19, 17, 0.24)",
  surfacePanel: "rgba(16, 17, 20, 0.90)",
  surfaceCharcoal: "rgba(52, 54, 56, 0.45)",
} as const;

export const ARKANAYA_SPACING = {
  xxs: 4,
  xs: 8,
  sm: 14,
  md: 20,
  lg: 28,
  xl: 36,
  xxl: 48,
} as const;

export const ARKANAYA_BORDERS = {
  subtle: `1px solid ${ARKANAYA_COLORS.borderSubtle}`,
  strong: `1px solid ${ARKANAYA_COLORS.borderStrong}`,
  paper: `1px solid ${ARKANAYA_COLORS.borderPaper}`,
  paperHeavy: `2px solid ${ARKANAYA_COLORS.inkBlack}`,
  accentLeft: (color: string = ARKANAYA_COLORS.bloodRed) => `4px solid ${color}`,
} as const;

export const ARKANAYA_SHADOWS = {
  panel: "0 20px 52px rgba(0, 0, 0, 0.55)",
  heavy: "0 28px 72px rgba(0, 0, 0, 0.65)",
  pin: "0 4px 10px rgba(0, 0, 0, 0.45)",
  insetBoard: "inset 0 0 90px rgba(0, 0, 0, 0.65)",
} as const;

export const ARKANAYA_TEXTURES = {
  darkPlateGradient: "radial-gradient(circle at 50% 45%, #232428 0%, #101114 82%)",
  boardSurface: "#15171B",
  newspaperPaper: "#DDD3C0",
  vignetteRadial: (strength = 0.52) =>
    `radial-gradient(ellipse at center, transparent 48%, rgba(10, 11, 13, ${strength}) 100%)`,
} as const;

export const ARKANAYA_FILM_GRAIN = {
  off: 0,
  subtle: 0.08,
  standard: 0.12,
  heavy: 0.2,
  dustDefault: 0.35,
  scratchesDefault: 0.25,
  vignetteDefault: 0.5,
} as const;

export const ARKANAYA_DURATIONS = {
  micro: 8,
  enter: 16,
  reveal: 22,
  transition: 28,
  stagger: 6,
  exit: 12,
} as const;

export const ARKANAYA_EASINGS = {
  editorial: [0.16, 1, 0.3, 1] as const,
  sharpExit: [0.7, 0, 0.84, 0] as const,
  analog: [0.25, 0.1, 0.25, 1] as const,
} as const;

export type MotionIntensity = "restrained" | "editorial" | "urgent";

export const ARKANAYA_MOTION_INTENSITY: Record<MotionIntensity, number> = {
  restrained: 0.55,
  editorial: 1.0,
  urgent: 1.35,
};

export type ComponentVariant =
  | "minimal"
  | "archive"
  | "investigative"
  | "cinematic"
  | "urgent";

/**
 * Safe margins for 1080x1920 vertical short-form documentary framing
 * (accounts for TikTok / Reels / Shorts right-side action bar & bottom caption UI).
 */
export const ARKANAYA_SAFE_MARGINS = {
  top: 140,
  bottom: 340,
  left: 64,
  right: 120,
} as const;

export const ARKANAYA_LANDSCAPE_SAFE_MARGINS = {
  top: 72,
  bottom: 84,
  left: 96,
  right: 96,
} as const;

export const getSafeMargins = (width: number, height: number) =>
  width >= height ? ARKANAYA_LANDSCAPE_SAFE_MARGINS : ARKANAYA_SAFE_MARGINS;

export const isLandscapeLayout = (width: number, height: number): boolean =>
  width >= height;

export type ArkanayaColorKey = keyof typeof ARKANAYA_COLORS;

// Backward-compatible aliases for existing components
export const ARSIP_BRAND = {
  ...ARKANAYA_BRAND,
  name: "ARKANAYA 13",
} as const;
export const ARSIP_COLORS = ARKANAYA_COLORS;
export const ARSIP_SAFE_MARGINS = ARKANAYA_SAFE_MARGINS;
export type ArsipColorKey = ArkanayaColorKey;
