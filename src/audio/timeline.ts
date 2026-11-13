import { instantiateSoundPreset } from "./presets";
import { getSfxAsset, resolveSfxAssetByLegacyCategory } from "./registry";
import type {
  SfxDomainCategory,
  SfxTimelineEvent,
  SoundDesignPresetName,
  SoundEffectCategory,
} from "./types";

export type ResolvedSfxEvent = SfxTimelineEvent & {
  resolvedSrc?: string;
  resolvedStartFrame: number;
  resolvedEndFrame: number;
  resolvedDurationFrames: number;
  resolvedVolume: number;
  resolvedFadeInFrames: number;
  resolvedFadeOutFrames: number;
  resolvedPlaybackRate: number;
  resolvedTrimBefore: number;
};

export type SceneSfxTriggerInput = {
  id?: string;
  assetId?: string;
  category?: SoundEffectCategory | SfxDomainCategory;
  src?: string;
  offsetFrame?: number;
  endFrame?: number;
  duration?: number;
  trimBefore?: number;
  volume?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  playbackRate?: number;
  stereoPan?: number;
  duckVoiceOver?: boolean;
  duckMusicBy?: number;
  enabled?: boolean;
};

export type EpisodeSfxSceneSource = {
  id: string;
  sfx?: SceneSfxTriggerInput;
  sfxList?: readonly SceneSfxTriggerInput[];
  soundPreset?: SoundDesignPresetName;
};

export type EpisodeSceneSlotInput = {
  scene: EpisodeSfxSceneSource;
  from: number;
  durationInFrames: number;
};

export const resolveSfxEvent = (event: SfxTimelineEvent): ResolvedSfxEvent => {
  const registryEntry = event.assetId
    ? getSfxAsset(event.assetId)
    : event.category && !event.src
      ? resolveSfxAssetByLegacyCategory(event.category as SoundEffectCategory)
      : undefined;

  const resolvedSrc = event.src ?? registryEntry?.filePath;
  const resolvedStartFrame = Math.max(0, Math.round(event.startFrame));

  let resolvedDurationFrames: number;
  if (typeof event.duration === "number" && event.duration > 0) {
    resolvedDurationFrames = Math.max(1, Math.round(event.duration));
  } else if (
    typeof event.endFrame === "number" &&
    event.endFrame > resolvedStartFrame
  ) {
    resolvedDurationFrames = Math.max(
      1,
      Math.round(event.endFrame - resolvedStartFrame),
    );
  } else {
    resolvedDurationFrames = registryEntry?.durationFrames ?? 45;
  }

  const resolvedEndFrame = resolvedStartFrame + resolvedDurationFrames;
  const resolvedVolume =
    typeof event.volume === "number"
      ? event.volume
      : (registryEntry?.defaultVolume ?? 0.58);

  return {
    ...event,
    resolvedSrc,
    resolvedStartFrame,
    resolvedEndFrame,
    resolvedDurationFrames,
    resolvedVolume: Math.max(0, Math.min(1, resolvedVolume)),
    resolvedFadeInFrames: Math.max(0, Math.round(event.fadeInFrames ?? 2)),
    resolvedFadeOutFrames: Math.max(0, Math.round(event.fadeOutFrames ?? 6)),
    resolvedPlaybackRate:
      typeof event.playbackRate === "number" && event.playbackRate > 0
        ? event.playbackRate
        : 1,
    resolvedTrimBefore: Math.max(0, Math.round(event.trimBefore ?? 0)),
  };
};

/**
 * Deterministically removes duplicate event IDs and accidental simultaneous duplicate triggers
 * (same audio source starting within 2 frames at the same point in the composition).
 */
export const deduplicateSfxEvents = (
  events: readonly ResolvedSfxEvent[],
): ResolvedSfxEvent[] => {
  const seenIds = new Set<string>();
  const accepted: ResolvedSfxEvent[] = [];

  for (const event of events) {
    if (event.enabled === false || !event.resolvedSrc) continue;
    if (seenIds.has(event.id)) continue;

    const nearDuplicate = accepted.some(
      (existing) =>
        existing.resolvedSrc === event.resolvedSrc &&
        Math.abs(existing.resolvedStartFrame - event.resolvedStartFrame) <= 2,
    );
    if (nearDuplicate) continue;

    seenIds.add(event.id);
    accepted.push(event);
  }

  return accepted.sort(
    (a, b) => a.resolvedStartFrame - b.resolvedStartFrame || a.id.localeCompare(b.id),
  );
};

const triggerToTimelineEvent = (
  trigger: SceneSfxTriggerInput,
  {
    sceneId,
    sceneStartFrame,
    sceneDurationFrames,
    index,
  }: {
    sceneId: string;
    sceneStartFrame: number;
    sceneDurationFrames: number;
    index: number;
  },
): SfxTimelineEvent => {
  const offset = Math.max(0, Math.round(trigger.offsetFrame ?? 0));
  const startFrame = sceneStartFrame + offset;
  const maxRemaining = Math.max(1, sceneStartFrame + sceneDurationFrames - startFrame);

  let endFrame: number | undefined;
  let duration = trigger.duration;
  if (typeof trigger.endFrame === "number") {
    endFrame = sceneStartFrame + Math.round(trigger.endFrame);
  }
  if (typeof duration === "number") {
    duration = Math.min(duration, maxRemaining);
  } else if (typeof endFrame === "number" && endFrame > startFrame) {
    duration = Math.min(endFrame - startFrame, maxRemaining);
  }

  return {
    id: trigger.id ?? `${sceneId}-sfx-${index + 1}`,
    assetId: trigger.assetId,
    src: trigger.src,
    category: trigger.category,
    startFrame,
    endFrame,
    duration,
    trimBefore: trigger.trimBefore,
    volume: trigger.volume,
    fadeInFrames: trigger.fadeInFrames,
    fadeOutFrames: trigger.fadeOutFrames,
    playbackRate: trigger.playbackRate,
    stereoPan: trigger.stereoPan,
    duckVoiceOver: trigger.duckVoiceOver,
    duckMusicBy: trigger.duckMusicBy,
    sceneId,
    enabled: trigger.enabled ?? true,
  };
};

/**
 * Compiles scene-level `sfx`, `sfxList`, `soundPreset`, and episode-level `sfxTimeline`
 * into one deterministic, deduplicated timeline in composition frame space.
 */
export const buildEpisodeSfxTimeline = ({
  timelineSlots,
  episodeTimeline = [],
}: {
  timelineSlots: readonly EpisodeSceneSlotInput[];
  episodeTimeline?: readonly SfxTimelineEvent[];
}): ResolvedSfxEvent[] => {
  const rawEvents: SfxTimelineEvent[] = [];

  for (const slot of timelineSlots) {
    if (slot.scene.soundPreset) {
      rawEvents.push(
        ...instantiateSoundPreset(slot.scene.soundPreset, {
          sceneId: slot.scene.id,
          sceneStartFrame: slot.from,
          sceneDurationFrames: slot.durationInFrames,
        }),
      );
    }

    const triggers: SceneSfxTriggerInput[] = [
      ...(slot.scene.sfx ? [slot.scene.sfx] : []),
      ...(slot.scene.sfxList ?? []),
    ];

    triggers.forEach((trigger, index) => {
      rawEvents.push(
        triggerToTimelineEvent(trigger, {
          sceneId: slot.scene.id,
          sceneStartFrame: slot.from,
          sceneDurationFrames: slot.durationInFrames,
          index,
        }),
      );
    });
  }

  rawEvents.push(...episodeTimeline);

  return deduplicateSfxEvents(rawEvents.map(resolveSfxEvent));
};
