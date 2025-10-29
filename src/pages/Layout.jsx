// src/pages/Layout.jsx (Refactored - Complete Code)
import React, { useState } from 'react'; // Impor useState untuk state sidebar
import { NavLink, Outlet } from 'react-router-dom'; //
import { useTheme } from '../contexts/ThemeContext'; // Import hook tema
import {
  MdDashboard,
  MdInventory2,
  MdAddCircle,
  MdGroup,
  MdLocalShipping,
  MdShoppingCart,
  MdAnalytics,
  MdHome,
  MdSearch,
  MdNotifications,
  MdLightMode,
  MdDarkMode,
  MdSettings,
  MdPerson,
  MdBook,
  MdImportExport,
  MdFactCheck,
  MdMenu, // Ikon baru untuk tombol hamburger
  MdClose // Ikon baru (opsional, jika diperlukan)
} from 'react-icons/md'; //
import ToastContainer from '../components/ToastContainer'; //

// Data Navigasi Sidebar (tetap sama)
const navLinks = [
  { to: "/dashboard", icon: MdDashboard, text: "Dashboard" },
  { to: "/", icon: MdInventory2, text: "Daftar Barang" },
  { to: "/tambah-barang", icon: MdAddCircle, text: "Tambah Barang" },
  { to: "/impor-barang", icon: MdImportExport, text: "Impor Barang" },
  { to: "/stok-opname", icon: MdFactCheck, text: "Stok Opname" },
  { to: "/order", icon: MdShoppingCart, text: "Order Management" },
  { to: "/supplier", icon: MdLocalShipping, text: "Supplier Management" },
  { to: "/user", icon: MdGroup, text: "User Management" },
  { to: "/log-aktivitas", icon: MdBook, text: "Log Aktivitas" },
  { to: "/pengaturan", icon: MdSettings, text: "Pengaturan" },
  { to: "/profil", icon: MdPerson, text: "Profil" },
]; //

const Layout = () => {
  const { theme, toggleTheme } = useTheme(); // Dapatkan state tema dan fungsi toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk mengontrol sidebar mobile

  return (
    // Container utama dengan warna latar belakang semantik
    <div className="relative flex h-screen w-full flex-row overflow-hidden bg-background dark:bg-background-dark font-inter">

      {/* Overlay untuk Mobile (muncul saat sidebar terbuka) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden" // Hanya tampil di mobile
          onClick={() => setIsSidebarOpen(false)} // Tutup sidebar saat overlay diklik
        ></div>
      )}

      {/* Sidebar */}
      <div
        // Styling dasar sidebar + warna semantik + transisi
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r bg-card dark:bg-card-dark border-border dark:border-border-dark transition-transform duration-300 ease-in-out
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} // Logika buka/tutup di mobile
      >
        {/* Header Sidebar */}
        <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-border dark:border-border-dark">
          <div className="text-primary">
            <MdInventory2 size={32} />
          </div>
          {/* Teks semantik */}
          <h1 className="text-xl font-bold text-text-dark dark:text-text-light">GudangJaya</h1>
        </div>

        {/* Navigasi Sidebar */}
        <nav className="flex-1 flex-col gap-2 p-4 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"} // Prop 'end' untuk NavLink root
              // Styling link + state aktif + warna semantik
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white' // Aktif: Latar primary, teks putih
                    : 'text-text-secondary dark:text-text-secondary-light hover:bg-background dark:hover:bg-background-dark hover:text-text-dark dark:hover:text-text-light' // Tidak aktif: Teks sekunder, hover ubah latar & teks
                }`
              }
              onClick={() => setIsSidebarOpen(false)} // Tutup sidebar saat link diklik (di mobile)
            >
              <link.icon size={20} />
              <p>{link.text}</p>
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar (Toggle Tema) */}
        <div className="mt-auto p-4 border-t border-border dark:border-border-dark">
          {/* Latar tombol semantik */}
          <div className="flex items-center justify-between rounded-lg bg-background dark:bg-background-dark p-2">
            {/* Tombol Dark */}
            <button
              onClick={toggleTheme} // Panggil fungsi toggle
              // Styling + state aktif/tidak aktif + warna semantik
              className={`flex w-1/2 items-center justify-center gap-2 rounded-md p-2 text-sm transition-colors ${
                theme === 'dark'
                  ? 'bg-card-dark text-primary font-semibold shadow-sm' // Aktif (Dark): Latar gelap, teks primary
                  : 'text-text-secondary dark:text-text-secondary-light hover:bg-border-light dark:hover:bg-border-dark hover:text-text-dark dark:hover:text-text-light' // Tidak aktif
              }`}
              aria-pressed={theme === 'dark'} // Aksesibilitas
            >
              <MdDarkMode size={16} />
              <span>Dark</span>
            </button>
            {/* Tombol Light */}
            <button
              onClick={toggleTheme} // Panggil fungsi toggle
              // Styling + state aktif/tidak aktif + warna semantik
              className={`flex w-1/2 items-center justify-center gap-2 rounded-md p-2 text-sm transition-colors ${
                theme === 'light'
                  ? 'bg-card-light text-primary font-semibold shadow-sm' // Aktif (Light): Latar terang, teks primary
                  : 'text-text-secondary dark:text-text-secondary-light hover:bg-border-light dark:hover:bg-border-dark hover:text-text-dark dark:hover:text-text-light' // Tidak aktif
              }`}
              aria-pressed={theme === 'light'} // Aksesibilitas
            >
              <MdLightMode size={16} />
              <span>Light</span>
            </button>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      {/* Padding kiri untuk desktop (setelah sidebar) */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Header Utama */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-card dark:bg-card-dark border-border dark:border-border-dark px-4 sm:px-8">

          {/* Tombol Hamburger Mobile */}
          <button
            className="md:hidden text-text-secondary dark:text-text-secondary-light hover:text-text-dark dark:hover:text-text-light" // Tampil hanya di mobile
            onClick={() => setIsSidebarOpen(true)} // Buka sidebar
          >
            <MdMenu size={24} />
          </button>

          {/* Search Bar (hanya di desktop) */}
          <div className="hidden flex-1 md:flex ml-4"> {/* Sembunyikan di mobile, beri margin kiri */}
            <label className="flex w-full max-w-sm flex-col">
              <div className="relative flex h-10 w-full flex-1 items-stretch">
                <div className="absolute left-0 top-0 flex h-full items-center pl-4">
                  {/* Ikon search semantik */}
                  <MdSearch className="text-text-secondary dark:text-text-secondary-light text-xl" />
                </div>
                 {/* Input search semantik */}
                <input
                  className="form-input w-full min-w-0 flex-1 rounded-full border bg-input dark:bg-input-dark border-border dark:border-border-dark text-text-dark dark:text-text-light placeholder:text-text-secondary dark:placeholder:text-text-secondary-light focus:border-primary focus:ring-primary/50 pl-12 pr-4 text-sm"
                  placeholder="Cari SKU atau nama..."
                />
              </div>
            </label>
          </div>

          {/* Ikon Header Kanan */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Tombol Search Mobile (Opsional) */}
             <button className="md:hidden flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-secondary dark:text-text-secondary-light hover:bg-background dark:hover:bg-background-dark/50">
              <MdSearch size={24} />
            </button>
            {/* Tombol Notifikasi */}
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-secondary dark:text-text-secondary-light hover:bg-background dark:hover:bg-background-dark/50">
              <MdNotifications size={24} />
            </button>
            {/* Tombol Toggle Tema Header */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-secondary dark:text-text-secondary-light hover:bg-background dark:hover:bg-background-dark/50"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} // Aksesibilitas
            >
              {theme === 'light' ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
            </button>
            {/* Avatar Pengguna */}
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-border dark:bg-border-dark" // Latar avatar semantik
              title="User avatar image"
              // style={{ backgroundImage: 'url("...")' }} // URL bisa dari context
            ></div>
          </div>
        </header>

        {/* Area Konten Halaman */}
        <main className="flex-1 overflow-y-auto bg-background dark:bg-background-dark p-4 sm:p-8">
          {/* Outlet adalah tempat halaman (Dashboard, ItemList, dll.) akan di-render */}
          <Outlet />
        </main>
      </div>

      {/* Container Toast (sudah di-refactor sebelumnya) */}
      <ToastContainer />
    </div>
  );
};

export default Layout; //