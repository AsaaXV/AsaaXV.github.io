# Desain Minimalis & Estetik Kartu Reuse

Menyederhanakan tampilan kartu kreasi Reuse agar tampil ramping, bersih, dan estetik dengan menghapus elemen visual yang berlebih (*badge* Sebelum/Sesudah, label "Ganti Tampilan", dan pengontrol panah redundan), dengan tetap mempertahankan kemampuan interaktif untuk mengklik kartu guna melihat transformasi kreasi dan manfaatnya.

## User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi pengguna pada sesi tanya jawab:
> - **Kartu Tetap Interaktif**: Pengguna tetap dapat mengklik kartu secara langsung untuk berganti antara bahan awal dan hasil kreasi upcycling.
> - **Elemen yang Dihapus**: 
>   1. Label/Badge status "SEBELUM" & "SESUDAH" di bagian atas kartu.
>   2. Label "Ganti Tampilan" beserta ikon bolak-balik di atas area visual/foto.
>   3. Bar pengontrol panah (kiri/kanan) dan titik indikator di bawah kartu.
>   4. Teks footnote kaku "Klik untuk lihat kondisi awal / hasil kreasi".
> - **Arah Visual**: Kartu berdesain ramping, lapang (*clean breathing room*), fokus pada foto/ilustrasi kreasi, judul kreasi, dan manfaat praktisnya.

---

## 1. Overview & Core Concept

- **Tujuan**: Menghadirkan tampilan kartu Reuse yang elegan dan modern tanpa clutter elemen penanda teks yang berulang.
- **Pengalaman Pengguna**: Pengguna melihat 3 kartu kreasi daur ulang yang bersih. Saat kartu disentuh atau diklik, kartu bertransisi secara halus (*smooth transition*) memperlihatkan ide transformasi limbah menjadi karya berguna beserta dampak positifnya.

---

## 2. User Experience & Visual Design

### A. Tata Letak Kartu yang Bersih & Ramping
1. **Header Kartu Minimalis**:
   - Menghapus badge pill "SEBELUM/SESUDAH".
   - Kategori ditampilkan sebagai teks kecil bersih dan rapi (misal: `KERAJINAN RUMAH TANGGA` atau `UPCYCLE KOS`) tanpa kotak pill yang tebal.
2. **Visual Showcase Utama**:
   - Menghapus stiker/badge "Ganti Tampilan" di pojok visual.
   - Kotak visual fokus menampilkan ikon/ilustrasi barang dengan kontras warna alam yang hangat.
   - Efek hover subtle yang memberikan isyarat interaktif tanpa perlu teks instruksi yang mengganggu estetika.
3. **Plakat Judul Kreasi**:
   - Label judul kreasi (misal: "KREASI POT TANAMAN", "KREASI ORGANIZER MEJA", "KREASI SELIMUT PERCA") disajikan ramping dan terintegrasi harmonis di bawah visual.
4. **Deskripsi & Manfaat**:
   - Menampilkan deskripsi ringkas dan poin manfaat utama secara elegan.
5. **Penghapusan Bagian Bawah Kartu**:
   - Menghilangkan kontrol panah samping (`<` dan `>`) serta baris dot di bawah kartu yang membuat tampilan tampak berat.

```
┌──────────────────────────────────────────────────┐
│ KATEGORI · UPCYCLE                               │
│                                                  │
│ Pot Hidroponik Meja Kos                          │
│ Dari botol kaca bekas minuman                    │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │                                            │  │
│  │         [ Visual / Ilustrasi ]             │  │
│  │                                            │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌─ KREASI POT TANAMAN HIDROPONIK ───────────┐  │
│                                                  │
│  Hemat biaya beli pot, mempercantik ruangan kos  │
│  dengan sirkulasi air mandiri.                  │
└──────────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

- **Mempertahankan Fungsi Klik Kartu (Click-to-Toggle)**:
  - *Keputusan*: Kartu tetap merespons klik (`onClick`) untuk beralih antara melihat bahan asal dan hasil kreasi.
  - *Alasan*: Pengguna menegaskan "bukan berarti gak bisa ditekan, tetap bisa ganti tampilan, cuma yang dihilangkan visualnya". Interaksi tetap hidup namun antarmukanya jauh lebih bersih dan estetik.
- **Menghilangkan Tombol Ekstra**:
  - *Keputusan*: Menghilangkan tombol panah bawah dan badge status.
  - *Alasan*: Elemen-elemen tersebut redundant dengan interaksi kartu dan merusak estetika minimalis.

---

## 4. Technical Architecture & Data Strategy

```
ReuseSection (React)
 │
 ├── Container Grid (3 Kolom Responsif)
 │    └── MinimalistReuseCard (per item)
 │         ├── Header: Category subtle text
 │         ├── Title & Subtitle
 │         ├── Visual Showcase Area (Clean, no 'Ganti Tampilan' pill)
 │         ├── Kreasi Caption Banner
 │         └── Description & Benefit text
 └── State Management
      └── cardStates: Toggle flip / transition state saat kartu diklik
```

- **File Terdampak**: `src/components/ReuseSection.tsx`
- **Verifikasi**: Build & lint check memastikan tidak ada error kompilasi dan tampilan sesuai standar estetika web modern.
