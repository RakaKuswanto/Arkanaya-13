import { z } from "zod";

export const CaptionTokenSchema = z.object({
  text: z.string().min(1),
  startMs: z.number().nonnegative(),
  endMs: z.number().nonnegative(),
});

export const TimelineEventSchema = z.object({
  date: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  highlight: z.boolean().optional(),
});

export const BoardCardSchema = z.object({
  id: z.string().min(1),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
  evidenceNumber: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().optional(),
  source: z.string().optional(),
  image: z.string().optional(),
  rotation: z.number().optional(),
  variant: z.enum(["polaroid", "document"]).optional(),
  width: z.number().positive().optional(),
});

export const BoardConnectionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string().optional(),
});

export const MapWaypointSchema = z.object({
  id: z.string().min(1),
  city: z.string().min(1),
  country: z.string().optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
  align: z.enum(["left", "right"]).optional(),
});

export const FactStatSchema = z.object({
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string().min(1),
  description: z.string().min(1),
  source: z.string().optional(),
});

export const IntegrityStatusSchema = z.enum([
  "VERIFIED",
  "OFFICIAL STATEMENT",
  "ALLEGED",
  "DISPUTED",
  "UNVERIFIED",
  "UNKNOWN",
]);

export const SoundDesignPresetSchema = z.enum([
  "Documentary Opening",
  "Evidence Reveal",
  "Newspaper Reveal",
  "Investigation Tension",
  "Historical Flashback",
  "Digital Glitch",
  "Major Revelation",
  "Dramatic Ending",
  "Silence Transition",
]);

export const SfxCategoryEnumSchema = z.enum([
  "typewriter",
  "paper_movement",
  "camera_shutter",
  "tape_rewind",
  "radio_static",
  "low_cinematic_impact",
  "footsteps",
  "wind_ambience",
  "film_projector",
  "stamp_impact",
  "digital_glitch",
  "subtle_transition",
  "tension_pulse",
  "gsm_chime",
  "Archive",
  "Investigation",
  "Analog",
  "Suspense",
  "Transition",
  "Environment",
  "Technology",
  "Atmosphere",
]);

export const SceneSfxSchema = z.object({
  id: z.string().optional(),
  assetId: z.string().optional(),
  category: SfxCategoryEnumSchema.optional(),
  src: z.string().optional(),
  offsetFrame: z.number().int().nonnegative().optional(),
  endFrame: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
  trimBefore: z.number().int().nonnegative().optional(),
  volume: z.number().min(0).max(1).optional(),
  fadeInFrames: z.number().int().nonnegative().optional(),
  fadeOutFrames: z.number().int().nonnegative().optional(),
  playbackRate: z.number().positive().max(4).optional(),
  stereoPan: z.number().min(-1).max(1).optional(),
  duckVoiceOver: z.boolean().optional(),
  duckMusicBy: z.number().min(0).max(1).optional(),
  enabled: z.boolean().optional(),
});

export const SfxTimelineEventSchema = z.object({
  id: z.string().min(1),
  assetId: z.string().optional(),
  src: z.string().optional(),
  category: SfxCategoryEnumSchema.optional(),
  startFrame: z.number().int().nonnegative(),
  endFrame: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
  trimBefore: z.number().int().nonnegative().optional(),
  volume: z.number().min(0).max(1).optional(),
  fadeInFrames: z.number().int().nonnegative().optional(),
  fadeOutFrames: z.number().int().nonnegative().optional(),
  playbackRate: z.number().positive().max(4).optional(),
  stereoPan: z.number().min(-1).max(1).optional(),
  duckVoiceOver: z.boolean().optional(),
  duckMusicBy: z.number().min(0).max(1).optional(),
  sceneId: z.string().optional(),
  preset: SoundDesignPresetSchema.optional(),
  enabled: z.boolean().optional(),
});

export const EpisodeAudioMixSchema = z.object({
  voiceoverVolume: z.number().min(0).max(1).optional(),
  musicBaseVolume: z.number().min(0).max(1).optional(),
  musicDuckedVolume: z.number().min(0).max(1).optional(),
  musicDuckRampFrames: z.number().int().nonnegative().optional(),
  ambientBaseVolume: z.number().min(0).max(1).optional(),
  ambientDuckedVolume: z.number().min(0).max(1).optional(),
  sfxPolyphonyCeiling: z.number().min(0.1).max(1).optional(),
});

export const GalleryItemSchema = z.object({
  src: z.string().optional(),
  frameCode: z.string().optional(),
  label: z.string().optional(),
  caption: z.string().optional(),
  date: z.string().optional(),
  rotation: z.number().optional(),
});

export const EpisodeSceneTypeSchema = z.enum([
  "opening",
  "background",
  "incident",
  "evidence",
  "timeline",
  "location",
  "mystery",
  "quote",
  "audioTape",
  "dossier",
  "comparison",
  "statHero",
  "transcript",
  "theorySplit",
  "chapterBreak",
  "conclusion",
]);

export const EpisodeSceneSchema = z.object({
  id: z.string().min(1),
  type: EpisodeSceneTypeSchema,
  duration: z.number().int().positive(),
  headline: z.string().optional(),
  highlightWords: z.array(z.string()).optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  chapterNumber: z.string().optional(),
  background: z.string().optional(),
  captionText: z.string().optional(),
  dateStamp: z.string().optional(),
  transition: z
    .enum(["none", "verticalWipe", "paperCut", "filmBurn"])
    .optional(),
  captions: z.array(CaptionTokenSchema).optional(),
  srtText: z.string().optional(),
  galleryMode: z.enum(["photo", "contactSheet", "polaroidStack"]).optional(),
  galleryItems: z.array(GalleryItemSchema).optional(),
  filmStockLabel: z.string().optional(),
  events: z.array(TimelineEventSchema).optional(),
  cards: z.array(BoardCardSchema).optional(),
  connections: z.array(BoardConnectionSchema).optional(),
  waypoints: z.array(MapWaypointSchema).optional(),
  routeMode: z.enum(["flight", "vehicle", "walking"]).optional(),
  stat: FactStatSchema.optional(),
  stamp: z.string().optional(),
  docNumber: z.string().optional(),
  agency: z.string().optional(),
  redactedPhrases: z.array(z.string()).optional(),
  annotations: z.array(z.string()).optional(),
  speaker: z.string().optional(),
  source: z.string().optional(),
  highlightPhrase: z.string().optional(),
  dossierAttributes: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  comparisonLeft: z
    .object({
      label: z.string(),
      src: z.string().optional(),
      caption: z.string().optional(),
    })
    .optional(),
  comparisonRight: z
    .object({
      label: z.string(),
      src: z.string().optional(),
      caption: z.string().optional(),
    })
    .optional(),
  stats: z.array(FactStatSchema).optional(),
  transcriptLines: z
    .array(
      z.object({
        speaker: z.string(),
        text: z.string(),
        redacted: z.boolean().optional(),
      }),
    )
    .optional(),
  theories: z
    .array(
      z.object({
        label: z.string(),
        title: z.string(),
        summary: z.string(),
        status: z.string().optional(),
      }),
    )
    .optional(),
  voiceover: z.string().optional(),
  sfx: SceneSfxSchema.optional(),
  sfxList: z.array(SceneSfxSchema).optional(),
  soundPreset: SoundDesignPresetSchema.optional(),
  integrityStatus: IntegrityStatusSchema.optional(),
  speakerCredential: z.string().optional(),
  speakerOrganization: z.string().optional(),
  factCheck: z
    .object({
      claim: z.string(),
      finding: z.string(),
      verificationStatus: IntegrityStatusSchema.optional(),
      sourceId: z.string().optional(),
      sourceTitle: z.string().optional(),
    })
    .optional(),
  citation: z
    .object({
      sourceId: z.string(),
      title: z.string(),
      publisher: z.string(),
      publicationDate: z.string(),
      sourceType: z
        .enum([
          "ARCHIVE",
          "OFFICIAL",
          "COURT",
          "NEWS",
          "MEDIA",
          "WITNESS",
          "REPORT",
          "ACADEMIC",
        ])
        .optional(),
      url: z.string().optional(),
      verificationStatus: IntegrityStatusSchema.optional(),
    })
    .optional(),
  chartData: z
    .object({
      title: z.string(),
      type: z.enum(["bar", "line", "timeline"]).optional(),
      unit: z.string().optional(),
      sourceCitation: z.string().optional(),
      data: z.array(
        z.object({
          label: z.string(),
          value: z.number(),
          highlight: z.boolean().optional(),
        }),
      ),
    })
    .optional(),
  conclusionData: z
    .object({
      title: z.string().optional(),
      summary: z.string(),
      openQuestions: z.array(z.string()).optional(),
    })
    .optional(),
});

export const EpisodeSchema = z.object({
  id: z.string().min(1),
  episodeNumber: z.string().default("EPISODE 01"),
  caseNumber: z.string().default("A13-001"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  category: z.string().default("UNSOLVED CASE"),
  location: z.string().min(1),
  date: z.string().min(1),
  status: z.string().default("UNSOLVED"),
  duration: z.number().int().positive().optional(),
  fps: z.number().int().positive().default(30),
  voiceover: z.string().optional(),
  music: z.string().optional(),
  ambient: z.string().optional(),
  sfxTimeline: z.array(SfxTimelineEventSchema).optional(),
  audioMix: EpisodeAudioMixSchema.optional(),
  srtText: z.string().optional(),
  scenes: z.array(EpisodeSceneSchema).min(1),
});

export type EpisodeData = z.infer<typeof EpisodeSchema>;
export type EpisodeScene = z.infer<typeof EpisodeSceneSchema>;
export type EpisodeSceneType = z.infer<typeof EpisodeSceneTypeSchema>;

export type ComputedSceneSlot = {
  scene: EpisodeScene;
  from: number;
  durationInFrames: number;
};

export const computeSceneTimeline = (
  episode: EpisodeData,
): ComputedSceneSlot[] => {
  let cursor = 0;
  return episode.scenes.map((scene) => {
    const slot: ComputedSceneSlot = {
      scene,
      from: cursor,
      durationInFrames: scene.duration,
    };
    cursor += scene.duration;
    return slot;
  });
};

export const calculateEpisodeDuration = (episode: EpisodeData): number => {
  const scenesTotal = episode.scenes.reduce((sum, s) => sum + s.duration, 0);
  return Math.max(1, episode.duration ?? scenesTotal);
};

export const sec = (seconds: number, fps = 30): number =>
  Math.max(1, Math.round(seconds * fps));

export const validateEpisode = (raw: unknown): EpisodeData => {
  return EpisodeSchema.parse(raw);
};
