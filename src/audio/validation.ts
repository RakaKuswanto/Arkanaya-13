import {
  SFX_ASSET_REGISTRY,
  getSfxAsset,
  resolveSfxAssetByLegacyCategory,
} from "./registry";
import type {
  AudioValidationIssue,
  AudioValidationReport,
  SfxAssetEntry,
  SfxTimelineEvent,
  SoundEffectCategory,
  SupportedAudioFormat,
} from "./types";

const SUPPORTED_FORMATS = new Set<SupportedAudioFormat>([
  "mp3",
  "wav",
  "m4a",
  "aac",
  "ogg",
  "flac",
]);

const UNKNOWN_LICENSE_TOKENS = ["unknown", "unlicensed", "tbd", "todo", "none"];

export const extractAudioExtension = (filePath: string): string => {
  const clean = filePath.split("?")[0]?.split("#")[0] ?? filePath;
  const dotIdx = clean.lastIndexOf(".");
  if (dotIdx === -1) return "";
  return clean.slice(dotIdx + 1).toLowerCase();
};

export const isSupportedAudioFormat = (filePath: string): boolean => {
  const ext = extractAudioExtension(filePath) as SupportedAudioFormat;
  return SUPPORTED_FORMATS.has(ext);
};

export const validateSfxRegistry = (
  registry: readonly SfxAssetEntry[] = SFX_ASSET_REGISTRY,
  options?: { existingPublicFiles?: ReadonlySet<string> },
): AudioValidationReport => {
  const issues: AudioValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenPaths = new Set<string>();

  for (const entry of registry) {
    if (seenIds.has(entry.id)) {
      issues.push({
        code: "DUPLICATE_EVENT_ID",
        severity: "error",
        message: `Duplicate registry asset ID "${entry.id}".`,
        targetId: entry.id,
        filePath: entry.filePath,
      });
    }
    seenIds.add(entry.id);

    if (seenPaths.has(entry.filePath)) {
      issues.push({
        code: "OVERLAPPING_DUPLICATE_TRIGGER",
        severity: "warning",
        message: `Audio file "${entry.filePath}" is registered under multiple asset IDs.`,
        targetId: entry.id,
        filePath: entry.filePath,
      });
    }
    seenPaths.add(entry.filePath);

    if (!entry.filePath || !isSupportedAudioFormat(entry.filePath)) {
      issues.push({
        code: "UNSUPPORTED_FORMAT",
        severity: "error",
        message: `Asset "${entry.id}" has unsupported audio format: "${entry.filePath}".`,
        targetId: entry.id,
        filePath: entry.filePath,
      });
    }

    if (
      options?.existingPublicFiles &&
      !options.existingPublicFiles.has(entry.filePath.replace(/^\/+/, ""))
    ) {
      issues.push({
        code: "MISSING_AUDIO_SOURCE",
        severity: "error",
        message: `Audio file missing on disk under public/: "${entry.filePath}" (asset "${entry.id}").`,
        targetId: entry.id,
        filePath: entry.filePath,
      });
    }

    if (
      !Number.isFinite(entry.defaultVolume) ||
      entry.defaultVolume < 0 ||
      entry.defaultVolume > 1
    ) {
      issues.push({
        code: "INVALID_VOLUME",
        severity: "error",
        message: `Asset "${entry.id}" defaultVolume (${entry.defaultVolume}) must be between 0 and 1.`,
        targetId: entry.id,
      });
    }

    const licenseLower = entry.license.trim().toLowerCase();
    const sourceLower = entry.source.trim().toLowerCase();
    if (
      !licenseLower ||
      !sourceLower ||
      UNKNOWN_LICENSE_TOKENS.some(
        (tok) => licenseLower.includes(tok) || sourceLower.includes(tok),
      )
    ) {
      issues.push({
        code: "UNLICENSED_OR_UNKNOWN_SOURCE",
        severity: "error",
        message: `Asset "${entry.id}" is missing valid licensing or source metadata.`,
        targetId: entry.id,
        filePath: entry.filePath,
      });
    }
  }

  return buildReport(issues);
};

export const validateSfxTimeline = (
  events: readonly SfxTimelineEvent[],
  options?: {
    totalFrames?: number;
    existingPublicFiles?: ReadonlySet<string>;
  },
): AudioValidationReport => {
  const issues: AudioValidationIssue[] = [];
  const seenIds = new Set<string>();
  const resolvedLocations: {
    id: string;
    src: string;
    startFrame: number;
  }[] = [];

  for (const ev of events) {
    if (seenIds.has(ev.id)) {
      issues.push({
        code: "DUPLICATE_EVENT_ID",
        severity: "error",
        message: `Duplicate timeline event ID "${ev.id}".`,
        targetId: ev.id,
      });
    }
    seenIds.add(ev.id);

    const regAsset = ev.assetId
      ? getSfxAsset(ev.assetId)
      : ev.category && !ev.src
        ? resolveSfxAssetByLegacyCategory(ev.category as SoundEffectCategory)
        : undefined;
    if (ev.assetId && !regAsset) {
      issues.push({
        code: "UNREGISTERED_ASSET_ID",
        severity: "error",
        message: `Event "${ev.id}" references unknown assetId "${ev.assetId}".`,
        targetId: ev.id,
      });
    }

    const effectiveSrc = ev.src ?? regAsset?.filePath;
    if (!effectiveSrc) {
      issues.push({
        code: "MISSING_AUDIO_SOURCE",
        severity: "error",
        message: `Event "${ev.id}" has neither a valid assetId nor an explicit src.`,
        targetId: ev.id,
      });
    } else {
      if (!isSupportedAudioFormat(effectiveSrc)) {
        issues.push({
          code: "UNSUPPORTED_FORMAT",
          severity: "error",
          message: `Event "${ev.id}" references unsupported format "${effectiveSrc}".`,
          targetId: ev.id,
          filePath: effectiveSrc,
        });
      }

      if (
        options?.existingPublicFiles &&
        !effectiveSrc.startsWith("http") &&
        !options.existingPublicFiles.has(effectiveSrc.replace(/^\/+/, ""))
      ) {
        issues.push({
          code: "MISSING_AUDIO_SOURCE",
          severity: "error",
          message: `Event "${ev.id}" references missing file "public/${effectiveSrc}".`,
          targetId: ev.id,
          filePath: effectiveSrc,
        });
      }

      const overlapsExisting = resolvedLocations.some(
        (prev) =>
          prev.src === effectiveSrc &&
          Math.abs(prev.startFrame - ev.startFrame) <= 2,
      );
      if (overlapsExisting) {
        issues.push({
          code: "OVERLAPPING_DUPLICATE_TRIGGER",
          severity: "warning",
          message: `Event "${ev.id}" triggers "${effectiveSrc}" within 2 frames of another identical asset.`,
          targetId: ev.id,
          filePath: effectiveSrc,
        });
      }
      resolvedLocations.push({
        id: ev.id,
        src: effectiveSrc,
        startFrame: ev.startFrame,
      });
    }

    if (!Number.isInteger(ev.startFrame) || ev.startFrame < 0) {
      issues.push({
        code: "INVALID_FRAME_RANGE",
        severity: "error",
        message: `Event "${ev.id}" has invalid startFrame (${ev.startFrame}). Must be a non-negative integer.`,
        targetId: ev.id,
      });
    }

    if (typeof ev.endFrame === "number" && ev.endFrame <= ev.startFrame) {
      issues.push({
        code: "INVALID_FRAME_RANGE",
        severity: "error",
        message: `Event "${ev.id}" endFrame (${ev.endFrame}) must be greater than startFrame (${ev.startFrame}).`,
        targetId: ev.id,
      });
    }

    if (typeof ev.duration === "number" && ev.duration <= 0) {
      issues.push({
        code: "INVALID_FRAME_RANGE",
        severity: "error",
        message: `Event "${ev.id}" duration (${ev.duration}) must be > 0.`,
        targetId: ev.id,
      });
    }

    if (typeof ev.trimBefore === "number" && ev.trimBefore < 0) {
      issues.push({
        code: "INVALID_FRAME_RANGE",
        severity: "error",
        message: `Event "${ev.id}" trimBefore (${ev.trimBefore}) must be >= 0.`,
        targetId: ev.id,
      });
    }

    if (
      typeof options?.totalFrames === "number" &&
      ev.startFrame >= options.totalFrames
    ) {
      issues.push({
        code: "INVALID_FRAME_RANGE",
        severity: "warning",
        message: `Event "${ev.id}" startFrame (${ev.startFrame}) exceeds episode length (${options.totalFrames}).`,
        targetId: ev.id,
      });
    }

    if (
      typeof ev.volume === "number" &&
      (!Number.isFinite(ev.volume) || ev.volume < 0 || ev.volume > 1)
    ) {
      issues.push({
        code: "INVALID_VOLUME",
        severity: "error",
        message: `Event "${ev.id}" volume (${ev.volume}) must be in [0, 1].`,
        targetId: ev.id,
      });
    }

    if (
      typeof ev.playbackRate === "number" &&
      (!Number.isFinite(ev.playbackRate) ||
        ev.playbackRate <= 0 ||
        ev.playbackRate > 4)
    ) {
      issues.push({
        code: "INVALID_PLAYBACK_RATE",
        severity: "error",
        message: `Event "${ev.id}" playbackRate (${ev.playbackRate}) must be in (0, 4].`,
        targetId: ev.id,
      });
    }

    if (
      typeof ev.stereoPan === "number" &&
      (!Number.isFinite(ev.stereoPan) || ev.stereoPan < -1 || ev.stereoPan > 1)
    ) {
      issues.push({
        code: "INVALID_STEREO_PAN",
        severity: "error",
        message: `Event "${ev.id}" stereoPan (${ev.stereoPan}) must be in [-1, 1].`,
        targetId: ev.id,
      });
    }
  }

  return buildReport(issues);
};

const buildReport = (issues: AudioValidationIssue[]): AudioValidationReport => {
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  return {
    valid: errorCount === 0,
    issues,
    errorCount,
    warningCount,
  };
};
