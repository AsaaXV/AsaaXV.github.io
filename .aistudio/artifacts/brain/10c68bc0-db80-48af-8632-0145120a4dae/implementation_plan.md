# Penyesuaian Status Awal Tong Sampah Selesai

Status awal tong sampah saat website pertama kali dibuka telah disesuaikan:

## Detail Perubahan:
1. **Tong Sampah Tertutup saat Website Dibuka**:
   - Nilai inisial state `isLidOpen` diubah dari `true` menjadi `false`.
   - Ketika halaman dibuka, tutup tong sampah berada tepat di atas badan tong sampah dalam posisi tertutup rapi.
   - Folder aksi berada di dalam tong sampah dan tidak langsung mencuat keluar.

2. **Interaksi Membuka**:
   - Pengunjung dapat mengklik badan tong sampah, tutupnya, atau tombol tahap aksi (Tahap 1, 2, 3) untuk membuka tutup secara dinamis dengan animasi halus (tutup miring ke samping dan folder-folder aksi terangkat keluar).
   - Label petunjuk juga otomatis menampilkan status *"Tekan tong sampah untuk membuka 3 dokumen aksi"* saat tertutup.
