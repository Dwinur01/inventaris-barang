// src/components/OrderFormModal.jsx (Refactored - Complete Code)
import React, { useState, useEffect } from 'react'; //

const OrderFormModal = ({ isOpen, onClose, onSubmit, orderToEdit }) => {
  // State awal form
  const initialFormData = {
    tanggal: new Date().toISOString().split('T')[0], // Default tanggal hari ini (YYYY-MM-DD)
    tipe: 'Incoming', // Default tipe
    status: 'Pending', // Default status
    items: '', // Item terkait (string dipisah koma)
    kuantitas: 0, // Kuantitas total
  }; //
  const [formData, setFormData] = useState(initialFormData);

  // Cek apakah mode Edit
  const isEditMode = Boolean(orderToEdit);

  // Efek untuk mengisi/reset form saat modal dibuka atau data berubah
  useEffect(() => {
    if (isOpen) { // Hanya jalankan jika modal terbuka
      if (orderToEdit) {
        // Mode Edit: Isi form dengan data orderToEdit
        setFormData({
          ...orderToEdit,
          // Pastikan format tanggal YYYY-MM-DD
          tanggal: orderToEdit.tanggal ? new Date(orderToEdit.tanggal).toISOString().split('T')[0] : initialFormData.tanggal
        });
      } else {
        // Mode Tambah: Reset form ke state awal
        setFormData(initialFormData);
      }
    }
  }, [orderToEdit, isOpen]); // Dependencies

  // Handler perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Konversi kuantitas ke angka
    const newValue = name === 'kuantitas' ? parseInt(value, 10) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  }; //

  // Handler submit form
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload
    // Panggil onSubmit dari props dengan data form
    onSubmit(formData);
    // onClose(); // Tutup modal (sudah dilakukan di onSubmit handler di OrderManagement.jsx)
  }; //

  // Jangan render jika modal tidak terbuka
  if (!isOpen) return null;

  return (
     // Backdrop Semantik
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
       {/* Kontainer Modal Semantik */}
      <div className="bg-card dark:bg-card-dark rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <form onSubmit={handleSubmit}>
          {/* Judul Modal Semantik */}
          <h2 className="text-xl sm:text-2xl font-bold text-text-dark dark:text-text-light mb-6">
            {isEditMode ? 'Edit Order' : 'Buat Order Baru'}
          </h2>
          {/* Grid Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Tanggal Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Tanggal</span>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
                className="form-input rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary"
              />
            </label>
            {/* Select Tipe Order Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Tipe Order</span>
              <select
                name="tipe"
                value={formData.tipe}
                onChange={handleChange}
                className="form-select appearance-none rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary"
              >
                <option>Incoming</option>
                <option>Outgoing</option>
              </select>
              {/* Tambahkan ikon dropdown jika perlu */}
            </label>
            {/* Select Status Order Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Status Order</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select appearance-none rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary"
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </label>
            {/* Input Kuantitas Semantik */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Total Kuantitas</span>
              <input
                type="number"
                name="kuantitas"
                min="0" // Kuantitas tidak boleh negatif
                value={formData.kuantitas}
                onChange={handleChange}
                required
                className="form-input rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
            {/* Textarea Associated Items Semantik */}
            <label className="flex flex-col md:col-span-2">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Associated Items (Nama/SKU, pisah koma)</span>
              <textarea
                name="items"
                value={formData.items}
                onChange={handleChange}
                className="form-textarea rounded-lg border border-border dark:border-border-dark bg-input dark:bg-input-dark p-3 text-sm text-text-dark dark:text-text-light focus:ring-primary focus:border-primary min-h-[80px]" // Min height
                placeholder="Contoh: KLP-001, Baju Anak Merah, SKU-XYZ..."
                rows={3}
              ></textarea>
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

export default OrderFormModal; //