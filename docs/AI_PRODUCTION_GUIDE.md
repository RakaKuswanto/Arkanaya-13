# ARKANAYA — AI Episode Production Guide

Panduan praktis bagi AI editor / produser konten untuk menyusun episode baru **tanpa menulis ulang komponen animasi**.

> Untuk workflow produksi lengkap dari riset hingga QC (Deliverable 01–08), jalankan prompt utama di [MASTER_EPISODE_PRODUCTION_PROMPT.md](file:///D:/RAKA%20KUSWANTO/1.%20PROJECTS/OTHER/Remotion/ARKANAYA%2013/prompts/MASTER_EPISODE_PRODUCTION_PROMPT.md).

---

## 1. Alur Kerja Produksi (Data-First)

1. **Verifikasi Riset & Fakta:** Kumpulkan kronologi, koordinat, dan kutipan berdasar sumber valid (lihat `guidelines/RESEARCH_PROTOCOL.md`). **Dilarang keras mengarang kutipan, nomor berkas resmi palsu, koordinat fiktif sebagai fakta, atau bukti rekayasa.**
2. **Buat Data Episode:** Jalankan `npm run new-episode` atau buat file baru di `src/episodes/<slug>.ts` bertipe `EpisodeData` dan validasi dengan `validateEpisode(...)`.
3. **Daftarkan di `src/episodes/index.ts`:** Ekspor ke array `EPISODES` agar otomatis muncul di folder `Episodes` pada `src/Root.tsx`.
4. **Pilih Preset Visual (`VISUAL_PRESETS`) & Tipe Scene (`EpisodeSceneType`):** Gunakan 16 tipe scene yang tersedia di `DocumentaryEpisode.tsx` (mis. `opening` → `chapterBreak` → `timeline` → `evidence` → `location` → `theorySplit` → `conclusion`).
5. **Tambahkan Audio & Subtitle:** Sambungkan rekaman VO (`public/audio/voiceover/...`), jalankan `npm run sync-srt`, dan sesuaikan `duration` scene agar selaras dengan narasi.
6. **Validasi & Render:** Jalankan `npm run check` lalu render preview di Remotion Studio atau CLI.

---

## 2. Aturan Integritas Informasi untuk AI

- **Pemisahan Fakta vs Dugaan:** Pada `theorySplit` atau kartu bukti, isi field `status` secara jujur (`"VERIFIED"`, `"OFFICIAL STATEMENT"`, `"ALLEGED"`, `"UNVERIFIED"`, `"DISPUTED"`, atau `"UNKNOWN"`).
- **Keterlacakan Sumber:** Saat menggunakan `SourceCitation` atau `SourceCard`, isi lengkap `sourceId`, `title`, `publisher`, `publicationDate`, `sourceType`, dan `url` (bila ada).
- **Aset Opsional & Missing Assets:** Jika foto lapangan asli belum tersedia, biarkan `src` kosong atau gunakan aset ilustrasi netral yang diberi label arsip jelas; jangan memasukkan URL eksternal acak.
- **Kepatuhan Determinisme:** Apabila diperlukan kustomisasi komponen baru, animasi **hanya boleh** bergantung pada `useCurrentFrame()` + `useVideoConfig()` (`spring`, `interpolate`, `hash1D`/`signedHash` dari `src/utils/deterministic.ts`). Jangan pernah memakai `Math.random()`, `Date.now()`, atau timer CSS/DOM.

---

## 3. Memilih Preset Visual per Segmen Cerita

| Kebutuhan Naratif | Rekomendasi Preset (`VISUAL_PRESETS`) | Tipe Scene yang Cocok |
|---|---|---|
| Pengenalan kliping/arsip lama | `archiveReveal` | `background`, `incident` |
| Pembeberan berkas disensor | `classifiedDossier` | `mystery`, `dossier`, `transcript` |
| Peta hubungan bukti & saksi | `evidenceDiscovery` | `evidence`, `comparison` |
| Urutan waktu kejadian | `timelineInvestigation` | `timeline`, `statHero` |
| Perjalanan / sektor geografis | `mapJourney` | `location` |
| Kilas balik foto analog | `archivalMemory` | `incident` (`contactSheet`/`polaroidStack`) |
| Jeda pertanyaan terbuka | `mysteryPause` | `quote`, `theorySplit`, `chapterBreak` |
| Penutup episode | `cinematicClosing` | `conclusion` |
