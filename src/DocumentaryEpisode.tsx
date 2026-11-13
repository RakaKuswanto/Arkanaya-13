import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ARKANAYA_AUDIO_MIX,
  buildEpisodeSfxTimeline,
  deriveMusicDuckRangesFromSfx,
  type ResolvedSfxEvent,
} from "./audio";
import {
  AmbientSoundTrack,
  BackgroundMusicTrack,
  SfxTimelinePlayer,
  VoiceOverTrack,
} from "./components/audio";
import {
  ArchivePhoto,
  ContactSheet,
  FilmOverlay,
  PolaroidStack,
  SplitComparison,
} from "./components/archival";
import {
  CaseEnding,
  CaseOpening,
  ConclusionCard,
  Watermark,
} from "./components/branding";
import {
  AudioWaveform,
  CameraOverlay,
  FilmBurn,
} from "./components/effects";
import { DataChart, FactCounter, MapRoute } from "./components/geographic";
import {
  CaseTimeline,
  DocumentReveal,
  FactCheckCard,
  InvestigationBoard,
  NewspaperClipping,
  RedactedLine,
  SourceCitation,
  SuspectDossier,
  VerificationBadge,
} from "./components/investigation";
import {
  FadeToBlack,
  PaperCutTransition,
  VerticalWipe,
} from "./components/transitions";
import {
  DocumentaryCaption,
  HeadlineReveal,
  KineticNumber,
  LowerThird,
  QuoteCallout,
  SectionTitle,
  TypewriterText,
} from "./components/typography";
import {
  EDITORIAL_EASE,
  handheldDrift,
  microfilmScroll,
  pulseBeacon,
} from "./motion/presets";
import {
  type ComputedSceneSlot,
  type EpisodeData,
  EpisodeSchema,
  computeSceneTimeline,
} from "./schema/episode";
import {
  ARKANAYA_COLORS,
  getSafeMargins,
  isLandscapeLayout,
} from "./theme/tokens";
import { ARKANAYA_FONTS } from "./theme/typography";
import { resolveMediaSrc } from "./utils/assets";

export type DocumentaryEpisodeProps = {
  episode: EpisodeData;
  showWatermark?: boolean;
  showFilmGrain?: boolean;
};

const SceneRenderer = ({
  slot,
  episode,
}: {
  slot: ComputedSceneSlot;
  episode: EpisodeData;
}) => {
  const { scene } = slot;
  const frame = useCurrentFrame();
  const { durationInFrames, fps, width, height } = useVideoConfig();
  const margins = getSafeMargins(width, height);
  const landscape = isLandscapeLayout(width, height);
  const contentWidth = width - margins.left - margins.right;
  const primaryWidth = landscape ? Math.min(1180, contentWidth) : Math.min(896, contentWidth);

  const drift = handheldDrift({ frame, durationInFrames, fps });
  const scrollY = microfilmScroll(
    { frame, durationInFrames, fps },
    { distancePx: 80, stepFrames: 2 },
  );
  const beacon = pulseBeacon({ frame, durationInFrames, fps });

  const containerStyle = {
    paddingTop: margins.top,
    paddingBottom: margins.bottom,
    paddingLeft: margins.left,
    paddingRight: margins.right,
    display: "flex",
    flexDirection: "column" as const,
    gap: landscape ? 24 : 36,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: ARKANAYA_COLORS.obsidian }}>
      {scene.type === "opening" && (
        <CaseOpening
          episodeNumber={episode.episodeNumber}
          caseTitle={scene.headline ?? episode.title}
          subtitle={scene.subtitle ?? episode.subtitle}
          location={episode.location}
          date={episode.date}
          status={episode.status}
          caseNumber={episode.caseNumber}
          highlightWords={scene.highlightWords}
        />
      )}

      {scene.type === "background" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "01"}
            title={scene.headline ?? "INTRODUCTION"}
            subtitle={scene.subtitle}
          />
          {scene.galleryMode === "contactSheet" ? (
            <ContactSheet
              width={primaryWidth}
              columns={3}
              filmStockLabel={scene.filmStockLabel ?? "ARKANAYA 13 // 35MM"}
              items={(scene.galleryItems ?? []).map((item, idx) => ({
                src: resolveMediaSrc(item.src),
                frameCode: item.frameCode ?? `${idx + 14}A`,
                label: item.label ?? item.caption,
              }))}
            />
          ) : scene.galleryMode === "polaroidStack" ? (
            <div style={{ position: "relative", height: landscape ? 380 : 560 }}>
              <PolaroidStack
                width={landscape ? 420 : 520}
                photoHeight={landscape ? 260 : 400}
                items={(scene.galleryItems ?? []).map((item) => ({
                  src: resolveMediaSrc(item.src),
                  caption: item.caption ?? item.label,
                  date: item.date ?? scene.dateStamp ?? episode.date,
                  rotation: item.rotation,
                }))}
              />
            </div>
          ) : (
            <div style={{ position: "relative", width: primaryWidth, height: landscape ? 420 : 560 }}>
              <ArchivePhoto
                src={resolveMediaSrc(scene.background)}
                width={primaryWidth}
                height={landscape ? 360 : 500}
                frameStyle="paper"
                caption={scene.captionText ?? episode.location}
                dateStamp={scene.dateStamp ?? episode.date}
              />
            </div>
          )}
          {scene.body && (
            <TypewriterText
              text={scene.body}
              font="body"
              fontSize={landscape ? 24 : 28}
              maxWidth={primaryWidth}
              charsPerSecond={34}
              showCursor={false}
            />
          )}
        </AbsoluteFill>
      )}

      {scene.type === "incident" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "02"}
            title={scene.headline ?? "THE INCIDENT"}
          />
          <NewspaperClipping
            width={primaryWidth}
            headline={scene.subtitle ?? episode.title}
            excerpt={scene.body ?? ""}
            image={resolveMediaSrc(scene.background)}
            issueDate={scene.dateStamp ?? episode.date}
          />
        </AbsoluteFill>
      )}

      {scene.type === "timeline" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "02"}
            title={scene.headline ?? "THE INCIDENT"}
          />
          <CaseTimeline
            events={scene.events ?? []}
            orientation={landscape ? "horizontal" : "vertical"}
            width={primaryWidth}
          />
        </AbsoluteFill>
      )}

      {scene.type === "location" && (
        <AbsoluteFill style={{ ...containerStyle, gap: landscape ? 20 : 28 }}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "03"}
            title={scene.headline ?? "THE DISAPPEARANCE"}
          />
          {scene.integrityStatus && (
            <VerificationBadge
              status={scene.integrityStatus}
              compact
              style={{ alignSelf: "flex-start" }}
            />
          )}
          {scene.waypoints && scene.waypoints.length > 0 && (
            <MapRoute
              width={primaryWidth}
              height={landscape ? 420 : 760}
              mode={scene.routeMode ?? "flight"}
              waypoints={scene.waypoints}
            />
          )}
          {scene.stat && (
            <FactCounter
              value={scene.stat.value}
              prefix={scene.stat.prefix}
              suffix={scene.stat.suffix}
              label={scene.stat.label}
              description={scene.stat.description}
              source={scene.stat.source}
              width={primaryWidth}
            />
          )}
          <CameraOverlay cameraId={`SECTOR // ${episode.caseNumber}`} />
        </AbsoluteFill>
      )}

      {scene.type === "evidence" && (
        <AbsoluteFill style={{ ...containerStyle, gap: landscape ? 20 : 28 }}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "04"}
            title={scene.headline ?? "THE EVIDENCE"}
          />
          <InvestigationBoard
            width={primaryWidth}
            height={landscape ? 620 : 1260}
            cards={(scene.cards ?? []).map((card) => ({
              ...card,
              image: resolveMediaSrc(card.image),
            }))}
            connections={scene.connections ?? []}
          />
        </AbsoluteFill>
      )}

      {scene.type === "mystery" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "05"}
            title={scene.headline ?? "THE MYSTERY"}
          />
          <DocumentReveal
            width={primaryWidth}
            docNumber={scene.docNumber ?? episode.caseNumber}
            agency={scene.agency ?? "ARCHIVE DOSSIER"}
            subject={scene.subtitle ?? episode.title}
            body={scene.body ?? ""}
            redactedPhrases={scene.redactedPhrases}
            annotations={scene.annotations}
            stamp={scene.stamp ?? episode.status}
          />
        </AbsoluteFill>
      )}

      {scene.type === "quote" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "05"}
            title={scene.headline ?? "TESTIMONY"}
          />
          <QuoteCallout
            quote={scene.body ?? ""}
            speaker={scene.speaker}
            source={scene.source}
            highlightPhrase={scene.highlightPhrase}
          />
        </AbsoluteFill>
      )}

      {scene.type === "audioTape" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "05"}
            title={scene.headline ?? "AUDIO RECORD"}
            subtitle={scene.subtitle}
          />
          <AudioWaveform
            label={scene.docNumber ?? `ARCHIVE TAPE // ${episode.caseNumber}`}
            speaker={scene.speaker}
            transcript={scene.body}
          />
        </AbsoluteFill>
      )}

      {scene.type === "dossier" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "05"}
            title={scene.headline ?? "SUBJECT DOSSIER"}
          />
          {scene.speakerCredential && scene.subtitle && (
            <LowerThird
              name={scene.subtitle}
              role={scene.speakerCredential}
              organization={scene.speakerOrganization}
              verificationStatus={scene.integrityStatus}
            />
          )}
          <SuspectDossier
            subjectName={scene.subtitle ?? "UNKNOWN SUBJECT"}
            alias={scene.speaker}
            dossierCode={scene.docNumber ?? episode.caseNumber}
            photoSrc={resolveMediaSrc(scene.background)}
            status={scene.stamp ?? episode.status}
            attributes={scene.dossierAttributes}
            notes={scene.body}
          />
        </AbsoluteFill>
      )}

      {scene.type === "comparison" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "05"}
            title={scene.headline ?? "EVIDENCE COMPARISON"}
            subtitle={scene.subtitle}
          />
          <SplitComparison
            height={landscape ? 420 : 520}
            left={{
              label: scene.comparisonLeft?.label ?? "CLAIM",
              src: resolveMediaSrc(scene.comparisonLeft?.src),
              caption: scene.comparisonLeft?.caption,
            }}
            right={{
              label: scene.comparisonRight?.label ?? "EVIDENCE",
              src: resolveMediaSrc(scene.comparisonRight?.src),
              caption: scene.comparisonRight?.caption,
            }}
          />
        </AbsoluteFill>
      )}

      {scene.type === "statHero" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "04"}
            title={scene.headline ?? "KEY FIGURES"}
            subtitle={scene.subtitle}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {(scene.stats && scene.stats.length > 0
              ? scene.stats
              : scene.stat
                ? [scene.stat]
                : []
            ).map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                style={{
                  position: "relative",
                  border: "1px solid rgba(232, 223, 207, 0.18)",
                  backgroundColor: ARKANAYA_COLORS.charcoal,
                  padding: "26px 30px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: ARKANAYA_COLORS.bloodRed,
                    transform: `scale(${beacon.scale})`,
                    opacity: beacon.opacity,
                  }}
                />
                <KineticNumber
                  from={0}
                  to={item.value}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  label={item.label}
                  fontSize={landscape ? 76 : 92}
                  accentColor={
                    idx === 0
                      ? ARKANAYA_COLORS.bloodRed
                      : ARKANAYA_COLORS.archiveGold
                  }
                />
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: ARKANAYA_FONTS.body,
                    fontSize: 22,
                    lineHeight: 1.4,
                    color: ARKANAYA_COLORS.archiveCream,
                  }}
                >
                  {item.description}
                </div>
                {item.source && (
                  <div
                    style={{
                      marginTop: 10,
                      fontFamily: ARKANAYA_FONTS.mono,
                      fontSize: 14,
                      color: ARKANAYA_COLORS.ashGrey,
                      letterSpacing: "0.08em",
                    }}
                  >
                    SOURCE // {item.source}
                  </div>
                )}
              </div>
            ))}
            {scene.chartData && (
              <DataChart
                title={scene.chartData.title}
                type={scene.chartData.type ?? "bar"}
                unit={scene.chartData.unit}
                sourceCitation={scene.chartData.sourceCitation}
                data={scene.chartData.data}
                height={landscape ? 220 : 260}
              />
            )}
            {scene.citation && (
              <SourceCitation
                sourceId={scene.citation.sourceId}
                title={scene.citation.title}
                publisher={scene.citation.publisher}
                publicationDate={scene.citation.publicationDate}
                sourceType={scene.citation.sourceType}
                url={scene.citation.url}
                verificationStatus={scene.citation.verificationStatus ?? "VERIFIED"}
              />
            )}
          </div>
        </AbsoluteFill>
      )}

      {scene.type === "transcript" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "05"}
            title={scene.headline ?? "ARCHIVE TRANSCRIPT"}
            subtitle={scene.subtitle}
          />
          <div
            style={{
              height: landscape ? 480 : 820,
              overflow: "hidden",
              border: "1px solid rgba(232, 223, 207, 0.2)",
              backgroundColor: ARKANAYA_COLORS.deepBlack,
              padding: "28px 30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                transform: `translateY(${scrollY}px)`,
              }}
            >
              {(scene.transcriptLines ?? []).map((line, idx) => (
                <div
                  key={`${line.speaker}-${idx}`}
                  style={{
                    borderLeft: `3px solid ${
                      line.redacted
                        ? ARKANAYA_COLORS.bloodRed
                        : ARKANAYA_COLORS.archiveGold
                    }`,
                    paddingLeft: 18,
                  }}
                >
                  <div
                    style={{
                      fontFamily: ARKANAYA_FONTS.mono,
                      fontSize: 14,
                      letterSpacing: "0.12em",
                      color: ARKANAYA_COLORS.archiveGold,
                      marginBottom: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    {line.speaker}
                  </div>
                  {line.redacted ? (
                    <RedactedLine
                      text={line.text}
                      mode="redact"
                      startFrame={18 + idx * 14}
                      fontSize={24}
                    />
                  ) : (
                    <div
                      style={{
                        fontFamily: ARKANAYA_FONTS.mono,
                        fontSize: 23,
                        lineHeight: 1.45,
                        color: ARKANAYA_COLORS.archiveCream,
                      }}
                    >
                      {line.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <CameraOverlay cameraId={`MICROFILM // ${episode.caseNumber}`} />
        </AbsoluteFill>
      )}

      {scene.type === "theorySplit" && (
        <AbsoluteFill style={containerStyle}>
          <SectionTitle
            chapterNumber={scene.chapterNumber ?? "06"}
            title={scene.headline ?? "WORKING THEORIES"}
            subtitle={scene.subtitle}
          />
          {scene.factCheck && (
            <FactCheckCard
              claim={scene.factCheck.claim}
              finding={scene.factCheck.finding}
              verificationStatus={scene.factCheck.verificationStatus ?? "DISPUTED"}
              sourceId={scene.factCheck.sourceId}
              sourceTitle={scene.factCheck.sourceTitle}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {(scene.theories ?? []).map((theory, idx) => {
              const enter = interpolate(
                frame,
                [idx * 10, idx * 10 + 18],
                [0, 1],
                {
                  easing: EDITORIAL_EASE,
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              );
              return (
                <div
                  key={theory.title}
                  style={{
                    border: "1px solid rgba(232, 223, 207, 0.18)",
                    backgroundColor: ARKANAYA_COLORS.charcoal,
                    padding: "24px 28px",
                    opacity: enter,
                    transform: `translateY(${(1 - enter) * 16}px)`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                      fontFamily: ARKANAYA_FONTS.mono,
                      fontSize: 14,
                      letterSpacing: "0.1em",
                    }}
                  >
                    <span style={{ color: ARKANAYA_COLORS.archiveGold }}>
                      {theory.label}
                    </span>
                    <VerificationBadge
                      status={theory.status ?? "UNVERIFIED"}
                      compact
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: ARKANAYA_FONTS.secondary,
                      fontSize: 40,
                      lineHeight: 1.08,
                      color: ARKANAYA_COLORS.archiveCream,
                      marginBottom: 8,
                    }}
                  >
                    {theory.title}
                  </div>
                  <div
                    style={{
                      fontFamily: ARKANAYA_FONTS.body,
                      fontSize: 22,
                      lineHeight: 1.42,
                      color: ARKANAYA_COLORS.agedPaper,
                    }}
                  >
                    {theory.summary}
                  </div>
                </div>
              );
            })}
          </div>
          {scene.citation && (
            <SourceCitation
              sourceId={scene.citation.sourceId}
              title={scene.citation.title}
              publisher={scene.citation.publisher}
              publicationDate={scene.citation.publicationDate}
              sourceType={scene.citation.sourceType}
              url={scene.citation.url}
              verificationStatus={scene.citation.verificationStatus ?? "VERIFIED"}
            />
          )}
        </AbsoluteFill>
      )}

      {scene.type === "chapterBreak" && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: margins.left,
            paddingRight: margins.right,
            backgroundColor: ARKANAYA_COLORS.deepBlack,
            transform: `translate(${drift.x}px, ${drift.y}px) rotate(${drift.rotate}deg)`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                fontFamily: ARKANAYA_FONTS.mono,
                fontSize: 20,
                letterSpacing: "0.24em",
                color: ARKANAYA_COLORS.bloodRed,
                textTransform: "uppercase",
              }}
            >
              FILE // {scene.chapterNumber ?? "02"}
            </div>
            <HeadlineReveal
              text={scene.headline ?? "THE TURNING POINT"}
              highlightWords={scene.highlightWords}
              align="center"
              fontSize={92}
            />
            {scene.subtitle && (
              <div
                style={{
                  fontFamily: ARKANAYA_FONTS.body,
                  fontSize: 26,
                  color: ARKANAYA_COLORS.ashGrey,
                  maxWidth: 760,
                  lineHeight: 1.4,
                }}
              >
                {scene.subtitle}
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {scene.type === "conclusion" &&
        (scene.conclusionData ? (
          <>
            <Sequence durationInFrames={Math.max(120, Math.floor(durationInFrames * 0.52))}>
              <AbsoluteFill
                style={{
                  ...containerStyle,
                  justifyContent: "center",
                }}
              >
                <ConclusionCard
                  title={scene.conclusionData.title ?? "RINGKASAN ARSIP"}
                  summary={scene.conclusionData.summary}
                  openQuestions={scene.conclusionData.openQuestions ?? []}
                  caseStatus={episode.status}
                  verificationSummary={scene.integrityStatus ?? "VERIFIED"}
                />
              </AbsoluteFill>
            </Sequence>
            <Sequence from={Math.max(120, Math.floor(durationInFrames * 0.52))}>
              <CaseEnding
                statement={
                  scene.headline ??
                  "Setiap kejadian punya cerita. Tidak semua cerita punya jawaban."
                }
              />
            </Sequence>
          </>
        ) : (
          <CaseEnding
            statement={
              scene.headline ??
              "Setiap kejadian punya cerita. Tidak semua cerita punya jawaban."
            }
          />
        ))}

      {((scene.captions && scene.captions.length > 0) ||
        Boolean(scene.srtText)) && (
        <DocumentaryCaption
          captions={scene.captions}
          srtText={scene.srtText}
        />
      )}
    </AbsoluteFill>
  );
};

export const DocumentaryEpisode = ({
  episode,
  showWatermark = true,
  showFilmGrain = true,
}: DocumentaryEpisodeProps) => {
  const parsed = EpisodeSchema.parse(episode);
  const timeline = computeSceneTimeline(parsed);

  const narratedRanges = timeline
    .filter(
      (slot) =>
        Boolean(slot.scene.voiceover) ||
        Boolean(slot.scene.srtText) ||
        (slot.scene.captions && slot.scene.captions.length > 0) ||
        Boolean(slot.scene.body),
    )
    .map((slot) => ({
      startFrame: Math.max(0, slot.from + 4),
      endFrame: Math.max(slot.from + 12, slot.from + slot.durationInFrames - 6),
    }));

  const hasPerSceneVoiceover = timeline.some((t) => Boolean(t.scene.voiceover));
  const duckRanges =
    parsed.voiceover || hasPerSceneVoiceover
      ? narratedRanges.length > 0
        ? narratedRanges
        : [
            {
              startFrame: 15,
              endFrame: Math.max(
                30,
                timeline.reduce((s, t) => s + t.durationInFrames, 0) - 30,
              ),
            },
          ]
      : [];

  const sfxEvents = buildEpisodeSfxTimeline({
    timelineSlots: timeline,
    episodeTimeline: parsed.sfxTimeline,
  });
  const sfxDuckRanges = deriveMusicDuckRangesFromSfx(
    sfxEvents,
    (ev) => (ev as ResolvedSfxEvent).resolvedEndFrame,
  );
  const musicDuckRanges = [...duckRanges, ...sfxDuckRanges];
  const mix = {
    voiceoverVolume:
      parsed.audioMix?.voiceoverVolume ?? ARKANAYA_AUDIO_MIX.voiceoverVolume,
    musicBaseVolume:
      parsed.audioMix?.musicBaseVolume ?? ARKANAYA_AUDIO_MIX.musicBaseVolume,
    musicDuckedVolume:
      parsed.audioMix?.musicDuckedVolume ??
      ARKANAYA_AUDIO_MIX.musicDuckedVolume,
    musicDuckRampFrames:
      parsed.audioMix?.musicDuckRampFrames ??
      ARKANAYA_AUDIO_MIX.musicDuckRampFrames,
    ambientBaseVolume:
      parsed.audioMix?.ambientBaseVolume ??
      ARKANAYA_AUDIO_MIX.ambientBaseVolume,
    ambientDuckedVolume:
      parsed.audioMix?.ambientDuckedVolume ??
      ARKANAYA_AUDIO_MIX.ambientDuckedVolume,
    sfxPolyphonyCeiling:
      parsed.audioMix?.sfxPolyphonyCeiling ??
      ARKANAYA_AUDIO_MIX.sfxPolyphonyCeiling,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: ARKANAYA_COLORS.deepBlack }}>
      {/* Data-driven scene sequences */}
      {timeline.map((slot) => (
        <Sequence
          key={slot.scene.id}
          name={`${slot.scene.chapterNumber ?? ""} ${slot.scene.type.toUpperCase()}`.trim()}
          from={slot.from}
          durationInFrames={slot.durationInFrames}
          hidden
        >
          <SceneRenderer slot={slot} episode={parsed} />
          {slot.scene.voiceover && (
            <VoiceOverTrack
              src={resolveMediaSrc(slot.scene.voiceover)}
              volume={mix.voiceoverVolume}
            />
          )}
        </Sequence>
      ))}

      {/* Scene boundary transitions */}
      {timeline.slice(0, -1).map((slot) => {
        const trans = slot.scene.transition ?? "none";
        if (trans === "none") return null;
        const cutFrame = slot.from + slot.durationInFrames;
        const transDuration = 28;
        const transStart = Math.max(0, cutFrame - Math.floor(transDuration / 2));

        return (
          <Sequence
            key={`tr-${slot.scene.id}`}
            from={transStart}
            durationInFrames={transDuration}
          >
            {trans === "paperCut" && <PaperCutTransition />}
            {trans === "verticalWipe" && <VerticalWipe />}
            {trans === "filmBurn" && <FilmBurn />}
          </Sequence>
        );
      })}

      {/* Global episode-level SRT captions (when provided) */}
      {parsed.srtText && <DocumentaryCaption srtText={parsed.srtText} />}

      {/* Centralized SFX Timeline & Global Audio Mixing Buses */}
      <SfxTimelinePlayer
        events={sfxEvents}
        voDuckRanges={duckRanges}
        sfxPolyphonyCeiling={mix.sfxPolyphonyCeiling}
      />
      <VoiceOverTrack
        src={resolveMediaSrc(parsed.voiceover)}
        volume={mix.voiceoverVolume}
      />
      <BackgroundMusicTrack
        src={resolveMediaSrc(parsed.music)}
        volume={mix.musicBaseVolume}
        duckedVolume={mix.musicDuckedVolume}
        rampFrames={mix.musicDuckRampFrames}
        duckRanges={musicDuckRanges}
      />
      <AmbientSoundTrack
        src={resolveMediaSrc(parsed.ambient)}
        volume={mix.ambientBaseVolume}
        duckedVolume={mix.ambientDuckedVolume}
        rampFrames={ARKANAYA_AUDIO_MIX.ambientDuckRampFrames}
        duckRanges={duckRanges}
      />

      {/* Branding & Analog Film Finish */}
      {showWatermark && <Watermark position="top-right" opacity={0.46} />}
      {showFilmGrain && (
        <FilmOverlay grain={0.11} dust={0.3} scratches={0.2} vignette={0.48} />
      )}
      <FadeToBlack fadeInFrames={10} fadeOutFrames={18} />
    </AbsoluteFill>
  );
};
