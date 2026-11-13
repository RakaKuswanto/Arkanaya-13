import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "src");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

// Lightweight in-memory CommonJS loader for TypeScript source modules
const moduleCache = new Map();
const nodeRequire = createRequire(import.meta.url);

function loadTsModule(tsPath) {
  const normalized = path.resolve(tsPath);
  if (moduleCache.has(normalized)) {
    return moduleCache.get(normalized).exports;
  }

  const mod = { exports: {} };
  moduleCache.set(normalized, mod);

  if (normalized.endsWith(".json")) {
    mod.exports = JSON.parse(fs.readFileSync(normalized, "utf8"));
    return mod.exports;
  }

  const source = fs.readFileSync(normalized, "utf8");
  const { outputText } = ts.transpileModule(source, {
    fileName: normalized,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });

  const localRequire = (specifier) => {
    if (specifier === "remotion") {
      return {
        staticFile: (p) => `/${String(p).replace(/^\/+/, "")}`,
        interpolate: (val, input, output) => {
          const [in0, in1] = input;
          const [out0, out1] = output;
          if (in1 === in0) return out0;
          const t = Math.max(0, Math.min(1, (val - in0) / (in1 - in0)));
          return out0 + (out1 - out0) * t;
        },
      };
    }
    if (!specifier.startsWith(".")) {
      return nodeRequire(specifier);
    }
    const base = path.resolve(path.dirname(normalized), specifier);
    const candidates = [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      path.join(base, "index.ts"),
      path.join(base, "index.tsx"),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return loadTsModule(candidate);
      }
    }
    throw new Error(`Cannot resolve "${specifier}" from ${normalized}`);
  };

  const fn = new Function("exports", "require", "module", "__filename", "__dirname", outputText);
  fn(mod.exports, localRequire, mod, normalized, path.dirname(normalized));
  return mod.exports;
}

function collectPublicFiles(dir, prefix = "") {
  const out = new Set();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const child of collectPublicFiles(full, rel)) {
        out.add(child);
      }
    } else {
      out.add(rel);
    }
  }
  return out;
}

const existingPublicFiles = collectPublicFiles(PUBLIC_DIR);

const registryMod = loadTsModule(path.join(SRC_DIR, "audio", "registry.ts"));
const presetsMod = loadTsModule(path.join(SRC_DIR, "audio", "presets.ts"));
const timelineMod = loadTsModule(path.join(SRC_DIR, "audio", "timeline.ts"));
const mixingMod = loadTsModule(path.join(SRC_DIR, "audio", "mixing.ts"));
const validationMod = loadTsModule(path.join(SRC_DIR, "audio", "validation.ts"));
const episodesMod = loadTsModule(path.join(SRC_DIR, "episodes", "index.ts"));
const schemaMod = loadTsModule(path.join(SRC_DIR, "schema", "episode.ts"));

// 1. Validate centralized SFX asset registry & physical files in public/
const registryReport = validationMod.validateSfxRegistry(
  registryMod.SFX_ASSET_REGISTRY,
  { existingPublicFiles },
);
console.log(
  `[Registry] ${registryMod.SFX_ASSET_REGISTRY.length} assets checked -> valid=${registryReport.valid} (${registryReport.errorCount} errors, ${registryReport.warningCount} warnings)`,
);
assert.equal(registryReport.valid, true, JSON.stringify(registryReport.issues, null, 2));

// 2. Verify all 8 required domain categories exist in registry
for (const cat of [
  "Archive",
  "Investigation",
  "Analog",
  "Suspense",
  "Transition",
  "Environment",
  "Technology",
  "Atmosphere",
]) {
  const matches = registryMod.listSfxByCategory(cat);
  assert.ok(matches.length >= 1, `Missing asset for category "${cat}"`);
}

// 3. Verify all 9 Sound Design Presets instantiate valid timeline events
const presetNames = presetsMod.SOUND_DESIGN_PRESET_LIST.map((p) => p.name);
assert.equal(presetNames.length, 9, "Expected 9 Sound Design Presets");
for (const presetName of presetNames) {
  const events = presetsMod.instantiateSoundPreset(presetName, {
    sceneId: "qa-scene",
    sceneStartFrame: 30,
    sceneDurationFrames: 180,
  });
  const report = validationMod.validateSfxTimeline(events, {
    totalFrames: 240,
    existingPublicFiles,
  });
  assert.equal(
    report.valid,
    true,
    `Preset "${presetName}" failed validation: ${JSON.stringify(report.issues)}`,
  );
}
console.log(`[Presets] All ${presetNames.length} Sound Design Presets validated cleanly.`);

// 4. Validate all registered episodes & compiled SFX timelines
for (const episode of episodesMod.EPISODES) {
  const slots = schemaMod.computeSceneTimeline(episode);
  const totalFrames = schemaMod.calculateEpisodeDuration(episode);
  const compiled = timelineMod.buildEpisodeSfxTimeline({
    timelineSlots: slots,
    episodeTimeline: episode.sfxTimeline ?? [],
  });
  const epReport = validationMod.validateSfxTimeline(compiled, {
    totalFrames,
    existingPublicFiles,
  });
  console.log(
    `[Episode: ${episode.id}] ${compiled.length} SFX events -> valid=${epReport.valid} (${epReport.errorCount} errors, ${epReport.warningCount} warnings)`,
  );
  assert.equal(epReport.valid, true, JSON.stringify(epReport.issues, null, 2));
}

// 5. Exercise validation failure detectors + polyphony/dedup edge cases
const brokenReport = validationMod.validateSfxTimeline(
  [
    { id: "dup", assetId: "sfx-paper-movement", startFrame: 0, duration: 20, volume: 0.5 },
    { id: "dup", src: "audio/sfx/missing.unknown", startFrame: -5, endFrame: -10, volume: 1.8, playbackRate: 0, stereoPan: 2 },
  ],
  { totalFrames: 100, existingPublicFiles },
);
const codes = new Set(brokenReport.issues.map((i) => i.code));
for (const expected of [
  "DUPLICATE_EVENT_ID",
  "MISSING_AUDIO_SOURCE",
  "UNSUPPORTED_FORMAT",
  "INVALID_FRAME_RANGE",
  "INVALID_VOLUME",
  "INVALID_PLAYBACK_RATE",
  "INVALID_STEREO_PAN",
]) {
  assert.ok(codes.has(expected), `Expected validation to catch "${expected}"`);
}

// Check deduplication & polyphony ceiling
const deduped = timelineMod.deduplicateSfxEvents([
  timelineMod.resolveSfxEvent({ id: "a", assetId: "sfx-paper-movement", startFrame: 10 }),
  timelineMod.resolveSfxEvent({ id: "b", assetId: "sfx-paper-movement", startFrame: 11 }),
]);
assert.equal(deduped.length, 1, "Accidental overlap duplicate trigger should be deduplicated");
const scale = mixingMod.computePolyphonyScale(
  [
    { startFrame: 0, endFrame: 30, volume: 0.6 },
    { startFrame: 0, endFrame: 30, volume: 0.6 },
  ],
  10,
  0.9,
);
assert.ok(Math.abs(scale - 0.75) < 0.001, `Expected polyphony scale 0.75, got ${scale}`);
console.log("[Validation & Mixing Tests] All assertions passed.");
