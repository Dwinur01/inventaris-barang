// src/components/ItemDetailModal.jsx (Refactored - Complete Code)
import React from 'react'; //
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { MdClose } from 'react-icons/md'; // Ikon close

const ItemDetailModal = ({ isOpen, onClose, item, onEditClick }) => {
  const { database } = useInventoryContext(); // Ambil data database dari context

  // Helper mendapatkan nama kategori (tetap sama)
  const getKategoriName = (kategoriId) => {
    return database?.kategori?.find(k => k.id === kategoriId)?.nama || 'N/A';
  }; //

  // Helper format mata uang (tetap sama)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value || 0); // Fallback ke 0
  }; //

  // Helper warna teks stok (Refactored Semantik)
  const getStockColor = (jumlah) => {
    const stock = Number(jumlah);
    if (stock <= 0) return "text-danger dark:text-danger/90 font-semibold"; // Merah tebal jika habis
    if (stock <= 10) return "text-warning dark:text-warning/90 font-semibold"; // Kuning tebal jika menipis
    return "text-success dark:text-success/90"; // Hijau jika tersedia
  }; //

  // Jangan render jika modal tertutup atau tidak ada item
  if (!isOpen || !item) return null;

  return (
    // Backdrop Semantik
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Kontainer Modal Semantik */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card dark:bg-card-dark rounded-2xl shadow-2xl flex flex-col font-sans transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">

        {/* Tombol Close di Pojok Kanan Atas */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light transition-colors z-10 p-2 rounded-full hover:bg-background dark:hover:bg-background-dark/50" // Styling tombol close
          aria-label="Tutup detail barang"
        >
          <MdClose size={24} />
        </button>

        {/* Header Modal Semantik */}
        <div className="p-6 sm:p-8 border-b border-border dark:border-border-dark">
          <h2 className="text-xl sm:text-2xl font-bold text-text-dark dark:text-text-light leading-tight font-display">
            Detail Barang
          </h2>
          <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-light font-display mt-1">
            Informasi lengkap mengenai item yang dipilih.
          </p>
        </div>

        {/* Konten Modal (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1"> {/* flex-1 agar bisa scroll */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

            {/* Kolom Gambar */}
            <div className="md:col-span-1 flex flex-col gap-4 items-center">
               {/* Container Gambar Semantik */}
              <div className="w-full max-w-[250px] md:max-w-full aspect-square bg-input dark:bg-input-dark rounded-lg flex items-center justify-center overflow-hidden border border-border dark:border-border-dark">
                <img
                  alt={item.namaBarang || 'Gambar barang'}
                  className="w-full h-full object-cover rounded-lg"
                  src={item.gambarUrl || 'https://via.placeholder.com/300/F1F5F9/9CA3AF?text=No+Image'} // Placeholder lebih baik
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300/F1F5F9/9CA3AF?text=Error'; }} // Fallback jika gambar error
                />
              </div>
              {/* (Opsional: Thumbnail tambahan) */}
            </div>

            {/* Kolom Info Detail */}
            <div className="md:col-span-2">
              <div className="space-y-4 sm:space-y-6 font-display">
                {/* Nama Barang */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Nama Barang</h3>
                  <p className="text-lg sm:text-xl font-semibold text-text-dark dark:text-text-light mt-1">{item.namaBarang}</p>
                </div>
                {/* SKU */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">SKU</h3>
                  <p className="text-lg sm:text-xl font-semibold text-text-dark dark:text-text-light mt-1">{item.sku}</p>
                </div>
                {/* Kategori & Stok (Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Kategori</h3>
                    <p className="text-base sm:text-lg font-semibold text-text-dark dark:text-text-light mt-1">{getKategoriName(item.kategori)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Jumlah Stok</h3>
                    {/* Warna Stok Semantik */}
                    <p className={`text-base sm:text-lg ${getStockColor(item.jumlah)} mt-1`}>
                      {item.jumlah} Unit
                    </p>
                  </div>
                </div>
                {/* Harga Beli & Jual (Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Harga Beli</h3>
                    <p className="text-base sm:text-lg font-semibold text-text-dark dark:text-text-light mt-1">{formatCurrency(item.hargaBeli)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Harga Jual</h3>
                    <p className="text-base sm:text-lg font-semibold text-text-dark dark:text-text-light mt-1">{formatCurrency(item.hargaJual)}</p>
                  </div>
                </div>
                {/* Deskripsi */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Deskripsi</h3>
                  <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-light mt-1 whitespace-pre-wrap"> {/* Jaga format line break */}
                      {item.deskripsi || '-'} {/* Tampilkan '-' jika deskripsi kosong */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Tombol Aksi Semantik */}
        <div className="flex justify-end gap-3 sm:gap-4 p-6 sm:p-8 border-t border-border dark:border-border-dark font-display">
          {/* Tombol Tutup Semantik */}
          <button
            onClick={onClose}
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-11 px-5 sm:h-12 sm:px-6 bg-border-light dark:bg-border-dark hover:opacity-80 text-text-dark dark:text-text-light text-sm font-bold tracking-wide transition-opacity"
          >
            <span className="truncate">Tutup</span>
          </button>
          {/* Tombol Edit Semantik */}
          <button
            onClick={onEditClick} // Panggil fungsi edit
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-11 px-5 sm:h-12 sm:px-6 bg-primary hover:bg-primary-hover text-white text-sm font-bold tracking-wide transition-colors"
          >
            <span className="truncate">Edit Barang</span>
          </button>
        </div>
      </div>
       {/* CSS Animasi */}
    </div>
  );
}; //

export default ItemDetailModal; //