export type SoundEffectCategory =
  | "typewriter"
  | "paper_movement"
  | "camera_shutter"
  | "tape_rewind"
  | "radio_static"
  | "low_cinematic_impact"
  | "footsteps"
  | "wind_ambience"
  | "film_projector"
  | "stamp_impact"
  | "digital_glitch"
  | "subtle_transition"
  | "tension_pulse"
  | "gsm_chime";

export const SFX_DOMAIN_CATEGORIES = [
  "Archive",
  "Investigation",
  "Analog",
  "Suspense",
  "Transition",
  "Environment",
  "Technology",
  "Atmosphere",
] as const;

export type SfxDomainCategory = (typeof SFX_DOMAIN_CATEGORIES)[number];

export type SupportedAudioFormat = "mp3" | "wav" | "m4a" | "aac" | "ogg" | "flac";

export type SfxAssetEntry = {
  id: string;
  name: string;
  filePath: string;
  category: SfxDomainCategory;
  legacyCategory?: SoundEffectCategory;
  description: string;
  defaultVolume: number;
  recommendedUse: string;
  durationSeconds?: number;
  durationFrames?: number;
  format: SupportedAudioFormat;
  license: string;
  source: string;
  tags: readonly string[];
};

export const SOUND_DESIGN_PRESET_NAMES = [
  "Documentary Opening",
  "Evidence Reveal",
  "Newspaper Reveal",
  "Investigation Tension",
  "Historical Flashback",
  "Digital Glitch",
  "Major Revelation",
  "Dramatic Ending",
  "Silence Transition",
] as const;

export type SoundDesignPresetName = (typeof SOUND_DESIGN_PRESET_NAMES)[number];

export type SfxTimelineEvent = {
  /** Unique deterministic event identifier across the episode timeline. */
  id: string;
  /** Registry ID referencing SFX_ASSET_REGISTRY (recommended over raw src). */
  assetId?: string;
  /** Explicit audio file path relative to public/ when not using assetId. */
  src?: string;
  /** Domain or legacy category label for organization and legacy fallback lookup. */
  category?: SfxDomainCategory | SoundEffectCategory;
  /** Inclusive composition-relative (or normalized scene-relative) start frame. */
  startFrame: number;
  /** Exclusive end frame. Takes precedence over asset default when supplied. */
  endFrame?: number;
  /** Explicit duration in frames. Mutually compatible with endFrame if matching. */
  duration?: number;
  /** Frames trimmed from the beginning of the audio file (Remotion trimBefore). */
  trimBefore?: number;
  /** Base playback volume in [0, 1]. Defaults to registry defaultVolume or 0.58. */
  volume?: number;
  /** Linear fade-in duration in frames. */
  fadeInFrames?: number;
  /** Linear fade-out duration in frames. */
  fadeOutFrames?: number;
  /** Deterministic playback speed multiplier (0.25..4). */
  playbackRate?: number;
  /**
   * Optional stereo pan hint [-1 = full left, 0 = center, 1 = full right].
   * Note: Remotion 4.0 Html5Audio outputs mixed down/stereo gain natively without
   * a hardware panner prop; stored as validated mixing metadata & downmix spec.
   */
  stereoPan?: number;
  /** When true, attenuates slightly whenever VoiceOver is active for clarity. */
  duckVoiceOver?: boolean;
  /** Optional duck multiplier (0..1) applied to music during this event's window. */
  duckMusicBy?: number;
  /** Optional scene ID linkage for episode timeline tracing. */
  sceneId?: string;
  /** Optional preset name that generated this event. */
  preset?: SoundDesignPresetName;
  /** Enable/disable toggle without removing timeline data. */
  enabled?: boolean;
};

export type AudioBusName = "voiceover" | "sfx" | "music" | "ambient";

export type AudioMixConfig = {
  voiceoverVolume: number;
  sfxBaseVolume: number;
  sfxMaxVolume: number;
  sfxUnderVoiceOverScale: number;
  sfxPolyphonyCeiling: number;
  musicBaseVolume: number;
  musicDuckedVolume: number;
  musicDuckRampFrames: number;
  ambientBaseVolume: number;
  ambientDuckedVolume: number;
  ambientDuckRampFrames: number;
};

export type AudioValidationSeverity = "error" | "warning";

export type AudioValidationIssue = {
  code:
    | "MISSING_AUDIO_SOURCE"
    | "UNREGISTERED_ASSET_ID"
    | "INVALID_FRAME_RANGE"
    | "INVALID_VOLUME"
    | "INVALID_PLAYBACK_RATE"
    | "INVALID_STEREO_PAN"
    | "DUPLICATE_EVENT_ID"
    | "OVERLAPPING_DUPLICATE_TRIGGER"
    | "UNSUPPORTED_FORMAT"
    | "UNLICENSED_OR_UNKNOWN_SOURCE";
  severity: AudioValidationSeverity;
  message: string;
  targetId?: string;
  filePath?: string;
};

export type AudioValidationReport = {
  valid: boolean;
  issues: AudioValidationIssue[];
  errorCount: number;
  warningCount: number;
};
