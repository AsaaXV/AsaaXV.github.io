import React, { useState } from 'react';
import {
  X,
  PieChart,
  Users,
  MessageSquareQuote,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  BookOpen,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { TEAM_MEMBERS, LECTURERS, LOGBOOK_ENTRIES } from '../data/content';
import { sounds } from '../utils/audio';

interface AcademicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'team' | 'research' | 'logbook';
}

export const AcademicReportModal: React.FC<AcademicReportModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'team',
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'research' | 'logbook'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-[#FEFAE0] rounded-3xl shadow-2xl border-4 border-[#283618] text-[#283618] max-h-[92vh] flex flex-col overflow-hidden animate-fade-in">
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-[#283618] text-[#FEFAE0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEFAE0] text-[#283618] flex items-center justify-center font-display font-black text-lg shadow-sm">
              3R
            </div>
            <div>
              <h2 className="font-display text-base sm:text-xl font-black leading-tight text-white">
                Dokumentasi Proyek &amp; Kerja Sama Tim DKV UNM
              </h2>
              <p className="text-[11px] sm:text-xs text-[#FEFAE0]/85 font-medium">
                Mata Kuliah Desain Media Interaktif • Pembagian Tugas &amp; Riset Pengguna
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            aria-label="Tutup Laporan"
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 pt-3 pb-2.5 bg-[#FEFAE0] border-b border-[#283618]/15 overflow-x-auto select-none shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveTab('team');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'team'
                ? 'bg-[#283618] text-[#FEFAE0] shadow-md scale-102'
                : 'bg-[#283618]/10 text-[#283618] hover:bg-[#283618]/20'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kerja Sama &amp; Pembagian Tugas Tim</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveTab('research');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'research'
                ? 'bg-[#283618] text-[#FEFAE0] shadow-md scale-102'
                : 'bg-[#283618]/10 text-[#283618] hover:bg-[#283618]/20'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Data Riset Pengguna (16 Responden)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveTab('logbook');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'logbook'
                ? 'bg-[#283618] text-[#FEFAE0] shadow-md scale-102'
                : 'bg-[#283618]/10 text-[#283618] hover:bg-[#283618]/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Logbook Perkuliahan</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* TAB 1: KERJA SAMA & PEMBAGIAN TUGAS TIM (ARAHAN STEFFI) */}
          {activeTab === 'team' && (
            <div className="space-y-5 animate-fade-in">
              {/* Highlight Box: Saran & Arahan Steffi */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#5B4436] text-[#FEFAE0] shadow-md border border-[#433126]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-300 text-[#283618] flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5 text-[#283618]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-amber-200">
                      Arahan &amp; Saran Ketua Tim
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-black text-white mt-1">
                      Steffi Ansari Situmorang — Project Manager &amp; UX Research
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-white/95 leading-relaxed mt-1.5 italic">
                      "Pengerjaan proyek media interaktif 3R ini dibagi melalui kerja sama tim yang terstruktur. Tampilan kartu diatur menjadi satu kartu per satu layar HP agar tidak terlalu kecil bagi pengguna smartphone, rumput dibuat fleksibel di segala device tanpa menutupi layar, serta font dan hierarki visual dijaga agar ramah bagi seluruh mahasiswa UNM."
                    </p>
                  </div>
                </div>
              </div>

              {/* 6 Anggota Kelompok & Rincian Tugas */}
              <div>
                <h4 className="font-display text-sm sm:text-base font-black text-[#283618] mb-3 flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-[#5B4436]" />
                  <span>Daftar Anggota &amp; Pembagian Tugas Tim</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {TEAM_MEMBERS.map((member, idx) => (
                    <div
                      key={member.nim}
                      className="p-4 rounded-2xl bg-white/90 border border-[#283618]/20 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Member Header */}
                        <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-[#283618]/15">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#283618]/10 text-[#283618]">
                              Anggota 0{idx + 1}
                            </span>
                            <h5 className="font-display text-sm font-black text-[#283618] mt-1">
                              {member.name}
                            </h5>
                            <span className="text-xs font-mono font-bold text-[#5B4436]">
                              NIM: {member.nim}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#5B4436]/15 text-[#5B4436] text-right max-w-[140px] leading-tight">
                            {member.role}
                          </span>
                        </div>

                        {/* Member Tasks */}
                        {member.tasks && (
                          <div className="space-y-1.5 mt-2.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#283618]/70 block">
                              Tugas &amp; Tanggung Jawab:
                            </span>
                            {member.tasks.map((task, tIdx) => (
                              <div key={tIdx} className="flex items-start gap-1.5 text-xs text-[#283618]/90">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="leading-snug">{task}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quote */}
                      {member.quote && (
                        <div className="mt-3 pt-2 border-t border-[#283618]/10 text-[11px] italic text-[#5B4436]">
                          "{member.quote}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dosen Pengampu */}
              <div className="p-4 rounded-2xl bg-white/80 border border-[#283618]/20 shadow-xs">
                <h5 className="font-display text-xs sm:text-sm font-black text-[#283618] mb-2.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#5B4436]" />
                  <span>Dosen Pengampu Mata Kuliah Desain Media Interaktif</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {LECTURERS.map((dosen, dIdx) => (
                    <div key={dIdx} className="p-2.5 rounded-xl bg-[#FEFAE0] border border-[#283618]/15">
                      <span className="font-display text-xs font-bold text-[#283618] block leading-tight">
                        {dosen.name}
                      </span>
                      <span className="text-[10px] text-[#5B4436] font-semibold mt-0.5 block">
                        {dosen.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA RISET PENGGUNA */}
          {activeTab === 'research' && (
            <div className="space-y-6 animate-fade-in">
              {/* Demografi & Statistik */}
              <div className="p-5 rounded-2xl bg-white/90 border border-[#283618]/20 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-base font-black text-[#283618] flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#283618]" />
                    <span>Statistik Survei Google Form (16 Responden)</span>
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#283618]/10 text-[#283618]">
                    Mahasiswa UNM Makassar
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
                  <div className="p-3 rounded-xl bg-[#FEFAE0] border border-[#283618]/15 text-center">
                    <span className="block font-display text-2xl font-black text-[#283618]">87.5%</span>
                    <span className="text-[11px] font-bold text-[#283618]/85">Usia 18-20 Tahun</span>
                    <p className="text-[10px] text-slate-500 mt-1">Fase adaptasi awal perkuliahan &amp; kos</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FEFAE0] border border-[#283618]/15 text-center">
                    <span className="block font-display text-2xl font-black text-[#5B4436]">81.3%</span>
                    <span className="text-[11px] font-bold text-[#283618]/85">Mahasiswa Non-DKV</span>
                    <p className="text-[10px] text-slate-500 mt-1">Target utama edukasi visual ramah</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FEFAE0] border border-[#283618]/15 text-center">
                    <span className="block font-display text-2xl font-black text-rose-800">56.3%</span>
                    <span className="text-[11px] font-bold text-[#283618]/85">Kurang Fasilitas</span>
                    <p className="text-[10px] text-slate-500 mt-1">Tempat sampah terpilah minim &amp; membingungkan</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FEFAE0] border border-[#283618]/15 text-center">
                    <span className="block font-display text-2xl font-black text-emerald-800">100%</span>
                    <span className="text-[11px] font-bold text-[#283618]/85">Ingin Visual Menarik</span>
                    <p className="text-[10px] text-slate-500 mt-1">Menolak poster kaku penuh teks panjang</p>
                  </div>
                </div>
              </div>

              {/* Temuan Masalah */}
              <div className="p-5 rounded-2xl bg-white/90 border border-[#283618]/20 shadow-xs">
                <h4 className="font-display text-sm sm:text-base font-black text-[#283618] mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#5B4436]" />
                  <span>Temuan Masalah Utama Berdasarkan Riset Lapangan</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#5B4436]/10 border border-[#5B4436]/20">
                    <div className="w-7 h-7 rounded-lg bg-[#5B4436] text-white flex items-center justify-center font-display text-xs font-bold mb-2">
                      1
                    </div>
                    <h5 className="font-display text-xs font-black text-[#5B4436] mb-1">
                      Kebingungan Pemilahan
                    </h5>
                    <p className="text-xs text-[#283618]/90 leading-relaxed">
                      Mahasiswa sering bingung membedakan jenis sampah basah, plastik kering, dan residu jika tidak ada panduan visual langsung di tempat sampah.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#283618]/10 border border-[#283618]/20">
                    <div className="w-7 h-7 rounded-lg bg-[#283618] text-white flex items-center justify-center font-display text-xs font-bold mb-2">
                      2
                    </div>
                    <h5 className="font-display text-xs font-black text-[#283618] mb-1">
                      Kelelahan Informasi
                    </h5>
                    <p className="text-xs text-[#283618]/90 leading-relaxed">
                      Format poster regulasi kampus terlalu panjang dan monoton, sehingga diabaikan mahasiswa saat melintas.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-800/10 border border-emerald-800/20">
                    <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-display text-xs font-bold mb-2">
                      3
                    </div>
                    <h5 className="font-display text-xs font-black text-emerald-900 mb-1">
                      Butuh Aksi Nyata Praktis
                    </h5>
                    <p className="text-xs text-[#283618]/90 leading-relaxed">
                      Mahasiswa membutuhkan tips 3R konkret yang dapat langsung dipraktikkan di kamar kos dan kampus tanpa biaya tambahan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kutipan Responden */}
              <div className="space-y-3">
                <h4 className="font-display text-xs font-black uppercase tracking-wider text-[#5B4436] flex items-center gap-1.5">
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Insight &amp; Kutipan Langsung Responden</span>
                </h4>

                <div className="space-y-2.5">
                  <div className="p-4 rounded-2xl bg-white/90 border-l-4 border-[#5B4436] text-xs sm:text-sm text-slate-800 shadow-xs">
                    <p className="italic leading-relaxed">
                      "Yang bikin bosan itu layout yang tidak membuat mata terarah, desain terlalu banyak teks yang dipanjang-panjangkan demi terlihat penuh, warna monoton, dan UI template default."
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs font-bold text-[#5B4436]">
                      <span>— Akbar (Responden Non-DKV, 19 Tahun)</span>
                      <span className="text-[10px] font-semibold text-slate-500">Evaluasi UI/UX</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/90 border-l-4 border-[#283618] text-xs sm:text-sm text-slate-800 shadow-xs">
                    <p className="italic leading-relaxed">
                      "Apabila tidak ada keterangan yang dikasih di atas tempat sampah, saya bingung jenis sampah mana yang harus dibuang ke mana."
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs font-bold text-[#283618]">
                      <span>— Rani (Responden Non-DKV, 20 Tahun)</span>
                      <span className="text-[10px] font-semibold text-slate-500">Masalah Lapangan</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/90 border-l-4 border-emerald-700 text-xs sm:text-sm text-slate-800 shadow-xs">
                    <p className="italic leading-relaxed">
                      "Visual yang paling sesuai adalah ilustrasi/infografis sederhana dan ramah, menampilkan contoh yang dekat dengan keseharian mahasiswa."
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs font-bold text-emerald-800">
                      <span>— Keyra (Responden DKV, 20 Tahun)</span>
                      <span className="text-[10px] font-semibold text-slate-500">Preferensi Desain</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rekomendasi Solusi Desain */}
              <div className="p-5 rounded-2xl bg-[#5B4436]/10 border border-[#283618]/20">
                <h4 className="font-display text-sm sm:text-base font-black text-[#283618] mb-2.5 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#5B4436]" />
                  <span>Rekomendasi Desain Berdasarkan Riset</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#283618]">
                  <div className="p-3 rounded-xl bg-white/80 border border-[#283618]/15">
                    <span className="font-display font-black text-[#283618] block mb-1">
                      1. Tampilan Mobile 1 Kartu
                    </span>
                    <p className="leading-relaxed text-[#283618]/85">
                      Kartu disajikan 1 kartu per layar HP sehingga ukuran font dan visual tetap besar, nyaman dibaca, dan tidak terdistorsi.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-[#283618]/15">
                    <span className="font-display font-black text-[#283618] block mb-1">
                      2. Rumput Pendek &amp; Fleksibel
                    </span>
                    <p className="leading-relaxed text-[#283618]/85">
                      Rumput tidak difix di layar bawah agar tidak mengganggu konten dan tombol, serta memanjang fleksibel di seluruh device.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-[#283618]/15">
                    <span className="font-display font-black text-[#283618] block mb-1">
                      3. Contoh Dekat Keseharian
                    </span>
                    <p className="leading-relaxed text-[#283618]/85">
                      Fokus pada botol bekas, kardus paket online, tumbler, dan pakaian bayi yang dekat dengan kehidupan sehari-hari.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOGBOOK PERKULIAHAN */}
          {activeTab === 'logbook' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-white/90 border border-[#283618]/20 shadow-xs mb-3">
                <h4 className="font-display text-sm font-black text-[#283618]">
                  Logbook Pengerjaan &amp; Progres Pertemuan Kelompok
                </h4>
                <p className="text-xs text-[#283618]/80 mt-0.5">
                  Rekapitulasi 10 pertemuan asistensi dan pengerjaan tugas proyek media interaktif 3R.
                </p>
              </div>

              <div className="space-y-2.5">
                {LOGBOOK_ENTRIES.map((entry) => (
                  <div
                    key={entry.meeting}
                    className="p-3.5 rounded-2xl bg-white/85 border border-[#283618]/15 text-xs text-[#283618]"
                  >
                    <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#283618]/10">
                      <span className="font-display font-black text-[#283618]">
                        Pertemuan {entry.meeting} • {entry.date}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Disetujui
                      </span>
                    </div>
                    <p className="font-bold text-[#5B4436] mt-1">{entry.focus}</p>
                    <p className="text-[11px] text-[#283618]/85 mt-0.5">
                      <strong>Feedback:</strong> {entry.feedback}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      <strong>Deliverable:</strong> {entry.deliverable}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3.5 bg-[#5B4436]/15 border-t border-[#283618]/20 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-[#283618]">
            Craft4Earth • DKV FSD Universitas Negeri Makassar
          </span>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-[#283618] text-[#FEFAE0] font-display text-xs font-bold hover:bg-[#1e2a12] transition cursor-pointer"
          >
            Tutup Dokumen
          </button>
        </div>
      </div>
    </div>
  );
};
