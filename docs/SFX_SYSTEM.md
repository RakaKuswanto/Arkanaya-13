# ARKANAYA 13 — Sound Effects & Audio Mixing System

Sistem manajemen SFX dan audio mixing terpusat untuk produksi dokumenter investigatif **ARKANAYA 13** (kompatibel `9:16` dan `16:9`, deterministik berbasis frame pada Remotion `4.0.543`).

---

## 1. Audit Arsitektur Audio Sebelum & Sesudah

### Arsitektur Sebelumnya
- Komponen dasar di `src/components/audio/`: `VoiceOverTrack`, `BackgroundMusicTrack`, `AmbientSoundTrack`, `AudioFade`, `AudioDuck`, dan `SoundEffect`.
- `SoundEffect` sebelumnya hanya pembungkus tipis `AudioFade` dengan `fadeInFrames=2` / `fadeOutFrames=6` hardcoded, tidak memiliki `assetId` registry, tidak mendukung `playbackRate`/`trimBefore`, mengabaikan `category` saat `src` kosong, dan tidak memiliki proteksi tabrakan polyphony atau duplikasi event.
- `AmbientSoundTrack` sebelumnya tidak mendukung ducking saat narasi aktif.
- Tidak ada registry terpusat, tidak ada validasi file/lisensi/frame, tidak ada preset sound design, dan tidak ada komposisi showcase preview audio.

### Arsitektur Saat Ini
- **`src/audio/registry.ts`**: Registry terpusat `SFX_ASSET_REGISTRY` (14 aset terverifikasi pada disk across 8 kategori: `Archive`, `Investigation`, `Analog`, `Suspense`, `Transition`, `Environment`, `Technology`, `Atmosphere`).
- **`src/audio/timeline.ts`**: Engine timeline deklaratif (`buildEpisodeSfxTimeline`, `resolveSfxEvent`, `deduplicateSfxEvents`) yang menggabungkan `scene.sfx`, `scene.sfxList`, `scene.soundPreset`, dan `episode.sfxTimeline`.
- **`src/audio/mixing.ts`**: Arsitektur 4-bus (`voiceover > sfx > ambient > music`), helper `computeSfxCombinedEnvelope`, `computePolyphonyScale`, serta target mastering sosial/shorts.
- **`src/audio/presets.ts`**: 9 Sound Design Presets siap pakai tanpa duplikasi file audio.
- **`src/audio/validation.ts` & `scripts/validate-audio.mjs`**: Validator registry, timeline, format, frame range, volume, rate, pan, duplikasi ID/trigger, serta kelengkapan file fisik & lisensi di `public/`.
- **`src/components/audio/`**: `AudioFade`, `AudioDuck`, `AmbientSoundTrack` (kini mendukung ducking VO opsional), `BackgroundMusicTrack`, `SoundEffect` (kompatibel API lama + API timeline baru via `<Html5Audio>`), dan `SfxTimelinePlayer`.
- **`src/SfxShowcase.tsx`**: Komposisi showcase interaktif `arkanaya-sfx-showcase` (9:16) dan `arkanaya-sfx-showcase-16x9` (16:9) di folder `Library` Remotion Studio.

---

## 2. Cara Menambahkan & Mendaftarkan SFX Baru

1. **Siapkan file audio** (`.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg`, atau `.flac`, disarankan `44100 Hz` stereo, normalized clean tanpa clipping) dan simpan ke:
   - `public/audio/sfx/<nama-file>.mp3` (atau `public/audio/ambient/` untuk bed atmosfer).
2. **Ukur durasi aktual** (dalam detik & frame pada `30 fps`), misalnya menggunakan `ffprobe`:
   ```powershell
   node_modules\@remotion\compositor-win32-x64-msvc\ffprobe.exe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public\audio\sfx\<nama-file>.mp3
   ```
3. **Daftarkan ke `SFX_ASSET_REGISTRY`** di `src/audio/registry.ts` dengan seluruh metadata wajib:
   - `id`: unik (misalnya `"sfx-courthouse-bell"`)
   - `name`: nama tampilan Showcase
   - `filePath`: path relatif dari `public/` (misal `"audio/sfx/<nama-file>.mp3"`)
   - `category`: salah satu dari 8 kategori (`Archive`, `Investigation`, `Analog`, `Suspense`, `Transition`, `Environment`, `Technology`, `Atmosphere`)
   - `description` & `recommendedUse`
   - `defaultVolume`: `0..1` sesuai karakter dinamis aset
   - `durationSeconds` & `durationFrames` (`Math.ceil(seconds * 30)`)
   - `format`: `"mp3" | "wav" | "m4a" | "aac" | "ogg" | "flac"`
   - `license` & `source`: wajib diisi eksplisit (tidak boleh `"unknown"` / `"unlicensed"`).
4. **Jalankan validasi & check**:
   ```powershell
   npm run validate-audio
   npm run check
   ```

---

## 3. Penggunaan Timeline, Preset & Komponen

### A. Mengaktifkan Preset per Scene di Episode Data
```ts
{
  id: "evidence-01",
  type: "evidence",
  duration: sec(8),
  soundPreset: "Evidence Reveal",
  // Opsional tambahan trigger presisi:
  sfxList: [
    {
      id: "evidence-01-gsm",
      assetId: "sfx-gsm-chime",
      offsetFrame: 120,
      duration: 64,
      volume: 0.65,
      playbackRate: 1,
      fadeInFrames: 2,
      fadeOutFrames: 6,
    },
  ],
}
```

### B. Episode-Level `sfxTimeline`
Selain level scene, `EpisodeData` mendukung `sfxTimeline: SfxTimelineEvent[]` dengan frame absolut komposisi (`startFrame`, `endFrame` atau `duration`, `trimBefore`, `fadeInFrames`, `fadeOutFrames`, `playbackRate`, `stereoPan`, `duckVoiceOver`, `duckMusicBy`, `sceneId`).

> **Catatan Teknis Remotion 4.0 `stereoPan`**: `stereoPan` (`-1..1`) divalidasi dan disimpan sebagai metadata mixing/stem. Primitif `<Html5Audio>` bawaan Remotion `4.0.543` melakukan render stereo/mono gain secara deterministik tanpa properti panner per-tag.

### C. Daftar 9 Sound Design Presets
1. **Documentary Opening** — `sfx-low-impact` + `sfx-film-projector`
2. **Evidence Reveal** — `sfx-camera-shutter` + `sfx-stamp-impact`
3. **Newspaper Reveal** — `sfx-paper-movement` + `sfx-typewriter`
4. **Investigation Tension** — `sfx-tension-pulse` + `sfx-radio-static`
5. **Historical Flashback** — `sfx-tape-rewind` + `sfx-film-projector`
6. **Digital Glitch** — `sfx-digital-glitch` + `sfx-radio-static`
7. **Major Revelation** — `sfx-low-impact` (`duckMusicBy: 0.6`) + `sfx-tension-pulse`
8. **Dramatic Ending** — `sfx-low-impact` (`duckMusicBy: 0.5`) + `sfx-tape-rewind` (`end` anchor)
9. **Silence Transition** — `sfx-subtle-transition` + ducking musik drastis (`duckMusicBy: 0.85`) untuk jeda hening naratif

---

## 4. Strategi Audio Mixing & Rekomendasi Mastering Akhir

Konfigurasi default di `ARKANAYA_AUDIO_MIX` (`src/audio/mixing.ts`):

| Bus | Base Volume | Ducked Under VO | Catatan Mixing |
| :--- | :--- | :--- | :--- |
| **VoiceOver** | `1.00` | — | Prioritas #1, harus jelas di speaker ponsel. |
| **SFX** | `0.58` (maks `0.85`) | Opsional (`0.72x` jika `duckVoiceOver: true`) | Polyphony ceiling `0.90` mencegah clipping saat beberapa SFX bertumpuk. |
| **Ambient** | `0.16` | `0.095` (ramp `14f`) | Menjaga nuansa ruang arsip tanpa mengganggu artikulasi VO. |
| **Music** | `0.26` | `0.10` (ramp `12f`) | Juga ter-duck otomatis oleh event berflag `duckMusicBy`. |

### Rekomendasi Analisis Audio Final (Post-Render MP4)
Setelah merender episode ke MP4 (`npx remotion render <id> out/<ep>.mp4`), disarankan mengecek loudness akhir memakai `ffmpeg loudnorm` / `ebur128` agar optimal di **TikTok, Instagram Reels, dan YouTube Shorts**:
- **Integrated Loudness**: `-16 LUFS` hingga `-14 LUFS`
- **True Peak Maksimum**: `<= -1.0 dBTP` (bebas clipping)
- **Kejelasan Narasi**: Voice-over berada kira-kira `+8 dB` hingga `+12 dB` di atas musik latar.
