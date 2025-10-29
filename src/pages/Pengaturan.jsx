// src/pages/Pengaturan.jsx (Refactored - Complete Code)
import React, { useState, useMemo } from 'react'; // Impor useMemo
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { useToastContext } from '../contexts/ToastContext'; // Import context toast
import DeleteConfirmModal from '../components/DeleteConfirmModal'; // Import modal hapus
import KategoriFormModal from '../components/KategoriFormModal'; // Import modal form kategori
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'; //

const Pengaturan = () => {
  const { database, addKategori, updateKategori, deleteKategori } = useInventoryContext(); // Ambil data dan fungsi
  const { showToast } = useToastContext(); // Ambil fungsi toast

  // State Management
  const [activeTab, setActiveTab] = useState('Kategori'); // Tab yang aktif
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // State modal form
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State modal hapus
  const [selectedKategori, setSelectedKategori] = useState(null); // Kategori yang dipilih

  // --- Handlers Modal --- (Logika tidak berubah)
  const handleOpenAddModal = () => { setSelectedKategori(null); setIsFormModalOpen(true); }; //
  const handleOpenEditModal = (kategori) => { setSelectedKategori(kategori); setIsFormModalOpen(true); }; //
  const handleOpenDeleteModal = (kategori) => { setSelectedKategori(kategori); setIsDeleteModalOpen(true); }; //
  const handleCloseModals = () => { setIsFormModalOpen(false); setIsDeleteModalOpen(false); setSelectedKategori(null); }; //

  // --- Handlers CRUD --- (Logika tidak berubah)
  const handleFormSubmit = (formData) => {
    if (formData.id) { // Cek ID untuk mode edit
      updateKategori(formData);
      showToast(`Kategori "${formData.nama}" berhasil diperbarui.`, 'success');
    } else {
      addKategori(formData);
      showToast(`Kategori "${formData.nama}" berhasil ditambahkan.`, 'success');
    }
    handleCloseModals();
  }; //

  const handleDeleteConfirm = () => {
    if (selectedKategori) {
      deleteKategori(selectedKategori.id);
      showToast(`Kategori "${selectedKategori.nama}" berhasil dihapus.`, 'success');
      handleCloseModals();
    }
  }; //

  // Memoize daftar kategori untuk optimasi (opsional jika list tidak terlalu panjang)
  const memoizedKategori = useMemo(() => database?.kategori || [], [database?.kategori]);

  return (
     // Container layout diatur oleh Layout.jsx
    <div className="flex flex-col max-w-4xl mx-auto"> {/* Max width bisa disesuaikan */}
      {/* Header Halaman */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
         {/* Teks Header Semantik */}
        <p className="text-4xl font-black tracking-tighter text-text-dark dark:text-text-light">Pengaturan</p>
      </div>

      {/* Tabs Semantik */}
      <div className="pb-3 px-4"> {/* Tambah px-4 agar align */}
        <div className="flex border-b border-border dark:border-border-dark gap-8">
          {/* Tombol Tab Umum */}
          <button
            onClick={() => setActiveTab('Umum')}
            className={`flex flex-col items-center justify-center border-b-[3px] ${
              activeTab === 'Umum'
              ? 'border-b-primary text-primary' // Aktif: border & text primary
              : 'border-b-transparent text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light' // Tidak aktif
            } pb-[13px] pt-4 transition-colors`}
          >
            <p className="text-sm font-bold tracking-[0.015em]">Umum</p>
          </button>
           {/* Tombol Tab Kategori */}
          <button
            onClick={() => setActiveTab('Kategori')}
             className={`flex flex-col items-center justify-center border-b-[3px] ${
              activeTab === 'Kategori'
              ? 'border-b-primary text-primary'
              : 'border-b-transparent text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light'
            } pb-[13px] pt-4 transition-colors`}
          >
            <p className="text-sm font-bold tracking-[0.015em]">Kategori</p>
          </button>
           {/* Tombol Tab Notifikasi */}
          <button
            onClick={() => setActiveTab('Notifikasi')}
            className={`flex flex-col items-center justify-center border-b-[3px] ${
              activeTab === 'Notifikasi'
              ? 'border-b-primary text-primary'
              : 'border-b-transparent text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light'
            } pb-[13px] pt-4 transition-colors`}
          >
            <p className="text-sm font-bold tracking-[0.015em]">Notifikasi</p>
          </button>
        </div>
      </div>

      {/* Konten Tab Kategori */}
      {activeTab === 'Kategori' && (
        <div className="flex flex-col gap-4 p-4">
          {/* Tombol Tambah Kategori */}
          <div className="flex justify-start">
             {/* Tombol Semantik */}
            <button
              onClick={handleOpenAddModal}
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-primary text-white gap-2 text-base font-bold tracking-[0.015em] hover:bg-primary-hover transition-colors"
            >
              <MdAdd size={20} />
              <span className="truncate">Tambah Kategori Baru</span>
            </button>
          </div>

          {/* Tabel Kategori */}
          {/* Container Tabel Semantik */}
          <div className="overflow-hidden rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                 {/* Header Tabel Semantik */}
                <thead className="bg-background-light dark:bg-background-dark/50 border-b border-border dark:border-border-dark">
                  <tr>
                     {/* Kolom Header Semantik */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider w-[calc(100%-150px)]">Nama Kategori</th> {/* Sesuaikan lebar */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider w-[150px]">Aksi</th> {/* Sesuaikan lebar */}
                  </tr>
                </thead>
                 {/* Body Tabel Semantik */}
                <tbody className="divide-y divide-border dark:divide-border-dark">
                  {memoizedKategori.map((kategori) => (
                     // Hover Baris Semantik
                    <tr key={kategori.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                       {/* Kolom Teks Semantik */}
                      <td className="h-[72px] px-4 py-2 text-sm text-text-dark dark:text-text-light font-normal">{kategori.nama}</td>
                       {/* Kolom Aksi */}
                      <td className="h-[72px] px-4 py-2 text-sm font-normal w-[150px]">
                        <div className="flex items-center gap-3">
                           {/* Tombol Aksi Semantik */}
                          <button
                            onClick={() => handleOpenEditModal(kategori)}
                            className="flex items-center gap-1 text-primary hover:text-primary-hover transition-colors"
                          >
                            <MdEdit size={16} />
                            <span className="font-bold text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(kategori)}
                            className="flex items-center gap-1 text-danger hover:text-danger/80 transition-colors"
                          >
                            <MdDelete size={16} />
                            <span className="font-bold text-sm">Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                   {/* Baris jika tidak ada kategori */}
                   {memoizedKategori.length === 0 && (
                      <tr>
                          <td colSpan={2} className="text-center py-10 text-text-secondary dark:text-text-secondary-light">
                              Belum ada kategori ditambahkan.
                          </td>
                      </tr>
                   )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder untuk Tab Lain */}
       {activeTab !== 'Kategori' && (
         // Kartu Semantik
        <div className="mt-8 p-8 bg-card dark:bg-card-dark rounded-xl shadow mx-4"> {/* Tambah mx-4 */}
          {/* Teks Semantik */}
          <p className="text-lg text-text-secondary dark:text-text-secondary-light">Konten untuk tab '{activeTab}' belum tersedia.</p>
        </div>
      )}

      {/* Render Modals (Pastikan modal juga di-refactor) */}
      <KategoriFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleFormSubmit}
        kategoriToEdit={selectedKategori}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        judul="Hapus Kategori?"
        pesan={`Anda yakin ingin menghapus kategori "${selectedKategori?.nama}"? Tindakan ini tidak dapat diurungkan.`}
      />
    </div>
  );
}; //

export default Pengaturan; //