// src/components/SupplierFormModal.jsx (Refactored - Complete Code)
import React, { useState, useEffect } from 'react'; //

const SupplierFormModal = ({ isOpen, onClose, onSubmit, supplierToEdit }) => {
  // State awal form
  const initialFormData = {
    namaSupplier: '',
    kontakPerson: '',
    telepon: '',
    email: '',
    alamat: '',
    status: 'Active' // Default status
  }; //
  const [formData, setFormData] = useState(initialFormData);

  // Cek mode Edit
  const isEditMode = Boolean(supplierToEdit);

  // Efek untuk mengisi/reset form
  useEffect(() => {
    if (isOpen) { // Hanya saat modal terbuka
      if (supplierToEdit) {
        // Mode Edit: Isi form dengan data supplierToEdit, beri fallback
        setFormData({
          namaSupplier: supplierToEdit.namaSupplier || '',
          kontakPerson: supplierToEdit.kontakPerson || '',
          telepon: supplierToEdit.telepon || '',
          email: supplierToEdit.email || '',
          alamat: supplierToEdit.alamat || '',
          status: supplierToEdit.status || 'Active', // Default ke Active jika tidak ada
        });
      } else {
        // Mode Tambah: Reset ke state awal
        setFormData(initialFormData);
      }
    }
  }, [supplierToEdit, isOpen]); // Dependencies

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
      <div className="bg-card dark:bg-card-dark rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <form onSubmit={handleSubmit}>
          {/* Judul Modal Semantik */}
          <h2 className="text-xl sm:text-2xl font-bold text-text-dark dark:text-text-light mb-6">
            {isEditMode ? 'Edit Supplier' : 'Tambah Supplier Baru'}
          </h2>
          {/* Grid Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Nama Supplier Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Nama Supplier</span>
              <input
                type="text"
                name="namaSupplier"
                value={formData.namaSupplier}
                onChange={handleChange}
                required
                className="form-input rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary placeholder:text-text-secondary dark:placeholder:text-text-secondary-light"
                placeholder="Nama Perusahaan Supplier"
              />
            </label>
            {/* Input Kontak Person Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Kontak Person</span>
              <input
                type="text"
                name="kontakPerson"
                value={formData.kontakPerson}
                onChange={handleChange}
                required
                className="form-input rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary placeholder:text-text-secondary dark:placeholder:text-text-secondary-light"
                 placeholder="Nama Kontak"
              />
            </label>
            {/* Input Telepon Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Telepon</span>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                className="form-input rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary placeholder:text-text-secondary dark:placeholder:text-text-secondary-light"
                placeholder="Nomor Telepon Kontak"
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
                className="form-input rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary placeholder:text-text-secondary dark:placeholder:text-text-secondary-light"
                placeholder="Alamat Email Kontak"
              />
            </label>
            {/* Textarea Alamat Semantik */}
            <label className="flex flex-col md:col-span-2">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Alamat</span>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="form-textarea rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary min-h-[80px] placeholder:text-text-secondary dark:placeholder:text-text-secondary-light"
                placeholder="Alamat Lengkap Supplier"
                rows={3}
              ></textarea>
            </label>
            {/* Select Status Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Status</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select appearance-none rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>On Hold</option>
              </select>
               {/* Tambahkan ikon dropdown jika perlu */}
            </label>
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
             {/* Tombol Simpan Semantik (warna primary) */}
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

export default SupplierFormModal; //