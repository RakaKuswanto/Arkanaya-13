import type React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import {
  ArchivePhoto,
  AudioTranscript,
  AudioWaveform,
  BrandIdent,
  BrandOpening,
  CameraOverlay,
  CaseEnding,
  CaseMetadata,
  CaseStamp,
  CaseTimeline,
  ChapterProgress,
  ChapterTransition,
  ConclusionCard,
  ContactSheet,
  CoordinateOverlay,
  DataChart,
  DistanceMeasurement,
  DocumentaryCaption,
  DocumentaryLowerThird,
  DocumentComparison,
  DocumentReveal,
  EpisodeNumber,
  EvidenceMarker,
  EvidenceZoom,
  FactCheckCard,
  FactCounter,
  FadeToBlack,
  FilmBurn,
  FilmOverlay,
  HandwrittenNote,
  HeadlineReveal,
  InvestigationBoard,
  KenBurns,
  KineticNumber,
  LocationComparison,
  LowerThird,
  MapRoute,
  MapZoomTransition,
  NarrativePause,
  NewspaperClipping,
  PaperCutTransition,
  PhotoAnnotation,
  PhotoParallax,
  PolaroidStack,
  PoliceReport,
  QuestionReveal,
  QuoteCallout,
  RedactedLine,
  SatelliteMap,
  SectionTitle,
  SeriesLabel,
  SocialEndScreen,
  type SoundEffectCategory,
  SourceCard,
  SourceCitation,
  SplitComparison,
  SuspectDossier,
  TelegramMessage,
  TypewriterText,
  VerificationBadge,
  VerticalWipe,
  VHSGlitch,
  Watermark,
  WitnessStatement,
} from "./components";
import { VISUAL_PRESETS } from "./presets/visualPresets";
import { EpisodeSceneTypeSchema } from "./schema/episode";
import { EVIDENCE_VERIFICATION_STATUSES } from "./theme/dataIntegrity";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  getSafeMargins,
  isLandscapeLayout,
} from "./theme/tokens";
import { ARKANAYA_FONTS } from "./theme/typography";

export type ShowcaseSection =
  | "all"
  | "editorial"
  | "geographic"
  | "archival"
  | "branding"
  | "presets";

export type ComponentShowcaseProps = {
  showWatermark?: boolean;
  showFilmGrain?: boolean;
  caseNumber?: string;
  section?: ShowcaseSection;
};

export const COMPONENT_SHOWCASE_DURATION = 2160;
export const SECTION_PREVIEW_DURATION = 180;

const SOUND_EFFECT_CATEGORIES: readonly SoundEffectCategory[] = [
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
];

const PropHint: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      fontFamily: ARKANAYA_FONTS.mono,
      fontSize: 13,
      letterSpacing: "0.08em",
      color: ARKANAYA_COLORS.ashGrey,
      borderLeft: `2px solid ${ARKANAYA_COLORS.archiveGold}`,
      paddingLeft: 10,
    }}
  >
    SAMPLE PROPS // {label} · [FICTIONAL PLACEHOLDER DATA]
  </div>
);

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({
  showWatermark = true,
  showFilmGrain = true,
  caseNumber = "FICTIONAL-QA-01",
  section = "all",
}) => {
  const { width, height } = useVideoConfig();
  const margins = getSafeMargins(width, height);
  const landscape = isLandscapeLayout(width, height);
  const contentWidth = width - margins.left - margins.right;
  const stageWidth = landscape ? Math.min(1260, contentWidth) : contentWidth;

  const stageStyle: React.CSSProperties = {
    backgroundColor: ARKANAYA_COLORS.obsidian,
    color: ARKANAYA_COLORS.archiveCream,
    paddingTop: margins.top,
    paddingBottom: margins.bottom,
    paddingLeft: margins.left,
    paddingRight: margins.right,
    display: "flex",
    flexDirection: "column",
    gap: landscape ? 18 : 24,
    overflow: "hidden",
  };

  const badgeStyle: React.CSSProperties = {
    fontFamily: ARKANAYA_FONTS.mono,
    fontSize: 16,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: ARKANAYA_COLORS.archiveGold,
  };

  const panelStyle: React.CSSProperties = {
    border: ARKANAYA_BORDERS.subtle,
    backgroundColor: ARKANAYA_COLORS.surfacePanel,
    padding: landscape ? 18 : 22,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  // Helper blocks usable both in standalone independent section preview AND full timeline
  const renderEditorialBlock = () => (
    <AbsoluteFill style={stageStyle}>
      <div style={badgeStyle}>
        QA // EDITORIAL, STORYTELLING &amp; DATA INTEGRITY
      </div>
      <PropHint label="LowerThird + SourceCitation + FactCheckCard + QuestionReveal + NarrativePause + ConclusionCard" />
      <LowerThird
        name="DR. SASTRA PRATAMA (FIKTIF)"
        role="KURATOR ARSIP NASIONAL (CONTOH)"
        credential="REF-041"
        verificationStatus="OFFICIAL STATEMENT"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: landscape ? "1fr 1fr" : "1fr",
          gap: 16,
        }}
      >
        <SourceCitation
          sourceId="SRC-FIKTIF-01"
          title="Laporan Inspeksi Stasiun Barat 1978 (Fictional)"
          publisher="Balai Arsip Fiktif Nusantara"
          publicationDate="1978-05-14"
          sourceType="ARCHIVE"
          url="https://archive.example.invalid/fiktif-01"
          verificationStatus="VERIFIED"
        />
        <FactCheckCard
          claim="Klaim fiktif: Menara Utara dikosongkan pada pukul 21:00."
          finding="Catatan jaga fiktif mencatat pergantian shift baru berlangsung pukul 23:15."
          verificationStatus="DISPUTED"
          sourceId="SRC-FIKTIF-02"
        />
      </div>
      <QuestionReveal
        caseId={caseNumber}
        question="Mengapa dua buku log berbeda mencatat jam yang bertolak belakang?"
      />
      {!landscape && (
        <ConclusionCard
          title="STATUS INTEGRITAS DATA (6 TINGKAT)"
          caseStatus="OPEN // FICTIONAL QA"
          summary="Setiap klaim harus menggunakan indikator visual yang membedakan fakta terverifikasi dan pernyataan yang dibantah."
          verificationSummary="ALLEGED"
        />
      )}
    </AbsoluteFill>
  );

  const renderGeographicBlock = () => (
    <AbsoluteFill style={stageStyle}>
      <div style={badgeStyle}>
        QA // GEOGRAPHIC, TELEMETRY &amp; DATA VISUALIZATION
      </div>
      <PropHint label="MapRoute + MapZoomTransition + SatelliteMap + CoordinateOverlay + DistanceMeasurement + DataChart" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: landscape ? "1.1fr 0.9fr" : "1fr",
          gap: 16,
        }}
      >
        <MapRoute
          width={landscape ? 680 : stageWidth}
          height={landscape ? 360 : 380}
          mode="vehicle"
          mapTitle="FICTIONAL SECTOR MAP // PLACEHOLDER"
          waypoints={[
            {
              id: "st-a",
              city: "SECTOR ALPHA (FIKTIF)",
              coordinates: { lat: -7.12, lng: 110.24 },
              xPercent: 25,
              yPercent: 72,
            },
            {
              id: "st-b",
              city: "SECTOR BRAVO (FIKTIF)",
              coordinates: { lat: -7.18, lng: 110.42 },
              xPercent: 75,
              yPercent: 28,
              align: "right",
            },
          ]}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SatelliteMap
            width={landscape ? 560 : stageWidth}
            height={landscape ? 220 : 210}
            sectorTitle="SATELLITE PLATE // FICTIONAL"
            pins={[{ id: "p1", label: "POS 01 (CONTOH)", xPercent: 52, yPercent: 54 }]}
          />
          <CoordinateOverlay
            lat={-7.1452}
            lng={110.3218}
            sectorLabel="COORDINATE OVERLAY (FICTIONAL)"
            elevationMeters={420}
            bearingDeg={118}
          />
        </div>
      </div>
      <DistanceMeasurement
        fromLabel="POS ALPHA (FIKTIF)"
        toLabel="POS BRAVO (FIKTIF)"
        distanceLabel="14.8 KM (CONTOH)"
      />
      <DataChart
        title="LAPORAN ANOMALI ARSIP (DATA FIKTIF)"
        type="bar"
        unit=" BERKAS"
        data={[
          { label: "1976", value: 12 },
          { label: "1977", value: 28 },
          { label: "1978", value: 54, highlight: true },
        ]}
        sourceCitation="FICTIONAL QA DATASET"
      />
    </AbsoluteFill>
  );

  const renderArchivalBlock = () => (
    <AbsoluteFill style={stageStyle}>
      <div style={badgeStyle}>
        QA // ARCHIVAL DOCUMENTS, FORENSICS &amp; ANNOTATIONS
      </div>
      <PropHint label="HandwrittenNote + TelegramMessage + PoliceReport + EvidenceZoom + PhotoAnnotation + WitnessStatement" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: landscape ? "1fr 1fr" : "1fr",
          gap: 16,
        }}
      >
        <HandwrittenNote
          note="Catatan lapangan fiktif: Laci arsip nomor 07 sudah dalam keadaan terbuka sebelum inspeksi pagi."
          author="PETUGAS MALAM (FIKTIF)"
          date="1978-05-12"
          highlightLine="Kunci cadangan tidak tercatat di buku serah terima."
          verificationStatus="ALLEGED"
        />
        <TelegramMessage
          sender="STASIUN BARAT (FIKTIF)"
          recipient="KANTOR PUSAT (FIKTIF)"
          timestamp="12 MAY 78 · 04:10"
          priority="FLASH"
          message="BERKAS 07 HILANG DARI BRANKAS STOP TUNGGU INSTRUKSI"
        />
      </div>
      <PoliceReport
        reportNumber="REP-FIKTIF-088"
        date="1978-05-13"
        officer="INSPEKTUR DUMMY"
        incidentSummary="Pemeriksaan awal fiktif menemukan segel kertas pada map arsip terpotong rapi."
        findings={["Tidak ada tanda paksa pada pintu utama.", "Satu halaman indeks tidak lengkap."]}
        classification="CLASSIFIED"
        verificationStatus="OFFICIAL STATEMENT"
      />
      {!landscape && (
        <WitnessStatement
          witnessLabel="SAKSI B-04 (IDENTITAS FIKTIF)"
          dateRecorded="1978-05-15"
          statement="Saya hanya melihat lampu ruang arsip menyala sebentar sekitar tengah malam."
          verificationStatus="UNVERIFIED"
          sourceId="DEP-FIKTIF-04"
        />
      )}
    </AbsoluteFill>
  );

  const renderBrandingBlock = () => (
    <AbsoluteFill style={stageStyle}>
      <div style={badgeStyle}>
        QA // BRANDING, INTEGRITY STATUS &amp; VISUAL PRESETS
      </div>
      <PropHint label="BrandIdent + EpisodeNumber + SeriesLabel + SocialEndScreen + VerificationBadge (6 states) + VISUAL_PRESETS (8)" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
        <SeriesLabel
          seriesTitle="ARKANAYA"
          category="CONTOH FIKTIF"
          partLabel="QA MODE"
        />
        <EpisodeNumber
          episodeNumber={99}
          season="SEASON 01"
          caseCode={caseNumber}
        />
      </div>
      <BrandIdent compact brandName="ARKANAYA" />
      <div style={panelStyle}>
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 14,
            color: ARKANAYA_COLORS.archiveGold,
          }}
        >
          DATA INTEGRITY BADGES ({EVIDENCE_VERIFICATION_STATUSES.length})
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {EVIDENCE_VERIFICATION_STATUSES.map((st) => (
            <VerificationBadge key={st} status={st} />
          ))}
        </div>
      </div>
      <div style={panelStyle}>
        <div
          style={{
            fontFamily: ARKANAYA_FONTS.mono,
            fontSize: 14,
            color: ARKANAYA_COLORS.archiveGold,
          }}
        >
          VISUAL PRESETS ({Object.keys(VISUAL_PRESETS).length})
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(VISUAL_PRESETS).map(([key, cfg]) => (
            <span
              key={key}
              style={{
                fontFamily: ARKANAYA_FONTS.mono,
                fontSize: 13,
                padding: "5px 10px",
                borderLeft: `3px solid ${cfg.accentColor}`,
                borderTop: ARKANAYA_BORDERS.subtle,
                borderRight: ARKANAYA_BORDERS.subtle,
                borderBottom: ARKANAYA_BORDERS.subtle,
                backgroundColor: ARKANAYA_COLORS.deepBlack,
              }}
            >
              {key} ({cfg.transition})
            </span>
          ))}
        </div>
      </div>
      <SocialEndScreen
        closingQuestion="Jika seluruh arsip telah terbuka, bagian mana yang masih hilang?"
        nextEpisodeLabel="EPISODE FIKTIF SELANJUTNYA"
      />
    </AbsoluteFill>
  );

  const renderPresetsBlock = () => (
    <AbsoluteFill style={stageStyle}>
      <div style={badgeStyle}>QA // ALL 8 VISUAL PRESETS MATRIX</div>
      <PropHint label="VISUAL_PRESETS configuration overview & transition tokens" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: landscape ? "repeat(2, 1fr)" : "1fr",
          gap: 14,
        }}
      >
        {Object.values(VISUAL_PRESETS).map((preset) => (
          <div
            key={preset.name}
            style={{
              ...panelStyle,
              borderLeft: ARKANAYA_BORDERS.accentLeft(preset.accentColor),
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: ARKANAYA_FONTS.mono,
                fontSize: 15,
                color: preset.accentColor,
                fontWeight: 700,
              }}
            >
              <span>{preset.name}</span>
              <span>
                TRANS: {preset.transition.toUpperCase()} · KB: {preset.kenBurnsMode}
              </span>
            </div>
            <div
              style={{
                fontFamily: ARKANAYA_FONTS.body,
                fontSize: 18,
                color: ARKANAYA_COLORS.archiveCream,
              }}
            >
              {preset.description}
            </div>
            <div
              style={{
                fontFamily: ARKANAYA_FONTS.mono,
                fontSize: 12,
                color: ARKANAYA_COLORS.ashGrey,
              }}
            >
              GRAIN: {preset.filmGrain} · VIGNETTE: {preset.vignette}
              {preset.stamp ? ` · STAMP: ${preset.stamp}` : ""}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );

  // Independent focused preview modes
  if (section !== "all") {
    return (
      <AbsoluteFill style={{ backgroundColor: ARKANAYA_COLORS.deepBlack }}>
        {section === "editorial" && renderEditorialBlock()}
        {section === "geographic" && renderGeographicBlock()}
        {section === "archival" && renderArchivalBlock()}
        {section === "branding" && renderBrandingBlock()}
        {section === "presets" && renderPresetsBlock()}
        {showWatermark && <Watermark />}
        {showFilmGrain && <FilmOverlay />}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: ARKANAYA_COLORS.deepBlack }}>
      {/* 1. Branding & Opening (0 - 120) */}
      <Sequence durationInFrames={120}>
        <BrandOpening
          brandName="ARKANAYA"
          tagline="Setiap kejadian punya cerita. Tidak semua cerita punya jawaban."
        />
      </Sequence>

      {/* 2. Typography Category (120 - 300) */}
      <Sequence from={120} durationInFrames={180}>
        <AbsoluteFill style={stageStyle}>
          <div style={badgeStyle}>CATEGORY 01 // TYPOGRAPHY (EXISTING)</div>
          <SectionTitle
            title="THE EVIDENCE"
            subtitle="Editorial display, typewriter, counters & subtitles"
            chapterNumber="CAT 01"
          />
          <HeadlineReveal
            text="ARSIP STASIUN BARAT YANG HILANG"
            highlightWords={["STASIUN", "HILANG"]}
            fontSize={landscape ? 60 : 72}
          />
          <div style={panelStyle}>
            <TypewriterText
              text="[CONTOH FIKTIF] 12 MEI 1978 — Log jaga malam mencatat akses ruang arsip pada pukul 02:14."
              charsPerSecond={34}
              fontSize={22}
              maxWidth={stageWidth}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div style={panelStyle}>
              <KineticNumber from={0} to={1978} label="TAHUN ARSIP (FIKTIF)" fontSize={64} />
            </div>
            <div style={panelStyle}>
              <KineticNumber
                from={0}
                to={14}
                suffix=" BERKAS"
                label="BELUM DITEMUKAN"
                fontSize={64}
                accentColor={ARKANAYA_COLORS.bloodRed}
              />
            </div>
          </div>
          <CaseMetadata
            caseNumber={caseNumber}
            location="SEKTOR BARAT (FIKTIF)"
            date="1978-05-12"
            category="FICTIONAL SHOWCASE"
            status="UNSOLVED"
            compact={landscape}
          />
        </AbsoluteFill>
        <DocumentaryCaption
          position="bottom"
          captions={[
            { text: "Setiap", startMs: 400, endMs: 1100 },
            { text: "dokumen", startMs: 1100, endMs: 2000 },
            { text: "menyimpan", startMs: 2000, endMs: 3000 },
            { text: "jejak", startMs: 3000, endMs: 4000 },
            { text: "fiktif", startMs: 4000, endMs: 4700 },
            { text: "untuk QA.", startMs: 4700, endMs: 5800 },
          ]}
        />
      </Sequence>

      {/* 3. Archival Media Category (300 - 480) */}
      <Sequence from={300} durationInFrames={180}>
        <AbsoluteFill style={stageStyle}>
          <div style={badgeStyle}>CATEGORY 02 // ARCHIVAL MEDIA (EXISTING)</div>
          <SectionTitle
            title="THE INCIDENT"
            subtitle="Archive plates, contact sheets & polaroid stacks"
            chapterNumber="CAT 02"
          />
          <ArchivePhoto
            width={stageWidth}
            height={landscape ? 250 : 340}
            frameStyle="paper"
            dateStamp="12-05-1978"
            caption="Contoh foto arsip ruang brankas (placeholder fiktif)."
          />
          <ContactSheet
            filmStockLabel="FICTIONAL 35MM // ROLL 09"
            columns={3}
            width={stageWidth}
            items={[
              { frameCode: "04A", label: "PINTU" },
              { frameCode: "05A", label: "MEJA 07" },
              { frameCode: "06A", label: "SEGEL" },
            ]}
          />
          {!landscape && (
            <div style={{ position: "relative", height: 280 }}>
              <PolaroidStack
                width={340}
                photoHeight={200}
                items={[
                  { caption: "Kunci Laci 07 (Fiktif)", date: "1978-05-12", rotation: -4 },
                  { caption: "Buku Log (Fiktif)", date: "1978-05-13", rotation: 3 },
                ]}
              />
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* 4. Investigation Category (480 - 660) */}
      <Sequence from={480} durationInFrames={180}>
        <AbsoluteFill style={stageStyle}>
          <div style={badgeStyle}>CATEGORY 03 // INVESTIGATION BOARD</div>
          <InvestigationBoard
            width={stageWidth}
            height={landscape ? 360 : 440}
            cards={[
              {
                id: "ev1",
                evidenceNumber: "FIKTIF-01",
                title: "SEGEL RUSAK",
                description: "Ditemukan pada rak 07 (contoh).",
                date: "1978-05-12",
                xPercent: 26,
                yPercent: 52,
                width: 280,
              },
              {
                id: "ev2",
                evidenceNumber: "FIKTIF-02",
                title: "CATATAN MALAM",
                description: "Selisih jam jaga 2 jam (contoh).",
                date: "1978-05-13",
                xPercent: 74,
                yPercent: 52,
                width: 280,
              },
            ]}
            connections={[{ from: "ev1", to: "ev2", label: "LINKED" }]}
          />
          <CaseTimeline
            orientation={landscape ? "horizontal" : "vertical"}
            width={stageWidth}
            events={[
              { date: "02:14 (FIKTIF)", title: "PINTU TERBUKA", description: "Sensor pintu berbunyi." },
              { date: "06:30 (FIKTIF)", title: "INSPEKSI PAGI", description: "14 map tidak di tempat.", highlight: true },
            ]}
          />
          {!landscape && (
            <NewspaperClipping
              width={stageWidth}
              newspaperName="HARIAN ARSIP (FIKTIF)"
              issueDate="14 MEI 1978"
              headline="BELASAN BERKAS HILANG DARI GEDUNG LAMA"
              excerpt="Artikel contoh fiktif ini memverifikasi tata letak kliping koran vintage dan pinggiran kertas sobek."
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* 5. New Geographic & Data Suite (660 - 840) */}
      <Sequence from={660} durationInFrames={180}>
        {renderGeographicBlock()}
      </Sequence>

      {/* 6. New MapZoomTransition & LocationComparison (840 - 1020) */}
      <Sequence from={840} durationInFrames={180}>
        <AbsoluteFill style={stageStyle}>
          <div style={badgeStyle}>QA // MAP ZOOM &amp; LOCATION COMPARISON</div>
          <PropHint label="MapZoomTransition + LocationComparison + FactCounter" />
          <MapZoomTransition
            width={stageWidth}
            height={landscape ? 320 : 380}
            targetLabel="SEKTOR TARGET (FIKTIF)"
            coordinates={{ lat: -7.1452, lng: 110.3218 }}
          />
          <LocationComparison
            left={{
              title: "STASIUN UTARA (FIKTIF)",
              dateLabel: "1978-05-12",
              coordinatesLabel: "7.1200° S · 110.2400° E",
            }}
            right={{
              title: "GUDANG TIMUR (FIKTIF)",
              dateLabel: "1978-05-13",
              coordinatesLabel: "7.1800° S · 110.4200° E",
            }}
          />
          {!landscape && (
            <FactCounter
              value={14}
              suffix=" BERKAS"
              label="JUMLAH DOKUMEN HILANG (FIKTIF)"
              description="Angka contoh untuk verifikasi counter dan batas aman."
              source="FICTIONAL ARCHIVE"
              width={stageWidth}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* 7. Effects, EvidenceZoom & PhotoAnnotation (1020 - 1200) */}
      <Sequence from={1020} durationInFrames={180}>
        <AbsoluteFill style={stageStyle}>
          <div style={badgeStyle}>QA // EFFECTS, FORENSICS &amp; ZOOM</div>
          <PropHint label="EvidenceZoom + PhotoAnnotation + DocumentReveal + CaseStamp + KenBurns + VHSGlitch" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: landscape ? "1fr 1fr" : "1fr",
              gap: 16,
            }}
          >
            <EvidenceZoom
              height={landscape ? 340 : 320}
              calloutLabel="SEGEL RUSAK (FIKTIF)"
              calloutDetail="Pembesaran forensik terpusat pada titik koordinat 52%, 48%."
            />
            <PhotoAnnotation
              height={landscape ? 340 : 320}
              caption="FOTO INSPEKSI FIKTIF // ANOTASI MULTI-TITIK"
              verificationStatus="VERIFIED"
              markers={[
                { number: "01", label: "ENGSEL LACI", xPercent: 34, yPercent: 44 },
                { number: "02", label: "KODE MAP", xPercent: 62, yPercent: 62 },
              ]}
            />
          </div>
          {!landscape && (
            <div style={{ position: "relative", height: 340, overflow: "hidden" }}>
              <VHSGlitch intensity={0.4}>
                <KenBurns mode="zoomIn">
                  <DocumentReveal
                    width={stageWidth}
                    docNumber="FIKTIF-78-C"
                    agency="ARSIP CONTOH"
                    subject="MEMO INTERNAL PEMBERITAHUAN"
                    body="Beberapa rincian mengenai akses malam hari telah disunting sementara."
                    redactedPhrases={["akses malam hari"]}
                    stamp="CLASSIFIED"
                  />
                </KenBurns>
              </VHSGlitch>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <CaseStamp
              text="ARCHIVED"
              subtext="FICTIONAL QA STAMP"
              color={ARKANAYA_COLORS.bloodRed}
              fontSize={24}
              delayFrames={24}
              rotation={-6}
            />
          </div>
        </AbsoluteFill>
        <CameraOverlay cameraId="QA TAPE // REC" />
        <Sequence from={142} durationInFrames={32}>
          <FilmBurn direction="right" />
        </Sequence>
      </Sequence>

      {/* 8. New Archival Investigation Docs (1200 - 1380) */}
      <Sequence from={1200} durationInFrames={180}>
        {renderArchivalBlock()}
      </Sequence>

      {/* 9. Comparison, AudioTranscript, Quote & NarrativePause (1380 - 1560) */}
      <Sequence from={1380} durationInFrames={180}>
        <AbsoluteFill style={stageStyle}>
          <div style={badgeStyle}>QA // COMPARISON, TRANSCRIPTS &amp; QUOTE</div>
          <PropHint label="DocumentComparison + SplitComparison + AudioWaveform + AudioTranscript + QuoteCallout + RedactedLine" />
          <DocumentComparison
            leftDoc={{
              versionLabel: "VERSI A // BUKU JAGA (FIKTIF)",
              docCode: "LOG-A",
              verificationStatus: "OFFICIAL STATEMENT",
              lines: [
                { text: "02:00 — Seluruh ruang terkunci aman." },
                { text: "02:15 — Tidak ada tamu tercatat.", changed: true },
              ],
            }}
            rightDoc={{
              versionLabel: "VERSI B // LAPORAN PAGI (FIKTIF)",
              docCode: "LOG-B",
              verificationStatus: "DISPUTED",
              lines: [
                { text: "02:00 — Seluruh ruang terkunci aman." },
                { text: "02:15 — Lampu lorong barat menyala.", changed: true },
              ],
            }}
          />
          <AudioTranscript
            sourceCode="TAPE-FIKTIF-02"
            lines={[
              { speaker: "OPERATOR (FIKTIF)", timecode: "02:13", text: "Ada pergerakan di koridor tiga?" },
              { speaker: "PENJAGA (FIKTIF)", timecode: "02:14", text: "Segel ruang arsip sudah terbuka.", redacted: false },
            ]}
          />
          {!landscape && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <QuoteCallout
                quote="Kutipan contoh fiktif untuk memeriksa animasi garis sorot editorial."
                highlightPhrase="garis sorot"
                speaker="NARASUMBER CONTOH"
              />
              <SuspectDossier
                subjectName="SUBJEK CONTOH"
                dossierCode="QA-SUBJ"
                status="UNSOLVED"
                attributes={[{ label: "PERAN", value: "FIKTIF" }]}
              />
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* 10. New Editorial & Data Integrity (1560 - 1740) */}
      <Sequence from={1560} durationInFrames={180}>
        {renderEditorialBlock()}
      </Sequence>

      {/* 11. ChapterTransition + NarrativePause + Branding + Visual Presets (1740 - 1980) */}
      <Sequence from={1740} durationInFrames={90}>
        <ChapterTransition
          chapterNumber={9}
          title="VERIFIKASI PRESET"
          subtitle="Transisi bab, jeda naratif, dan identitas grafis ARKANAYA"
        />
      </Sequence>
      <Sequence from={1830} durationInFrames={150}>
        {renderBrandingBlock()}
      </Sequence>

      {/* 12. Presets Matrix, Audio Layer & Ending (1980 - 2160) */}
      <Sequence from={1980} durationInFrames={90}>
        <AbsoluteFill style={stageStyle}>
          <div style={badgeStyle}>
            QA // SCENE TYPES ({EpisodeSceneTypeSchema.options.length}), AUDIO ({SOUND_EFFECT_CATEGORIES.length} SFX) &amp; LEGACY COMPAT
          </div>
          <PhotoParallax height={landscape ? 190 : 240} depth={1}>
            <EvidenceMarker
              number="01"
              label="MARKER + PARALLAX"
              annotation="Fictional Evidence Point"
              xPercent={48}
              yPercent={46}
            />
          </PhotoParallax>
          <ChapterProgress currentChapter={11} totalChapters={12} label="QA PROGRESS" />
          <div style={{ display: "grid", gridTemplateColumns: landscape ? "1fr 1fr" : "1fr", gap: 14 }}>
            <SourceCard
              sourceId="SRC-LEGACY"
              title="SourceCard & DocumentaryLowerThird Back-Compat"
              publisher="ARKANAYA QA"
              verificationStatus="OFFICIAL"
            />
            <DocumentaryLowerThird
              name="PANEL LEGACY (FIKTIF)"
              role="KOMPATIBILITAS API LAMA"
            />
          </div>
          <div style={panelStyle}>
            <div style={{ fontFamily: ARKANAYA_FONTS.mono, fontSize: 13, color: ARKANAYA_COLORS.bloodRed }}>
              SPLIT &amp; WAVEFORM &amp; REDACT // AudioWaveform · SplitComparison · RedactedLine ({SOUND_EFFECT_CATEGORIES.join(" · ")})
            </div>
            <RedactedLine text="KALIMAT TERSUNTING FIKTIF UNTUK VERIFIKASI" mode="redact" />
          </div>
          {!landscape && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <SplitComparison height={160} left={{ label: "KLAIM" }} right={{ label: "BUKTI" }} />
              <AudioWaveform height={60} label="AUDIO QA" />
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      <Sequence from={2070} durationInFrames={90}>
        <NarrativePause
          statement="Setiap kejadian punya cerita. Tidak semua cerita punya jawaban."
          subtext="QA SELESAI // FICTIONAL PLACEHOLDER SHOWCASE"
          label="ARKANAYA // END"
        />
        <Sequence from={45} durationInFrames={45}>
          <CaseEnding statement="Kebenaran sering kali terkubur bersama waktu." />
        </Sequence>
        <Sequence durationInFrames={20}>
          <VerticalWipe direction="up" />
        </Sequence>
        <Sequence from={22} durationInFrames={20}>
          <PaperCutTransition />
        </Sequence>
        <Sequence from={66} durationInFrames={24}>
          <FadeToBlack fadeInFrames={0} fadeOutFrames={24} />
        </Sequence>
      </Sequence>

      {showWatermark && <Watermark />}
      {showFilmGrain && <FilmOverlay />}
    </AbsoluteFill>
  );
};
