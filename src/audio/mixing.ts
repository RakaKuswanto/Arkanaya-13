import { computeDuckEnvelope, type DuckRange } from "../components/audio/AudioDuck";
import { computeFadeEnvelope } from "../components/audio/AudioFade";
import type { AudioMixConfig, SfxTimelineEvent } from "./types";

/**
 * Default ARKANAYA 13 4-bus mixing architecture tuned for mobile (9:16) & desktop (16:9).
 * Priority order: VoiceOver > Primary SFX > Ambient Bed > Background Music (ducked under VO).
 */
export const ARKANAYA_AUDIO_MIX: AudioMixConfig = {
  voiceoverVolume: 1.0,
  sfxBaseVolume: 0.58,
  sfxMaxVolume: 0.85,
  sfxUnderVoiceOverScale: 0.72,
  sfxPolyphonyCeiling: 0.9,
  musicBaseVolume: 0.26,
  musicDuckedVolume: 0.1,
  musicDuckRampFrames: 12,
  ambientBaseVolume: 0.16,
  ambientDuckedVolume: 0.095,
  ambientDuckRampFrames: 14,
};

/**
 * Mastering target guidelines for TikTok, Instagram Reels, and YouTube Shorts.
 */
export const ARKANAYA_AUDIO_MASTERING_TARGETS = {
  integratedLufsMin: -16,
  integratedLufsMax: -14,
  truePeakMaxDbTp: -1.0,
  voiceoverDominanceDbOverMusic: 10,
  sampleRateHz: 44100,
  aacBitrateKbps: 192,
} as const;

export const clampAudioVolume = (
  value: number,
  maxAllowed = 1,
): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(maxAllowed, value));
};

/**
 * Prevents digital clipping when multiple SFX events trigger simultaneously on the same frame.
 */
export const computePolyphonyScale = (
  concurrentEvents: readonly {
    startFrame: number;
    endFrame: number;
    volume: number;
  }[],
  compositionFrame: number,
  ceiling = ARKANAYA_AUDIO_MIX.sfxPolyphonyCeiling,
): number => {
  let activeSum = 0;
  for (const ev of concurrentEvents) {
    if (compositionFrame >= ev.startFrame && compositionFrame < ev.endFrame) {
      activeSum += Math.max(0, ev.volume);
    }
  }
  if (activeSum <= ceiling || activeSum <= 0) return 1;
  return Math.max(0.25, ceiling / activeSum);
};

/**
 * Computes deterministic sample-free SFX volume envelope for a single frame:
 * base volume -> fade in/out -> optional VO intelligibility ducking -> polyphony ceiling.
 */
export const computeSfxCombinedEnvelope = ({
  localFrame,
  compositionFrame,
  durationInFrames,
  baseVolume = ARKANAYA_AUDIO_MIX.sfxBaseVolume,
  fadeInFrames = 2,
  fadeOutFrames = 6,
  duckVoiceOver = false,
  voDuckRanges = [],
  voDuckScale = ARKANAYA_AUDIO_MIX.sfxUnderVoiceOverScale,
  polyphonyScale = 1,
  maxVolume = ARKANAYA_AUDIO_MIX.sfxMaxVolume,
}: {
  localFrame: number;
  compositionFrame: number;
  durationInFrames: number;
  baseVolume?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  duckVoiceOver?: boolean;
  voDuckRanges?: readonly DuckRange[];
  voDuckScale?: number;
  polyphonyScale?: number;
  maxVolume?: number;
}): number => {
  const safeBase = clampAudioVolume(baseVolume, maxVolume);
  const fadeLevel = computeFadeEnvelope({
    frame: localFrame,
    durationInFrames,
    fadeInFrames,
    fadeOutFrames,
    baseVolume: safeBase,
  });

  const duckedLevel =
    duckVoiceOver && voDuckRanges.length > 0
      ? computeDuckEnvelope({
          frame: compositionFrame,
          duckRanges: voDuckRanges,
          baseVolume: fadeLevel,
          duckedVolume: fadeLevel * clampAudioVolume(voDuckScale, 1),
          rampFrames: 6,
        })
      : fadeLevel;

  return clampAudioVolume(duckedLevel * clampAudioVolume(polyphonyScale, 1), 1);
};

/**
 * Extracts additional duck ranges from SFX timeline events marked with `duckMusicBy`
 * (e.g., Silence Transition or Major Revelation where music drops out briefly).
 */
export const deriveMusicDuckRangesFromSfx = (
  events: readonly SfxTimelineEvent[],
  resolveEndFrame: (event: SfxTimelineEvent) => number,
): DuckRange[] => {
  const ranges: DuckRange[] = [];
  for (const event of events) {
    if (event.enabled === false) continue;
    if (typeof event.duckMusicBy === "number" && event.duckMusicBy > 0) {
      const startFrame = Math.max(0, Math.round(event.startFrame));
      const endFrame = Math.max(startFrame + 6, Math.round(resolveEndFrame(event)));
      ranges.push({ startFrame, endFrame });
    }
  }
  return ranges;
};
