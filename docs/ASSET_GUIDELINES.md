# ARKANAYA — Asset & Media Guidelines

Seluruh aset media (foto, dokumen pindaian, peta, voiceover, musik, dan SFX) harus disimpan secara lokal dan dirujuk menggunakan konvensi deterministik proyek. **Jangan pernah mengarang URL eksternal atau aset fiktif sebagai sumber berita asli.**

---

## 1. Struktur Direktori `public/`

```text
public/
├── audio/
│   ├── ambient/       # Latar suasana (ruang arsip, hujan, mesin tik pelan)
│   ├── music/         # Musik latar dokumenter (instrumental non-intrusif)
│   ├── sfx/           # Efek suara per-adegan (paper_movement, camera_shutter, dll.)
│   └── voiceover/     # Rekaman VO narator per episode
└── media/
    └── <episode-id>/  # Foto arsip, pindaian koran, peta dasar berlisensi
```

---

## 2. Resolusi Asset Path (`src/utils/assets.ts`)

Selalu gunakan `resolveMediaSrc(src)` sebelum mengirim `src` ke `<Img>` atau `<Audio>`:

- **Path relatif lokal** (disarankan, mis. `"media/ep02/kliping-01.jpg"` atau `"audio/voiceover/ep02.mp3"`) otomatis dibungkus dengan `staticFile(...)` milik Remotion agar dapat dimuat baik di Studio maupun saat render headless.
- **Root-relative (`/assets/...`) atau URL eksplisit (`http:`, `https:`, `data:`, `blob:`)** dilewatkan apa adanya.
- Nilai kosong / `undefined` mengembalikan `undefined`.

---

## 3. Perilaku Missing-Asset Fallback

Komponen media (`ArchivePhoto`, `EvidenceCard`, `EvidenceZoom`, `PhotoAnnotation`, `PhotoParallax`, `MapZoomTransition`, `SatelliteMap`, `SplitComparison`, `ContactSheet`, `PolaroidStack`, `SuspectDossier`) **wajib tetap dapat dirender bersih** meski `src` belum tersedia:

- `<ArchivePhoto />`, `<PhotoParallax />`, `<EvidenceZoom />`, `<PhotoAnnotation />`, `<MapZoomTransition />`, dan `<SatelliteMap />` menampilkan `<MediaFallbackPlate />` (latar obsidian/grid teknis bertuliskan label yang jelas) bila `src` bernilai `undefined`.
- `<DocumentaryEpisode />` tidak me-mount `<VoiceOverTrack>`, `<BackgroundMusicTrack>`, atau `<AmbientSoundTrack>` jika field audio bernilai kosong/undefined sehingga tidak memicu error fetch jaringan.

---

## 4. Standar Visual & Geografis

- **Peta (`MapRoute`, `SatelliteMap`, `MapZoomTransition`):** Gunakan aset peta resmi / topografi berlisensi ke prop `mapSrc`, atau tampilkan grid koordinat deklaratif dengan koordinat sebenarnya. Jangan pernah mengarang lintang/bujur (*lat/lng*) atau rute yang tidak didukung data sumber.
- **Dokumen & Foto (`ArchivePhoto`, `NewspaperClipping`, `PoliceReport`):** Beri keterangan jelas jika sebuah aset merupakan ilustrasi arsip atau reka ulang (*re-enactment / placeholder*).
- **Showcase QA:** Seluruh data di `src/ComponentShowcase.tsx` menggunakan penanda eksplisit `(FIKTIF)` / `FICTIONAL QA` agar tidak pernah tertukar dengan berkas kasus nyata.

---

## 5. Audio Layer & Sinkronisasi VO (`scripts/sync-srt.mjs`)

1. Rekam Voiceover (`.wav` atau `.mp3` 48kHz) dan simpan di `public/audio/voiceover/<episode>.mp3`.
2. Siapkan file `.srt` hasil transkripsi/alignment narasi.
3. Jalankan script sinkronisasi:
   ```powershell
   npm run sync-srt -- path/ke/vo.srt
   ```
   untuk menghasilkan token caption ber-timestamp (`{ text, startMs, endMs }`) dan durasi adegan agar `DocumentaryCaption` serta `BackgroundMusicTrack` (auto-ducking via `AudioDuck`) tetap sinkron dengan VO manusia.
