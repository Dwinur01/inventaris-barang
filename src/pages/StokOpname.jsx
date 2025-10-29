// src/pages/StokOpname.jsx (Refactored - Complete Code)
import React, { useState, useEffect, useMemo } from 'react'; //
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { useToastContext } from '../contexts/ToastContext'; // Import context toast
import { MdSearch, MdExpandMore, MdAdd, MdPrint, MdTaskAlt } from 'react-icons/md'; //

const StokOpname = () => {
  const { database, updateBanyakItem } = useInventoryContext(); // Ambil data dan fungsi
  const { showToast } = useToastContext(); // Ambil fungsi toast

  // State Management
  const [opnameList, setOpnameList] = useState([]); // Daftar item untuk opname
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State modal konfirmasi
  const [searchTerm, setSearchTerm] = useState(''); // State pencarian
  const [filterKategori, setFilterKategori] = useState(''); // State filter kategori

  // Inisialisasi opnameList dari database.items saat komponen mount atau database.items berubah
  useEffect(() => {
    // Pastikan database.items ada
    if (!database?.items) return;
    const list = database.items.map(item => ({
      ...item, // Salin semua properti item
      stokSistem: Number(item.jumlah || 0), // Simpan stok asli (sistem) sebagai angka
      stokFisik: Number(item.jumlah || 0), // Stok fisik default ke stok sistem, sebagai angka
      selisih: 0, // Selisih awal adalah 0
    }));
    setOpnameList(list);
  }, [database?.items]); // Dependency: jalankan ulang jika database.items berubah

  // Handler saat nilai input stok fisik diubah
  const handleStokChange = (id, value) => {
    // Pastikan nilai yang dimasukkan adalah angka yang valid, default ke 0 jika tidak
    const nilaiFisik = Number(value) || 0;

    setOpnameList(prevList =>
      prevList.map(item => {
        if (item.id === id) {
          // Hitung selisih antara stok fisik baru dan stok sistem
          const selisih = nilaiFisik - item.stokSistem;
          // Update item yang sesuai dengan stok fisik dan selisih baru
          return { ...item, stokFisik: nilaiFisik, selisih: selisih };
        }
        return item; // Kembalikan item lain tanpa perubahan
      })
    );
  }; //

  // Logika Filter dan Pencarian (menggunakan useMemo untuk optimasi)
  const filteredList = useMemo(() => {
    // Pastikan database.kategori ada
    if (!database?.kategori) return opnameList; // Kembalikan list asli jika kategori belum siap
    return opnameList
      .filter(item => {
        // Filter berdasarkan Kategori
        const kategoriItem = database.kategori.find(k => k.id === item.kategori);
        // Tampilkan item jika tidak ada filter ATAU jika ID kategori item cocok
        return filterKategori ? kategoriItem?.id === filterKategori : true;
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
  }, [opnameList, searchTerm, filterKategori, database?.kategori]); // Dependencies

  // Handler untuk menyelesaikan proses stok opname
  const handleSelesaikan = () => {
    // 1. Filter item yang memiliki selisih (stok fisik != stok sistem)
    const itemsToUpdate = opnameList
      .filter(item => item.selisih !== 0)
      .map(item => ({
        id: item.id,
        jumlah: item.stokFisik, // Jumlah baru adalah stok fisik yang diinput
      }));

    // Jika tidak ada item yang berubah, beri tahu pengguna
    if (itemsToUpdate.length === 0) {
      showToast('Tidak ada perubahan stok yang terdeteksi.', 'info'); // Gunakan tipe 'info'
      setIsConfirmModalOpen(false); // Tutup modal
      return;
    }

    // 2. Panggil fungsi updateBanyakItem dari context
    try {
      updateBanyakItem(itemsToUpdate); // Fungsi ini sudah memanggil addLog
      showToast(`Stok untuk ${itemsToUpdate.length} barang berhasil disesuaikan.`, 'success');
      setIsConfirmModalOpen(false); // Tutup modal setelah berhasil
    } catch (error) {
      showToast('Gagal menyesuaikan stok.', 'error');
      console.error("Stock adjustment error:", error); // Log error
      // Modal tidak ditutup agar pengguna tahu ada masalah
    }
  }; //

  // Helper untuk styling warna teks selisih (menggunakan warna semantik)
  const getSelisihColor = (selisih) => {
    if (selisih < 0) return 'text-danger dark:text-danger/90'; // Merah jika negatif
    if (selisih > 0) return 'text-success dark:text-success/90'; // Hijau jika positif
    return 'text-text-secondary dark:text-text-secondary-light'; // Abu-abu jika nol
  }; //

  // Helper mendapatkan nama kategori (tetap sama)
  const getKategoriName = (kategoriId) => {
    return database?.kategori?.find(k => k.id === kategoriId)?.nama || 'N/A';
  }; //

  return (
    // Container layout diatur oleh Layout.jsx
    <div className="flex flex-col max-w-5xl flex-1 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-wrap justify-between items-center gap-4 p-4">
        {/* Teks Header Semantik */}
        <h1 className="text-3xl font-bold text-text-dark dark:text-text-light">Audit Stok</h1>
        <div className="flex flex-wrap items-center gap-4">
           {/* Tombol Aksi Semantik */}
          <button className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold border border-primary hover:bg-primary-hover transition-colors">
            <MdPrint size={20} />
            <span className="truncate">Print Report</span>
          </button>
          <button className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors">
            <MdAdd size={20} />
            <span className="truncate">Mulai Opname Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4"> {/* Responsive wrap */}
          {/* Input Search Semantik */}
          <div className="relative flex-grow">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-light" size={20} />
            <input
              className="w-full pl-10 pr-4 py-2 border border-border dark:border-border-dark rounded-lg bg-input dark:bg-input-dark text-text-dark dark:text-text-light placeholder:text-text-secondary dark:placeholder:text-text-secondary-light focus:ring-primary focus:border-primary text-sm"
              placeholder="Cari Nama Barang atau SKU"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Select Kategori Semantik */}
          <div className="relative flex-grow sm:flex-grow-0">
            <select
              className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 border border-border dark:border-border-dark rounded-lg bg-input dark:bg-input-dark text-text-dark dark:text-text-light focus:ring-primary focus:border-primary text-sm"
              value={filterKategori}
              onChange={e => setFilterKategori(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {database?.kategori?.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
            <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-light pointer-events-none" size={20} />
          </div>
        </div>
      </div>

      {/* Tabel Stok Opname */}
      <div className="p-4">
        {/* Container Tabel Semantik */}
        <div className="bg-card dark:bg-card-dark rounded-xl shadow-lg overflow-hidden border border-border dark:border-border-dark">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]"> {/* min-width */}
               {/* Header Tabel Semantik */}
              <thead className="bg-background-light dark:bg-background-dark/50 border-b border-border dark:border-border-dark">
                <tr>
                   {/* Kolom Header Semantik */}
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">Nama Barang</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider text-right">Stok Sistem</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider text-center">Stok Fisik</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary dark:text-text-secondary-light uppercase tracking-wider text-right">Selisih</th>
                </tr>
              </thead>
               {/* Body Tabel Semantik */}
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredList.map((item) => (
                   // Hover Baris Semantik
                  <tr key={item.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                     {/* Kolom Teks Semantik */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-dark dark:text-text-light">{item.namaBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-secondary-light text-right">{item.stokSistem}</td>
                    {/* Kolom Input Stok Fisik Semantik */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <input
                        className="w-20 rounded border border-border dark:border-border-dark bg-input dark:bg-input-dark text-center text-text-dark dark:text-text-light focus:ring-primary focus:border-primary py-1 px-2 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Styling input number
                        type="number"
                        min="0"
                        value={item.stokFisik} // Gunakan state stokFisik
                        onChange={(e) => handleStokChange(item.id, e.target.value)}
                      />
                    </td>
                     {/* Kolom Selisih Semantik */}
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${getSelisihColor(item.selisih)}`}>
                      {/* Tampilkan '+' jika positif */}
                      {item.selisih > 0 ? `+${item.selisih}` : item.selisih}
                    </td>
                  </tr>
                ))}
                {/* Baris jika tidak ada hasil filter */}
                {filteredList.length === 0 && opnameList.length > 0 && (
                    <tr>
                        <td colSpan={5} className="text-center py-10 text-text-secondary dark:text-text-secondary-light">
                            Tidak ada barang yang cocok dengan filter Anda.
                        </td>
                    </tr>
                )}
                 {/* Baris jika belum ada barang sama sekali */}
                {opnameList.length === 0 && (
                     <tr>
                        <td colSpan={5} className="text-center py-10 text-text-secondary dark:text-text-secondary-light">
                           Belum ada barang di inventaris untuk diaudit.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Tombol Aksi */}
      <div className="flex justify-end mt-6 p-4">
        <div className="flex flex-wrap gap-4">
           {/* Tombol Simpan Draf Semantik */}
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-border-light dark:bg-border-dark text-text-dark dark:text-text-light text-base font-bold hover:opacity-80 transition-opacity">
            <span className="truncate">Simpan Draf</span>
          </button>
           {/* Tombol Selesaikan Semantik */}
          <button
            onClick={() => setIsConfirmModalOpen(true)} // Buka modal konfirmasi
            disabled={opnameList.length === 0} // Disable jika tidak ada item
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-primary text-white text-base font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">Selesaikan & Sesuaikan Stok</span>
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi Selesaikan Opname (Refactored Semantik) */}
      {isConfirmModalOpen && (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           {/* Kontainer Modal */}
          <div className="relative w-full max-w-md p-6 mx-auto bg-card dark:bg-card-dark rounded-xl shadow-lg">
            <div className="text-center">
               {/* Ikon */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft dark:bg-success-soft/20">
                <MdTaskAlt className="text-primary" size={24} />
              </div>
               {/* Judul */}
              <h3 className="mt-4 text-lg font-medium leading-6 text-text-dark dark:text-text-light">
                Konfirmasi Audit Stok
              </h3>
               {/* Pesan */}
              <div className="mt-2">
                <p className="text-sm text-text-secondary dark:text-text-secondary-light">
                  Anda yakin ingin menyelesaikan audit stok dan menyesuaikan inventaris? Stok yang memiliki selisih akan diperbarui.
                </p>
              </div>
            </div>
             {/* Tombol Aksi Modal */}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
               {/* Tombol Konfirmasi */}
              <button
                onClick={handleSelesaikan}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-card-dark sm:col-start-2 sm:text-sm transition-colors"
                type="button"
              >
                Konfirmasi
              </button>
               {/* Tombol Batal */}
              <button
                onClick={() => setIsConfirmModalOpen(false)} // Tutup modal
                className="mt-3 inline-flex w-full justify-center rounded-md border border-border dark:border-border-dark bg-card dark:bg-card-dark px-4 py-2 text-base font-medium text-text-dark dark:text-text-light shadow-sm hover:bg-background-light dark:hover:bg-background-dark/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-card-dark sm:mt-0 sm:col-start-1 sm:text-sm transition-colors"
                type="button"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; //

export default StokOpname; //