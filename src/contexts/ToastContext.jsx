// src/contexts/ToastContext.jsx (Complete Code)
import React, { createContext, useContext, useState, useCallback } from 'react'; // Import useCallback
import { v4 as uuidv4 } from 'uuid'; // Untuk ID unik

// Buat context
const ToastContext = createContext(null);

// Buat provider
export const ToastProvider = ({ children }) => {
  // State untuk menyimpan daftar toast yang aktif
  const [toasts, setToasts] = useState([]);

  // Fungsi untuk menampilkan toast baru
  // useCallback digunakan agar fungsi ini tidak dibuat ulang di setiap render kecuali dependensinya berubah (dalam hal ini tidak ada)
  const showToast = useCallback((pesan, tipe = 'success', durasi = 3000) => { // Tambah parameter durasi
    const id = uuidv4(); // Buat ID unik untuk toast
    // Tambahkan toast baru ke state
    setToasts((prevToasts) => [...prevToasts, { id, pesan, tipe }]);

    // Atur timer untuk menghapus toast setelah durasi tertentu
    setTimeout(() => {
      // Panggil fungsi removeToast setelah durasi
      removeToast(id);
    }, durasi); // Gunakan durasi dari parameter
  }, []); // Dependency array kosong

  // Fungsi untuk menghapus toast berdasarkan ID
  // useCallback digunakan di sini juga
  const removeToast = useCallback((id) => {
    // Filter keluar toast dengan ID yang cocok
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []); // Dependency array kosong

  // Sediakan state 'toasts', fungsi 'showToast', dan 'removeToast' ke komponen anak
  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook untuk memudahkan penggunaan context
export const useToastContext = () => {
  const context = useContext(ToastContext);
  // Pastikan hook digunakan di dalam provider
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};