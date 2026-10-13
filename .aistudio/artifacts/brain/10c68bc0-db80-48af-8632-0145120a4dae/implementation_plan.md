# Penataan Susunan Folder Dokumen Tong Sampah (Sesuai Referensi Gambar)

Mengatur tata letak dan kedalaman 3 folder dokumen aksi agar tersusun menumpuk bertingkat saling tindih dari kiri ke kanan, tertanam separuh di dalam mulut tong sampah, dengan visual bersih dan nomor langkah minimalis sesuai konfirmasi gambar referensi.

## User Review & Critical Decisions

> [!IMPORTANT]
> Seluruh keputusan telah diselaraskan langsung melalui klarifikasi dengan pengguna:
> - **Susunan & Kemiringan Folder**: Menumpuk bertingkat saling tindih dari kiri ke kanan (overlapping staggered cascade) dengan sedikit variasi sudut rotasi natural.
> - **Kedalaman Folder**: Separuh tertanam di dalam mulut tong sampah dan menyembul keluar (bukan melayang tinggi di atas tong).
> - **Tampilan Label**: Hanya gambar folder dengan nomor langkah minimalis (menghilangkan pill dan teks judul panjang di bawah folder agar tidak mengaburkan visual).
> - **Tutup Tong Sampah**: Tetap dipertahankan persis seperti saat ini karena sudah disukai dan disetujui oleh pengguna ("tutup sampah sudah bagus").

---

## 1. Overview & Core Concept

- **Apa yang Dikerjakan**: Menyesuaikan penataan 3 folder aksi (`folder1.png`, `folder2.png`, `folder3.png`) di dalam `ActionSection.tsx` agar terlihat menyembul keluar dari mulut tong sampah dalam formasi tumpukan bertingkat (*cascading layered stack*) yang rapi dan estetis.
- **Interaktivitas**: Folder tetap dapat diklik untuk membuka panduan langkah detail pada kotak drawer di atas tong sampah (di bawah tombol Tahap 1-2-3).
- **Hasil Akhir**: Tampilan ilustrasi visual menjadi kohesif, proporsional, dan identik dengan komposisi pada gambar referensi `6.png`.

---

## 2. User Experience & Visual Design

### Susunan Visual & Geometri Folder
```
          [TUTUP TONGSAMPAH] (Miring terbuka di samping kanan)
                    \
       Mulut Tong    \
     ┌────────────────────────┐
     │   [Folder 1]           │  <- Tahap 1 (kiri depan, sedikit miring -6°, badge angka 1)
     │       [Folder 2]       │  <- Tahap 2 (tengah sedikit overlap, miring -2°, badge angka 2)
     │           [Folder 3]   │  <- Tahap 3 (kanan belakang, miring +4°, badge angka 3)
     │════════════════════════│  <- Bibir mulut tong sampah (half-embedded)
     │                        │
     │   [BADAN TONG SAMPAH]  │
     │                        │
     └────────────────────────┘
```

1. **Tata Letak & Overlapping**:
   - Tiga item folder ditata menggunakan container flex/relative terpusat dengan negative horizontal margin (`-mr-4` / `-ml-4` atau `relative -left-...`) sehingga ketiga folder saling menindih (*overlapping stack*).
   - Indeks susunan z-index bertingkat (`z-10`, `z-20`, `z-30`) atau sebaliknya sehingga tercipta ilusi kedalaman ruang dokumen di dalam tong.
   - Rotasi halus masing-masing folder: Folder 1 (-6deg), Folder 2 (-1deg), Folder 3 (+5deg) untuk kesan dokumen nyata yang dimasukkan ke dalam tong sampah.

2. **Kedalaman Relatif Terhadap Bibir Tong**:
   - Memposisikan container folder agar titik bawah folder masuk sekitar 40–50% ke dalam rongga atas badan tong sampah (`tongsampah-bawah.png`).
   - Saat tong sampah dibuka (`isLidOpen = true`), folder menyembul naik dengan animasi mulus `transform translate-y` ke posisi bibir tong.

3. **Tipografi & Ornamen Minimalis**:
   - Menghilangkan badge pill besar dan label teks multi-baris di bawah masing-masing folder.
   - Menggantinya dengan penanda nomor langkah minimalis yang elegan (lingkaran nomor kecil `1`, `2`, `3` di sudut folder atau badge ringkas).
   - Efek hover: Folder yang disorot kursor akan sedikit terangkat (`-translate-y-2`) dan naik ke layer paling atas (`z-40`) tanpa merusak susunan tumpukan tetangganya.

---

## 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Format Tumpukan Bertingkat (*Cascading Overlap*)**
  - *Pilihan*: Folder disusun bertumpuk saling tindih dengan sedikit rotasi natural, bukan berjejer lurus kaku horizontal.
  - *Alasan*: Sesuai dengan instruksi pengguna dan visual referensi `6.png`, memberikan estetika hand-drawn yang hidup.
- **Keputusan 2: Mempertahankan Tutup Sampah & Posisi Drawer Langkah**
  - *Pilihan*: Tutup sampah dan posisi drawer di atas tong sampah tidak diubah.
  - *Alasan*: Pengguna secara eksplisit memuji posisi tutup tong sampah dan telah menyetujui letak panduan langkah sebelumnya.

---

## 4. Technical Architecture & Implementation Steps

```
[Tahap 1, 2, 3 Pill Buttons]
            │
            ▼
[Panduan Langkah Detail Drawer (muncul saat folder dipilih)]
            │
            ▼
[Status Bar: Tong Terbuka / Tekan untuk membuka]
            │
            ▼
[Komponen Tong Sampah Interaktif]
 ├── Tutup Sampah (Animasi miring di sisi kanan saat terbuka)
 ├── 3 Folder Aksi Bertingkat (Half-embedded, overlapping stack)
 │    ├── Folder 1 (Step 1, rotasi -6°, z-10)
 │    ├── Folder 2 (Step 2, rotasi -1°, z-20)
 │    └── Folder 3 (Step 3, rotasi +5°, z-30)
 ├── Badan Tong Sampah (tongsampah-bawah.png)
 └── Sampah di Lantai (sampah1.png & sampah2.png)
```

### Rencana File yang Dikerjakan:
1. **`src/components/ActionSection.tsx`**:
   - Perbarui styling container `ACTION_FOLDERS` di dalam blok tong sampah.
   - Ubah layout dari `flex-row justify-center gap-6` menjadi overlapping relative stack dengan negative margins dan subtle rotation angles.
   - Sesuaikan posisi vertikal (`top` / `translate-y`) agar bagian bawah folder masuk separuh ke dalam bibir mulut tong sampah.
   - Sederhanakan indikator langkah pada folder menjadi nomor langkah minimalis.
   - Uji kompilasi (`compile_applet`) dan linter (`lint_applet`) untuk memastikan aplikasi berjalan sempurna tanpa regresi.
