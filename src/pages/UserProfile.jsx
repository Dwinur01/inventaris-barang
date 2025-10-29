// src/pages/UserProfile.jsx (Refactored - Complete Code)
import React, { useState, useEffect } from 'react'; //
import { useInventoryContext } from '../contexts/InventoryContext'; // Import context inventaris
import { useToastContext } from '../contexts/ToastContext'; // Import context toast

const UserProfile = () => {
  const { database, updateUser } = useInventoryContext(); // Ambil data dan fungsi update
  const { showToast } = useToastContext(); // Ambil fungsi toast

  // --- MOCK LOGIN: Ambil user pertama sebagai currentUser ---
  // Di aplikasi nyata, Anda akan mendapatkan currentUser dari state login/autentikasi
  const currentUser = useMemo(() => database?.users?.[0], [database?.users]);
  // -----------------------------------------------------------

  // State untuk data form dan tab aktif
  const [formData, setFormData] = useState(null); // Data form (diambil dari currentUser)
  const [activeTab, setActiveTab] = useState('Personal'); // Tab yang sedang aktif

  // Efek untuk mengisi form saat currentUser berubah atau ada
  useEffect(() => {
    if (currentUser) {
      // Isi form dengan data currentUser, beri fallback jika ada data null/undefined
      setFormData({
        id: currentUser.id,
        namaLengkap: currentUser.namaLengkap || '',
        email: currentUser.email || '',
        telepon: currentUser.telepon || '',
      });
    } else {
      // Jika tidak ada currentUser (misal belum login), reset form
      setFormData(null);
      // Mungkin redirect ke halaman login di sini
    }
  }, [currentUser]); // Jalankan efek saat currentUser berubah

  // Handler untuk perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Logika khusus untuk memisahkan/menggabungkan nama depan & belakang
    if (name === 'firstName') {
      // Ambil lastName dari state saat ini
      const currentLastName = formData.namaLengkap.split(' ').slice(1).join(' ');
      // Gabungkan firstName baru dengan lastName lama
      setFormData(prev => ({ ...prev, namaLengkap: `${value.trim()} ${currentLastName}`.trim() }));
    } else if (name === 'lastName') {
      // Ambil firstName dari state saat ini
      const currentFirstName = formData.namaLengkap.split(' ')[0] || '';
      // Gabungkan firstName lama dengan lastName baru
      setFormData(prev => ({ ...prev, namaLengkap: `${currentFirstName} ${value.trim()}`.trim() }));
    } else {
      // Untuk input lain (email, telepon), update langsung
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }; //

  // Handler saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload
    // Pastikan currentUser dan formData ada
    if (!currentUser || !formData) return;

    // Gabungkan data form (yang bisa diedit) dengan data user asli (yang tidak bisa diedit di form ini, cth: role, password)
    const userToUpdate = {
        ...currentUser, // Ambil semua data asli
        namaLengkap: formData.namaLengkap.trim(), // Update namaLengkap (trim spasi)
        email: formData.email, // Email tidak diedit, tapi pastikan ada
        telepon: formData.telepon, // Update telepon
    };

    // Validasi sederhana (misal nama tidak boleh kosong)
    if (!userToUpdate.namaLengkap) {
        showToast("Nama lengkap tidak boleh kosong.", "warning");
        return;
    }

    try {
      updateUser(userToUpdate); // Panggil fungsi update dari context
      showToast('Profil berhasil diperbarui.', 'success');
      // Tidak perlu navigate, tetap di halaman profil
    } catch (error) {
       showToast('Gagal memperbarui profil.', 'error');
       console.error("Profile update error:", error);
    }
  }; //

  // Tampilkan pesan loading jika data form belum siap
  if (!formData) {
    return (
      <div className="flex-1 p-8 text-text-secondary dark:text-text-secondary-light">
        Memuat profil pengguna...
      </div>
    );
  } //

  // Ambil nama depan dan belakang dari namaLengkap untuk ditampilkan di input terpisah
  const nameParts = formData.namaLengkap.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    // Container layout diatur oleh Layout.jsx
    <div className="flex-1">
      {/* Header Halaman */}
      <div className="mb-8">
         {/* Teks Header Semantik */}
        <p className="text-4xl font-black tracking-[-0.033em] text-text-dark dark:text-text-light">
          User Profile
        </p>
      </div>

      {/* Tabs Semantik */}
      <div className="pb-3">
        <div className="flex border-b border-border dark:border-border-dark gap-8">
           {/* Tombol Tab Personal */}
          <button
            onClick={() => setActiveTab('Personal')}
            className={`flex flex-col items-center justify-center border-b-[3px] ${
              activeTab === 'Personal'
                ? 'border-primary text-primary' // Aktif
                : 'border-transparent text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light' // Tidak Aktif
            } pb-[13px] pt-4 transition-colors`}
          >
            <p className="text-sm font-bold tracking-[0.015em]">Personal Information</p>
          </button>
          {/* Tombol Tab Password */}
          <button
            onClick={() => setActiveTab('Password')}
            className={`flex flex-col items-center justify-center border-b-[3px] ${
              activeTab === 'Password'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light'
            } pb-[13px] pt-4 transition-colors`}
          >
            <p className="text-sm font-bold tracking-[0.015em]">Change Password</p>
          </button>
           {/* Tombol Tab Notifikasi */}
          <button
            onClick={() => setActiveTab('Notif')}
            className={`flex flex-col items-center justify-center border-b-[3px] ${
              activeTab === 'Notif'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light'
            } pb-[13px] pt-4 transition-colors`}
          >
            <p className="text-sm font-bold tracking-[0.015em]">Notifications</p>
          </button>
        </div>
      </div>

      {/* Konten Tab Personal */}
      {activeTab === 'Personal' && (
        <div className="mt-8 space-y-8"> {/* Beri jarak antar elemen */}
          {/* Header Profil Semantik */}
          <div className="flex p-4 bg-card dark:bg-card-dark rounded-xl shadow">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-6">
                 {/* Avatar Semantik */}
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 bg-border dark:bg-border-dark">
                  {/* Gambar profil bisa ditambahkan di sini */}
                </div>
                <div className="flex flex-col justify-center">
                   {/* Teks Info Semantik */}
                  <p className="text-2xl font-bold tracking-tight text-text-dark dark:text-text-light">{formData.namaLengkap}</p>
                  <p className="text-base text-text-secondary dark:text-text-secondary-light">{formData.email}</p>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-light mt-1">Role: {currentUser.role}</p> {/* Tampilkan Role */}
                </div>
              </div>
               {/* Tombol Upload Semantik */}
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-background dark:bg-background-dark/50 text-text-dark dark:text-text-light text-sm font-bold hover:opacity-80 transition-opacity">
                <span className="truncate">Upload new picture</span>
              </button>
            </div>
          </div>

          {/* Form Informasi Personal Semantik */}
          <div className="bg-card dark:bg-card-dark p-6 md:p-8 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-6 text-text-dark dark:text-text-light">Edit Informasi Personal</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input First Name */}
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">First Name</p>
                  <input
                    name="firstName"
                    className="form-input rounded-lg border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-base text-text-dark dark:text-text-light focus:ring-primary focus:border-primary"
                    value={firstName}
                    onChange={handleChange}
                    required
                  />
                </label>
                {/* Input Last Name */}
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Last Name</p>
                  <input
                    name="lastName"
                     className="form-input rounded-lg border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-base text-text-dark dark:text-text-light focus:ring-primary focus:border-primary"
                    value={lastName}
                    onChange={handleChange}
                     // Tidak wajib, nama belakang bisa kosong
                  />
                </label>
                {/* Input Email (Readonly) */}
                <label className="flex flex-col md:col-span-2"> {/* Lebarkan di desktop */}
                  <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Email</p>
                   {/* Input Readonly Semantik */}
                  <input
                    name="email"
                    type="email" // Tipe email
                    className="form-input rounded-lg border-border dark:border-border-dark bg-background dark:bg-background-dark/50 text-text-secondary dark:text-text-secondary-light h-12 p-3 text-base cursor-not-allowed"
                    readOnly // Tidak bisa diedit
                    value={formData.email}
                  />
                </label>
                {/* Input Phone Number */}
                <label className="flex flex-col md:col-span-2">
                  <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Phone Number</p>
                  <input
                    name="telepon"
                    type="tel" // Tipe telepon
                    className="form-input rounded-lg border-border dark:border-border-dark bg-input dark:bg-input-dark h-12 p-3 text-base text-text-dark dark:text-text-light focus:ring-primary focus:border-primary"
                    value={formData.telepon}
                    onChange={handleChange}
                    placeholder="Masukkan nomor telepon"
                  />
                </label>
              </div>
              {/* Tombol Simpan */}
              <div className="mt-8 flex justify-end">
                 {/* Tombol Submit Semantik */}
                <button
                  type="submit"
                  className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
                >
                  <span className="truncate">Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Placeholder untuk Tab Lain */}
      {activeTab !== 'Personal' && (
        // Kartu Semantik
        <div className="mt-8 p-8 bg-card dark:bg-card-dark rounded-xl shadow">
           {/* Teks Semantik */}
          <p className="text-lg text-text-secondary dark:text-text-secondary-light">Fitur untuk tab '{activeTab}' belum diimplementasikan.</p>
          {/* Contoh placeholder untuk ganti password */}
          {activeTab === 'Password' && (
             <form className="mt-6 space-y-4 max-w-md">
                 <label className="flex flex-col">
                  <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Password Lama</p>
                  <input type="password" disabled className="form-input rounded-lg border-border dark:border-border-dark bg-background dark:bg-background-dark/50 h-12 p-3 cursor-not-allowed"/>
                 </label>
                 <label className="flex flex-col">
                  <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Password Baru</p>
                  <input type="password" disabled className="form-input rounded-lg border-border dark:border-border-dark bg-background dark:bg-background-dark/50 h-12 p-3 cursor-not-allowed"/>
                 </label>
                  <label className="flex flex-col">
                  <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-light pb-2">Konfirmasi Password Baru</p>
                  <input type="password" disabled className="form-input rounded-lg border-border dark:border-border-dark bg-background dark:bg-background-dark/50 h-12 p-3 cursor-not-allowed"/>
                 </label>
                  <button type="button" disabled className="flex min-w-[120px] cursor-not-allowed items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold opacity-50 mt-4">
                    Ganti Password
                </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}; //

export default UserProfile; //