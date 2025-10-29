// tailwind.config.js (Refactored for Dark Mode - Complete Code)
/** @type {import('tailwindcss').Config} */
export default {
  // Aktifkan mode gelap berbasis kelas
  darkMode: 'class',

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna Primer
        primary: {
          DEFAULT: '#10B981', // Hijau utama
          hover: '#0F9669',   // Versi lebih gelap untuk hover
          soft: '#E7F8F2',    // Latar belakang/badge soft
        },

        // Warna Teks
        text: {
          DEFAULT: '#111827',  // dark:text-text -> Teks terang di mode gelap
          dark: '#111827',     // Teks utama di mode terang
          light: '#F9FAFB',    // Teks utama di mode gelap
          secondary: '#6B7280', // dark:text-text-secondary -> Teks sekunder terang
          'secondary-dark': '#6B7280', // Teks sekunder di mode terang
          'secondary-light': '#9CA3AF',// Teks sekunder di mode gelap
        },

        // Warna Latar Belakang
        background: {
          DEFAULT: '#F9FAFB',      // dark:bg-background -> Latar utama gelap
          light: '#F9FAFB',        // Latar utama di mode terang
          dark: '#111827',        // Latar utama di mode gelap
        },

        // Warna Kartu/Modal
        card: {
          DEFAULT: '#FFFFFF',     // dark:bg-card -> Latar kartu gelap
          light: '#FFFFFF',       // Latar kartu di mode terang
          dark: '#1F2937',      // Latar kartu di mode gelap
        },

        // Warna Input Form
        input: {
          DEFAULT: '#F9FAFB',      // dark:bg-input -> Latar input gelap
          light: '#F9FAFB',        // Latar input di mode terang
          dark: '#374151',      // Latar input di mode gelap
        },

        // Warna Border
        border: {
          DEFAULT: '#E5E7EB',     // dark:border-border -> Border gelap
          light: '#E5E7EB',       // Border di mode terang
          dark: '#4B5563',      // Border di mode gelap
        },

        // Warna Aksen
        danger: {
          DEFAULT: '#EF4444', // Merah
          soft: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#F59E0B', // Kuning
          soft: '#FEF3C7',
        },
        success: {
          // Menggunakan primary sebagai success default
          DEFAULT: '#10B981',
          soft: '#E7F8F2',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    // Jika Anda menggunakan form-input, form-select, dll., tambahkan plugin forms
    // require('@tailwindcss/forms'),
  ],
}