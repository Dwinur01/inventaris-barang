// src/components/DeleteConfirmModal.jsx (Refactored - Complete Code)
import React from 'react'; //
import { MdWarning } from 'react-icons/md'; //

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, judul, pesan }) => {
  // Jangan render jika modal tidak terbuka
  if (!isOpen) return null;

  return (
    // Backdrop semantik (latar belakang gelap transparan + blur)
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      {/* Kontainer Modal Semantik (kartu) */}
      <div className="bg-card dark:bg-card-dark rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"> {/* Animasi sederhana */}
        {/* Ikon Peringatan Semantik */}
        <div className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-danger-soft dark:bg-danger-soft/20 text-danger mb-4 sm:mb-6">
          <MdWarning className="text-3xl sm:text-4xl" />
        </div>

        {/* Judul Modal Semantik */}
        <h2 className="text-xl sm:text-2xl font-bold text-text-dark dark:text-text-light mb-2 sm:mb-3">
          {judul || 'Konfirmasi Penghapusan'} {/* Judul default */}
        </h2>

        {/* Pesan Modal Semantik */}
        <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-light mb-6 sm:mb-8">
          {pesan || 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat diurungkan.'} {/* Pesan default */}
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          {/* Tombol Batal Semantik */}
          <button
            onClick={onClose} // Panggil fungsi tutup modal
            className="flex-1 rounded-lg bg-border-light dark:bg-border-dark px-6 py-3 text-sm sm:text-base font-semibold text-text-dark dark:text-text-light hover:opacity-80 transition-opacity"
          >
            Batal
          </button>
          {/* Tombol Hapus Semantik */}
          <button
            onClick={onConfirm} // Panggil fungsi konfirmasi hapus
            className="flex-1 rounded-lg bg-danger px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-danger/80 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
      {/* CSS untuk animasi (tambahkan ke index.css jika belum ada) */}
      {/*
        @keyframes scaleIn {
            from { scale: 0.95; opacity: 0; }
            to { scale: 1; opacity: 1; }
        }
        .animate-scale-in {
            animation: scaleIn 0.3s ease-out forwards;
        }
       */}
    </div>
  );
}; //

export default DeleteConfirmModal; //