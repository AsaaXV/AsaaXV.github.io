import React, { useState } from 'react';
import { X, Users, BookOpen, FileText, CheckCircle2, Award, Calendar, Lightbulb, PieChart } from 'lucide-react';
import { TEAM_MEMBERS, LECTURERS, LOGBOOK_ENTRIES } from '../data/content';
import { sounds } from '../utils/audio';

interface AcademicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicReportModal: React.FC<AcademicReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'bab1' | 'riset' | 'logbook'>('profil');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-[#FBF3E4] rounded-3xl shadow-2xl border-4 border-[#808847] text-[#242A16] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#808847] text-[#F1D2A1] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F1D2A1] text-[#808847] flex items-center justify-center font-display font-black text-lg">
              3R
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-black leading-tight text-white">
                Dokumen Kerja & Asistensi Kelompok
              </h2>
              <p className="text-xs text-[#F1D2A1]/85 font-semibold">
                DKV UNM • Mata Kuliah Desain Media Interaktif • Semester 5
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#E7D0AA] border-b border-[#808847]/30 overflow-x-auto shrink-0">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('profil');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profil'
                ? 'bg-[#808847] text-white shadow'
                : 'text-[#4A5222] hover:bg-[#808847]/20'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Tim & Info Kuliah</span>
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('bab1');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bab1'
                ? 'bg-[#808847] text-white shadow'
                : 'text-[#4A5222] hover:bg-[#808847]/20'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>Latar Belakang & Konsep</span>
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('riset');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'riset'
                ? 'bg-[#808847] text-white shadow'
                : 'text-[#4A5222] hover:bg-[#808847]/20'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 shrink-0" />
            <span>Hasil Riset Pengguna</span>
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('logbook');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logbook'
                ? 'bg-[#808847] text-white shadow'
                : 'text-[#4A5222] hover:bg-[#808847]/20'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Kartu Asistensi (10 Pertemuan)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* TAB 1: PROFIL & ANGGOTA KELOMPOK */}
          {activeTab === 'profil' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[11px] font-black uppercase text-[#925E06]">Kelompok Perancang</span>
                <h3 className="font-display text-2xl font-black text-[#808847]">Kelompok "Craft4Earth"</h3>
                <p className="text-xs text-[#454D22] font-medium mt-1">
                  Kelas DKV D/4 Angkatan 2024 • Fakultas Seni dan Desain • Universitas Negeri Makassar
                </p>
              </div>

              {/* Members Grid */}
              <div>
                <h4 className="font-display text-sm font-black text-[#242A16] mb-3 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#808847]" />
                  <span>Daftar Anggota & NIM</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEAM_MEMBERS.map((member, idx) => (
                    <div
                      key={member.nim}
                      className="p-3.5 rounded-2xl bg-white/80 border border-[#808847]/30 shadow-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-display text-sm font-black text-[#242A16]">
                          {idx + 1}. {member.name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">NIM: {member.nim}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#808847]/15 text-[#5C642F]">
                        {member.role.split(' / ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dosen Pengampu */}
              <div className="p-4 rounded-2xl bg-[#E8D4B4]/70 border border-[#808847]/30">
                <h4 className="font-display text-sm font-black text-[#242A16] mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#925E06]" />
                  <span>Dosen Pengampu Mata Kuliah:</span>
                </h4>
                <ul className="space-y-1.5 text-xs font-semibold text-[#3C441E]">
                  {LECTURERS.map((dosen, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#808847]" />
                      <span>{dosen.name}</span>
                      <span className="text-[10px] text-slate-500">({dosen.role})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: LATAR BELAKANG & KONSEP */}
          {activeTab === 'bab1' && (
            <div className="space-y-5 animate-fade-in text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white/80 border border-[#808847]/30">
                <h4 className="font-display text-base font-black text-[#808847] mb-2">
                  1.1 Latar Belakang Perancangan
                </h4>
                <p className="text-[#323919] leading-relaxed mb-3">
                  Sampah adalah salah satu masalah lingkungan paling mendesak di Indonesia. Data Kementerian Lingkungan Hidup dan Kehutanan menunjukkan sampah organik dan plastik berakhir di TPA tanpa pengelolaan memadai. Mahasiswa merupakan agen perubahan strategis di masa transisi kemandirian mereka.
                </p>
                <p className="text-[#323919] leading-relaxed">
                  Pada mata kuliah <strong>Desain Grafis Lingkungan (DGL)</strong> sebelumnya, kelompok Craft4Earth membuat karya mural 3R di ruang publik kampus. Untuk memperluas jangkauan dan interaktivitas, pada mata kuliah <strong>Desain Media Interaktif (DMI)</strong> ini materi mural ditransformasikan menjadi microsite interaktif satu halaman (single long-scroll).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#E8D4B4]/70 border border-[#808847]/30">
                  <h5 className="font-display text-sm font-black text-[#925E06] mb-1">
                    Big Idea: "Belajar 3R, Sekali Scroll"
                  </h5>
                  <p className="text-xs text-[#323919] leading-relaxed">
                    Pengalaman belajar digital yang mengubah materi mural statis menjadi alur eksplorasi scroll yang ringan, visual, dan dapat diakses mahasiswa kapan saja di smartphone.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#E8D4B4]/70 border border-[#808847]/30">
                  <h5 className="font-display text-sm font-black text-[#808847] mb-1">
                    Sistem Warna 60-30-10
                  </h5>
                  <p className="text-xs text-[#323919] leading-relaxed">
                    • <strong>60% Dominan:</strong> Mustard Green (#808847) melambangkan alam.<br />
                    • <strong>30% Sekunder:</strong> Peach (#F1D2A1) warna dasar hangat.<br />
                    • <strong>10% Aksen:</strong> Golden Brown (#925E06) tombol CTA & aksi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RISET & ANALISIS */}
          {activeTab === 'riset' && (
            <div className="space-y-5 animate-fade-in text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white/80 border border-[#808847]/30">
                <h4 className="font-display text-base font-black text-[#808847] mb-2 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#808847]" />
                  <span>Ringkasan Riset Google Form (16 Responden Mahasiswa)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-3">
                  <div className="p-2.5 rounded-xl bg-[#F1D2A1]">
                    <span className="block font-display text-xl font-black text-[#808847]">87.5%</span>
                    <span className="text-[10px] font-bold text-[#444D22]">Usia 18-20 Tahun</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F1D2A1]">
                    <span className="block font-display text-xl font-black text-[#925E06]">81.3%</span>
                    <span className="text-[10px] font-bold text-[#444D22]">Mahasiswa Non-DKV</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F1D2A1]">
                    <span className="block font-display text-xl font-black text-rose-800">56.3%</span>
                    <span className="text-[10px] font-bold text-[#444D22]">Kurang Fasilitas</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F1D2A1]">
                    <span className="block font-display text-xl font-black text-emerald-800">100%</span>
                    <span className="text-[10px] font-bold text-[#444D22]">Ingin Visual Menarik</span>
                  </div>
                </div>
              </div>

              {/* Kutipan Responden */}
              <div className="space-y-2">
                <h5 className="font-display text-xs font-black uppercase text-[#925E06]">
                  Insight Langsung Responden (Akbar, Rani, Keyra):
                </h5>
                <div className="p-3 rounded-xl bg-white/70 border-l-4 border-[#925E06] text-xs italic text-slate-700">
                  "Yang bikin bosan itu layout yang tidak membuat mata terarah, desain terlalu banyak teks yang dipanjang-panjangkan demi terlihat penuh, warna monoton, dan UI template default." — <strong>Akbar (Non-DKV)</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border-l-4 border-[#808847] text-xs italic text-slate-700">
                  "Apabila tidak ada keterangan yang dikasih di atas tempat sampah, saya bingung." — <strong>Rani (Non-DKV)</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border-l-4 border-emerald-700 text-xs italic text-slate-700">
                  "Visual yang paling sesuai adalah ilustrasi/infografis sederhana dan ramah, menampilkan contoh yang dekat dengan keseharian mahasiswa." — <strong>Keyra (DKV)</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOGBOOK ASISTENSI */}
          {activeTab === 'logbook' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display text-sm font-black text-[#242A16] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#808847]" />
                  <span>Logbook Asistensi 10 Milestone Perancangan</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  100% Terpenuhi
                </span>
              </div>

              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {LOGBOOK_ENTRIES.map((log) => (
                  <div
                    key={log.meeting}
                    className="p-3 rounded-2xl bg-white/80 border border-[#808847]/30 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-black text-[#808847]">
                        Asistensi #{log.meeting} • {log.date}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ACC</span>
                      </span>
                    </div>
                    <p className="font-bold text-[#242A16]">{log.focus}</p>
                    <p className="text-slate-600 mt-1 italic">
                      Catatan Dosen: "{log.feedback}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-[#E7D0AA] border-t border-[#808847]/30 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-[#4B5325]">
            Dokumen Ujian Akhir Semester DKV UNM 2026
          </span>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-4 py-1.5 rounded-full bg-[#808847] text-[#F1D2A1] font-display text-xs font-bold hover:bg-[#686F35] cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
