import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  SFX_ASSET_REGISTRY,
  SFX_DOMAIN_CATEGORIES,
  SOUND_DESIGN_PRESET_LIST,
  instantiateSoundPreset,
} from "./audio";
import { SfxTimelinePlayer, SoundEffect } from "./components/audio";
import { FilmOverlay } from "./components/archival";
import { Watermark } from "./components/branding";
import { AudioWaveform } from "./components/effects";
import {
  ARKANAYA_BORDERS,
  ARKANAYA_COLORS,
  getSafeMargins,
  isLandscapeLayout,
} from "./theme/tokens";
import { ARKANAYA_FONTS } from "./theme/typography";

export const SFX_SLOT_FRAMES = 90;
export const PRESET_SLOT_FRAMES = 150;
export const SFX_SHOWCASE_DURATION =
  SFX_ASSET_REGISTRY.length * SFX_SLOT_FRAMES + 2 * PRESET_SLOT_FRAMES;

export type SfxShowcaseProps = {
  showWatermark?: boolean;
  showFilmGrain?: boolean;
};

export const SfxShowcase = ({
  showWatermark = true,
  showFilmGrain = true,
}: SfxShowcaseProps) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const safe = getSafeMargins(width, height);
  const landscape = isLandscapeLayout(width, height);

  const assetPhaseEnd = SFX_ASSET_REGISTRY.length * SFX_SLOT_FRAMES;
  const activeAssetIndex =
    frame < assetPhaseEnd
      ? Math.min(
          SFX_ASSET_REGISTRY.length - 1,
          Math.floor(frame / SFX_SLOT_FRAMES),
        )
      : -1;

  const pageSize = landscape ? 8 : 7;
  const currentAssetPage =
    activeAssetIndex >= 0 ? Math.floor(activeAssetIndex / pageSize) : 0;
  const visibleAssets = SFX_ASSET_REGISTRY.slice(
    currentAssetPage * pageSize,
    currentAssetPage * pageSize + pageSize,
  );

  const presetEvents = [
    ...instantiateSoundPreset("Documentary Opening", {
      sceneId: "showcase-opening",
      sceneStartFrame: assetPhaseEnd,
      sceneDurationFrames: PRESET_SLOT_FRAMES,
      baseEventId: "showcase-open",
    }),
    ...instantiateSoundPreset("Digital Glitch", {
      sceneId: "showcase-glitch",
      sceneStartFrame: assetPhaseEnd + PRESET_SLOT_FRAMES,
      sceneDurationFrames: PRESET_SLOT_FRAMES,
      baseEventId: "showcase-glitch",
    }),
  ];

  const activePresetIndex =
    frame >= assetPhaseEnd
      ? Math.min(1, Math.floor((frame - assetPhaseEnd) / PRESET_SLOT_FRAMES))
      : -1;

  const badgeStyle: React.CSSProperties = {
    fontFamily: ARKANAYA_FONTS.mono,
    fontSize: 13,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: ARKANAYA_COLORS.archiveGold,
    marginBottom: 4,
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ARKANAYA_COLORS.deepBlack,
        color: ARKANAYA_COLORS.archivePaper,
      }}
    >
      {/* Sequential Audio Previews for Every Registered SFX */}
      {SFX_ASSET_REGISTRY.map((asset, index) => (
        <SoundEffect
          key={`preview-${asset.id}`}
          assetId={asset.id}
          startFrame={index * SFX_SLOT_FRAMES + 8}
          duration={Math.min(
            SFX_SLOT_FRAMES - 10,
            asset.durationFrames ?? 60,
          )}
          volume={asset.defaultVolume}
        />
      ))}

      {/* Live Presets Preview */}
      <SfxTimelinePlayer events={presetEvents} />

      <AbsoluteFill
        style={{
          paddingTop: safe.top - 10,
          paddingRight: safe.right,
          paddingBottom: safe.bottom - 20,
          paddingLeft: safe.left,
          display: "flex",
          flexDirection: "column",
          gap: landscape ? 14 : 18,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: ARKANAYA_BORDERS.subtle,
            paddingBottom: 10,
          }}
        >
          <div>
            <div style={badgeStyle}>
              ARKANAYA 13 // AUDIO SYSTEM &amp; SFX SHOWCASE
            </div>
            <div
              style={{
                fontFamily: ARKANAYA_FONTS.headline,
                fontSize: landscape ? 44 : 48,
                lineHeight: 1,
                letterSpacing: "0.02em",
              }}
            >
              {activeAssetIndex >= 0
                ? "CENTRALIZED SFX REGISTRY PREVIEW"
                : "SOUND DESIGN PRESETS & MIXING"}
            </div>
          </div>
          <div
            style={{
              fontFamily: ARKANAYA_FONTS.mono,
              fontSize: 13,
              color: ARKANAYA_COLORS.ashGrey,
              textAlign: "right",
            }}
          >
            <div>
              {SFX_ASSET_REGISTRY.length} ASSETS · {SFX_DOMAIN_CATEGORIES.length}{" "}
              CATEGORIES
            </div>
            <div>{SOUND_DESIGN_PRESET_LIST.length} PRESETS · {fps} FPS</div>
          </div>
        </div>

        {/* Category Filter Summary Strip */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SFX_DOMAIN_CATEGORIES.map((cat) => {
            const activeCat =
              activeAssetIndex >= 0 &&
              SFX_ASSET_REGISTRY[activeAssetIndex]?.category === cat;
            return (
              <div
                key={cat}
                style={{
                  fontFamily: ARKANAYA_FONTS.mono,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  border: `1px solid ${
                    activeCat
                      ? ARKANAYA_COLORS.bloodRed
                      : ARKANAYA_COLORS.borderSubtle
                  }`,
                  backgroundColor: activeCat
                    ? "rgba(158, 48, 45, 0.24)"
                    : ARKANAYA_COLORS.surfacePanel,
                  color: activeCat
                    ? ARKANAYA_COLORS.archivePaper
                    : ARKANAYA_COLORS.ashGrey,
                }}
              >
                {cat}
              </div>
            );
          })}
        </div>

        {/* Main Content Switch: Assets Preview vs Presets Matrix */}
        {activeAssetIndex >= 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: landscape ? "1fr 1fr" : "1fr",
              gap: 12,
            }}
          >
            {visibleAssets.map((asset) => {
              const globalIdx = SFX_ASSET_REGISTRY.findIndex(
                (item) => item.id === asset.id,
              );
              const isPlaying = globalIdx === activeAssetIndex;
              return (
                <div
                  key={asset.id}
                  style={{
                    padding: landscape ? "12px 14px" : "14px 16px",
                    backgroundColor: isPlaying
                      ? "rgba(158, 48, 45, 0.14)"
                      : ARKANAYA_COLORS.surfacePanel,
                    border: `1px solid ${
                      isPlaying
                        ? ARKANAYA_COLORS.bloodRed
                        : ARKANAYA_COLORS.borderSubtle
                    }`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: ARKANAYA_FONTS.headline,
                        fontSize: landscape ? 24 : 26,
                        letterSpacing: "0.02em",
                        color: isPlaying
                          ? ARKANAYA_COLORS.archivePaper
                          : ARKANAYA_COLORS.agedPaper,
                      }}
                    >
                      {asset.name}
                    </div>
                    <div
                      style={{
                        fontFamily: ARKANAYA_FONTS.mono,
                        fontSize: 11,
                        padding: "2px 8px",
                        border: ARKANAYA_BORDERS.subtle,
                        color: isPlaying
                          ? ARKANAYA_COLORS.bloodRed
                          : ARKANAYA_COLORS.archiveGold,
                        textTransform: "uppercase",
                      }}
                    >
                      {isPlaying ? "PLAYING // " : ""}
                      {asset.category}
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: ARKANAYA_FONTS.body,
                      fontSize: 15,
                      lineHeight: 1.35,
                      color: ARKANAYA_COLORS.agedPaper,
                    }}
                  >
                    {asset.description}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: ARKANAYA_FONTS.mono,
                      fontSize: 12,
                      color: ARKANAYA_COLORS.ashGrey,
                      marginTop: 2,
                    }}
                  >
                    <span>
                      ID: {asset.id} ·{" "}
                      {asset.durationSeconds?.toFixed(2) ?? "--"}s (
                      {asset.durationFrames ?? "--"}f) · VOL{" "}
                      {Math.round(asset.defaultVolume * 100)}%
                    </span>
                    <span>{asset.format.toUpperCase()}</span>
                  </div>

                  <div
                    style={{
                      fontFamily: ARKANAYA_FONTS.mono,
                      fontSize: 11,
                      color: ARKANAYA_COLORS.ashGrey,
                    }}
                  >
                    LICENSE: {asset.license}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: landscape ? "1fr 1fr 1fr" : "1fr",
              gap: 10,
            }}
          >
            {SOUND_DESIGN_PRESET_LIST.map((preset) => {
              const highlighted =
                (activePresetIndex === 0 &&
                  preset.name === "Documentary Opening") ||
                (activePresetIndex === 1 && preset.name === "Digital Glitch");
              return (
                <div
                  key={preset.name}
                  style={{
                    padding: "12px 14px",
                    backgroundColor: highlighted
                      ? "rgba(158, 48, 45, 0.16)"
                      : ARKANAYA_COLORS.surfacePanel,
                    border: `1px solid ${
                      highlighted
                        ? ARKANAYA_COLORS.bloodRed
                        : ARKANAYA_COLORS.borderSubtle
                    }`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontFamily: ARKANAYA_FONTS.headline,
                      fontSize: 22,
                      color: ARKANAYA_COLORS.archivePaper,
                    }}
                  >
                    {preset.name}
                    {highlighted ? " // PREVIEWING" : ""}
                  </div>
                  <div
                    style={{
                      fontFamily: ARKANAYA_FONTS.body,
                      fontSize: 14,
                      color: ARKANAYA_COLORS.agedPaper,
                      lineHeight: 1.35,
                    }}
                  >
                    {preset.description}
                  </div>
                  <div
                    style={{
                      fontFamily: ARKANAYA_FONTS.mono,
                      fontSize: 11,
                      color: ARKANAYA_COLORS.archiveGold,
                    }}
                  >
                    CUES: {preset.cues.map((c) => c.assetId).join(" + ")}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Waveform Preview Bar */}
        <div style={{ marginTop: "auto", width: "100%" }}>
          <AudioWaveform
            style={{ width: "100%" }}
            height={landscape ? 68 : 88}
            label={
              activeAssetIndex >= 0
                ? `PREVIEW // ${SFX_ASSET_REGISTRY[activeAssetIndex]?.name ?? ""}`
                : activePresetIndex === 0
                  ? "PRESET // Documentary Opening"
                  : "PRESET // Digital Glitch"
            }
          />
        </div>
      </AbsoluteFill>

      {showWatermark && <Watermark />}
      {showFilmGrain && <FilmOverlay />}
    </AbsoluteFill>
  );
};
