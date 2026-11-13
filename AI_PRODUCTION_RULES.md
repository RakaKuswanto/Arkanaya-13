# AI PRODUCTION RULES

Instruksi wajib untuk AI, coding agent, penulis, researcher, dan automation yang membantu ARKANAYA 13.

## Sebelum bekerja
1. Baca `EDITORIAL_BIBLE.md`.
2. Baca `README.md` untuk memahami struktur project, tipe scene, dan perintah CLI (`new-episode`, `check`, `studio`).
3. Baca guideline yang relevan dengan tugas.
4. Baca brief dan status episode yang sedang dikerjakan.
5. Periksa apakah komponen, template, atau keputusan serupa sudah tersedia.

## Aturan riset dan penulisan
- Jangan mengarang sumber, kutipan, tanggal, angka, dialog, atau detail.
- Beri rujukan untuk setiap klaim faktual penting.
- Tandai klaim yang belum terverifikasi.
- Pisahkan fakta, pernyataan resmi, kesaksian, teori, dan hal yang belum diketahui.
- Jangan menyimpulkan motif atau kesalahan seseorang tanpa bukti.
- Jika sumber saling bertentangan, jelaskan konflik tersebut dan jangan memilih salah satu tanpa alasan.

## Aturan visual dan teknis
- Ikuti brand theme dan motion guidelines.
- Gunakan komponen Remotion yang sudah tersedia jika sesuai.
- Jangan membuat komponen duplikat tanpa memeriksa library.
- Jangan mengganti warna, font, logo, atau sistem animasi global tanpa persetujuan.
- Semua animasi harus deterministik dan berbasis frame (dilarang memakai `Math.random()`).
- Simpan aset lokal di `public/media/` dan `public/audio/`, lalu rujuk dengan path relatif agar otomatis di-resolve oleh `resolveMediaSrc()` (`staticFile()`).
- Gunakan `npm run new-episode` saat membuat episode baru, daftarkan ke `src/episodes/index.ts`, dan pastikan `npm run check` (`tsc --noEmit && eslint src`) lolos tanpa error.
- Jangan memakai aset tanpa status lisensi atau izin yang jelas.

## Aturan perubahan
- Jangan mengubah standar global ketika mengerjakan satu episode.
- Usulkan perubahan secara terpisah.
- Catat perubahan yang disetujui di changelog.
- Pertahankan kompatibilitas episode lama jika memungkinkan.

## Format laporan
Setiap hasil kerja harus menyebutkan:
1. File yang dibuat/diubah.
2. Sumber yang digunakan.
3. Klaim yang masih belum pasti.
4. Aset yang masih dibutuhkan.
5. Pemeriksaan yang sudah dilakukan.
6. Hal yang membutuhkan persetujuan editor.
