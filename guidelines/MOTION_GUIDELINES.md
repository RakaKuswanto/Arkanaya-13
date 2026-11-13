# MOTION GUIDELINES

## Prinsip
Motion harus membantu penonton memahami informasi, bukan sekadar dekorasi.

## Gerakan yang disarankan
- Slow zoom dan pan untuk foto arsip.
- Hard cut untuk perpindahan informasi.
- Paper slide/reveal untuk dokumen.
- Typewriter reveal untuk teks tertentu.
- Stamp impact untuk label editorial.
- Line draw untuk rute atau koneksi bukti.
- Fade to black untuk penutup.

## Motion tokens awal
Nilai berikut adalah titik awal dan harus diuji pada hasil render:
- Headline entrance: 8–15 frame.
- Stamp impact: 6–12 frame.
- Photo zoom: skala sekitar 1.00–1.12 sepanjang shot.
- Fade transition: 8–18 frame.
- Text reveal: disesuaikan dengan panjang teks dan tempo narasi.

## Implementasi Remotion
- Gunakan frame-based animation dan API resmi Remotion.
- Animasi harus deterministik.
- Hindari `Math.random()` tanpa seed tetap.
- Hindari ketergantungan pada waktu browser.
- Hormati batas awal/akhir Sequence.
- Uji preview dan render final.

## Komponen
Setiap komponen harus mendokumentasikan props, default, preset, batasan, contoh, dan perilaku pada frame awal/akhir.
