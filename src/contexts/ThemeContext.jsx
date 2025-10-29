// src/contexts/ThemeContext.jsx (Complete Code)
import React, { createContext, useContext, useState, useEffect } from 'react';

// Membuat context
const ThemeContext = createContext(null);

// Membuat provider
export const ThemeProvider = ({ children }) => {
  // State untuk menyimpan tema ('light' atau 'dark')
  const [theme, setTheme] = useState(() => {
    // 1. Cek localStorage saat aplikasi pertama kali dimuat
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme; // Gunakan tema yang tersimpan jika ada
    }
    // 2. Jika tidak ada di localStorage, cek preferensi sistem pengguna
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light'; // Set default berdasarkan sistem
  });

  // Efek untuk mengubah kelas pada elemen <html> dan menyimpan ke localStorage
  useEffect(() => {
    const root = window.document.documentElement; // Ambil elemen <html>

    // Hapus kelas sebelumnya (jika ada) dan tambahkan kelas tema saat ini
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);

    // Simpan pilihan tema ke localStorage setiap kali tema berubah
    localStorage.setItem('theme', theme);
  }, [theme]); // Jalankan efek ini setiap kali 'theme' berubah

  // Fungsi untuk mengganti tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Sediakan state 'theme' dan fungsi 'toggleTheme' ke komponen anak
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook untuk memudahkan penggunaan context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Pastikan hook digunakan di dalam provider
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};