// src/pages/ItemList.jsx (Refactored - Complete Code)
import React, { useState, useMemo } from 'react'; //
import { useNavigate } from 'react-router-dom'; //
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { useToastContext } from '../contexts/ToastContext'; // Import context toast
import DeleteConfirmModal from '../components/DeleteConfirmModal'; // Import modal
import ItemListEmptyState from '../components/ItemListEmptyState'; // Import komponen empty state
import ItemDetailModal from '../components/ItemDetailModal'; // Import modal detail
import CetakLabelModal from '../components/CetakLabelModal'; // Import modal cetak
import {
  MdAdd,
  MdSearch,
  MdExpandMore,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdChevronLeft,
  MdChevronRight,
  MdPrint,
  MdDownload,
  MdDeleteSweep,
} from 'react-icons/md'; //
import Papa from 'papaparse'; // Untuk export CSV

// Helper format mata uang (asumsikan sudah ada atau diimpor)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0); // Tambahkan default 0
}; //

// Helper download CSV (asumsikan sudah ada atau diimpor)
const downloadCSV = (csvString, fileName) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' }); //
  const link = document.createElement('a'); //
  const url = URL.createObjectURL(blob); //
  link.setAttribute('href', url); //
  link.setAttribute('download', fileName); //
  link.style.visibility = 'hidden'; //
  document.body.appendChild(link); //
  link.click(); //
  document.body.removeChild(link); //
}; //


const ItemList = () => {
  const { database, deleteItem, deleteBanyakItem, addLog } = useInventoryContext(); //
  const { showToast } = useToastContext(); //
  const navigate = useNavigate(); //

  // State Management
  const [selectedItems, setSelectedItems] = useState([]); // ID item yang dipilih
  const [searchTerm, setSearchTerm] = useState(''); // Teks pencarian
  const [filterKategori, setFilterKategori] = useState(''); // ID kategori yang difilter
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State modal hapus
  const [itemToDelete, setItemToDelete] = useState(null); // Item yang akan dihapus
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // State modal detail
  const [isCetakModalOpen, setIsCetakModalOpen] = useState(false); // State modal cetak
  const [selectedItemForModal, setSelectedItemForModal] = useState(null); // Item untuk modal detail/cetak

  // Helper mendapatkan nama kategori dari ID
  const getKategoriName = (kategoriId) => {
    // Pastikan database.kategori ada
    return database?.kategori?.find(k => k.id === kategoriId)?.nama || 'N/A';
  }; //

  // Logika Filter menggunakan useMemo untuk optimasi
  const filteredItems = useMemo(() => {
    // Pastikan database.items ada
    if (!database?.items) return [];
    return database.items
      .filter(item => {
        // Filter berdasarkan Kategori
        return filterKategori ? item.kategori === filterKategori : true;
      })
      .filter(item => {
        // Filter berdasarkan Pencarian (Nama Barang atau SKU)
        const searchLower = searchTerm.toLowerCase();
        // Tambahkan null check
        const namaBarangLower = item.namaBarang?.toLowerCase() || '';
        const skuLower = item.sku?.toLowerCase() || '';
        return (
          namaBarangLower.includes(searchLower) ||
          skuLower.includes(searchLower)
        );
      });
  }, [database?.items, searchTerm, filterKategori]); // Dependency array

  // Logika Checkbox All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Pilih semua ID dari item yang terfilter
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      // Kosongkan pilihan
      setSelectedItems([]);
    }
  }; //

  // Logika Checkbox Individual Item
  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id] // Toggle pilihan
    );
  }; //

  // Cek apakah semua item yang terfilter sudah dipilih
  const isAllSelected = filteredItems.length > 0 && selectedItems.length === filteredItems.length;

  // --- Handlers Modal Lanjutan ---
  const handleOpenDetailModal = (item) => {
    setSelectedItemForModal(item);
    setIsDetailModalOpen(true);
  }; //

  const handleOpenCetakModal = (item) => {
    setSelectedItemForModal(item);
    setIsCetakModalOpen(true);
  }; //

  // Menutup semua modal dan reset state
  const handleCloseModals = () => {
    setSelectedItemForModal(null);
    setIsDetailModalOpen(false);
    setIsCetakModalOpen(false);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  }; //

  // Handler tombol Edit dari dalam modal detail
  const handleEditFromDetail = () => {
    if (selectedItemForModal) {
      navigate(`/edit-barang/${selectedItemForModal.id}`); // Navigasi ke halaman edit
      handleCloseModals(); // Tutup modal
    }
  }; //

  // --- Handlers Modal Hapus ---
  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  }; //

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id); // Panggil fungsi hapus dari context
      showToast(`Barang "${itemToDelete.namaBarang}" berhasil dihapus.`, 'success');
      handleCloseModals(); // Tutup modal
      // Hapus item dari daftar item yang dipilih (jika ada)
      setSelectedItems(prev => prev.filter(id => id !== itemToDelete.id));
    }
  }; //

  // --- Helper Aksi Massal ---
  const handleExportCSV = () => {
    if (selectedItems.length === 0) {
      showToast('Pilih barang yang ingin diekspor.', 'warning');
      return;
    }
    // Filter data item yang dipilih
    const dataToExport = database.items
      .filter(item => selectedItems.includes(item.id))
      .map(item => ({ // Format data untuk CSV
        sku: item.sku,
        namaBarang: item.namaBarang,
        kategoriNama: getKategoriName(item.kategori), // Tambah nama kategori
        jumlah: item.jumlah,
        hargaBeli: item.hargaBeli,
        hargaJual: item.hargaJual,
        deskripsi: item.deskripsi
        // gambarUrl tidak diekspor
      }));

    // Konversi ke CSV menggunakan PapaParse
    const csv = Papa.unparse(dataToExport);
    downloadCSV(csv, 'export_barang_terpilih.csv'); // Panggil helper download
    addLog(`Mengekspor ${selectedItems.length} barang ke CSV.`); // Tambahkan log
    setSelectedItems([]); // Kosongkan pilihan setelah ekspor
  }; //

  const handleDeleteMany = () => {
    if (selectedItems.length === 0) {
      showToast('Pilih barang yang ingin dihapus.', 'warning');
      return;
    }
    // Tampilkan modal konfirmasi sebelum hapus banyak (opsional, tapi disarankan)
    // deleteBanyakItem(selectedItems); // Panggil fungsi hapus banyak
    // showToast(`${selectedItems.length} barang berhasil dihapus.`, 'success');
    // setSelectedItems([]); // Kosongkan pilihan

    // Contoh dengan konfirmasi sederhana (lebih baik pakai modal DeleteConfirmModal lagi)
    if (window.confirm(`Anda yakin ingin menghapus ${selectedItems.length} barang terpilih?`)) {
        deleteBanyakItem(selectedItems); // Panggil fungsi hapus banyak
        showToast(`${selectedItems.length} barang berhasil dihapus.`, 'success');
        setSelectedItems([]); // Kosongkan pilihan
    }
  }; //

  // --- Helper Tampilan Badge Stok (Refactored dengan warna semantik) ---
  const getStockBadge = (jumlah) => {
    const stock = Number(jumlah);
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-soft text-danger dark:bg-danger-soft/20">
          Habis
        </span>
      );
    }
    if (stock <= 10) { // Angka batas bisa disesuaikan
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-soft text-warning dark:bg-warning-soft/20">
          Menipis
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-soft text-success dark:bg-success-soft/20">
        Tersedia
      </span>
    );
  }; //

  // Tampilan "Empty State" jika tidak ada barang sama sekali
  // Pastikan database.items ada sebelum cek length
  if (!database?.items || database.items.length === 0) {
    // Pastikan ItemListEmptyState juga sudah di-refactor warnanya
    return <ItemListEmptyState />;
  } //

  // Render komponen utama
  return (
    <div className="flex flex-col gap-4">
      {/* Header Halaman */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          {/* Teks Header Semantik */}
          <h1 className="text-3xl font-bold text-text-dark dark:text-text-light">Daftar Barang</h1>
          <p className="text-text-secondary dark:text-text-secondary-light">Kelola semua barang di inventaris Anda.</p>
        </div>
        {/* Tombol Tambah Semantik */}
        <button
          onClick={() => navigate('/tambah-barang')}
          className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
        >
          <MdAdd size={20} />
          <span className="truncate">Tambah Barang</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4"> {/* Dibuat flex-col di mobile */}
        {/* Input Search Semantik */}
        <div className="relative flex-grow">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-light" size={20} />
          <input
            className="w-full pl-10 pr-4 py-2 border border-border dark:border-border-dark rounded-lg bg-input dark:bg-input-dark text-text-dark dark:text-text-light placeholder:text-text-secondary dark:placeholder:text-text-secondary-light focus:ring-primary focus:border-primary text-sm" // Ukuran font
            placeholder="Cari Nama Barang atau SKU"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Select Kategori Semantik */}
        <div className="relative flex-grow sm:flex-grow-0"> {/* Tidak grow di layar besar */}
          <select
            className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 border border-border dark:border-border-dark rounded-lg bg-input dark:bg-input-dark text-text-dark dark:text-text-light focus:ring-primary focus:border-primary text-sm" // Ukuran font
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
          >
            <option value="">Semua Kategori</option>
             {/* Pastikan database.kategori ada */}
            {database?.kategori?.map(k => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
          <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-light pointer-events-none" size={20} />
        </div>
      </div>

      {/* Bulk Action Bar (jika ada item dipilih) */}
      {selectedItems.length > 0 && (
         // Styling bar semantik
        <div className="flex flex-wrap items-center gap-4 p-4 bg-primary-soft dark:bg-primary-soft/20 rounded-lg border border-primary/50">
          <p className="text-sm font-medium text-primary">{selectedItems.length} item terpilih</p>
          {/* Tombol Ekspor Semantik */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 text-sm text-text-secondary dark:text-text-secondary-light hover:text-primary transition-colors"
          >
            <MdDownload size={16} /> Ekspor CSV
          </button>
           {/* Tombol Hapus Semantik */}
          <button
            onClick={handleDeleteMany}
            className="flex items-center gap-1 text-sm text-danger hover:text-danger/80 transition-colors"
          >
            <MdDeleteSweep size={16} /> Hapus Terpilih
          </button>
        </div>
      )}

      {/* Tabel */}
      {/* Container Tabel Semantik */}
      <div className="bg-card dark:bg-card-dark rounded-xl shadow-sm overflow-x-auto border border-border dark:border-border-dark"> {/* Tambah border */}
        <table className="w-full text-left min-w-[800px]"> {/* min-width untuk scroll horizontal */}
           {/* Header Tabel Semantik */}
          <thead className="bg-background-light dark:bg-background-dark/50 border-b border-border dark:border-border-dark">
            <tr>
              {/* Checkbox All */}
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  className="rounded border-border dark:border-border-dark text-primary focus:ring-primary bg-input dark:bg-input-dark focus:ring-offset-0" // Hapus offset
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all items" // Aksesibilitas
                />
              </th>
              {/* Kolom Header Semantik */}
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Gambar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Nama Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Harga Jual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
           {/* Body Tabel Semantik */}
          <tbody className="divide-y divide-border dark:divide-border-dark">
            {filteredItems.map((item) => (
               // Hover Baris Semantik
              <tr key={item.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                {/* Checkbox Item */}
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-border dark:border-border-dark text-primary focus:ring-primary bg-input dark:bg-input-dark focus:ring-offset-0"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    aria-label={`Select item ${item.namaBarang}`} // Aksesibilitas
                  />
                </td>
                {/* Kolom Gambar */}
                <td className="px-6 py-4">
                  <img
                    src={item.gambarUrl || 'https://via.placeholder.com/40'}
                    alt={item.namaBarang || 'Gambar barang'} // Fallback alt text
                    className="w-10 h-10 rounded-md object-cover bg-border-light dark:bg-border-dark" // Latar Semantik
                  />
                </td>
                 {/* Kolom Teks Semantik */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-dark dark:text-text-light">{item.namaBarang}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">{item.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">{getKategoriName(item.kategori)}</td>
                {/* Kolom Stok dengan Badge */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark dark:text-text-light">
                  {getStockBadge(item.jumlah)}
                  <span className="ml-2">{item.jumlah}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">{formatCurrency(item.hargaJual)}</td>
                {/* Kolom Aksi */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                     {/* Tombol Aksi Semantik */}
                    <button
                      onClick={() => handleOpenDetailModal(item)}
                      className="text-text-secondary dark:text-text-secondary-light hover:text-primary transition-colors"
                      title="Lihat Detail"
                    >
                      <MdVisibility size={20} />
                    </button>
                    <button
                      onClick={() => navigate(`/edit-barang/${item.id}`)}
                      className="text-text-secondary dark:text-text-secondary-light hover:text-primary transition-colors"
                      title="Edit Barang"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(item)}
                      className="text-text-secondary dark:text-text-secondary-light hover:text-danger transition-colors"
                      title="Hapus Barang"
                    >
                      <MdDelete size={20} />
                    </button>
                    <button
                      onClick={() => handleOpenCetakModal(item)}
                      className="text-text-secondary dark:text-text-secondary-light hover:text-primary transition-colors"
                      title="Cetak Label"
                    >
                      <MdPrint size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
             {/* Baris jika tidak ada hasil filter */}
             {filteredItems.length === 0 && (
                <tr>
                    <td colSpan={8} className="text-center py-10 text-text-secondary dark:text-text-secondary-light">
                        Tidak ada barang yang cocok dengan pencarian atau filter Anda.
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Placeholder) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2"> {/* Responsive gap */}
         {/* Teks Info Pagination Semantik */}
        <p className="text-sm text-text-secondary dark:text-text-secondary-light">
          Menampilkan {filteredItems.length} dari {database?.items?.length || 0} hasil
        </p>
        <div className="flex items-center gap-2">
           {/* Tombol Pagination Semantik */}
          <button className="p-2 rounded-md hover:bg-border-light dark:hover:bg-border-dark disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary dark:text-text-secondary-light" disabled>
            <MdChevronLeft size={20} />
          </button>
           {/* Nomor Halaman Semantik */}
          <span className="text-sm font-medium p-2 text-text-dark dark:text-text-light">1</span>
          <button className="p-2 rounded-md hover:bg-border-light dark:hover:bg-border-dark disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary dark:text-text-secondary-light" disabled>
            <MdChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Render Semua Modal (Pastikan modal juga di-refactor) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        judul="Hapus Barang?"
        pesan={`Anda yakin ingin menghapus barang "${itemToDelete?.namaBarang}"?`}
      />

      <ItemDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        item={selectedItemForModal}
        onEditClick={handleEditFromDetail}
      />

      <CetakLabelModal
        isOpen={isCetakModalOpen}
        onClose={handleCloseModals}
        item={selectedItemForModal}
      />
    </div>
  );
}; //

export default ItemList; //