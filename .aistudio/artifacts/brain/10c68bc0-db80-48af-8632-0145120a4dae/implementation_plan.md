# Rencana Implementasi: Perbaikan Tutup Tong Sampah & Penataan Folder Aksi

Memperbaiki posisi tutup tong sampah agar saat terbuka jatuh menyentuh tanah dan bersandar miring di sebelah kanan badan tong sampah, serta menata ketiga folder aksi agar keluar berjajar horizontal secara rapi, berjarak nyaman, memiliki label langkah yang jelas, dan mudah ditekan.

---

## User Review Required
> [!IMPORTANT]
> - **Posisi Tutup Bersandar & Sentuh Tanah**: Tutup tong sampah (`tongsampah-atas.png`) akan bertransisi ke bawah menyentuh garis tanah (sejajar dengan tumpukan sampah bawah) dan miring bersandar ke sisi kanan badan tong sampah.
> - **Penataan Folder Horizontal**: Ketiga folder (`folder1.png`, `folder2.png`, `folder3.png`) akan muncul ke atas bukaan tong sampah dalam formasi horizontal rapi dengan jarak (gap) yang lega, badge nomor langkah yang jelas ("Langkah 1", "Langkah 2", "Langkah 3"), dan layer `z-index` tinggi (`z-40`) agar bebas dari tumpang tindih serta sangat mudah diklik di desktop maupun mobile.

---

## Proposed Changes

### 1. Penataan Posisi Tutup Tong Sampah (`src/components/ActionSection.tsx`)
- Hitung ulang posisi transform saat `isLidOpen === true`:
  - Geser horizontal ke kanan (`translate-x`) agar menempel di sisi samping badan tong sampah.
  - Turunkan secara vertikal (`translate-y`) hingga bagian bawah tutup menyentuh garis dasar lantai/tanah (ground level di dekat aset `sampah1.png` & `sampah2.png`).
  - Berikan sudut rotasi miring yang realistis (misalnya 55° - 65°) bersandar di bahu kanan tong sampah dengan bayangan jatuh (`drop-shadow`) yang natural.

### 2. Penataan Rapi & Interaktivitas 3 Folder Aksi (`src/components/ActionSection.tsx`)
- Ubah kontainer folder yang muncul saat tong terbuka:
  - Angkat posisi kemunculan lebih tinggi di atas mulut tong sampah sehingga tidak tertutup bibir tong.
  - Terapkan layout flex horizontal yang rapi: `flex-row items-end justify-center gap-4 sm:gap-6 md:gap-8`.
  - Berikan badge nomor langkah di bawah/atas tiap folder (Langkah 1: Bawa Wadah, Langkah 2: Pilah Sampah, Langkah 3: Bagikan Semangat) agar jelas dan berstruktur rapi.
  - Pastikan `z-index: 40` dan `pointer-events-auto` serta `stopPropagation` aktif sehingga klik pada folder langsung membuka modul panduan aksi tanpa memicu penutupan tutup tong sampah.
  - Berikan efek hover yang menyenangkan (mengangkat, highlight border, kursor pointer) dan state aktif yang kontras.

---

## Verification Plan

### Automated Verification
- Jalankan `compile_applet` untuk memastikan tidak ada kesalahan TypeScript, CSS class, atau build issue.

### Manual Verification
1. **Buka / Tutup Tong Sampah**: Klik atau hover tempat sampah, amati bahwa tutup tong turun mulus ke tanah di sisi kanan dan bersandar miring pada badan tong sampah.
2. **Kerapian Folder**: Pastikan ketiga folder keluar dengan rapi, berjarak teratur secara horizontal, dan tidak berhimpitan.
3. **Interaktivitas Klik**: Klik masing-masing folder (1, 2, dan 3) dan verifikasi bahwa kartu panduan aksi terbuka dengan benar dan folder aktif ditandai secara visual.
4. **Responsivitas**: Periksa tampilan pada layar mobile dan desktop agar tidak ada elemen yang terpotong.
