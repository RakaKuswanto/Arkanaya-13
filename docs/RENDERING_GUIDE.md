# ARKANAYA — Rendering & QA Validation Guide

Panduan menjalankan Remotion Studio, melakukan pengecekan kode, dan me-render output produksi `9:16` (`1080×1920`, `30fps`) maupun `16:9` (`1920×1080`, `30fps`).

---

## 1. Perintah Utama (`package.json`)

| Script | Perintah Asli | Kegunaan |
|---|---|---|
| `npm run check` | `tsc --noEmit && eslint src` | Validasi TypeScript ketat (`strict`, `noUnusedLocals`) + aturan deterministik Remotion ESLint |
| `npm run typecheck` | `tsc --noEmit` | Cek tipe TypeScript saja |
| `npm run lint` | `eslint src` | Cek aturan ESLint |
| `npm run studio` | `remotion studio` | Membuka UI preview interaktif di browser |
| `npm run render` | `remotion render` | Alias CLI render video Remotion |
| `npm run new-episode` | `node scripts/new-episode.mjs` | Generator template data episode baru |
| `npm run sync-srt` | `node scripts/sync-srt.mjs` | Konversi subtitle `.srt` ke token durasi Remotion |

---

## 2. Daftar Komposisi Terdaftar (`src/Root.tsx`)

### Folder `Episodes`
- Setiap episode dari `src/episodes/index.ts` otomatis terdaftar sebagai komposisi vertikal `1080×1920` @ `30fps` (mis. `ep01-cooper`, `ep02-setiabudi-13`). Durasi diambil otomatis lewat `calculateEpisodeDuration(props.episode)`.

### Folder `Library`
- `arkanaya-showcase`: Showcase lengkap `9:16` (`1080×1920`, 2160 frame / 72 detik).
- `arkanaya-showcase-16x9`: Showcase lengkap `16:9` (`1920×1080`, 2160 frame / 72 detik).
- `arkanaya-16x9-preview`: Preview horizontal `16:9` untuk `EPISODES[0]`.

### Folder `Library-QA` (Preview Independen)
Komposisi berdurasi `180` frame (`6` detik) untuk memverifikasi tiap kategori komponen secara terpisah:
- `qa-editorial-integrity` (`section: "editorial"`, `9:16`)
- `qa-geographic-data` (`section: "geographic"`, `9:16`)
- `qa-archival-forensics` (`section: "archival"`, `9:16`)
- `qa-branding-status` (`section: "branding"`, `9:16`)
- `qa-visual-presets` (`section: "presets"`, `16:9`)

---

## 3. Contoh Perintah Render Produksi

### Render Video Penuh (`9:16`)
```powershell
npx remotion render ep02-setiabudi-13 out/ep02-setiabudi-13.mp4
```

### Render Preview `16:9`
```powershell
npx remotion render arkanaya-16x9-preview out/ep01-16x9.mp4
```

### Render Still Frame untuk Visual QA
```powershell
npx remotion still arkanaya-showcase out/qa-frame-150.png --frame=150
npx remotion still arkanaya-showcase-16x9 out/qa-16x9-1620.png --frame=1620
npx remotion still qa-editorial-integrity out/qa-editorial.png --frame=60
```

---

## 4. Checklist Sebelum Publish Render Final

1. Jalankan `npm run check` dan pastikan exit code `0`.
2. Uji frame awal (`--frame=0`), titik tengah scene padat teks, dan frame akhir setiap komposisi untuk memastikan tidak ada elemen terpotong melewati `getSafeMargins(width, height)`.
3. Pastikan tidak ada label status `VERIFIED` yang menempel pada teori/dugaan (`ALLEGED` / `DISPUTED` / `UNVERIFIED`).
4. Pastikan musik latar berada di bawah level vokal saat VO aktif (`duckRanges` di `DocumentaryEpisode`).
