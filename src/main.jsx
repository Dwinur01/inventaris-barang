// src/main.jsx (Complete Code Refactored)
import React from 'react'; //
import ReactDOM from 'react-dom/client'; //
import App from './App.jsx'; //
import './index.css'; // Pastikan file ini berisi @tailwind base, components, utilities
import { InventoryProvider } from './contexts/InventoryContext.jsx'; //
import { ToastProvider } from './contexts/ToastContext.jsx'; //
import { BrowserRouter } from 'react-router-dom'; //
import { ThemeProvider } from './contexts/ThemeContext.jsx'; // <-- IMPORT ThemeProvider

// Render aplikasi ke DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> {/* Membantu menemukan potensi masalah */}
    <BrowserRouter> {/* Mengaktifkan routing */}
      <ThemeProvider> {/* <-- BUNGKUS DENGAN ThemeProvider */}
        <InventoryProvider> {/* Menyediakan state inventaris */}
          <ToastProvider> {/* Menyediakan fungsi toast notification */}
            <App /> {/* Komponen aplikasi utama */}
          </ToastProvider>
        </InventoryProvider>
      </ThemeProvider> {/* <-- TUTUP ThemeProvider */}
    </BrowserRouter>
  </React.StrictMode>,
); //