# Revisi Selesai: Desain & Tata Letak Dosen Pembimbing

Keempat poin revisi dari dosen/ibu pembimbing telah berhasil diimplementasikan secara menyeluruh:

## Ringkasan Perubahan yang Diterapkan:
1. **Pembersihan Shadow pada Roda (`RecycleSection.tsx`)**:
   - Seluruh efek bayangan (`shadow-2xl`, `boxShadow`, `drop-shadow`, `shadow-md`, `shadow-sm`) pada lingkar kemudi setir roda, jeruji (*spokes*), pasak/gagang kayu (*pegs*), aksen rivet kuningan, dan poros telah dihilangkan sepenuhnya.
   - Tampilan roda kini rata (*clean flat-design*), bersih, dan tajam tanpa ada bayangan tebal yang mengganggu.

2. **Tipografi Huruf Normal & Nyaman Dibaca**:
   - Subheader dan teks penjelasan di `ReduceSection` ("Kurangi Dari Awal") dan `ReuseSection` ("Masih Bisa Dipakai Nggak?") diubah dari huruf kapital (*all-caps*) menjadi huruf biasa (*Title Case* / *Sentence Case*).
   - Kalimat penjelasan dan kartu di balik flip diformat dengan huruf kapital hanya di awal kalimat, kontras yang jelas, serta ukuran font yang ramah dibaca.

3. **Tata Letak Tengah & Proporsi Seimbang Flip Card (`ReduceSection.tsx`)**:
   - Konten di sisi depan dan belakang kartu kini diposisikan secara terpusat (*vertically centered*) dengan `my-auto`, mendistribusikan nomor, ikon ilustrasi, judul, dan deskripsi secara proporsional.
   - Tinggi minimal kartu dirampingkan dari yang semula terlalu tinggi (510px) menjadi proporsional (~420px), menghilangkan area kosong yang sebelumnya mengendap di bawah kartu.

4. **Navigasi Rumput Fixed di Bagian Paling Bawah (`App.tsx`)**:
   - Rumput di bagian bawah layar kini berposisi tetap (`position: fixed; bottom: 0; left: 0; width: 100%; z-index: 30; pointer-events-none`) dan selalu melayang mengikuti saat pengguna melakukan scrolling.
   - Rumput pemisah berulang di akhir masing-masing section telah ditiadakan sehingga hanya ada satu siluet rumput tunggal di bagian paling bawah layar.
   - Padding bawah pada halaman (`pb-16 sm:pb-24`) ditambahkan sehingga seluruh teks dan konten footer tidak tertutup oleh rumput melayang.
