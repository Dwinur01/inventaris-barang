// src/components/KategoriFormModal.jsx (Refactored - Complete Code)
import React, { useState, useEffect } from 'react'; //

const KategoriFormModal = ({ isOpen, onClose, onSubmit, kategoriToEdit }) => {
  const [nama, setNama] = useState(''); // State untuk nama kategori

  // Cek apakah mode Edit (jika kategoriToEdit ada isinya)
  const isEditMode = Boolean(kategoriToEdit);

  // Efek untuk mengisi/mengosongkan form saat modal dibuka atau data berubah
  useEffect(() => {
    if (isOpen) { // Hanya jalankan jika modal terbuka
      if (isEditMode) {
        setNama(kategoriToEdit.nama || ''); // Isi form jika mode edit
      } else {
        setNama(''); // Kosongkan form jika mode tambah
      }
    }
    // Tidak perlu reset nama saat onClose karena state akan hilang saat modal unmount
  }, [kategoriToEdit, isEditMode, isOpen]); // Dependencies

  // Handler saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload
    const trimmedNama = nama.trim(); // Hapus spasi di awal/akhir
    if (!trimmedNama) { // Validasi nama tidak boleh kosong
        // Opsional: Tambahkan feedback error di sini
        return;
    }

    // Panggil fungsi onSubmit dari props dengan data kategori
    onSubmit({
      id: isEditMode ? kategoriToEdit.id : undefined, // Kirim ID hanya jika mode edit
      nama: trimmedNama, // Kirim nama yang sudah di-trim
    });
    // onClose(); // Tutup modal setelah submit (sudah dilakukan di onSubmit handler di Pengaturan.jsx)
  }; //

  // Jangan render jika modal tidak terbuka
  if (!isOpen) return null;

  return (
    // Backdrop Semantik
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      {/* Kontainer Modal Semantik */}
      <div className="bg-card dark:bg-card-dark rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <form onSubmit={handleSubmit}>
          {/* Judul Modal Semantik */}
          <h2 className="text-xl sm:text-2xl font-bold text-text-dark dark:text-text-light mb-6">
            {isEditMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h2>

          {/* Input Nama Kategori Semantik */}
          <label className="flex flex-col">
            <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Nama Kategori</p>
            <input
              className="form-input flex w-full min-w-0 flex-1 rounded-lg text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 placeholder:text-text-secondary dark:placeholder:text-text-secondary-light p-3 text-base"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Pakaian Anak"
              required // Wajib diisi
              autoFocus // Fokus otomatis saat modal terbuka
            />
            {/* Opsional: Tambahkan pesan error validasi di sini */}
          </label>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 sm:gap-4 mt-8">
             {/* Tombol Batal Semantik */}
            <button
              type="button"
              onClick={onClose} // Panggil fungsi tutup
              className="rounded-lg bg-border-light dark:bg-border-dark px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-text-dark dark:text-text-light hover:opacity-80 transition-opacity"
            >
              Batal
            </button>
             {/* Tombol Simpan Semantik */}
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
      {/* CSS Animasi (sama seperti DeleteConfirmModal) */}
    </div>
  );
}; //

export default KategoriFormModal; //