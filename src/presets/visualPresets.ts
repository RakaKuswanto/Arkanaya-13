import { ARKANAYA_COLORS } from "../theme/tokens";

export type VisualPresetName =
  | "archiveReveal"
  | "classifiedDossier"
  | "evidenceDiscovery"
  | "timelineInvestigation"
  | "mapJourney"
  | "archivalMemory"
  | "mysteryPause"
  | "cinematicClosing";

export type VisualPresetConfig = {
  name: VisualPresetName;
  description: string;
  transition: "none" | "verticalWipe" | "paperCut" | "filmBurn";
  accentColor: string;
  filmGrain: number;
  vignette: number;
  kenBurnsMode: "zoomIn" | "zoomOut" | "panLeft" | "panRight";
  stamp?: string;
};

export const VISUAL_PRESETS: Record<VisualPresetName, VisualPresetConfig> = {
  archiveReveal: {
    name: "archiveReveal",
    description: "Pembukaan arsip foto atau kliping dengan zoom perlahan.",
    transition: "paperCut",
    accentColor: ARKANAYA_COLORS.archiveGold,
    filmGrain: 0.14,
    vignette: 0.45,
    kenBurnsMode: "zoomIn",
  },
  classifiedDossier: {
    name: "classifiedDossier",
    description: "Pengungkapan dokumen rahasia, sensor teks, dan stempel.",
    transition: "verticalWipe",
    accentColor: ARKANAYA_COLORS.bloodRed,
    filmGrain: 0.12,
    vignette: 0.55,
    kenBurnsMode: "zoomOut",
    stamp: "CLASSIFIED",
  },
  evidenceDiscovery: {
    name: "evidenceDiscovery",
    description: "Papan bukti investigasi dengan pin, benang merah, dan marker.",
    transition: "paperCut",
    accentColor: ARKANAYA_COLORS.bloodRed,
    filmGrain: 0.1,
    vignette: 0.48,
    kenBurnsMode: "panRight",
  },
  timelineInvestigation: {
    name: "timelineInvestigation",
    description: "Urutan kronologi kejadian dengan penekanan waktu kunci.",
    transition: "verticalWipe",
    accentColor: ARKANAYA_COLORS.archiveGold,
    filmGrain: 0.1,
    vignette: 0.42,
    kenBurnsMode: "zoomIn",
  },
  mapJourney: {
    name: "mapJourney",
    description: "Visualisasi rute pergerakan dan sektor geografis.",
    transition: "verticalWipe",
    accentColor: ARKANAYA_COLORS.bloodRed,
    filmGrain: 0.08,
    vignette: 0.5,
    kenBurnsMode: "panLeft",
  },
  archivalMemory: {
    name: "archivalMemory",
    description: "Nuansa memori analog hangat dengan film burn dan contact sheet.",
    transition: "filmBurn",
    accentColor: ARKANAYA_COLORS.archiveGold,
    filmGrain: 0.18,
    vignette: 0.6,
    kenBurnsMode: "zoomOut",
  },
  mysteryPause: {
    name: "mysteryPause",
    description: "Jeda tenang untuk pernyataan atau pertanyaan tak terjawab.",
    transition: "none",
    accentColor: ARKANAYA_COLORS.bloodRed,
    filmGrain: 0.12,
    vignette: 0.65,
    kenBurnsMode: "zoomIn",
    stamp: "UNSOLVED",
  },
  cinematicClosing: {
    name: "cinematicClosing",
    description: "Penutupan dokumenter dengan fade to black dan tagline ARKANAYA 13.",
    transition: "filmBurn",
    accentColor: ARKANAYA_COLORS.bloodRed,
    filmGrain: 0.11,
    vignette: 0.68,
    kenBurnsMode: "zoomOut",
  },
};
