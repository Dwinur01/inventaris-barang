// src/components/UserFormModal.jsx (Refactored - Complete Code)
import React, { useState, useEffect } from 'react'; //

const UserFormModal = ({ isOpen, onClose, onSubmit, userToEdit }) => {
  // State awal form
  const initialFormData = {
    namaLengkap: '',
    role: 'Warehouse Staff', // Default role
    email: '',
    telepon: '', // Tambahkan telepon jika diperlukan
    // status: 'Active' // Tambahkan status jika diperlukan
  }; //
  const [formData, setFormData] = useState(initialFormData);

  // Cek mode Edit
  const isEditMode = Boolean(userToEdit);

  // Efek untuk mengisi/reset form
  useEffect(() => {
    if (isOpen) { // Hanya saat modal terbuka
      if (userToEdit) {
        // Mode Edit: Isi form dengan data userToEdit, beri fallback
        setFormData({
          namaLengkap: userToEdit.namaLengkap || '',
          role: userToEdit.role || 'Warehouse Staff',
          email: userToEdit.email || '',
          telepon: userToEdit.telepon || '',
          // status: userToEdit.status || 'Active',
        });
      } else {
        // Mode Tambah: Reset ke state awal
        setFormData(initialFormData);
      }
    }
  }, [userToEdit, isOpen]); // Dependencies

  // Handler perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }; //

  // Handler submit form
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload
    // Panggil onSubmit dari props
    onSubmit(formData);
    // onClose(); // Tutup modal (dilakukan di parent)
  }; //

  // Jangan render jika modal tertutup
  if (!isOpen) return null;

  return (
    // Backdrop Semantik
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      {/* Kontainer Modal Semantik */}
      <div className="bg-card dark:bg-card-dark rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <form onSubmit={handleSubmit}>
          {/* Judul Modal Semantik */}
          <h2 className="text-xl sm:text-2xl font-bold text-text-dark dark:text-text-light mb-6">
            {isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
          </h2>
          {/* Form Fields */}
          <div className="space-y-4">
            {/* Input Nama Lengkap Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Nama Lengkap</span>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                required
                className="form-input rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary placeholder:text-text-secondary dark:placeholder:text-text-secondary-light"
                placeholder="Nama Lengkap Pengguna"
                autoFocus={!isEditMode} // Autofocus hanya saat tambah
              />
            </label>
            {/* Input Email Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary placeholder:text-text-secondary dark:placeholder:text-text-secondary-light"
                placeholder="Alamat Email Pengguna"
              />
            </label>
             {/* Select Role Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Role</span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select appearance-none rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary"
              >
                <option>Admin</option>
                <option>Manager</option>
                <option>Warehouse Staff</option>
              </select>
               {/* Tambahkan ikon dropdown jika perlu */}
            </label>
             {/* Input Telepon (Opsional) Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Telepon (Opsional)</span>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                className="form-input rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary placeholder:text-text-secondary dark:placeholder:text-text-secondary-light"
                placeholder="Nomor Telepon Pengguna"
              />
            </label>
             {/* Tambahkan Input/Select Status jika diperlukan */}
          </div>
          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 sm:gap-4 mt-8">
             {/* Tombol Batal Semantik */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-border-light dark:bg-border-dark px-5 py-2.5 sm:px-6 sm:py-3 font-semibold text-text-dark dark:text-text-light hover:opacity-80 transition-opacity text-sm sm:text-base"
            >
              Batal
            </button>
             {/* Tombol Simpan Semantik */}
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 sm:px-6 sm:py-3 font-semibold text-white hover:bg-primary-hover transition-colors text-sm sm:text-base"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
       {/* CSS Animasi */}
    </div>
  );
}; //

export default UserFormModal; //