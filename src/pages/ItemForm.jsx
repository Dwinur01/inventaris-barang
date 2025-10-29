// src/pages/ItemForm.jsx (Refactored - Complete Code)
import React, { useState, useEffect } from 'react'; //
import { useParams, useNavigate } from 'react-router-dom'; //
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { useToastContext } from '../contexts/ToastContext'; // Import context toast
import { MdCloudUpload, MdImage } from 'react-icons/md'; //

const ItemForm = () => {
  const { id } = useParams(); // Ambil ID dari URL (jika ada, berarti mode Edit)
  const navigate = useNavigate(); // Hook untuk navigasi
  const { database, addItem, updateItem } = useInventoryContext(); // Ambil data dan fungsi dari context
  const { showToast } = useToastContext(); // Ambil fungsi showToast

  const isEditMode = Boolean(id); // Tentukan apakah ini mode Tambah atau Edit

  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    namaBarang: '',
    sku: '',
    kategori: '',
    jumlah: 0,
    hargaBeli: 0,
    hargaJual: 0,
    deskripsi: '',
    gambarUrl: '', // Akan menyimpan string Base64 untuk gambar
  }); //

  // Jika mode Edit, ambil data barang yang sesuai dan isi form
  useEffect(() => {
    if (isEditMode && database.items) { // Pastikan database.items ada
      const itemToEdit = database.items.find((item) => item.id === id);
      if (itemToEdit) {
        setFormData(itemToEdit); // Isi form dengan data barang
      } else {
        // Jika barang dengan ID tersebut tidak ditemukan
        showToast('Barang tidak ditemukan.', 'error');
        navigate('/'); // Kembali ke daftar barang
      }
    } else if (!isEditMode) {
      // Reset form jika beralih dari mode edit ke tambah (misalnya via navigasi)
      setFormData({
        namaBarang: '', sku: '', kategori: '', jumlah: 0,
        hargaBeli: 0, hargaJual: 0, deskripsi: '', gambarUrl: ''
      });
    }
  }, [id, isEditMode, database.items, navigate, showToast]); // Dependency array

  // Handler untuk perubahan input form biasa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Konversi ke number jika input type number, kecuali kategori
      [name]: (name === 'jumlah' || name === 'hargaBeli' || name === 'hargaJual')
               ? Number(value) // Pastikan dikonversi ke Angka
               : value,
    }));
  }; //

  // Handler untuk upload gambar
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simpan gambar sebagai string Base64
        setFormData((prev) => ({
          ...prev,
          gambarUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file); // Baca file sebagai Data URL (Base64)
    }
  }; //

  // Handler saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    // Validasi sederhana (contoh: pastikan kategori dipilih)
    if (!formData.kategori) {
        showToast('Silakan pilih kategori barang.', 'warning');
        return;
    }
    try {
      if (isEditMode) {
        updateItem(formData); // Panggil fungsi update dari context
        showToast(`Barang "${formData.namaBarang}" berhasil diperbarui.`, 'success');
      } else {
        addItem(formData); // Panggil fungsi add dari context (ID akan dibuat di hook)
        showToast(`Barang "${formData.namaBarang}" berhasil ditambahkan.`, 'success');
      }
      navigate('/'); // Kembali ke daftar barang setelah berhasil
    } catch (error) {
      showToast('Terjadi kesalahan saat menyimpan barang.', 'error');
      console.error("Save item error:", error); // Log error ke console
    }
  }; //

  return (
    // Container layout diatur oleh Layout.jsx
    <div className="flex h-full grow flex-col">
      {/* Header Halaman */}
      <div className="flex flex-wrap justify-between gap-3 mb-8">
        <div className="flex flex-col gap-1">
          {/* Teks Header Semantik */}
          <h1 className="text-text-dark dark:text-text-light text-3xl font-bold leading-tight tracking-tight font-display">
            {isEditMode ? 'Edit Barang' : 'Tambah Barang Baru'}
          </h1>
          <p className="text-text-secondary dark:text-text-secondary-light text-base font-normal leading-normal">
            {isEditMode
              ? 'Perbarui detail item di inventaris.'
              : 'Isi detail untuk menambahkan item baru ke inventaris.'}
          </p>
        </div>
      </div>

      {/* Form Utama */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Form Kiri (Input Utama) */}
          {/* Latar Kartu Semantik */}
          <div className="lg:col-span-2 bg-card dark:bg-card-dark rounded-xl shadow-sm p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Nama Barang */}
              <label className="flex flex-col col-span-1 md:col-span-2"> {/* Lebarkan di mobile */}
                {/* Label Semantik */}
                <p className="text-text-dark dark:text-text-light text-sm font-medium pb-2">Nama Barang</p>
                 {/* Input Semantik */}
                <input
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 placeholder:text-text-secondary dark:placeholder:text-text-secondary-light px-4 text-sm"
                  name="namaBarang"
                  value={formData.namaBarang}
                  onChange={handleChange}
                  placeholder="Contoh: Kemeja Lengan Panjang Polos"
                  required // Wajib diisi
                />
              </label>
              {/* Input SKU */}
              <label className="flex flex-col col-span-1">
                <p className="text-text-dark dark:text-text-light text-sm font-medium pb-2">SKU</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 placeholder:text-text-secondary dark:placeholder:text-text-secondary-light px-4 text-sm"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Contoh: KLP-001-XL"
                  required
                />
              </label>
              {/* Input Kategori */}
              <label className="flex flex-col col-span-1">
                <p className="text-text-dark dark:text-text-light text-sm font-medium pb-2">Kategori</p>
                 {/* Select Semantik */}
                <select
                  className="form-select appearance-none flex w-full min-w-0 flex-1 rounded-lg text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 placeholder:text-text-secondary dark:placeholder:text-text-secondary-light px-4 text-sm"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  required // Wajib dipilih
                >
                  <option value="">Pilih Kategori</option>
                  {/* Pastikan database.kategori ada sebelum map */}
                  {database?.kategori?.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
                {/* Tambahkan ikon dropdown jika diinginkan */}
                {/* <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-light pointer-events-none" size={20} /> */}
              </label>
              {/* Input Jumlah */}
              <label className="flex flex-col col-span-1">
                <p className="text-text-dark dark:text-text-light text-sm font-medium pb-2">Jumlah</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 placeholder:text-text-secondary dark:placeholder:text-text-secondary-light px-4 text-sm"
                  name="jumlah"
                  type="number"
                  min="0" // Tidak boleh negatif
                  value={formData.jumlah}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </label>
              {/* Input Harga Beli */}
              <label className="flex flex-col col-span-1">
                <p className="text-text-dark dark:text-text-light text-sm font-medium pb-2">Harga Beli</p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary dark:text-text-secondary-light">Rp</span>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 rounded-lg text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 placeholder:text-text-secondary dark:placeholder:text-text-secondary-light pl-10 pr-4 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Sembunyikan panah number input
                    name="hargaBeli"
                    type="number"
                    min="0"
                    value={formData.hargaBeli}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </label>
              {/* Input Harga Jual */}
              <label className="flex flex-col col-span-1">
                <p className="text-text-dark dark:text-text-light text-sm font-medium pb-2">Harga Jual</p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary dark:text-text-secondary-light">Rp</span>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 rounded-lg text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 placeholder:text-text-secondary dark:placeholder:text-text-secondary-light pl-10 pr-4 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    name="hargaJual"
                    type="number"
                    min="0"
                    value={formData.hargaJual}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </label>
              {/* Input Deskripsi */}
              <div className="col-span-1 md:col-span-2"> {/* Lebarkan di mobile */}
                <label className="flex flex-col">
                  <p className="text-text-dark dark:text-text-light text-sm font-medium pb-2">Deskripsi</p>
                   {/* Textarea Semantik */}
                  <textarea
                    className="form-textarea flex w-full min-w-0 flex-1 rounded-lg text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border dark:border-border-dark bg-input dark:bg-input-dark min-h-32 placeholder:text-text-secondary dark:placeholder:text-text-secondary-light p-4 text-sm"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    placeholder="Tulis deskripsi singkat mengenai barang..."
                    rows={4} // Atur tinggi awal
                  ></textarea>
                </label>
              </div>
            </div>
          </div>

          {/* Kolom Kanan (Upload Gambar) */}
          <div className="lg:col-span-1 bg-card dark:bg-card-dark rounded-xl shadow-sm p-6 md:p-8 h-fit">
            <h2 className="text-lg font-semibold text-text-dark dark:text-text-light mb-4 font-display">Gambar Barang</h2>
            {/* Area Dropzone Semantik */}
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border dark:border-border-dark rounded-lg cursor-pointer bg-input dark:bg-input-dark hover:bg-border-light dark:hover:bg-border-dark transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                 {/* Ikon Semantik */}
                <MdCloudUpload className="text-4xl text-text-secondary dark:text-text-secondary-light mb-2" />
                 {/* Teks Semantik */}
                <p className="mb-1 text-sm text-text-secondary dark:text-text-secondary-light"><span className="font-semibold text-primary">Klik untuk unggah</span></p>
                <p className="text-xs text-text-secondary dark:text-text-secondary-light">atau seret file ke sini</p>
                <p className="text-xs text-text-secondary dark:text-text-secondary-light mt-1">PNG, JPG, GIF (MAX. 800x400px)</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/gif" // Tipe file yang diterima
                onChange={handleImageUpload}
              />
            </label>

            {/* Pratinjau Gambar */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-text-secondary dark:text-text-secondary-light mb-2">Pratinjau:</h3>
               {/* Container Pratinjau Semantik */}
              <div className="w-full h-32 bg-input dark:bg-input-dark rounded-md flex items-center justify-center border border-border dark:border-border-dark overflow-hidden">
                {formData.gambarUrl ? (
                    // Tampilkan gambar jika ada
                    <img src={formData.gambarUrl} alt="Pratinjau" className="h-full w-full object-cover" />
                ) : (
                    // Tampilkan ikon placeholder jika tidak ada gambar
                    <MdImage className="text-text-secondary dark:text-text-secondary-light" size={40} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi Form */}
        <div className="flex justify-end gap-4 mt-8">
          {/* Tombol Batal Semantik */}
          <button
            type="button"
            onClick={() => navigate('/')} // Kembali ke halaman sebelumnya
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-border-light dark:bg-border-dark hover:opacity-80 text-text-dark dark:text-text-light text-sm font-bold leading-normal tracking-wide transition-opacity"
          >
            <span className="truncate">Batal</span>
          </button>
           {/* Tombol Simpan Semantik */}
          <button
            type="submit"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-primary-hover text-white text-sm font-bold leading-normal tracking-wide transition-colors"
          >
            <span className="truncate">{isEditMode ? 'Simpan Perubahan' : 'Simpan Barang'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}; //

export default ItemForm; //