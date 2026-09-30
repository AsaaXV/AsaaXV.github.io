import React, { useState } from 'react';
import { X, Share2, Copy, Check, Sparkles, MessageCircle, Twitter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [pledgeCommitted, setPledgeCommitted] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://3r-craft4earth.unm.ac.id';
  const shareText = `Saya berkomitmen menerapkan 3R (Reduce, Reuse, Recycle) mulai dari kampus bersama Craft4Earth DKV UNM! Yuk buka microsite edukasi interaktifnya di: ${currentUrl}`;

  const handleCommitPledge = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    setPledgeCommitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#808847', '#F1D2A1', '#925E06', '#59602A'],
    });
  };

  const copyToClipboard = () => {
    sounds.playPop();
    navigator.clipboard.writeText(`${shareText}`);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    sounds.playPop();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareTwitter = () => {
    sounds.playPop();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#F1D2A1] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#808847] text-[#242A16] max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#808847]/20 flex items-center justify-center text-[#242A16] hover:bg-[#808847]/40 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#808847] text-[#F1D2A1] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Share2 className="w-7 h-7" />
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-black text-[#808847] leading-tight">
            BAGIKAN AKSI 3R
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-[#444C20] mt-1">
            Jadilah bagian dari perubahan gaya hidup ramah lingkungan di kampusmu!
          </p>
        </div>

        {/* Commitment Badge Preview */}
        <div className="my-5 p-5 rounded-2xl bg-white/80 border-2 border-[#808847]/40 text-left shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#808847]/20">
            <span className="font-display text-xs font-black text-[#808847]">
              KARTU KOMITMEN 3R KAMPUS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#808847]/15 text-[#5B632E]">
              Craft4Earth DKV UNM
            </span>
          </div>

          <div className="py-3">
            <p className="text-xs text-[#242A16] font-medium leading-relaxed">
              "Saya{' '}
              <strong className="text-[#925E06] font-bold">
                {userName.trim() ? userName : 'Mahasiswa Peduli Bumi'}
              </strong>{' '}
              berjanji mengurangi sampah plastik sekali pakai, membawa tumbler harian, serta memilah sampah di kamar kos & kampus."
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#808847]/20 text-[10px] text-slate-500 font-medium">
            <span>Fakultas Seni & Desain UNM</span>
            <span>#Belajar3RSekaliScroll</span>
          </div>
        </div>

        {/* Name Input Form */}
        {!pledgeCommitted ? (
          <form onSubmit={handleCommitPledge} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#444C20] mb-1">
                Tulis Namamu untuk Kartu Komitmen:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Contoh: Muh. Fatur / Rani"
                maxLength={30}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#808847]/40 font-body text-sm text-[#242A16] placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#808847]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#808847] text-[#F1D2A1] font-display text-base font-black shadow-md hover:bg-[#686F35] active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simpan Komitmen & Dapatkan Kartu</span>
            </button>
          </form>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center border border-emerald-300 flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Komitmenmu telah dicatat! Sekarang ajak teman satu angkatanmu!</span>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={shareWhatsApp}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={shareTwitter}
                className="py-2.5 px-3 rounded-xl bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-sky-600 transition cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter / X</span>
              </button>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full py-2.5 px-4 rounded-xl bg-[#925E06] text-[#F1D2A1] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#784D05] transition cursor-pointer"
            >
              {hasCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Teks & Link Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Teks Komitmen & Link</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
