# Perbaikan Visual Tong Sampah, Footer, dan Kartu Fakta 3R

Rencana perbaikan menyeluruh berdasarkan 3 gambar anotasi yang diberikan pengguna: menyempurnakan posisi tutup tempat sampah hingga menyentuh tanah, merapikan letak 3 folder aksi, serta menghapus elemen-elemen yang dicoret merah pada footer dan kartu fakta.

## User Review & Critical Decisions

> [!IMPORTANT]
> Seluruh poin perubahan telah diidentifikasi langsung dari 3 gambar tangkapan layar yang dicoret merah oleh pengguna:
> 1. **Image 1**: Tutup tempat sampah diturunkan posisinya hingga menyentuh tanah (*ground level*) dan bersandar di sisi kanan tong sampah, serta posisi ketiga folder diturunkan agar tidak terpotong atau menabrak header.
> 2. **Image 2**: Tombol `Ruang Rahasia DKV (Ketik: "UNM")` di dalam footer dihapus sepenuhnya.
> 3. **Image 3**: Label sumber di pojok kanan atas (`DATA GLOBAL`, `DATA NASIONAL 2025`, `KOMPOSISI SAMPAH`) serta baris footer bawah (`DATA RIIL 3R` dan `3R UNM Project`) pada ketiga kartu fakta dihapus.

---

## 1. Overview & Core Concept

- **Apa yang Dilakukan**:
  - **Tong Sampah & Tutup (Image 1)**: Menyesuaikan translasi vertikal dan rotasi tutup tong sampah (`ActionSection.tsx`) agar saat terbuka, tutup benar-benar mendarat menyentuh tanah di samping kanan tong sampah. Mengatur ulang ketinggian kemunculan 3 folder dokumen agar muncul rapi tepat di atas bukaan tong tanpa menabrak navbar atas.
  - **Pembersihan Footer (Image 2)**: Menghapus tombol trigger rahasia di bagian bawah banner footer cokelat, sehingga footer tampil bersih hanya menampilkan nama mata kuliah dan instansi.
  - **Minimalisasi Kartu Fakta (Image 3)**: Menghapus metadata sekunder (kategori sumber di kanan atas dan label footer bawah kartu) pada 3 kartu statistik, mempertahankan badge fakta, angka animasi stopwatch, dan narasi utama.
- **Target Audiens**: Mahasiswa dan sivitas akademika UNM yang mengakses situs edukasi kampanye 3R DKV UNM dengan tampilan visual yang presisi, proporsional, dan rapi.

---

## 2. User Experience & Visual Design

### A. Penyesuaian Interaksi Tong Sampah & Tutup
- **Posisi Tutup Bersandar & Menempel Tanah**:
  - Translasi vertikal disesuaikan dari ketinggian sebelumnya (~184px) menjadi ~255px–320px sesuai ukuran layar, dengan sudut rotasi ~76°–78°.
  - Bagian bawah tutup mendarat sejajar tumpukan sampah & rumput dasar, sementara sisi kiri tutup bersandar pada dinding kanan tong.
- **Tata Letak 3 Folder Aksi**:
  - Mengurangi translasi negatif folder saat tong terbuka (dari `-translate-y-44` menjadi tingkat translasi yang pas di atas bibir tong).
  - Folder, badge langkah, dan label aksi tampil utuh, tidak terpotong oleh viewport atas maupun header, dan tetap responsif serta mudah diklik.

### B. Pembersihan Kartu Fakta (FactsSection)
- Tampilan kartu fakta menjadi lebih lapang dan minimalis:
  - Header kartu hanya menyisakan badge hitam pill: `FAKTA 1`, `FAKTA 2`, `FAKTA 3`.
  - Area tengah mempertahankan animasi angka besar (2.000, 25,14, 40,76%), satuan teks kuning, dan teks penjelasan fakta.
  - Garis pemisah bawah dan teks "DATA RIIL 3R • 3R UNM Project" dihilangkan.

### C. Pembersihan Footer (ActionSection)
- Footer hanya memuat:
  - `Craft 4 Earth - DKV UNM 2024`
  - `Mata Kuliah Desain Media Interaktif • Fakultas Seni dan Desain • Universitas Negeri Makassar`
- Elemen tombol rahasia yang dicoret merah dihapus.

---

## 3. Key Product Decisions & Trade-Offs

- **Translasi Tutup Sampah**:
  - *Keputusan*: Menggunakan kalkulasi presisi geometri berdasarkan rasio aspek aset asli tong sampah (`tongsampah-atas.png` dan `tongsampah-bawah.png`) sehingga sudut miring dan titik terendah tutup selalu presisi menyentuh tanah pada mobile (`w-56`) maupun desktop (`w-72`).
- **Posisi 3 Folder Dokumen**:
  - *Keputusan*: Menempatkan folder mengambang persis di mulut tong sampah (bukan melayang terlalu tinggi hingga keluar batas section), memberi ruang vertikal yang cukup agar tidak menabrak tombol toggle di atasnya.
- **Penghapusan Elemen Visual**:
  - *Keputusan*: Menghapus elemen yang dicoret tanpa mengubah fungsi logika (kode easter egg melalui keyboard tetap dapat diakses di background jika diinginkan, namun tombol visual di footer ditiadakan).

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       Hero & 3R Sections                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FactsSection.tsx                         │
│  - Hapus: fact.source ("DATA GLOBAL", dst.)                 │
│  - Hapus: Footer kartu ("DATA RIIL 3R", dst.)               │
│  - Pertahankan: Badge FAKTA, Stopwatch Count-up, Narasi      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    ActionSection.tsx                        │
│  - Folder Dokumen: Sesuaikan translateY agar rapi & utuh    │
│  - Tutup Tong: Naikkan translateY & sesuaikan rotasi        │
│    sehingga ujung bawah menyentuh tanah di samping kanan    │
│  - Footer: Hapus tombol "Ruang Rahasia DKV"                 │
└─────────────────────────────────────────────────────────────┘
```

### Rincian Perubahan File:
1. `src/components/ActionSection.tsx`:
   - Modifikasi transform CSS pada elemen `Lid` saat `isLidOpen === true` (tambah jarak Y ke level tanah dan atur kemiringan bersandar).
   - Modifikasi transform CSS pada elemen container `ACTION_FOLDERS` saat `isLidOpen === true` (posisi pas di mulut tong, tidak menabrak header).
   - Hapus blok JSX tombol rahasia di dalam tag `<footer>`.
2. `src/components/FactsSection.tsx`:
   - Hapus rendering `fact.source` di baris atas kartu.
   - Hapus rendering div footer bawah kartu (`border-t border-white/10 ... Data Riil 3R`).
