import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadIbmPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: antonFamily } = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const { fontFamily: bebasFamily } = loadBebasNeue("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: monoFamily } = loadIbmPlexMono("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const ARKANAYA_FONTS = {
  headline: antonFamily,
  secondary: bebasFamily,
  body: interFamily,
  mono: monoFamily,
} as const;

export type ArkanayaFontVariant = keyof typeof ARKANAYA_FONTS;

// Backward-compatible aliases
export const ARSIP_FONTS = ARKANAYA_FONTS;
export type ArsipFontVariant = ArkanayaFontVariant;
