import { getSfxAsset } from "./registry";
import type { SoundDesignPresetName, SfxTimelineEvent } from "./types";

export type SoundDesignPresetCueSpec = {
  /** References an existing asset ID from SFX_ASSET_REGISTRY (never duplicates files). */
  assetId: string;
  /** Offset from scene start in frames, or negative offset from scene end (`fromEnd`). */
  anchor: "start" | "middle" | "end";
  offsetFrames: number;
  /** Optional override duration in frames; defaults to asset duration. */
  durationFrames?: number;
  volumeScale?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  playbackRate?: number;
  duckVoiceOver?: boolean;
  duckMusicBy?: number;
};

export type SoundDesignPresetDefinition = {
  name: SoundDesignPresetName;
  description: string;
  editorialMood: string;
  cues: readonly SoundDesignPresetCueSpec[];
};

export const SOUND_DESIGN_PRESETS: Record<
  SoundDesignPresetName,
  SoundDesignPresetDefinition
> = {
  "Documentary Opening": {
    name: "Documentary Opening",
    description:
      "Hentakan sub-bass terkendali diikuti tekstur proyektor 16mm pelan untuk membuka kasus.",
    editorialMood: "Otoritatif, investigatif, membuka ketegangan arsip.",
    cues: [
      {
        assetId: "sfx-low-impact",
        anchor: "start",
        offsetFrames: 4,
        volumeScale: 0.95,
        fadeInFrames: 2,
        fadeOutFrames: 18,
      },
      {
        assetId: "sfx-film-projector",
        anchor: "start",
        offsetFrames: 18,
        volumeScale: 0.65,
        fadeInFrames: 10,
        fadeOutFrames: 16,
        duckVoiceOver: true,
      },
    ],
  },
  "Evidence Reveal": {
    name: "Evidence Reveal",
    description:
      "Klik rana kamera forensik lalu hentakan stempel bukti arsip secara berurutan.",
    editorialMood: "Tajam, terverifikasi, fokus pada barang bukti.",
    cues: [
      {
        assetId: "sfx-camera-shutter",
        anchor: "start",
        offsetFrames: 8,
        volumeScale: 1,
        fadeInFrames: 1,
        fadeOutFrames: 4,
      },
      {
        assetId: "sfx-stamp-impact",
        anchor: "start",
        offsetFrames: 24,
        volumeScale: 0.92,
        fadeInFrames: 1,
        fadeOutFrames: 6,
      },
    ],
  },
  "Newspaper Reveal": {
    name: "Newspaper Reveal",
    description:
      "Gesekan halaman koran arsip dipadukan ketikan mesin tik untuk judul dan tanggal terbit.",
    editorialMood: "Editorial vintage, autentik media cetak.",
    cues: [
      {
        assetId: "sfx-paper-movement",
        anchor: "start",
        offsetFrames: 6,
        volumeScale: 1,
        fadeInFrames: 2,
        fadeOutFrames: 6,
      },
      {
        assetId: "sfx-typewriter",
        anchor: "start",
        offsetFrames: 16,
        volumeScale: 0.85,
        fadeInFrames: 2,
        fadeOutFrames: 10,
        duckVoiceOver: true,
      },
    ],
  },
  "Investigation Tension": {
    name: "Investigation Tension",
    description:
      "Denyut sub-harmonik pelan dengan desis radio AM tipis selama analisis teori.",
    editorialMood: "Analitis, penuh tanda tanya, menuntut fokus pendengar.",
    cues: [
      {
        assetId: "sfx-tension-pulse",
        anchor: "start",
        offsetFrames: 6,
        volumeScale: 0.9,
        fadeInFrames: 12,
        fadeOutFrames: 20,
        duckVoiceOver: true,
      },
      {
        assetId: "sfx-radio-static",
        anchor: "middle",
        offsetFrames: -16,
        volumeScale: 0.68,
        fadeInFrames: 8,
        fadeOutFrames: 14,
        duckVoiceOver: true,
      },
    ],
  },
  "Historical Flashback": {
    name: "Historical Flashback",
    description:
      "Putaran balik pita magnetik menuju proyektor 16mm sebagai penanda mundur waktu.",
    editorialMood: "Nostalgia analog, rekaman masa lampau.",
    cues: [
      {
        assetId: "sfx-tape-rewind",
        anchor: "start",
        offsetFrames: 4,
        volumeScale: 0.95,
        fadeInFrames: 2,
        fadeOutFrames: 6,
      },
      {
        assetId: "sfx-film-projector",
        anchor: "start",
        offsetFrames: 24,
        volumeScale: 0.72,
        fadeInFrames: 10,
        fadeOutFrames: 16,
        duckVoiceOver: true,
      },
    ],
  },
  "Digital Glitch": {
    name: "Digital Glitch",
    description:
      "Gangguan frame telemetri singkat dengan jejak statik radio untuk data teknologi atau rekaman rusak.",
    editorialMood: "Dingin, klinis, anomali sistem/teknologi.",
    cues: [
      {
        assetId: "sfx-digital-glitch",
        anchor: "start",
        offsetFrames: 6,
        volumeScale: 0.95,
        fadeInFrames: 1,
        fadeOutFrames: 5,
      },
      {
        assetId: "sfx-radio-static",
        anchor: "start",
        offsetFrames: 18,
        durationFrames: 28,
        volumeScale: 0.55,
        fadeInFrames: 2,
        fadeOutFrames: 8,
        duckVoiceOver: true,
      },
    ],
  },
  "Major Revelation": {
    name: "Major Revelation",
    description:
      "Penurunan musik singkat lalu sub-bass boom dan stempel konfirmasi pada fakta puncak.",
    editorialMood: "Titik balik naratif yang tegas tanpa jumpscare murah.",
    cues: [
      {
        assetId: "sfx-low-impact",
        anchor: "start",
        offsetFrames: 8,
        volumeScale: 1,
        fadeInFrames: 2,
        fadeOutFrames: 18,
        duckMusicBy: 0.6,
      },
      {
        assetId: "sfx-tension-pulse",
        anchor: "start",
        offsetFrames: 26,
        volumeScale: 0.8,
        fadeInFrames: 10,
        fadeOutFrames: 20,
        duckVoiceOver: true,
      },
    ],
  },
  "Dramatic Ending": {
    name: "Dramatic Ending",
    description:
      "Benturan sub rendah diikuti putaran kaset berhenti untuk menutup arsip episode.",
    editorialMood: "Reflektif, menggantung, menyisakan pertanyaan terbuka.",
    cues: [
      {
        assetId: "sfx-low-impact",
        anchor: "start",
        offsetFrames: 6,
        volumeScale: 0.88,
        fadeInFrames: 4,
        fadeOutFrames: 20,
        duckMusicBy: 0.5,
      },
      {
        assetId: "sfx-tape-rewind",
        anchor: "end",
        offsetFrames: -40,
        volumeScale: 0.72,
        fadeInFrames: 4,
        fadeOutFrames: 10,
        playbackRate: 0.9,
      },
    ],
  },
  "Silence Transition": {
    name: "Silence Transition",
    description:
      "Hembusan transisi lembut disertai ducking musik untuk menciptakan jeda hening naratif.",
    editorialMood: "Kontemplatif, memutus ritme agar kalimat penting menancap.",
    cues: [
      {
        assetId: "sfx-subtle-transition",
        anchor: "start",
        offsetFrames: 2,
        volumeScale: 0.85,
        fadeInFrames: 4,
        fadeOutFrames: 12,
        duckMusicBy: 0.85,
      },
    ],
  },
};

export const SOUND_DESIGN_PRESET_LIST: readonly SoundDesignPresetDefinition[] =
  Object.values(SOUND_DESIGN_PRESETS);

/**
 * Instantiates deterministic composition-level SfxTimelineEvent entries for a scene
 * from a named SoundDesignPresetDefinition.
 */
export const instantiateSoundPreset = (
  presetName: SoundDesignPresetName,
  {
    sceneId,
    sceneStartFrame,
    sceneDurationFrames,
    baseEventId,
  }: {
    sceneId: string;
    sceneStartFrame: number;
    sceneDurationFrames: number;
    baseEventId?: string;
  },
): SfxTimelineEvent[] => {
  const preset = SOUND_DESIGN_PRESETS[presetName];
  if (!preset) return [];

  const prefix = baseEventId ?? `${sceneId}-preset`;
  return preset.cues.map((cue, index) => {
    const asset = getSfxAsset(cue.assetId);
    const anchorBase =
      cue.anchor === "end"
        ? sceneStartFrame + sceneDurationFrames
        : cue.anchor === "middle"
          ? sceneStartFrame + Math.floor(sceneDurationFrames / 2)
          : sceneStartFrame;

    const rawStart = anchorBase + cue.offsetFrames;
    const startFrame = Math.max(
      sceneStartFrame,
      Math.min(sceneStartFrame + Math.max(0, sceneDurationFrames - 8), rawStart),
    );
    const maxRemaining = Math.max(4, sceneStartFrame + sceneDurationFrames - startFrame);
    const desiredDuration = cue.durationFrames ?? asset?.durationFrames ?? 45;
    const duration = Math.min(maxRemaining, desiredDuration);

    return {
      id: `${prefix}-${index + 1}-${cue.assetId}`,
      assetId: cue.assetId,
      src: asset?.filePath,
      category: asset?.category,
      startFrame,
      duration,
      volume: Number(((asset?.defaultVolume ?? 0.5) * (cue.volumeScale ?? 1)).toFixed(3)),
      fadeInFrames: cue.fadeInFrames ?? 2,
      fadeOutFrames: cue.fadeOutFrames ?? 6,
      playbackRate: cue.playbackRate ?? 1,
      duckVoiceOver: cue.duckVoiceOver ?? false,
      duckMusicBy: cue.duckMusicBy,
      sceneId,
      preset: presetName,
      enabled: true,
    };
  });
};
