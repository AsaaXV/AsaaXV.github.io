# Rencana Implementasi: Penghapusan 5 Komponen Sesuai Foto & Perapian Layout

Menghapus 5 elemen spesifik yang ditunjukkan pada foto referensi pengguna (tombol laporan DKV desktop/mobile, kalkulator jejak sampah, tabel waktu dekomposisi, dan kuis pemilahan sampah) serta merapikan tata letak agar mengalir mulus dan estetis.

### User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi Anda di fase tanya jawab:
> - **Cakupan Penghapusan**: Seluruh 5 elemen yang ada di foto akan dihapus secara bersih dari antarmuka.
> - **Penyesuaian Tata Letak**: Tata letak antarmuka dirapatkan secara proporsional agar tidak menyisakan ruang kosong canggung (*awkward white space*) dan ritme visual antar-bagian tetap harmonis.

---

### 1. Overview & Core Concept

- **Tujuan**: Menyederhanakan tampilan microsite edukasi 3R Craft4Earth dengan meniadakan fitur-fitur yang tidak diinginkan sesuai foto (laporan/riset DKV sekunder, kalkulator interaktif jejak kampus, tabel waktu dekomposisi, serta modul kuis pemilahan).
- **Hasil Akhir**: Microsite menjadi lebih fokus pada konten inti visual edukasi 3R (Reduce, Reuse, Recycle, Infografis Data Utama, dan Aksi Nyata) dengan alur scroll yang lebih ringkas, padat, dan cepat dipahami.

---

### 2. User Experience & Visual Design

- **Alur & Komposisi yang Diperbarui**:
  1. **Navbar**: Tombol navigasi "Laporan DKV" dihilangkan dari header desktop dan menu seluler (mobile drawer). Menu navigasi tetap mempertahankan navigasi anchor section (Reduce, Reuse, Recycle, Data, Aksi) dan tombol mode tampilan.
  2. **Bagian REDUCE**: Blok interaktif "Kalkulator Jejak Kampus Pribadi" di bagian bawah ReduceSection dihilangkan. Bagian Reduce kini berakhir mulus setelah 3 kartu komparasi visual sebelum transisi grass divider ke Reuse.
  3. **Bagian RECYCLE**: Kartu tantangan "Uji Kemampuan: Masih Bingung Memilah Sampah?" beserta trigger modal latihan pemilahan 5 soal dihilangkan dari RecycleSection. Bagian Recycle berfokus pada showcase interaktif roda siklus daur ulang dan panduan daur ulang.
  4. **Bagian FAKTA & DATA**: Tabel list "Waktu Dekomposisi Sampah di Alam Bebas" di FactsSection dihilangkan. Bagian Fakta & Data menonjolkan visual infografis data persentase dan statistik utama tanpa deretan teks dekomposisi yang padat.
- **Konsistensi Gaya Visual**: Tetap mempertahankan palet warna hangat bumi (*warm cream* `#FEFAE0`, *olive/forest green* `#283618`, dan *earth brown* `#5B4436`) dengan tipografi ramah anak muda (Fredoka & Plus Jakarta Sans).

---

### 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Pembersihan Kode & State yang Tidak Lagi Dipakai**:
  - *Pendekatan*: Menghapus referensi handler dan state lokal terkait kalkulator dan kuis di komponen masing-masing, serta menghapus tombol pemicu Laporan DKV di Navbar.
  - *Alasan*: Mencegah dead-code dan menjaga performa rendering tetap ringan.
- **Keputusan 2: Penyesuaian Spacing & Margin**:
  - *Pendekatan*: Mengurangi padding bawah pada kontainer yang elemennya dihapus agar transisi section dan divider rumput tidak terlalu berjarak.
  - *Alasan*: Menghindari kesan halaman terputus atau hampa setelah komponen dihapus.

---

### 4. Technical Architecture & Data Strategy (Technical Reference)

```
┌──────────────────────────────────────────────────────────┐
│                       App Container                      │
└────────────────────────────┬─────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
┌──────────────┐      ┌──────────────┐      ┌─────────────────┐
│    Navbar    │      │ ReduceSection│      │  RecycleSection │
│(Hapus tombol │      │(Hapus blok   │      │ (Hapus kuis &   │
│ Laporan DKV) │      │ Kalkulator)  │      │  latihan pilah) │
└──────────────┘      └──────────────┘      └─────────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ FactsSection │
                      │(Hapus tabel  │
                      │ Dekomposisi) │
                      └──────────────┘
```

- **Komponen Target**:
  - `src/components/Navbar.tsx`: Hapus tombol desktop "Laporan DKV" dan tombol mobile drawer "Buka Data Hasil Riset DKV".
  - `src/components/ReduceSection.tsx`: Hapus state habit tracker serta blok UI "Kalkulator Jejak Kampus Pribadi".
  - `src/components/RecycleSection.tsx`: Hapus tombol/kartu "Uji Kemampuan: Masih Bingung Memilah Sampah?" dan modal kuis pemilahan.
  - `src/components/FactsSection.tsx`: Hapus card container "WAKTU DEKOMPOSISI SAMPAH DI ALAM BEBAS".
- **Verifikasi**: Menjalankan `lint_applet` dan `compile_applet` untuk memastikan tidak ada import yang rusak, unhandled props, atau error tipe.
